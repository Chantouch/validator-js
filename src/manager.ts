import { Functions, ObjectLiteral } from '@/interfaces'
import rules from './rules'
import Rule from './rule'
import Validator from '~/validator'

let missedRuleValidator: Functions = function (this: any): Functions {
  throw new Error('Validator `' + this.name + '` is not defined!')
}
let missedRuleMessage: string | undefined

export default class Manager {
  private readonly asyncRules: string[]
  private implicitRules: string[]
  private readonly rules: ObjectLiteral
  public missedRuleMessage: string | undefined = missedRuleMessage
  public missedRuleValidator: Functions = missedRuleValidator

  constructor() {
    this.asyncRules = []
    this.implicitRules = [
      'required',
      'required_if',
      'required_unless',
      'required_with',
      'required_with_all',
      'required_without',
      'required_without_all',
      'accepted',
      'present',
    ]
    this.rules = rules
  }

  make(name: string, validator: Validator): Rule {
    const async = this.isAsync(name)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const rule = new Rule(name, rules[name], async)
    rule.setValidator(validator)
    return rule
  }

  isAsync(name: string): boolean {
    for (let i = 0, len = this.asyncRules.length; i < len; i++) {
      if (this.asyncRules[i] === name) {
        return true
      }
    }
    return false
  }

  isImplicit(name: string): boolean {
    return this.implicitRules.indexOf(name) > -1
  }

  register(name: string, fn: Functions): void {
    this.rules[name] = fn
  }

  registerImplicit(name: string, fn: Functions): void {
    this.register(name, fn)
    this.implicitRules.push(name)
  }

  registerAsync(name: string, fn: Functions): void {
    this.register(name, fn)
    this.asyncRules.push(name)
  }

  registerAsyncImplicit(name: string, fn: Functions): void {
    this.registerImplicit(name, fn)
    this.asyncRules.push(name)
  }

  registerMissedRuleValidator(fn: Functions, message?: string): void {
    missedRuleValidator = fn
    missedRuleMessage = message
    this.missedRuleValidator = fn
    this.missedRuleMessage = message
  }
}
