import Validator from '@/validator'

describe('async rule tests', function (this: any) {
  beforeAll(() => {
    jest.setTimeout(200)
  })
  afterEach(() => {
    jest.clearAllMocks()
    jest.resetAllMocks()
  })

  it('should be able to register and pass async rule', function (done) {
    Validator.registerAsync(
      'username',
      (
        desiredUsername: string,
        ruleValue: any,
        attribute: any,
        passes: () => void,
      ) => {
        setTimeout(() => {
          if (desiredUsername == 'test') {
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      {
        username: 'test',
      },
      {
        username: 'username',
      },
    )
    validator.passes(done)
  }, 50)

  it('should be able to fail async rules', function (done) {
    Validator.registerAsync(
      'username',
      function (
        desiredUsername: string,
        ruleValue: any,
        attribute: any,
        passes: (arg0: boolean) => void,
      ) {
        setTimeout(function () {
          if (desiredUsername == 'test') {
            passes(false)
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      {
        username: 'test',
      },
      {
        username: 'username',
      },
    )
    validator.fails(done)
  }, 50)

  it('should pass on multiple async rules', function (done) {
    let passCount = 0

    Validator.registerAsync(
      'username1',
      function (
        desiredUsername: string,
        ruleValue: any,
        attribute: any,
        passes: () => void,
      ) {
        setTimeout(function () {
          if (desiredUsername == 'test') {
            passCount++
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    Validator.registerAsync(
      'username2',
      function (
        desiredUsername: string,
        ruleValue: any,
        attribute: any,
        passes: () => void,
      ) {
        setTimeout(function () {
          if (desiredUsername == 'test') {
            passCount++
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      {
        username: 'test',
      },
      {
        username: 'username1|username2',
      },
    )
    validator.passes(function () {
      expect(passCount).toEqual(2)
      done()
    })
  }, 50)

  it('should fail on mixture of pass/fail async rules', function (done) {
    let failedCount = 0
    let passCount = 0

    Validator.registerAsync(
      'username1',
      function (
        desiredUsername: string,
        ruleValue: any,
        attribute: any,
        passes: () => void,
      ) {
        setTimeout(function () {
          if (desiredUsername == 'test') {
            passCount++
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    Validator.registerAsync(
      'username2',
      function (
        desiredUsername: string,
        ruleValue: any,
        attribute: any,
        passes: (arg0: boolean) => void,
      ) {
        setTimeout(function () {
          if (desiredUsername == 'test') {
            failedCount++
            passes(false)
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      {
        username: 'test',
      },
      {
        username: 'username1|username2',
      },
    )
    validator.fails(function () {
      expect(passCount).toEqual(1)
      expect(failedCount).toEqual(1)
      done()
    })
  }, 50)

  it('should allow custom error message', function (done) {
    Validator.registerAsync(
      'username',
      function (
        desiredUsername: string,
        ruleValue: any,
        attribute: any,
        passes: (arg0: boolean, arg1: string) => void,
      ) {
        setTimeout(function () {
          if (desiredUsername == 'admin') {
            passes(false, 'This username is banned')
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      {
        username: 'admin',
      },
      {
        username: 'username',
      },
    )
    validator.fails(function () {
      expect(validator.errors.first('username')).toEqual(
        'This username is banned',
      )
      done()
    })
  }, 50)

  it('should allow validating by async when no async rules', function (done) {
    const validator = new Validator(
      {
        username: 'admin',
        email: 'blah',
      },
      {
        username: 'required|min:3',
        email: 'required|email',
      },
    )
    validator.fails(function () {
      done()
    })

    validator.passes(function () {
      throw 'Should not have passed.'
    })
  }, 50)

  it('should it pass on mixture of sync/async rules', function (done) {
    Validator.registerAsync(
      'username',
      function (
        desiredUsername: string,
        ruleValue: any,
        attribute: any,
        passes: () => void,
      ) {
        setTimeout(function () {
          if (desiredUsername == 'test') {
            passes()
          }
        }, 50)
      },
      ':attribute is an invalid username',
    )

    const validator = new Validator(
      {
        username: 'test',
      },
      {
        username: 'required|min:3|username',
      },
    )
    validator.passes(done)
  }, 50)

  it('should it not call passes if using just fails callback', function (done) {
    const validator = new Validator(
      {
        name: 'gary',
      },
      {
        name: 'required',
      },
    )
    validator.fails(function () {
      throw 'Should not be called.'
    })

    validator.passes(function () {
      done()
    })
  }, 50)

  it('should it not call fails if using just passes callback', function (done) {
    const validator = new Validator(
      {
        name: '',
      },
      {
        name: 'required',
      },
    )
    validator.passes(function () {
      throw 'Should not be called.'
    })

    validator.fails(function () {
      done()
    })
  }, 50)

  // it('should throw exception when attempting to validate and no fail or pass callback', function() {

  // 	Validator.registerAsync('username', function() { });
  // 	const validator = new Validator({ username: 'admin' }, { username: 'username' });
  // 	expect(validator.passes).to.throw(/^passes expects.*/);

  // });
})
