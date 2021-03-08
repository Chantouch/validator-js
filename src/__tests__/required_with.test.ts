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
