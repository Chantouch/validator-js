import Validator from '../validator'

const failAsserts = [
  [
    {},
    {
      name: 'The name field is required.',
      'data.weight': 'The data.weight field is required.',
      'data.hair.color': 'The data.hair.color field is required.',
    },
  ],
  [
    { name: 'David' },
    {
      'data.weight': 'The data.weight field is required.',
      'data.hair.color': 'The data.hair.color field is required.',
    },
  ],
  [
    { data: { weight: 70 } },
    {
      name: 'The name field is required.',
      'data.hair.color': 'The data.hair.color field is required.',
    },
  ],
  [
    { data: { hair: { color: 'black' } } },
    {
      name: 'The name field is required.',
      'data.weight': 'The data.weight field is required.',
    },
  ],
]

describe('nested validation rules', function () {
  const nestedObject = {
    name: 'required',
    data: {
      weight: 'required',
      hair: {
        color: 'required',
      },
    },
  }

  const nestedFlatten = {
    name: 'required',
    'data.weight': 'required',
    'data.hair.color': 'required',
  }

  const dataPass = {
    name: 'David',
    data: {
      weight: 70,
      hair: {
        color: 'black',
      },
    },
  }

  it('should pass with validation rules nested object', function () {
    const validator = new Validator(dataPass, nestedObject)
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should fail with validation rules nested object', function () {
    failAsserts.forEach(function (assert) {
      const validator = new Validator(assert[0], nestedObject)
      expect(validator.passes()).toBeFalsy()
      expect(validator.fails()).toBeTruthy()
      Object.keys(assert[1]).forEach(function (key) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(validator.errors.first(key)).toEqual(assert[1][key])
      })
    })
  })

  it('should pass with validation rules flatten object', function () {
    const validator = new Validator(dataPass, nestedFlatten)
    expect(validator.passes()).toBeTruthy()
    expect(validator.fails()).toBeFalsy()
  })

  it('should fail with validation rules flatten object', function () {
    failAsserts.forEach(function (assert) {
      const validator = new Validator(assert[0], nestedFlatten)
      expect(validator.passes()).toBeFalsy()
      expect(validator.fails()).toBeTruthy()
      Object.keys(assert[1]).forEach(function (key) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(validator.errors.first(key)).toEqual(assert[1][key])
      })
    })
  })
}) // Page constructor
