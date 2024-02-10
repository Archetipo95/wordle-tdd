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

  test('warn message appears if the word is less than 5 characters', async () => {
    // 1st way to mock the console.warn
    const spy = vi.spyOn(console, 'warn')

    // Clear the console from errors
    spy.mockImplementation(() => null)

    mount(WordleBoard, {
      props: {
        wordOfTheDay: 'FLY',
      },
    })

    expect(console.warn).toHaveBeenCalled()
  })

  test('If the word is not in uppercase, a warn is needed', async () => {
    // 2nd way to mock the console.warn
    console.warn = vi.fn()

    mount(WordleBoard, {
      props: {
        wordOfTheDay: 'tests',
      },
    })

    expect(console.warn).toHaveBeenCalled()
  })
})
