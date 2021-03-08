import Validator from '../validator'

describe('digits between rule', function () {
  it('should pass digits between rule when 123489 and between 5 - 10', function () {
    const validator = new Validator(
      { num: 123456 },
      { num: 'digits_between:5,10' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass digits between rule when 12345 and between 1 - 6', function () {
    const validator = new Validator(
      { num: 12345 },
      { num: 'digits_between:1,6' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should fail on string 25 when digits between is set to 25 - 30', function () {
    const validator = new Validator(
      { num: '25' },
      { num: 'digits_between:25,30' },
    )
    expect(validator.passes()).toBeFalsy()
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass on string 25 when digits between is set to 2 - 3', function () {
    const validator = new Validator(
      { num: '25' },
      {
        num: 'digits_between:2,3',
      },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should threat string 25 as numeric when other numeric rules are set and pass when between is set to 2 - 5', function () {
    const validator = new Validator(
      { num: '25' },
      { num: 'digits_between:2,5|numeric' },
    )
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })
})
