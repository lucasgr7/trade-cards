<script lang='ts' setup>

const props = defineProps({
  message: {
    type: String,
    required: true
  }
})

</script>

<template>
  <div>
    <p class="text-trade-blue-900 items-end mt-10 text-xs text-center">{{ props.message }}</p>
  </div>
</template>

<style scoped lang='scss'>
    
</style>