const slugHelper = require('./slug')

describe('Slug Helper', () => {
  describe('slugafy', () => {
    test('when undefined throws exception', () => {
      expect(() => {
        slugHelper.slugafy(undefined)
      })
        .toThrowError()
    })

    test('when empty string returns empty string', () => {
      expect(slugHelper.slugafy(''))
        .toBe('')
    })

    test('when capital letters returns lower case', () => {
      expect(slugHelper.slugafy('ABCd'))
        .toBe('abcd')
    })

    test('when none standard characters returns dashes', () => {
      expect(slugHelper.slugafy('b&b*c@d€e!f(g)h'))
        .toBe('b-b-c-d-e-f-g-h')
    })

    test('when conjunctions returns dashes', () => {
      expect(slugHelper.slugafy('b and c the e of f to g a h is j'))
        .toBe('b-c-e-f-g-h-j')
    })

    test('when dashes at ends returns none', () => {
      expect(slugHelper.slugafy('-sadvd-'))
        .toBe('sadvd')
    })
  })
})
