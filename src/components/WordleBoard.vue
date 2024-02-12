<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from '../settings'
import englishWords from '@/englishWordsWith5Letters.json'
import { ref, computed } from 'vue'

defineProps({
  wordOfTheDay: {
    type: String,
    validator: (wordGiven: string) => englishWords.includes(wordGiven),
  },
})

const guessInProgress = ref<string | null>(null)
const guessSubmitted = ref('')

const formattedGuessInProgress = computed<string>({
  get() {
    return guessInProgress.value ?? ''
  },
  set(rawValue: string) {
    guessInProgress.value = null

    guessInProgress.value = rawValue
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, WORD_SIZE)
  },
})

const onSubmit = () => {
  if (!englishWords.includes(formattedGuessInProgress.value)) {
    return
  }

  guessSubmitted.value = formattedGuessInProgress.value
}
</script>

<template>
  <input v-model="formattedGuessInProgress" type="text" @keydown.enter="onSubmit()" />
  <p v-if="guessSubmitted.length > 0" v-text="guessSubmitted === wordOfTheDay ? VICTORY_MESSAGE : DEFEAT_MESSAGE" />
</template>
