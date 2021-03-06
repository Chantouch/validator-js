import Validator from '../src'

describe('confirmed validation rule', function() {
  it('should fail without a matching confirmation field for the field under validation', function() {
    const validator = new Validator({
      input: {
        password: 'abc',
      },
      rules: {
        password: 'confirmed',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail without a matching confirmation field for the field under validation', function() {
    const validator = new Validator({
      input: {
        password: 'abc',
        password_confirmation: 'abcd',
      },
      rules: {
        password: 'confirmed',
      },
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('password')).toEqual('The password confirmation does not match.')
  })

  it('should pass with a matching confirmation field for the field under validation', function() {
    const validator = new Validator({
      input: {
        password: 'abc',
        password_confirmation: 'abc',
      },
      rules: {
        password: 'confirmed',
      },
    })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).not.toBeTruthy()
  })

  it('should reverse message from confirm to _confirmation', function() {
    const validator = new Validator({
      input: {
        password: 'abc-1',
        password_confirmation: 'abc',
      },
      rules: {
        password: 'confirmed',
      },
      confirmedReverse: true,
    })
    expect(validator.passes()).not.toBeTruthy()
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('password_confirmation')).toEqual('The password confirmation confirmation does not match.')
  })
})
