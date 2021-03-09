import 'module-alias/register'
import { Functions, ObjectLiteral } from '@/interfaces'
import Errors from './errors'
import formatter from './utils/formatter'
import AsyncResolvers from './asyncResolvers'
import Rule from './rule'
import { flattenObject } from './utils/objects'
import Manager from './manager'
import Lang from './lang'
import Messages from './messages'

export default class Validator {
  private readonly input: ObjectLiteral
  private messages: Messages
  public readonly errors: Errors
  public errorCount: number
  private hasAsync: boolean
  private readonly rules: any
  private readonly numericRules: string[]
  private static locale: string
  public static attributeFormatter: Functions = formatter
  public static manager: Manager = new Manager()
  public static stopOnAttributes: any
  private static lang: Lang = new Lang()

  constructor(
    input?: ObjectLiteral,
    rules?: ObjectLiteral,
    messages?: ObjectLiteral,
    // attributes?: ObjectLiteral,
  ) {
    const locale = Validator.getDefaultLang()
    Validator.locale = 'en'
    this.input = input || {}
    this.messages = Validator.lang._make(locale)
    this.messages._setCustom(messages)
    this.setAttributeFormatter(Validator.attributeFormatter)
    this.errors = new Errors()
    this.errorCount = 0
    this.hasAsync = false
    this.rules = this._parseRules(rules)
    this.numericRules = ['integer', 'numeric']
  }

  check(): boolean {
    for (const attribute in this.rules) {
      if (!Object.prototype.hasOwnProperty.call(this.rules, attribute)) {
        continue
      }
      const attributeRules = this.rules[attribute]
      const inputValue = this._objectPath(this.input, attribute)
      if (
        this._hasRule(attribute, ['sometimes']) &&
        !this._suppliedWithData(attribute)
      ) {
        continue
      }

      for (
        let i = 0, len = attributeRules.length, rule, ruleOptions, rulePassed;
        i < len;
        i++
      ) {
        ruleOptions = attributeRules[i]
        rule = this.getRule(ruleOptions.name)

        if (!this._isValidatable(rule, inputValue)) {
          continue
        }

        rulePassed = rule.validate(inputValue, ruleOptions.value, attribute)
        if (!rulePassed) {
          this._addFailure(rule)
        }

        if (Validator._shouldStopValidating(attribute, rulePassed)) {
          break
        }
      }
    }

    return this.errorCount === 0
  }

  checkAsync(passes?: Functions, fails?: Functions): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    const defaultFn = (arg0: boolean): boolean => arg0
    passes = passes || defaultFn
    fails = fails || defaultFn
    const failsOne = function (rule: Rule, message: string): void {
      _this._addFailure(rule, message)
    }

    const resolvedAll = (allPassed: any): void => {
      if (allPassed && passes) {
        passes()
      } else if (fails) {
        fails()
      }
    }

    const asyncResolvers = new AsyncResolvers(failsOne, resolvedAll)

    const validateRule = function (
      inputValue: any,
      ruleOptions: ObjectLiteral,
      attribute: string,
      rule: Rule,
    ) {
      return function (): void {
        const resolverIndex = asyncResolvers.add(rule)
        rule.validate(inputValue, ruleOptions.value, attribute, function () {
          asyncResolvers.resolve(resolverIndex)
        })
      }
    }

    for (const attribute in this.rules) {
      if (!Object.hasOwnProperty.call(this.rules, attribute)) {
        continue
      }
      const attributeRules = this.rules[attribute]
      const inputValue = this._objectPath(this.input, attribute)

      if (
        this._hasRule(attribute, ['sometimes']) &&
        !this._suppliedWithData(attribute)
      ) {
        continue
      }

      for (
        let i = 0, len = attributeRules.length, rule, ruleOptions;
        i < len;
        i++
      ) {
        ruleOptions = attributeRules[i]

        rule = this.getRule(ruleOptions.name)

        if (!this._isValidatable(rule, inputValue)) {
          continue
        }

        validateRule(inputValue, ruleOptions, attribute, rule)()
      }
    }

    asyncResolvers.enableFiring()
    asyncResolvers.fire()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  static setMessages(locale: string, messages: ObjectLiteral) {
    Validator.lang._set(locale, messages)
    return this
  }

  static getMessages(locale: string): string {
    return Validator.lang._get(locale)
  }

  static useLang(locale: string): void {
    Validator.locale = locale
  }

  static getDefaultLang(): string {
    return Validator.locale || 'en'
  }

  static setAttributeFormatter(fn: Functions): void {
    Validator.attributeFormatter = fn
  }
  getRule(name: string): Rule {
    return Validator.manager.make(name, this)
  }

  static stopOnError(attributes: Array<string> | boolean): void {
    Validator.stopOnAttributes = attributes
  }

  stopOnError(attributes: Array<string> | boolean): void {
    Validator.stopOnAttributes = attributes
  }

  static register(name: string, fn: Functions, message?: string): void {
    const locale = Validator.getDefaultLang()
    Validator.manager.register(name, fn)
    Validator.lang._setRuleMessage(locale, name, message)
  }

  static registerImplicit(name: string, fn: Functions, message: string): void {
    const locale = Validator.getDefaultLang()
    Validator.manager.registerImplicit(name, fn)
    Validator.lang._setRuleMessage(locale, name, message)
  }

  static registerAsync(name: string, fn: Functions, message?: string): void {
    const locale = Validator.getDefaultLang()
    Validator.manager.registerAsync(name, fn)
    Validator.lang._setRuleMessage(locale, name, message)
  }

  static registerAsyncImplicit(
    name: string,
    fn: Functions,
    message: string,
  ): void {
    const locale = Validator.getDefaultLang()
    Validator.manager.registerAsyncImplicit(name, fn)
    Validator.lang._setRuleMessage(locale, name, message)
  }

  static registerMissedRuleValidator(
    fn: Functions,
    message?: string,
  ): boolean | void {
    Validator.manager.registerMissedRuleValidator(fn, message)
  }

  private _addFailure(rule: Rule, message?: string): void {
    const msg = message || this.messages.render(rule)
    if (rule.attribute) {
      this.errors.add(rule.attribute, msg)
    }
    this.errorCount++
  }

  _flattenObject(obj: ObjectLiteral | undefined | null): ObjectLiteral {
    return flattenObject(obj)
  }

  _objectPath(obj: ObjectLiteral, path: string): any {
    if (Object.prototype.hasOwnProperty.call(obj, path)) {
      return obj[path]
    }

    const keys = path
      .replace(/\[(\w+)/g, '.$1')
      .replace(/^\./, '')
      .split('.')
    let copy: any = {}
    for (const attr in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, attr)) {
        copy[attr] = obj[attr]
      }
    }

    for (let i = 0, l = keys.length; i < l; i++) {
      if (
        typeof copy === 'object' &&
        copy !== null &&
        Object.hasOwnProperty.call(copy, keys[i])
      ) {
        copy = copy[keys[i]]
      } else {
        return
      }
    }
    return copy
  }

  private _parseRules(rules?: ObjectLiteral): ObjectLiteral {
    const parsedRules: ObjectLiteral = {}
    if (!rules) {
      return {}
    }
    rules = this._flattenObject(rules)

    for (const attribute in rules) {
      if (!Object.prototype.hasOwnProperty.call(rules, attribute)) {
        continue
      }
      const rulesArray = rules[attribute]

      this._parseRulesCheck(attribute, rulesArray, parsedRules)
    }
    return parsedRules
  }

  private _parseRulesCheck(
    attribute: string,
    rulesArray: string[],
    parsedRules?: ObjectLiteral | undefined,
    wildCardValues?: Array<number | string> | undefined,
  ): void {
    if (attribute.indexOf('*') > -1) {
      this._parsedRulesRecurse(
        attribute,
        rulesArray,
        parsedRules,
        wildCardValues,
      )
    } else {
      this._parseRulesDefault(
        attribute,
        rulesArray,
        parsedRules,
        wildCardValues,
      )
    }
  }

  private _parsedRulesRecurse(
    attribute: string,
    rulesArray: string[],
    parsedRules: ObjectLiteral | undefined,
    wildCardValues: Array<number | string> | undefined,
  ): void {
    const parentPath = attribute.substr(0, attribute.indexOf('*') - 1)
    const propertyValue = this._objectPath(this.input, parentPath)

    if (propertyValue) {
      for (
        let propertyNumber = 0;
        propertyNumber < propertyValue.length;
        propertyNumber++
      ) {
        const workingValues = wildCardValues ? wildCardValues.slice() : []
        workingValues.push(propertyNumber)
        this._parseRulesCheck(
          attribute.replace('*', String(propertyNumber)),
          rulesArray,
          parsedRules,
          workingValues,
        )
      }
    }
  }

  private _parseRulesDefault(
    attribute: string,
    rulesArray: any,
    parsedRules: ObjectLiteral | undefined,
    wildCardValues: Array<number | string> | undefined,
  ): void {
    const attributeRules = []

    if (rulesArray instanceof Array) {
      rulesArray = Validator._prepareRulesArray(rulesArray)
    }

    if (typeof rulesArray === 'string') {
      rulesArray = rulesArray.split('|')
    }

    for (let i = 0, len = rulesArray.length, rule; i < len; i++) {
      rule =
        typeof rulesArray[i] === 'string'
          ? Validator._extractRuleAndRuleValue(rulesArray[i])
          : rulesArray[i]
      if (rule.value) {
        rule.value = this._replaceWildCards(rule.value, wildCardValues)
        this._replaceWildCardsMessages(wildCardValues)
      }

      if (Validator.manager.isAsync(rule.name)) {
        this.hasAsync = true
      }
      attributeRules.push(rule)
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    parsedRules?.[attribute] = attributeRules
  }

  private _replaceWildCards(
    path: string,
    nums: Array<number | string> | undefined,
  ): string {
    if (!nums) {
      return path
    }

    let path2 = path
    nums.forEach(function (value) {
      if (Array.isArray(path2)) {
        path2 = path2[0]
      }
      const pos = path2.indexOf('*')
      if (pos === -1) {
        return path2
      }
      path2 = path2.substr(0, pos) + value + path2.substr(pos + 1)
    })
    if (Array.isArray(path)) {
      path[0] = path2
      path2 = path
    }
    return path2
  }

  private _replaceWildCardsMessages(
    nums: Array<number | string> | undefined,
  ): void {
    const customMessages = this.messages.customMessages
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    Object.keys(customMessages).forEach(function (key) {
      if (nums) {
        const newKey = self._replaceWildCards(key, nums)
        customMessages[newKey] = customMessages[key]
      }
    })

    this.messages._setCustom(customMessages)
  }

  private static _prepareRulesArray(
    rulesArray: Array<ObjectLiteral>,
  ): Array<ObjectLiteral> {
    const rules: Array<ObjectLiteral> = []

    for (let i = 0, len = rulesArray.length; i < len; i++) {
      if (typeof rulesArray[i] === 'object') {
        for (const rule in rulesArray[i]) {
          if (!Object.hasOwnProperty.call(rulesArray[i], rule)) {
            continue
          }
          rules.push({
            name: rule,
            value: rulesArray[i][rule],
          })
        }
      } else {
        rules.push(rulesArray[i])
      }
    }

    return rules
  }

  private _suppliedWithData(attribute: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.input, attribute)
  }

  private static _extractRuleAndRuleValue(ruleString: string): ObjectLiteral {
    const rule: ObjectLiteral = {}
    let ruleArray: Array<string> = []
    rule.name = ruleString
    if (ruleString.indexOf(':') >= 0) {
      ruleArray = ruleString.split(':')
      rule.name = ruleArray[0]
      rule.value = ruleArray.slice(1).join(':')
    }

    return rule
  }

  private _hasRule(attribute: string, findRules: any[]): boolean {
    const rules = this.rules[attribute] || []
    for (let i = 0, len = rules.length; i < len; i++) {
      if (findRules.indexOf(rules[i].name) > -1) {
        return true
      }
    }
    return false
  }

  public _hasNumericRule(attribute?: string): boolean {
    if (!attribute) {
      return false
    }
    return this._hasRule(attribute, this.numericRules)
  }

  private _isValidatable(rule: Rule, value: any): boolean {
    if (Array.isArray(value)) {
      return true
    }
    if (Validator.manager.isImplicit(rule.name)) {
      return true
    }

    return <boolean>this.getRule('required').validate(value)
  }

  private static _shouldStopValidating(
    attribute: string,
    rulePassed: boolean | void,
  ): boolean {
    const stopOnAttributes = Validator.stopOnAttributes
    if (
      typeof stopOnAttributes === 'undefined' ||
      stopOnAttributes === false ||
      rulePassed
    ) {
      return false
    }

    if (stopOnAttributes instanceof Array) {
      return stopOnAttributes.indexOf(attribute) > -1
    }

    return true
  }

  public setAttributeNames(attributes: ObjectLiteral): void {
    this.messages._setAttributeNames(attributes)
  }

  setAttributeFormatter(fn: Functions): void {
    this.messages._setAttributeFormatter(fn)
  }

  passes(passes?: Functions): boolean | void {
    const async = this._checkAsync('passes', passes)
    if (async) {
      return this.checkAsync(passes)
    }
    return this.check()
  }

  fails(fails?: Functions): boolean | void {
    const async = this._checkAsync('fails', fails)
    if (async) {
      return this.checkAsync((args: boolean) => args, fails)
    }
    return !this.check()
  }

  _checkAsync(funcName: string, callback?: Functions): boolean {
    const hasCallback = typeof callback === 'function'
    if (this.hasAsync && !hasCallback) {
      throw funcName + ' expects a callback when async rules are being tested.'
    }

    return this.hasAsync || hasCallback
  }
}
