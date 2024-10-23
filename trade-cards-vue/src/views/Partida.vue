<script lang="ts" setup>
import { supabase } from '../util/supabase';
import { onMounted } from 'vue';
import CardDeck from '../components/CardDeck.vue';

onMounted(() => {
  supabase
    .channel('room1')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'partidas' }, payload => {
      console.log('Change received!', payload)
    })
    .subscribe()
})
</script>
<template>
  <div>
    <h1>Partida</h1>
  </div>
  <CardDeck />
</template>

<style lang="css">
h1 {
  text-align: center;
}
</style>