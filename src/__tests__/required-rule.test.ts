import Validator from '../validator'

describe('require validation pass rules', function () {
  it('should pass with non-empty strings', function () {
    const validator = new Validator({ name: 'David' }, { name: 'required' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with empty strings', function () {
    const validator = new Validator({ email: '' }, { email: 'required' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with strings containing only white space', function () {
    const validator = new Validator({ name: '      	' }, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail when a value is equal to undefined', function () {
    const validator = new Validator({ name: undefined }, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail when a value is equal to null', function () {
    const validator = new Validator({ name: null }, { name: 'required' })
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass when a value is numeric', function () {
    const validator = new Validator(
      {
        age: 29,
      },
      {
        age: 'required',
      },
    )
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail when the attribute is not passed in', function () {
    const validator = new Validator(
      {},
      {
        email: 'required',
      },
    )
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('should fail when the array is empty', function () {
    const validator = new Validator({ users: [] }, { users: 'required|array' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
  })

  it('should not fail when not an empty array', function () {
    const validator = new Validator(
      { users: [false] },
      { users: 'required|array' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
