import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '../../settings'

describe('WordleBoard', () => {
  let wordOfTheDay = 'TESTS'
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(WordleBoard, {
      props: {
        wordOfTheDay,
      },
    })
  })

  const playerSubmitsGuess = async (guess: string) => {
    const guessInput = wrapper.find("input[type='text']")
    await guessInput.setValue(guess)
    await guessInput.trigger('keydown.enter')
  }

  describe('End of game messages', () => {
    test('victory message appears when the user guesses the word', async () => {
      await playerSubmitsGuess(wordOfTheDay)

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    describe.each([
      { numberOfGuesses: 0, showDefaultMessage: false },
      { numberOfGuesses: 1, showDefaultMessage: false },
      { numberOfGuesses: 2, showDefaultMessage: false },
      { numberOfGuesses: 3, showDefaultMessage: false },
      { numberOfGuesses: 4, showDefaultMessage: false },
      { numberOfGuesses: 5, showDefaultMessage: false },
      { numberOfGuesses: 6, showDefaultMessage: true },
    ])('defeat message appears when the user makes 6 wrong guesses in a row', async ({ numberOfGuesses, showDefaultMessage }) => {
      test(`for ${numberOfGuesses} guesses, a defeat message should ${showDefaultMessage ? '' : 'not'} appear`, async () => {
        for (let i = 0; i < numberOfGuesses; i++) {
          await playerSubmitsGuess('WRONG')
        }

        if (showDefaultMessage) {
          expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
        } else {
          expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
        }
      })
    })

    test("no end of game message appears when the user hasn't yet made a guess", async () => {
      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
  })

  describe('Rules defing the word of the day', () => {
    beforeEach(() => {
      // Clear the console from errors
      console.warn = vi.fn()
    })

    test.each([
      { wordOfTheDay: 'FLY', reason: 'must have 5 characters' },
      { wordOfTheDay: 'tests', reason: 'must be in uppercase' },
      { wordOfTheDay: 'QWERT', reason: 'must be an English word' },
    ])('If the word $wordOfTheDay is provided, a warn is emitted because $reason', async ({ wordOfTheDay }) => {
      mount(WordleBoard, {
        props: {
          wordOfTheDay,
        },
      })

      expect(console.warn).toHaveBeenCalled()
    })

    test('No warning is emitted if you provide an English word, all uppercase with 5 characters', async () => {
      mount(WordleBoard, {
        props: {
          wordOfTheDay: 'TESTS',
        },
      })

      expect(console.warn).not.toHaveBeenCalled()
    })
  })

  describe('Player input', () => {
    test('remain in focus the entire time', async () => {
      document.body.innerHTML = `<div id="app"></div>`

      wrapper = mount(WordleBoard, {
        props: { wordOfTheDay },
        attachTo: '#app',
      })

      expect(wrapper.find('input[type=text]').attributes('autofocus')).not.toBeUndefined()

      await wrapper.find('input[type=text]').trigger('blur')

      expect(document.activeElement).toBe(wrapper.find('input[type=text]').element)
    })

    test('player guesses are limited to 5 letters', async () => {
      await playerSubmitsGuess(wordOfTheDay + 'EXTRA')

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })
    test('player guesses can only be submitted if they are real words', async () => {
      await playerSubmitsGuess('QWERT')

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })
    test('player guesses are not case-sensitive', async () => {
      await playerSubmitsGuess(wordOfTheDay.toLowerCase())

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })
    test('player guesses can only contain letters', async () => {
      await playerSubmitsGuess('H3eL!Lo')

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toEqual('HELLO')
    })

    test('Non letter charaters dont render on the screen while beeing typed', async () => {
      await playerSubmitsGuess('333')
      await playerSubmitsGuess('123')

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toEqual('')
    })
  })
})
