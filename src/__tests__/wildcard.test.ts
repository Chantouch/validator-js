import Validator from '../validator'

describe('Wildcard', function () {
  describe('Simple Rules ', function () {
    it('should have validation a deep level fails', function () {
      const validator = new Validator(
        {
          foo: [
            {
              bar: [
                {
                  people: [
                    {
                      name: '',
                      age: 'aa',
                      term: false,
                      isActive: 'not',
                    },
                    {
                      name: '',
                      age: 'aa',
                      term: false,
                      isActive: 'not',
                    },
                  ],
                },
                {
                  people: [
                    {
                      name: '',
                      age: 'aa',
                      term: false,
                      isActive: 'not',
                    },
                    {
                      name: '',
                      age: 'aa',
                      term: false,
                      isActive: 'not',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          'foo.*.bar.*.people.*.name': 'required',
          'foo.*.bar.*.people.*.age': 'numeric',
          'foo.*.bar.*.people.*.term': 'accepted',
          'foo.*.bar.*.people.*.isActive': 'boolean',
        },
      )
      expect(validator.fails()).toBeTruthy()
      expect(validator.passes()).toBeFalsy()
    })
    it('should have validation a deep level passes', function () {
      const validator = new Validator(
        {
          foo: [
            {
              bar: [
                {
                  people: [
                    {
                      name: 'Test',
                      age: '100',
                      term: true,
                      isActive: '0',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          'foo.*.bar.*.people.*.name': 'required',
          'foo.*.bar.*.people.*.age': 'numeric',
          'foo.*.bar.*.people.*.term': 'accepted',
          'foo.*.bar.*.people.*.isActive': 'boolean',
        },
      )
      expect(validator.fails()).toBeFalsy()
      expect(validator.passes()).toBeTruthy()
    })
  })
  describe('Rules with dependent of another field', function () {
    it('should have validation fail with required_* and show customMessage', function () {
      const validator = new Validator(
        {
          users: [
            {
              name: 'Teste',
              lastName: '',
              age: '',
              requiredAge: 'true',
            },
          ],
        },
        {
          'users.*.age': 'required_if:users.*.requiredAge,true',
          'users.*.lastName': 'required_with:users.*.name',
        },
        {
          'required_if.users.*.age': 'Required',
        },
      )
      expect(validator.fails()).toBeTruthy()
      expect(validator.passes()).toBeFalsy()
      expect(validator.errors.all()).toEqual({
        'users.0.age': ['Required'],
        'users.0.lastName': [
          'The users.0.lastName field is required when users.0.name is not empty.',
        ],
      })
    })
  })
})