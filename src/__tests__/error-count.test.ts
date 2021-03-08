import Validator from '../validator'

describe('Error counts', function () {
  it('should return 0 when validation has not yet run', function () {
    const validator = new Validator({ username: '' }, { username: 'required' })
    expect(validator.errorCount).toEqual(0)
  })

  it('should return a count when there are errors', function () {
    const validator = new Validator(
      { username: '', name: '' },
      { username: 'required', name: 'required' },
    )
    expect(validator.passes()).toBeFalsy()
    expect(validator.errorCount).toEqual(2)
  })

  it('should not return a count when error free', function () {
    const validator = new Validator(
      { username: 'a', name: 'a' },
      { username: 'required', name: 'required' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.errorCount).toEqual(0)
  })
})
