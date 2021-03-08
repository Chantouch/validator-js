import Validator from '../validator'

describe('present validation rule', function () {
  it('should pass with attribute present', function () {
    const validator = new Validator(
      { email: 'name@domain.com' },
      { email: 'present' },
    )
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with attribute not present', function () {
    const validator = new Validator({}, { email: 'present' })
    expect(validator.passes()).toBeFalsy()
  })
})
