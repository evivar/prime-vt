<template>
  <Menubar class="menu-bar" :model="items">
    <template #start>
      <img src="@/assets/logo.png" alt="logo" class="lg:w-22 w-30" />
    </template>
  </Menubar>
  <RouterView />
</template>

<script setup>
import Menubar from "primevue/menubar";
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";

import { useRouter } from 'vue-router';

const router = useRouter();

const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
    command: () => {
      router.push("/");
    },
  },
  {
    label: "Recipes",
    icon: "pi pi-book",
    command: () => {
      router.push("/recipes");
    },
  },
]);
</script>

<style lang="scss" scoped>
.menu-bar {
  border: none;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 2;
}
</style>
