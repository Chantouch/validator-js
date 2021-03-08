import Validator from '../validator'

describe('required without', function () {
  it('should fail', function () {
    const validator = new Validator(
      {
        desert: {
          first: 'icecream',
        },
        flavour: '',
      },
      {
        flavour: 'required_without:desert.second',
      },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('flavour')).toEqual(
      'The flavour field is required when desert.second is empty.',
    )
  })

  it('should pass', function () {
    const validator = new Validator(
      {
        desert: {
          first: 'icecream',
          second: 'icecream',
        },
        flavour: '',
      },
      {
        flavour: 'required_without:desert.second',
      },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
