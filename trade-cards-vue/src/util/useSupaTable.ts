import { supabase } from '../util/supabase';
import { ref } from 'vue';

type TableColumns = {
  [columnName: string]: TableColumn;
};

type TableColumn = {
  type: string;
  nullable?: boolean;
};

export function useSupaTable<T>(tableName: string, columns: TableColumns) {
  const records = ref<T[]>();
  const error = ref();

  async function insertRecord(form: T) {
    const invalidInput = Object.entries(columns).some(
      ([name, { nullable }]) => !(form as Record<string, any>)[name] && !nullable
    );

    if (invalidInput) {
      throw new Error('Invalid input, check if all required fields are filled');
    }

    try {
      const { error: insertError } = await supabase
        .from(tableName)
        .insert([form])
        .select();

      if (insertError) throw insertError;

      await getRecords();
    } catch (err) {
      error.value = err;
    }
  }

  async function updateRecord(id: number, form: Partial<T>) {
    try {
      const { error: updateError } = await supabase
        .from(tableName)
        .update(form)
        .eq('id', id);

      if (updateError) throw updateError;

      await getRecords();
    } catch (err) {
      error.value = err;
    }
  }

  async function getRecordById(id: number): Promise<T | null> {
    try {
      const { data, error: selectError } = await supabase
        .from(tableName)
        .select()
        .eq('id', id);

      if (selectError) throw selectError;

      return data ? data[0] : null;
    } catch (err) {
      error.value = err;
      return null;
    }
  }

  async function search(query: string){
    try {
      const { data, error: selectError } = await supabase
        .from(tableName)
        .select()
        .textSearch('name', query);

      if (selectError) throw selectError;
      return data;
    } catch (err) {
      error.value = err;
      return null;
    }
  }

  async function deleteRecord(id: number) {
    try {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await getRecords();
    } catch (err) {
      error.value = err;
    }
  }

  async function getRecords() {
    try {
      const { data, error: selectError } = await supabase.from(tableName).select('*');
      if (selectError) throw selectError;
      records.value = data;
    } catch (err) {
      error.value = err;
    }
  }

  //Random id
  function createId() {
    return Math.floor(Math.random() * 9000) + 1000;
  }

  return {
    records,
    error,
    insertRecord,
    getRecords,
    updateRecord,
    deleteRecord,
    getRecordById,
    search,
    createId
  };
}
