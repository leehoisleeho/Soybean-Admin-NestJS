import { ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchCreateDog, fetchDeleteDog, fetchDogList, fetchUpdateDog, fetchUpdateDogStatus } from '@/service/api/dog';

export const useDogStore = defineStore('dog-store', () => {
  const dogs = ref<Api.Dog.DogInfo[]>([]);
  const loading = ref(false);

  async function getDogList() {
    loading.value = true;
    try {
      const { data, error } = await fetchDogList();
      if (!error && data) {
        dogs.value = data;
      }
    } finally {
      loading.value = false;
    }
  }

  async function addDog(dog: Api.Dog.DogInfo) {
    const { error } = await fetchCreateDog(dog);
    if (!error) {
      await getDogList();
      return true;
    }
    return false;
  }

  async function updateDog(dog: Api.Dog.DogInfo) {
    const { error } = await fetchUpdateDog(dog);
    if (!error) {
      await getDogList();
      return true;
    }
    return false;
  }

  async function updateDogStatus(id: string, status: Api.Dog.Status) {
    const { error } = await fetchUpdateDogStatus(id, status);
    if (!error) {
      await getDogList();
      return true;
    }
    return false;
  }

  async function deleteDog(id: string) {
    // Check status locally first if needed, but better to let backend handle validation
    // But existing logic had a check for 'adopted'
    const dog = dogs.value.find(item => item.id === id);
    if (dog && dog.status === 'adopted') {
      return false;
    }

    const { error } = await fetchDeleteDog(id);
    if (!error) {
      await getDogList();
      return true;
    }
    return false;
  }

  return {
    dogs,
    loading,
    getDogList,
    addDog,
    updateDog,
    updateDogStatus,
    deleteDog
  };
});
