<script lang="ts" setup>
import { computed } from 'vue';

const {command} = defineProps<{
  command: string;
}>();

const color = computed(() => {
  if (command.toLowerCase().includes('troque')) return 'red';
  if (command.toLowerCase().includes('revelar')) return 'blue';
  return 'defaultColor';
});
const colorObject = computed(() => {
  if (command.toLowerCase().includes('assento')) return 'purple';
  if (command.toLowerCase().includes('presente')) return 'green';
  return 'defaultColor';
});

const pillAction = computed(() => {
  if (command.toLowerCase().includes('troque')) return 'Troque';
  if (command.toLowerCase().includes('revelar')) return 'Revelar';
  return 'Comando';
});
const pillObject = computed(() => {
  if (command.toLowerCase().includes('presente')) return 'Presente';
  if (command.toLowerCase().includes('assento')) return 'Assento';
  return 'Comando';
});
</script>
<template>
  <div class="flex flex-row">
    <div :class="['pill', color]" class="text-sm text-game text-white" style="text-align: center;">
      {{ pillAction }}
    </div>
    <div :class="['pill', colorObject]" class="text-sm text-game text-white" style="text-align: center;">
      {{ pillObject }}
    </div>
  </div>
</template>
<style scoped>
.pill{
  border: 2px solid black;
  border-radius: 20px;
  padding: 5px;
  margin: 5px;
  background: white;
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.5);
}
.red {
  background: linear-gradient(135deg, #ff4b1f, #ff9068);
}
.blue {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}
.purple {
  background: linear-gradient(135deg, #6a3093, #a044ff);
}
.green {
  background: linear-gradient(135deg, #00b09b, #96c93d);
}
.defaultColor {
  color: black;
}
</style>