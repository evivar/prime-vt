<template>
  <main class="home p-4 flex flex-row gap-4 lg:flex-nowrap flex-wrap">
    <Panel class="w-full" header="Recipes">
      <div class="flex lg:flex-row flex-col gap-4 w-full">
        <InputText
          v-model="recipeQuery"
          @input="onSearchRecipe"
          class="lg:w-[80%] w-full"
          :placeholder="$t('recipes.searchPlaceholder')"
        ></InputText>
        <Button class="lg:w-[20%] w-full" id="new-recipe-btn" @click="isCreateDialogVisible = true"
          >{{ $t('buttons.newRecipe') }}</Button
        >
      </div>
      <DataView
        :value="recipes"
        paginator
        :rows="10"
        v-if="!isInitializing"
        style="width: 100%; margin-top: 1rem"
        @page="onPageUpdate"
      >
        <template #list="recipes">
          <div class="lg:grid lg:grid-cols-2 flex flex-col gap-2 py-2">
            <RecipeCard
              v-for="(item, index) in recipes.items"
              :key="index"
              :recipe="item"
              @delete-recipe="onDeleteRecipe(item.id, index)"
              @update="onUpdateRecipe"
            />
          </div>
        </template>
      </DataView>
      <div v-else class="text-center p-4">
        <span class="pi pi-spin pi-spinner-dotted"></span>
      </div>
    </Panel>

    <CreateRecipeDialog
      :visible="isCreateDialogVisible"
      @close="isCreateDialogVisible = false"
      @save="onSaveRecipe"
    />
  </main>
</template>

<script setup>
import CreateRecipeDialog from "@/components/CreateRecipeDialog.vue";
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

const isCreateDialogVisible = ref(false);

onMounted(async () => {
  isInitializing.value = true;
  await initRecipes();
  isInitializing.value = false;
});

const onPageUpdate = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

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
  if (recipeQuery.value) {
    recipes.value = recipes.value.filter((recipe) =>
      recipe.fields.title
        .toLowerCase()
        .includes(recipeQuery.value.toLowerCase())
    );
  } else {
    initRecipes();
  }
};

// https://airtable.com/appK13ISOZy5bznU1/tblQYAwgASHHYQ0MJ/viwtpXtcPwJYw1rWW/fldbQijgJSXRtU6mw

const uploadImage = async (image) => {
  console.log("img", image);
  const response = await axios.post(
    "https://airtable.com/appK13ISOZy5bznU1/tblQYAwgASHHYQ0MJ/viwtpXtcPwJYw1rWW/fldbQijgJSXRtU6mw",
    {
      contentType: "image/jpeg, image/png",
      file: image,
      filename: "recipe image",
    }
  );
  console.log("response", response);
};

const onSaveRecipe = async (newRecipe) => {
  const response = await axios.post(
    "https://api.airtable.com/v0/appK13ISOZy5bznU1/tblQYAwgASHHYQ0MJ",
    { records: newRecipe.records }
  );
  if (response.status === 200) {
    toast.add({
      severity: "success",
      summary: "Recipe added",
      detail: "Recipe added successfully",
      life: 3000,
    });
    isCreateDialogVisible.value = false;
    // if (newRecipe.image) {
    //   await uploadImage(newRecipe.image);
    // }
    await initRecipes();
  } else {
    toast.add({
      severity: "error",
      summary: "Error adding recipe",
      detail: "Try again later",
      life: 3000,
    });
  }
};

const onDeleteRecipe = async (recipeId, idx) => {
  const response = await axios.delete(
    `https://api.airtable.com/v0/appK13ISOZy5bznU1/tblQYAwgASHHYQ0MJ/${recipeId}`
  );
  if (response.status === 200) {
    toast.add({
      severity: "success",
      summary: "Recipe deleted",
      detail: "Recipe deleted successfully",
      life: 3000,
    });
    recipes.value.splice(idx, 1);
  } else {
    toast.add({
      severity: "error",
      summary: "Error deleting recipe",
      detail: "Try again later",
      life: 3000,
    });
  }
};

const onUpdateRecipe = async () => {
  await initRecipes();
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

#new-recipe-btn > span {
  font-weight: 900;
}
</style>
