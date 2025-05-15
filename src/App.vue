<template>
  <Menubar class="menu-bar flex flex-row" :model="items">
    <template #start>
      <router-link to="/">
        <img src="@/assets/myhomeplanner.png" alt="logo" class="lg:w-40 w-38 p-4" />
      </router-link>
    </template>
  </Menubar>
  <RouterView />
  <Toast class="!w-80 custom-toast" position="bottom-right" />
</template>

<script setup>
import Menubar from "primevue/menubar";
import { RouterLink, RouterView } from "vue-router";
import Toast from "primevue/toast";
import { ref } from "vue";

import { useRouter } from "vue-router";

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
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
  justify-content: space-between;
  // justify-content: center;
  position: sticky;
  top: 0;
  z-index: 2;
}

.p-toast {
  width: 20rem !important;
}
</style>
