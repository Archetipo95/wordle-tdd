<script setup lang="ts">
import { WORD_SIZE } from '../settings'
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
  <ul class="word">
    <li v-for="(letter, index) in formattedGuessInProgress.padEnd(WORD_SIZE, ' ')" :key="`${letter}-${index}`" :data-letter="letter" class="letter" v-text="letter" />
  </ul>

  <input v-model="formattedGuessInProgress" autofocus @blur="({target})=> (target as HTMLInputElement).focus()" type="text" @keydown.enter="onSubmit()" />
</template>

<style scoped>
input {
  position: absolute;
  opacity: 0;
}
.word {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 0.25rem;
}
.letter {
  background-color: white;
  border: 1px solid hsl(0, 0%, 70%);
  width: 5rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bolder;
}
li:not([data-letter=' ']) {
  animation: pop 100ms;
}
@keyframes pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
}
</style>
