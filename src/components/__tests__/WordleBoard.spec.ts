import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'

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
    expect(wrapper.text()).toContain('You won!')
  })
})
