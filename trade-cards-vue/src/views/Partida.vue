<script lang="ts" setup>
import { supabase } from '../util/supabase';
import { onMounted } from 'vue';

onMounted(() => {
  supabase
    .channel('room1')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries' }, payload => {
      console.log('Change received!', payload)
    })
    .subscribe()
})
</script>
<template>
  <div>
    <h1>Partida</h1>
  </div>
</template>