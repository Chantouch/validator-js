import Rule from './rule'

export default class Attributes {
  between(this: any, template: string, rule: Rule): string {
    const [min, max] = rule.getParameters()
    return this._replacePlaceholders(rule, template, { min, max })
  }
  digits_between(this: any, template: string, rule: Rule): string {
    const [min, max] = rule.getParameters()
    return this._replacePlaceholders(rule, template, { min, max })
  }
  required_if(this: any, template: string, rule: Rule): string {
    const [other, value] = rule.getParameters()
    return this._replacePlaceholders(rule, template, {
      other: this._getAttributeName(other),
      value,
    })
  }
  required_unless(this: any, template: string, rule: Rule): string {
    const [other, value] = rule.getParameters()
    return this._replacePlaceholders(rule, template, {
      other: this._getAttributeName(other),
      value,
    })
  }
  required_with(this: any, template: string, rule: Rule): string {
    const [field] = rule.getParameters()
    return this._replacePlaceholders(rule, template, {
      field: this._getAttributeName(field),
    })
  }
  required_with_all(this: any, template: string, rule: Rule): string {
    const parameters = rule.getParameters()
    const getAttributeName = this._getAttributeName.bind(this)
    return this._replacePlaceholders(rule, template, {
      fields: parameters.map(getAttributeName).join(', '),
    })
  }
  required_without(this: any, template: string, rule: Rule): string {
    const [field] = rule.getParameters()
    return this._replacePlaceholders(rule, template, {
      field: this._getAttributeName(field),
    })
  }
  required_without_all(this: any, template: string, rule: Rule): string {
    const parameters = rule.getParameters()
    const getAttributeName = this._getAttributeName.bind(this)
    return this._replacePlaceholders(rule, template, {
      fields: parameters.map(getAttributeName).join(', '),
    })
  }
  after(this: any, template: string, rule: Rule): string {
    const [after] = rule.getParameters()
    return this._replacePlaceholders(rule, template, {
      after: this._getAttributeName(after),
    })
  }
  before(this: any, template: string, rule: Rule): string {
    const [before] = rule.getParameters()
    return this._replacePlaceholders(rule, template, {
      before: this._getAttributeName(before),
    })
  }
  after_or_equal(this: any, template: string, rule: Rule): string {
    const [afterOrEqual] = rule.getParameters()
    return this._replacePlaceholders(rule, template, {
      after_or_equal: this._getAttributeName(afterOrEqual),
    })
  }
  before_or_equal(this: any, template: string, rule: Rule): string {
    const parameters = rule.getParameters()
    return this._replacePlaceholders(rule, template, {
      before_or_equal: this._getAttributeName(parameters[0]),
    })
  }
  same(this: any, template: string, rule: Rule): string {
    const [same] = rule.getParameters()
    return this._replacePlaceholders(rule, template, {
      same: this._getAttributeName(same),
    })
  }
}
