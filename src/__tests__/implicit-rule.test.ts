import Validator from '../validator'

describe('implicit rule tests', function () {
  beforeEach(() => {
    jest.setTimeout(500)
  })
  it('should fail implicit rule even when undefined', function () {
    Validator.registerImplicit(
      'null_or_number',
      (val: string | null) => {
        return (val && val.match(/^\d*$/)) || val === null
      },
      ':attribute must be a number or empty',
    )

    const validator = new Validator(
      {
        /* empty */
      },
      { value: 'null_or_number' },
    )
    expect(validator.passes()).toBeFalsy()
  })

  it('should pass implicit rule even when null', function () {
    Validator.registerImplicit(
      'null_or_number',
      function (val: string | null) {
        return (val && val.match(/^\d*$/)) || val === null
      },
      ':attribute must be a number or empty',
    )

    const validator = new Validator(
      { value: null },
      { value: 'null_or_number' },
    )
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail async implicit rule even when undefined', function (done) {
    Validator.registerAsyncImplicit(
      'async_null',
      function (
        value: null,
        attribute: any,
        req: any,
        passes: (arg0: boolean) => void,
      ) {
        setTimeout(function () {
          if (value === null) {
            passes(true)
          } else {
            passes(false)
          }
        }, 50)
      },
      ':attribute already taken',
    )

    const validator = new Validator(
      {
        /* empty */
      },
      { value: 'async_null' },
    )
    validator.fails(done)
  }, 50)

  it('should pass async implicit rule even when null', function (done) {
    Validator.registerAsyncImplicit(
      'async_null',
      function (
        value: null,
        attribute: any,
        req: any,
        passes: (arg0: boolean) => void,
      ) {
        setTimeout(function () {
          if (value === null) {
            passes(true)
          } else {
            passes(false)
          }
        }, 50)
      },
      ':attribute already taken',
    )

    const validator = new Validator({ value: null }, { value: 'async_null' })
    validator.passes(done)
  })
})
