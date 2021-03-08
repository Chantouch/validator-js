import Validator from '../validator'

describe('passes()', function () {
  it('should not duplicate error messages when called multiple times', function () {
    const validator = new Validator({}, { login: 'required' })

    validator.passes()
    validator.passes()

    expect(validator.errors.all()).toEqual({
      login: ['The login field is required.'],
    })
  })

  it("should work if the input doesn't extend Object", function () {
    // This happens in Express's req.body, for example.
    const body = Object.create(null)
    body.a = 2

    const validator = new Validator(body, { a: 'required' })

    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
