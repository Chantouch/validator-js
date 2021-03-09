import Validator from '@/validator'

describe('after rule', function () {
  it('should fail when the comparing attribute are greater', function () {
    const validator = new Validator(
      { date: '1996-12-09', date2: '1995-08-09' },
      { date2: 'after:date' },
    )

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual(
      'The date2 must be after date.',
    )
  })

  it('should fail when the comparing attribute are equal', function () {
    const validator = new Validator(
      { date: '1995-08-09', date2: '1995-08-09' },
      { date2: 'after:date' },
    )

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual(
      'The date2 must be after date.',
    )
  })

  it('should fail when the date1 is not valid', function () {
    const validator = new Validator(
      { date: 'not valid date', date2: '1995-08-09' },
      { date2: 'after:date' },
    )

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual(
      'The date2 must be after date.',
    )
  })

  it('should fail when the date2 is not valid', function () {
    const validator = new Validator(
      { date: '1995-08-09', date2: 'not valid date' },
      { date2: 'after:date' },
    )

    expect(validator.fails()).toBeTruthy()
    expect(validator.passes()).toBeFalsy()
    expect(validator.errors.first('date2')).toEqual(
      'The date2 must be after date.',
    )
  })

  it('should pass when the comparing attribute are smaller', function () {
    const validator = new Validator(
      { date: '1995-08-09', date2: '1996-12-09' },
      { date2: 'after:date' },
    )

    expect(validator.fails()).toBeFalsy()
    expect(validator.passes()).toBeTruthy()
  })
})
