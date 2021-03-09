import Validator from '../validator'

describe('required with', function () {
  it('should fail', function () {
    const validator = new Validator(
      {
        desert: {
          first: 'icecream',
        },
        flavour: '',
      },
      { flavour: 'required_with:desert.first' },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('flavour')).toEqual(
      'The flavour field is required when desert.first is not empty.',
    )
  })

  it('should pass, when required value is null or empty.', function () {
    const validator = new Validator(
      {
        desert: {
          first: null,
        },
        flavour: '',
      },
      { flavour: 'required_with:desert.first' },
    )
    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
    expect(validator.errors.has('flavour')).toBeFalsy()
  })

  it('should pass', function () {
    const validator = new Validator(
      {
        desert: {
          first: 'icecream',
        },
        flavour: 'chocolate',
      },
      {
        flavour: 'required_with:desert.first',
      },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
