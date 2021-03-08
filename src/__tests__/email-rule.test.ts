import Validator from '../validator'

describe('email validation rule', function () {
  it('should pass with the email address: johndoe@gmail.com', function () {
    const validator = new Validator(
      { email: 'johndoe@gmail.com' },
      { email: 'email' },
    )
    expect(validator.passes()).toBeTruthy()
  })

  it('should fail with the email address: johndoe.gmail.com', function () {
    const validator = new Validator(
      { email: 'johndoe.gmail.com' },
      { email: 'email' },
    )
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail with the email address: johndoe@gmail', function () {
    const validator = new Validator(
      { email: 'johndoe@gmail' },
      { email: 'email' },
    )
    expect(validator.fails()).toBeTruthy()
  })

  it('should fail when the email address contains whitespace only and is required', function () {
    const validator = new Validator(
      { email: '   ' },
      { email: 'required|email' },
    )
    expect(validator.fails()).toBeTruthy()
  })

  it('should pass when the field is an empty string', function () {
    const validator = new Validator({ email: '' }, { email: 'email' })
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass when the field does not exist', function () {
    const validator = new Validator({}, { email: 'email' })
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass with first.last@example.com', function () {
    const validator = new Validator(
      { email: 'first.last@example.com' },
      { email: 'email' },
    )

    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should pass with the email addresses containing umlauts: john.doe@jänt.de', function () {
    const validator = new Validator(
      { email: 'john.doe@jänt.de' },
      { email: 'email' },
    )
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with the email addresses containing country designation (uk)', function () {
    const validator = new Validator(
      { email: 'johndoe@gmail.com.uk' },
      { email: 'email' },
    )
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with the email addresses containing country designation (au)', function () {
    const validator = new Validator(
      { email: 'johndoe@gmail.com.au' },
      { email: 'email' },
    )
    expect(validator.passes()).toBeTruthy()
  })

  it('should pass with the email addresses at domain 3-n level', function () {
    const validator = new Validator(
      { email: 'mike.erickson@ru.codedungeon.ru' },
      { email: 'email' },
    )
    expect(validator.passes()).toBeTruthy()
  })
})
