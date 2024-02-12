<script setup lang="ts">
import { WORD_SIZE } from '../settings'
import englishWords from '@/englishWordsWith5Letters.json'
import { ref, computed } from 'vue'
import GuessView from './GuessView.vue'

const guessInProgress = ref<string | null>(null)

const emit = defineEmits<{
  'guess-submitted': [guess: string]
}>()

const formattedGuessInProgress = computed<string>({
  get() {
    return guessInProgress.value ?? ''
  },
  set(rawValue: string) {
    guessInProgress.value = null

    guessInProgress.value = rawValue
      .slice(0, WORD_SIZE)
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
  },
})

const onSubmit = () => {
  if (!englishWords.includes(formattedGuessInProgress.value)) {
    return
  }

  emit('guess-submitted', formattedGuessInProgress.value)
  guessInProgress.value = null
}
</script>

<template>
  <GuessView :guess="formattedGuessInProgress" />

  <input v-model="formattedGuessInProgress" autofocus @blur="({target})=> (target as HTMLInputElement).focus()" type="text" @keydown.enter="onSubmit()" />
</template>

<style scoped>
input {
  position: absolute;
  opacity: 0;
}
</style>
