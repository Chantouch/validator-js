import Validator from '../validator'

describe('required if', function () {
  it('should fail', function () {
    const validator = new Validator(
      { desert: 'cream', flavour: '' },
      { flavour: 'required_if:desert,cream' },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('flavour')).toEqual(
      'The flavour field is required when desert is cream.',
    )
  })

  it('should pass, if value 2 is empty.', function () {
    const validator = new Validator(
      { desert: 'cream', flavour: '' },
      { flavour: 'required_if:desert' },
    )
    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
    expect(validator.errors.has('flavour')).toBeFalsy()
  })

  it('should pass', function () {
    const validator = new Validator(
      { desert: 'cream', flavour: 'chocolate' },
      { flavour: 'required_if:desert,cream' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
