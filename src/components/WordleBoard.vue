<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '../settings'
import { ref } from 'vue'

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (word: string) => word.length === 5 && word.toUpperCase() === word,
  },
})

const guessInProgress = ref('')
const guessSubmitted = ref('')
</script>

<template>
  <input v-model="guessInProgress" type="text" @keydown.enter="guessSubmitted = guessInProgress" />
  <p v-if="guessSubmitted.length > 0" v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE" />
</template>
