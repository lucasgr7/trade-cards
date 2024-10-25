<script lang="ts" setup>
import { supabase } from '../util/supabase';
import { onMounted } from 'vue';
import CardDeck from '../components/CardDeck.vue';
import CardChosen from '../components/CardChosen.vue';
import { CardType } from '../enums/cardType';

onMounted(() => {
  // TODO subscribe para as mudanças na tabela partidas do ID do registro da sala
  supabase
    .channel('room1')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'partidas' }, payload => {
      console.log('Change received!', payload)
    })
    .subscribe()
})

// TODO: Implementar a função choseCard
function choseCard(title: string) {
 alert(`Card chosen: ${title}`);
}

</script>
<template>
  <div class="flex flex-col items-center justify-between p-4
    border border-white rounded-xl bg-trade-blue-50
    w-screen h-screen">
    <h1 class="text-4xl font-black text-outline-blue mt-2">Trade-Cards</h1>
    <p class="text-blue-900 mt-2">Escolha as cartas do deck para montar uma ação.</p>
    <CardDeck :onChoseCard="choseCard" />
     <div class="flex gap-x-2">
      <CardChosen :card-type="CardType.Action"/>
      <CardChosen :card-type="CardType.Object"/>
      <CardChosen :card-type="CardType.Condition"/>
     </div>
  </div>
</template>

<style lang="css">
h1 {
  text-align: center;
}
</style>