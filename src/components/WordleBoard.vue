<script setup lang="ts">
defineProps<{
  wordOfTheDay: string
}>()
</script>

<template>
  <input type="text" name="inputGuess" id="inputGuess" />
  <p>You won!</p>
</template>
