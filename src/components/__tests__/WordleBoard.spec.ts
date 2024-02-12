import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import GuessView from '../GuessView.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, MAX_GUESSES_COUNT } from '../../settings'

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

  const playerTypesGuess = async (guess: string) => {
    await wrapper.find("input[type='text']").setValue(guess)
  }

  const playerPressesEnter = async () => {
    await wrapper.find("input[type='text']").trigger('keydown.enter')
  }

  const playerTypesAndSubmitsGuess = async (guess: string) => {
    await playerTypesGuess(guess)
    await playerPressesEnter()
  }

  describe('End of game messages', () => {
    test('victory message appears when the user guesses the word', async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay)

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    describe.each(
      Array.from({ length: MAX_GUESSES_COUNT + 1 }, (_, numberOfGuesses) => ({
        numberOfGuesses,
        showDefaultMessage: numberOfGuesses === MAX_GUESSES_COUNT,
      }))
    )(`defeat message appears when the user makes ${MAX_GUESSES_COUNT} wrong guesses in a row`, async ({ numberOfGuesses, showDefaultMessage }) => {
      test(`for ${numberOfGuesses} guesses, a defeat message should ${showDefaultMessage ? '' : 'not'} appear`, async () => {
        for (let i = 0; i < numberOfGuesses; i++) {
          await playerTypesAndSubmitsGuess('WRONG')
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

    test('input gets cleared after submission', async () => {
      await playerTypesAndSubmitsGuess('WRONG')

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toEqual('')
    })

    test('player guesses are limited to 5 letters', async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay + 'EXTRA')

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test('player guesses can only be submitted if they are real words', async () => {
      await playerTypesAndSubmitsGuess('QWERT')

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE)
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE)
    })

    test('player guesses are not case-sensitive', async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay.toLowerCase())

      expect(wrapper.text()).toContain(VICTORY_MESSAGE)
    })

    test('player guesses can only contain letters', async () => {
      await playerTypesGuess('H3eL!')

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toEqual('HEL')
    })

    test('Non letter charaters dont render on the screen while beeing typed', async () => {
      await playerTypesGuess('333')
      await playerTypesGuess('123')

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').element.value).toEqual('')
    })

    test('the player loses control after the max amount of guesses have been sent', async () => {
      const guesses = ['WRONG', 'GUESS', 'HELLO', 'WORLD', 'HAPPY', 'CODER']

      for (const guess of guesses) {
        await playerTypesAndSubmitsGuess(guess)
      }

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').attributes('disabled')).not.toBeUndefined()
    })

    test('the player loses control after correct word has been given', async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay)

      expect(wrapper.find<HTMLInputElement>('input[type="text"]').attributes('disabled')).not.toBeUndefined()
    })
  })

  test('Previous guesses are all visible', async () => {
    const guesses = ['WRONG', 'GUESS', 'HELLO', 'WORLD', 'HAPPY', 'CODER']

    for (const guess of guesses) {
      await playerTypesAndSubmitsGuess(guess)
    }

    for (const guess of guesses) {
      expect(wrapper.text()).toContain(guess)
    }
  })

  describe(`there should always be exactly ${MAX_GUESSES_COUNT} guess-views in the board`, async () => {
    test(`${MAX_GUESSES_COUNT} guess-views are present at the start of the game`, async () => {
      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
    })

    test(`${MAX_GUESSES_COUNT} guess-views are present when the player wins the game`, async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay)

      expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
    })

    test(`${MAX_GUESSES_COUNT} guess-views are present as the player loses the game`, async () => {
      const guesses = ['WRONG', 'GUESS', 'HELLO', 'WORLD', 'HAPPY', 'CODER']

      for (const guess of guesses) {
        await playerTypesAndSubmitsGuess(guess)
        expect(wrapper.findAllComponents(GuessView)).toHaveLength(MAX_GUESSES_COUNT)
      }
    })
  })

  describe('Displaying hints/feedback to the player', () => {
    test('hints are not displayed until the player submits their guess', async () => {
      expect(wrapper.find('[data-letter-feedback]').exists(), 'Feedback was being rendered before the player started typing their guess').toBe(false)

      await playerTypesGuess(wordOfTheDay)
      expect(wrapper.find('[data-letter-feedback]').exists(), 'Feedback was rendered while the player was typing their guess').toBe(false)

      await playerPressesEnter()
      expect(wrapper.find('[data-letter-feedback]').exists(), 'Feedback was not rendered after the player submitted their guess').toBe(true)
    })
  })
})
