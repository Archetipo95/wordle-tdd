import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '../../settings'

describe('WordleBoard', () => {
  test('vicotry message appears wheen the user guesses the word', async () => {
    // Arrange
    const wrapper = mount(WordleBoard, {
      props: {
        wordOfTheDay: 'TESTS',
      },
    })

    // Act
    const guessInput = wrapper.find("input[type='text']")
    await guessInput.setValue('TESTS')
    await guessInput.trigger('keydown.enter')

    // Assert
    expect(wrapper.text()).toContain(VICTORY_MESSAGE)
  })

  test("a defeat message appears when the user doesn't guess the word", async () => {
    const wrapper = mount(WordleBoard, {
      props: {
        wordOfTheDay: 'WRONG',
      },
    })

    const guessInput = wrapper.find("input[type='text']")
    await guessInput.setValue('TESTS')
    await guessInput.trigger('keydown.enter')

    expect(wrapper.text()).toContain(DEFEAT_MESSAGE)
  })

  test.todo("no end of game message appears when the user hasn't yet made a guess")
})
