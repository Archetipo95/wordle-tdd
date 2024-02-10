<script setup lang="ts">
import { VICTORY_MESSAGE } from '../settings'

defineProps<{
  wordOfTheDay: string
}>()
</script>

<template>
  <input type="text" name="inputGuess" id="inputGuess" />
  <p>{{ VICTORY_MESSAGE }}</p>
</template>
