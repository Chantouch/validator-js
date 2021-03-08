import Validator from '../validator'

describe('required with all', function () {
  it('should fail', function () {
    const validator = new Validator(
      {
        desert: {
          first: 'icecream',
          second: 'icecream',
        },
        flavour: '',
      },
      { flavour: 'required_with_all:desert.first,desert.second' },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('flavour')).toEqual(
      'The flavour field is required when desert.first, desert.second are not empty.',
    )
  })

  it('should pass', function () {
    const validator = new Validator(
      {
        desert: {
          first: 'icecream',
          second: 'icecream',
        },
        flavour: 'chocolate',
      },
      { flavour: 'required_with_all:desert.first,desert.second' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass (not all required field are set)', function () {
    const validator = new Validator(
      {
        desert: {
          first: 'icecream',
        },
        flavour: '',
      },
      {
        flavour: 'required_with_all:desert.first,desert.second',
      },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
