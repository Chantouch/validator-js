import Validator from '../validator'

describe('required unless', function () {
  it('should fail', function () {
    const validator = new Validator(
      { desert: 'icecream', flavour: '' },
      { flavour: 'required_unless:desert,cake' },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('flavour')).toEqual(
      'The flavour field is required when desert is not cake.',
    )
  })

  it('should pass', function () {
    const validator = new Validator(
      { desert: 'icecream', flavour: 'chocolate' },
      { flavour: 'required_unless:desert,cake' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
