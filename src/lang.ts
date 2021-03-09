import { ObjectLiteral } from '../interfaces'
import Messages from './messages'

const requireMethod = require

export default class Lang {
  messages: ObjectLiteral = {}

  _set(lang: string, rawMessages: ObjectLiteral): void {
    this.messages[lang] = rawMessages
  }

  _setRuleMessage(
    lang: string,
    attribute: string,
    message?: string | ObjectLiteral,
  ): void {
    this._load(lang)
    if (message === undefined) {
      message = this.messages[lang].def
    }

    this.messages[lang][attribute] = message
  }

  _load(lang: string): void {
    if (!this.messages[lang]) {
      try {
        const rawMessages = requireMethod('./locales/' + lang)
        const messages = rawMessages.default ? rawMessages.default : rawMessages
        this._set(lang, messages)
      } catch (e) {
        console.warn(e)
      }
    }
  }

  _get(lang: string): string {
    this._load(lang)
    return this.messages[lang]
  }

  _make(lang: string): Messages {
    this._load(lang)
    return new Messages(lang, this.messages[lang])
  }
}
