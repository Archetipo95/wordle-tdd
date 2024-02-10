import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '../../settings'
import { before } from 'node:test'

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

  describe('When the game is over', () => {
    test('vicotry message appears wheen the user guesses the word', async () => {
      await playerSubmitsGuess(wordOfTheDay)

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test("a defeat message appears when the user doesn't guess the word", async () => {
      await playerSubmitsGuess('WRONG')

      expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
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
    test.todo('player guesses are limited to 5 letters')
    test.todo('player guesses can only be submitted if they are real words')
    test.todo('player guesses are not case-sensitive')
    test.todo('player guesses can only contain letters')
  })
})
