<template>
  <main class="home p-4 flex flex-row gap-4 lg:flex-nowrap flex-wrap">
    <Panel class="w-full" header="Recipes">
      <div class="flex lg:flex-row flex-col gap-4 w-full">
        <InputText
          v-model="recipeQuery"
          @input="onSearchRecipe"
          class="lg:w-[80%] w-full"
          placeholder="Search recipes"
        ></InputText>
        <Button class="lg:w-[20%] w-full">New recipe</Button>
      </div>
      <DataView
        :value="recipes"
        paginator
        :rows="10"
        v-if="!isInitializing"
        style="width: 100%; margin-top: 1rem"
      >
        <template #list="recipes">
          <div class="flex flex-col gap-2">
            <RecipeCard v-for="(item, index) in recipes.items" :key="index" :recipe="item" />
          </div>
        </template>
      </DataView>
      <div v-else class="text-center p-4">
        <span class="pi pi-spin pi-spinner-dotted"></span>
      </div>
    </Panel>
  </main>
</template>

<script setup>
import Panel from "primevue/panel";
import MenuCard from "@/components/MenuCard.vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ScrollPanel from "primevue/scrollpanel";
import SwipeToDelete from "@/components/SwipeToDelete.vue";
import NewRecipe from "@/components/NewRecipe.vue";
import DataView from "primevue/dataview";
import { onMounted, onUnmounted, ref } from "vue";
import { useToast } from "primevue/usetoast";

import axios from "axios";
import RecipeCard from "@/components/RecipeCard.vue";

const toast = useToast();

const recipes = ref([]);
const isInitializing = ref(false);
const recipeQuery = ref(null);

onMounted(async () => {
  isInitializing.value = true;
  await initRecipes();
  isInitializing.value = false;
});

const initRecipes = async () => {
  const response = await axios.get(
    "https://api.airtable.com/v0/appK13ISOZy5bznU1/tblQYAwgASHHYQ0MJ?sort%5B0%5D%5Bfield%5D=created&sort%5B0%5D%5Bdirection%5D=desc"
  );
  if (response.status === 200) {
    recipes.value = response.data.records;

    toast.add({
      severity: "success",
      summary: "Recipes initialized",
      detail: "Recipe list initialized successfully",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error fetching recipes",
      detail: "Try again later",
      life: 3000,
    });
    return;
  }
};

const onSearchRecipe = () => {
  console.log("onSearchRecipe");
  console.log(recipeQuery.value);
  if (recipeQuery.value) {
    recipes.value = recipes.value.filter((recipe) =>
      recipe.fields.title.toLowerCase().includes(recipeQuery.value.toLowerCase())
    );
  } else {
    initRecipes();
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 1rem;
  height: 100%;
  & > .shopping-list-panel {
    // height: 100%;
  }
}

.shopping-list-item {
  border: 1px solid #3c3c3c4a;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.purchased {
  text-decoration: line-through;
}

.pi-spinner-dotted {
  font-size: xx-large;
}

#add-btn > span {
  font-weight: 900;
}
</style>
