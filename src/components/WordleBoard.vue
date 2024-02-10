<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '../settings'
import { ref } from 'vue'

const props = defineProps<{
  wordOfTheDay: string
}>()

const inputGuess = ref('')
const isGuessSubmitted = ref(false)

const isGuessCorrect = () => {
  return inputGuess.value === props.wordOfTheDay
}
</script>

<template>
  <input type="text" name="inputGuess" id="inputGuess" v-model="inputGuess" @keydown.enter="isGuessSubmitted = true" />

  <p v-if="isGuessSubmitted" v-text="isGuessCorrect() ? VICTORY_MESSAGE : DEFEAT_MESSAGE" />
</template>
