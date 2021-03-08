import { isValidDate } from '~/utils/datetime'
import { flattenObject } from '~/utils/objects'
import { ip } from '~/rules/ip'
import { ipv6 } from '~/rules/ipv6'
import { ipv4 } from '~/rules/ipv4'
import { required } from '~/rules/required'
import { array } from '~/rules/array'
import { boolean } from '~/rules/boolean'

export default {
  required,
  required_if(this: any, val: string, req: string | string[]): boolean {
    req = this.getParameters()
    if (this.validator._objectPath(this.validator.input, req[0]) === req[1]) {
      return this.validator.getRule('required').validate(val)
    }

    return true
  },

  required_unless(this: any, val: string, req: string | string[]): boolean {
    req = this.getParameters()
    if (this.validator._objectPath(this.validator.input, req[0]) !== req[1]) {
      return this.validator.getRule('required').validate(val)
    }

    return true
  },

  required_with(this: any, val: string, req: string): boolean {
    if (this.validator._objectPath(this.validator.input, req)) {
      return this.validator.getRule('required').validate(val)
    }

    return true
  },

  required_with_all(this: any, val: string, req: string | string[]): boolean {
    req = this.getParameters()

    for (let i = 0; i < req.length; i++) {
      if (!this.validator._objectPath(this.validator.input, req[i])) {
        return true
      }
    }

    return this.validator.getRule('required').validate(val)
  },

  required_without(this: any, val: string, req: string): boolean {
    if (this.validator._objectPath(this.validator.input, req)) {
      return true
    }

    return this.validator.getRule('required').validate(val)
  },

  required_without_all(
    this: any,
    val: string,
    req: string | string[],
  ): boolean {
    req = this.getParameters()

    for (let i = 0; i < req.length; i++) {
      if (this.validator._objectPath(this.validator.input, req[i])) {
        return true
      }
    }

    return this.validator.getRule('required').validate(val)
  },
  boolean,
  size(this: any, val: string, req: string): boolean {
    if (val) {
      const req1: number = parseFloat(req)

      const size: number = this.getSize()

      return size === req1
    }

    return true
  },

  string(this: any, val: string | any): boolean {
    return typeof val === 'string'
  },

  sometimes(): boolean {
    return true
  },

  /**
   * Compares the size of strings or the value of numbers if there is a truthy value
   */
  min(this: any, val: string, req: number): boolean {
    const size: number = this.getSize()
    return size >= req
  },

  /**
   * Compares the size of strings or the value of numbers if there is a truthy value
   */
  max(this: any, val: string, req: number): boolean {
    const size = this.getSize()
    console.info('size:', req)
    return size <= req
  },

  between(this: any, val: string, req: string | string[]): boolean {
    req = this.getParameters()
    const size = this.getSize()
    const min = parseFloat(req[0])
    const max = parseFloat(req[1])
    return size >= min && size <= max
  },

  email(val: string): boolean {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!re.test(val)) {
      // eslint-disable-next-line no-control-regex
      re = /^((?:[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]|[^\u0000-\u007F])+@(?:[a-zA-Z0-9]|[^\u0000-\u007F])(?:(?:[a-zA-Z0-9-]|[^\u0000-\u007F]){0,61}(?:[a-zA-Z0-9]|[^\u0000-\u007F]))?(?:\.(?:[a-zA-Z0-9]|[^\u0000-\u007F])(?:(?:[a-zA-Z0-9-]|[^\u0000-\u007F]){0,61}(?:[a-zA-Z0-9]|[^\u0000-\u007F]))?)+)*$/
    }
    return re.test(val)
  },

  numeric(val: string | number | boolean): boolean {
    const num = Number(val) // tries to convert value to a number. useful if value is coming from form element

    return !isNaN(num) && typeof val !== 'boolean'
  },
  array,
  url(url: string): boolean {
    return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_\+.~#?&/=]*)/i.test(
      url,
    )
  },

  alpha(val: string): boolean {
    return /^[a-zA-Z]+$/.test(val)
  },

  alpha_dash(val: string): boolean {
    return /^[a-zA-Z0-9_\-]+$/.test(val)
  },

  alpha_num(val: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(val)
  },

  same(this: any, val: string, req: string): boolean {
    const val1 = flattenObject(this.validator.input)[req]
    return val1 === val
  },

  different(this: any, val: string, req: string): boolean {
    const val1 = flattenObject(this.validator.input)[req]
    return val1 !== val
  },

  in(this: any, val: Array<string | number> | string): boolean {
    let list, i

    if (val) {
      list = this.getParameters()
    }

    if (val && !(val instanceof Array)) {
      let localValue = val

      for (i = 0; i < list.length; i++) {
        if (typeof list[i] === 'string') {
          localValue = String(val)
        }

        if (localValue === list[i]) {
          return true
        }
      }

      return false
    }

    if (val && val instanceof Array) {
      for (i = 0; i < val.length; i++) {
        if (list.indexOf(val[i]) < 0) {
          return false
        }
      }
    }

    return true
  },

  not_in(this: any, val: string): boolean {
    const list = this.getParameters()
    const len = list.length
    let returnVal = true

    for (let i = 0; i < len; i++) {
      let localValue = val

      if (typeof list[i] === 'string') {
        localValue = String(val)
      }

      if (localValue === list[i]) {
        returnVal = false
        break
      }
    }

    return returnVal
  },

  accepted(val: string | number | boolean): boolean {
    return (
      val === 'on' || val === 'yes' || val === 1 || val === '1' || val === true
    )
  },

  confirmed(this: any, val: string, req: string, key: string): boolean {
    const confirmedKey = key + '_confirmation'

    return this.validator.input[confirmedKey] === val
  },

  integer(val: string): boolean {
    return String(parseInt(val, 10)) === String(val)
  },

  digits(this: any, val: string, req: string): boolean {
    const numericRule = this.validator.getRule('numeric')
    return (
      numericRule.validate(val) && String(val.trim()).length === parseInt(req)
    )
  },

  digits_between(this: any, val: string): boolean {
    const numericRule = this.validator.getRule('numeric')
    const req = this.getParameters()
    const valueDigitsCount = String(val).length
    const min = parseFloat(req[0])
    const max = parseFloat(req[1])

    return (
      numericRule.validate(val) &&
      valueDigitsCount >= min &&
      valueDigitsCount <= max
    )
  },

  regex(val: string, req: string | RegExp): boolean {
    const reqPattern = req
    const mod = /[g|i|m]{1,3}$/
    let flag
    if (typeof reqPattern === 'string') {
      flag = reqPattern.match(mod)
    }
    flag = flag ? flag[0] : ''

    if (typeof req === 'string') {
      req = req.replace(mod, '').slice(1, -1)
    }
    req = new RegExp(req, flag)
    return req.test(val)
  },

  date(val: string): boolean {
    return isValidDate(val)
  },

  present(val: string): boolean {
    return typeof val !== 'undefined'
  },

  after(this: any, val: string, req: string): boolean {
    const val1 = this.validator.input[req]
    const val2 = val
    if (!isValidDate(val1)) {
      return false
    }
    if (!isValidDate(val2)) {
      return false
    }
    return new Date(val1).getTime() < new Date(val2).getTime()
  },

  after_or_equal(this: any, val: string, req: string): boolean {
    const val1 = this.validator.input[req]
    const val2 = val

    if (!isValidDate(val1)) {
      return false
    }
    if (!isValidDate(val2)) {
      return false
    }

    return new Date(val1).getTime() <= new Date(val2).getTime()
  },

  before(this: any, val: string, req: string): boolean {
    const val1 = this.validator.input[req]
    const val2 = val

    if (!isValidDate(val1)) {
      return false
    }
    if (!isValidDate(val2)) {
      return false
    }

    return new Date(val1).getTime() > new Date(val2).getTime()
  },

  before_or_equal(this: any, val: string, req: string | number): boolean {
    const val1 = this.validator.input[req]
    const val2 = val

    if (!isValidDate(val1)) {
      return false
    }
    if (!isValidDate(val2)) {
      return false
    }

    return new Date(val1).getTime() >= new Date(val2).getTime()
  },

  hex(val: string): boolean {
    return /^[0-9a-f]+$/i.test(val)
  },
  ipv4,
  ipv6,
  ip,
}
