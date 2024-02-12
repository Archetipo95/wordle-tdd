<script setup lang="ts">
import GuessInput from './GuessInput.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from '../settings'
import englishWords from '@/englishWordsWith5Letters.json'
import { ref } from 'vue'

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven),
  },
})

const guessSubmitted = ref('')
</script>

<template>
  <GuessInput @guess-submitted="(guess) => (guessSubmitted = guess)" />
  <p v-if="guessSubmitted.length > 0" v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE" />
</template>
