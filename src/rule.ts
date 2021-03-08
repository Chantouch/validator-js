import { Functions } from '@/interfaces'
import Validator from '~/validator'

export default class Rule {
  public name: string
  private readonly fn: Functions
  private passes: boolean | undefined | void
  private _customMessage?: string
  private readonly async: boolean
  private ruleValue: any
  private inputValue: any
  public attribute: string | undefined = ''
  private validator?: Validator
  private missedRuleMessage?: string = Validator.manager.missedRuleMessage
  private callback?: Functions

  constructor(name: string, fn: Functions, async: boolean) {
    this.name = name
    this.fn = fn
    this.passes = false
    this._customMessage = undefined
    this.async = async
  }

  validate(
    inputValue: string,
    ruleValue?: string,
    attribute?: string,
    callback?: Functions,
  ): boolean | void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this
    this._setValidatingData(attribute, inputValue, ruleValue)
    if (typeof callback === 'function') {
      this.callback = callback
      const handleResponse = (
        passes?: boolean | void,
        message?: string,
      ): void => {
        _this.response(passes, message)
      }

      if (this.async) {
        return this._apply(inputValue, ruleValue, attribute, handleResponse)
      } else {
        return handleResponse(
          this._apply(inputValue, ruleValue, attribute, callback),
        )
      }
    }
    return this._apply(inputValue, ruleValue, attribute, callback)
  }

  private _apply(
    inputValue: string | undefined,
    ruleValue: string | undefined,
    attribute: string | undefined,
    callback?: Functions,
  ): boolean | void {
    const fn = this.isMissed() ? Validator.manager.missedRuleValidator : this.fn

    return fn.apply(this, [inputValue, ruleValue, attribute, callback])
  }

  private _setValidatingData(
    attribute: string | undefined,
    inputValue: string | undefined,
    ruleValue: string | undefined,
  ): void {
    this.attribute = attribute
    this.inputValue = inputValue
    this.ruleValue = ruleValue
  }

  getParameters(): Array<any> {
    let value: Array<any> = []

    if (typeof this.ruleValue === 'string') {
      value = this.ruleValue.split(',')
    }

    if (typeof this.ruleValue === 'number') {
      value.push(this.ruleValue)
    }

    if (this.ruleValue instanceof Array) {
      value = this.ruleValue
    }

    return value
  }

  getSize(): number {
    const value = this.inputValue

    if (value instanceof Array) {
      return value.length
    }

    if (typeof value === 'number') {
      return value
    }

    if (this.validator?._hasNumericRule(this.attribute)) {
      return parseFloat(value)
    }

    return value.length
  }

  _getValueType(): number | string {
    if (
      typeof this.inputValue === 'number' ||
      this.validator?._hasNumericRule(this.attribute)
    ) {
      return 'numeric'
    }

    return 'string'
  }

  response(
    passes?: boolean | void | undefined,
    message?: string | undefined,
  ): void {
    this.passes = passes === undefined || passes
    this._customMessage = message
    if (typeof this.callback == 'function') {
      this.callback(this.passes, message)
    }
  }

  setValidator(validator: any): void {
    this.validator = validator
  }

  isMissed(): boolean {
    return typeof this.fn !== 'function'
  }

  get customMessage(): string | undefined {
    return this.isMissed() ? this.missedRuleMessage : this._customMessage
  }
}
