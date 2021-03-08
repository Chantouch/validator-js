import Validator from '../validator'

describe('lang / messages', function () {
  it('should default to english', function () {
    expect(Validator.getDefaultLang()).toEqual('en')
  })

  it('should be able to change lang', function () {
    const oldLang = Validator.getDefaultLang()
    Validator.useLang('ru')
    expect(Validator.getDefaultLang()).toEqual('ru')
    Validator.useLang(oldLang)
  })

  it('should be able to add custom', function () {
    const oldLang = Validator.getDefaultLang()
    const rawMessages = { required: 'Le nkundla iyadingeka', attributes: {} }
    Validator.setMessages('zu', rawMessages).useLang('zu')
    const validator = new Validator({ zip: '' }, { zip: 'required' })
    const messages = Validator.getMessages('zu')
    expect(messages).toEqual(rawMessages)
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('zip')).toEqual('Le nkundla iyadingeka')
    Validator.useLang(oldLang)
  })

  it('should be able to use Khmer', function () {
    Validator.useLang('kh')
    const oldLang = Validator.getDefaultLang()
    const validator = new Validator({ zip: '' }, { zip: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('zip')).toEqual('zip ត្រូវតែបញ្ចូលជាដាច់ខាត។')
    Validator.useLang(oldLang)
  })

  it('should be able to use Russian', function () {
    Validator.useLang('ru')
    const oldLang = Validator.getDefaultLang()
    const validator = new Validator({ zip: '' }, { zip: 'required' })
    expect(validator.fails()).toBeTruthy()
    expect(validator.errors.first('zip')).toEqual(
      'Поле zip обязательно для заполнения.',
    )
    expect(validator.errors.all()).toEqual({
      zip: ['Поле zip обязательно для заполнения.'],
    })
    Validator.useLang(oldLang)
  })
})
