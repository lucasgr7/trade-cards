import { useStorage } from "@vueuse/core";
import { ref, watch } from "vue";

export function useSerializedStorage<T>(key: string, initialValue: T) {
  const storageValue = useStorage<string | null>(key, null);
  const value = ref<T>(initialValue);

  if (storageValue.value) {
    try {
      value.value = JSON.parse(storageValue.value);
    } catch (e) {
      console.error(`Error parsing ${key} from localStorage:`, e);
    }
  }

  watch(value, (newValue) => {
    storageValue.value = JSON.stringify(newValue);
  }, { deep: true });

  return value;
}