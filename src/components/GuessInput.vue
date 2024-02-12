<script setup lang="ts">
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE } from '../settings'
import englishWords from '@/englishWordsWith5Letters.json'
import { ref, computed } from 'vue'

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
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .slice(0, WORD_SIZE)
  },
})

const onSubmit = () => {
  if (!englishWords.includes(formattedGuessInProgress.value)) {
    return
  }

  emit('guess-submitted', formattedGuessInProgress.value)
}
</script>

<template>
  <input v-model="formattedGuessInProgress" type="text" @keydown.enter="onSubmit()" />
</template>
