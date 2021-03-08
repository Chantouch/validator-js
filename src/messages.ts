import { ObjectLiteral, Functions } from '@/interfaces'
import Rule from './rule'
import Attributes from './attributes'

export default class Messages {
  public lang: string
  public readonly messages: ObjectLiteral
  public customMessages: ObjectLiteral
  public attributeNames: ObjectLiteral
  public attributeFormatter: Functions | undefined
  public readonly replacements: ObjectLiteral

  constructor(lang: string, messages: ObjectLiteral) {
    this.lang = lang
    this.messages = messages
    this.customMessages = {}
    this.attributeNames = {}
    this.replacements = new Attributes()
  }

  public _setCustom(customMessages: ObjectLiteral | undefined): void {
    this.customMessages = customMessages || {}
  }

  public _setAttributeNames(attributes: ObjectLiteral): void {
    this.attributeNames = attributes
  }

  public _setAttributeFormatter(fn: Functions): void {
    this.attributeFormatter = fn
  }

  protected _getAttributeName(attribute: string): string {
    let name: string | void = attribute
    if (Object.prototype.hasOwnProperty.call(this.attributeNames, attribute)) {
      return this.attributeNames[attribute]
    } else if (
      Object.prototype.hasOwnProperty.call(this.messages.attributes, attribute)
    ) {
      name = this.messages.attributes[attribute]
    }

    if (this.attributeFormatter) {
      name = this.attributeFormatter(name)
    }

    return <string>name
  }

  all(): ObjectLiteral {
    return this.messages
  }

  render(rule: Rule): string {
    if (rule.customMessage) {
      return rule.customMessage
    }
    const template: string = this._getTemplate(rule)
    let message: string
    if (this.replacements[rule.name]) {
      message = this.replacements[rule.name].apply(this, [template, rule])
    } else {
      message = this._replacePlaceholders(rule, template, {})
    }

    return message
  }

  private _getTemplate(rule: Rule): string {
    const messages = this.messages
    let template = messages.def
    const customMessages = this.customMessages
    const formats = [rule.name + '.' + rule.attribute, rule.name]

    for (let i = 0; i < formats.length; i++) {
      const format = formats[i]
      if (Object.prototype.hasOwnProperty.call(customMessages, format)) {
        template = customMessages[format]
        break
      } else if (Object.prototype.hasOwnProperty.call(messages, format)) {
        template = messages[format]
        break
      }
    }

    if (typeof template === 'object') {
      template = template[rule._getValueType()]
    }

    return template
  }

  protected _replacePlaceholders(
    rule: Rule,
    template: string | any,
    data: ObjectLiteral | any,
  ): string {
    let message: any
    let attribute: string
    if (rule.attribute != null) {
      data.attribute = this._getAttributeName(rule.attribute)
    }
    data[rule.name] = data[rule.name] || rule.getParameters().join(',')

    if (typeof template === 'string' && typeof data === 'object') {
      message = template

      for (attribute in data) {
        if (!Object.prototype.hasOwnProperty.call(data, attribute)) {
          continue
        }
        message = message.replace(
          new RegExp(':' + attribute, 'g'),
          data[attribute],
        )
      }
    }

    return message
  }
}
