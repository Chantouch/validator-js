import { ObjectLiteral } from '../interfaces'

export default class Errors {
  private readonly errors: ObjectLiteral

  constructor() {
    this.errors = {}
  }

  all(): ObjectLiteral {
    return this.errors
  }

  get(attribute: string): Array<string> {
    if (this.has(attribute)) {
      return this.errors[attribute]
    }
    return []
  }

  first(attribute: string): boolean | string {
    if (this.has(attribute)) {
      return this.errors[attribute][0]
    }

    return false
  }

  add(attribute: string, message: string): void {
    if (!this.has(attribute)) {
      this.errors[attribute] = []
    }

    if (this.errors[attribute].indexOf(message) === -1) {
      this.errors[attribute].push(message)
    }
  }

  has(attribute: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.errors, attribute)
  }
}
