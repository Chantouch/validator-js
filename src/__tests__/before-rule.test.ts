import Validator from '../validator'

describe('before rule', function () {
  it('should fail when the comparing attribute are smaller', function () {
    const validator = new Validator(
      { date: '1994-12-09', date2: '1998-08-09' },
      { date2: 'before:date' },
    )

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual(
      'The date2 must be before date.',
    )
  })

  it('should fail when the comparing attribute are equal', function () {
    const validator = new Validator(
      { date: '1994-12-09', date2: '1994-12-09' },
      { date2: 'before:date' },
    )

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual(
      'The date2 must be before date.',
    )
  })

  it('should fail when the date1 is not valid', function () {
    const validator = new Validator(
      { date: 'not valid date', date2: '1994-12-09' },
      { date2: 'before:date' },
    )

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual(
      'The date2 must be before date.',
    )
  })

  it('should fail when the date2', function () {
    const validator = new Validator(
      { date: '1994-12-09', date2: 'not valid date' },
      { date2: 'before:date' },
    )

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual(
      'The date2 must be before date.',
    )
  })

  it('should pass when the comparing attribute are greather', function () {
    const validator = new Validator(
      { date: '1998-08-09', date2: '1994-12-09' },
      { date2: 'before:date' },
    )

    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })
})
