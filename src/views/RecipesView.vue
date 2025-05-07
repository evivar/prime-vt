<template>
  <main
    class="recipes lg:flex p-4 hidden flex-row gap-4 lg:flex-nowrap flex-wrap-reverse"
  >
    <Panel header="Recipes" class="lg:w-1/3 w-full">
      <ScrollPanel class="recipes-scroll" style="height: calc(100vh - 104px);">
        <div class="recipes-list">
          <!-- Mostrar las recetas -->
          <div v-for="recipe in recipes" :key="recipe.id" class="recipe-item">
            <span>{{ recipe.fields.Name }}</span> <!-- Cambia esto según los campos que uses -->
          </div>
        </div>
      </ScrollPanel>
    </Panel>
    <Panel
      :header="selectedRecipe ? selectedRecipe.name : 'New recipe'"
      class="shopping-list-panel lg:w-2/3 w-full"
    >
      <span>La receta</span>
    </Panel>
  </main>
</template>

<script setup>
import Panel from "primevue/panel";
import ScrollPanel from "primevue/scrollpanel";
import { onMounted, ref } from "vue";
import axios from "axios";

const selectedRecipe = ref(null);
const recipes = ref([]);

onMounted(async () => {
  console.log("onMounted");
  const response = await axios.get(
    "https://api.airtable.com/v0/appK13ISOZy5bznU1/tblQYAwgASHHYQ0MJ?sort%5B0%5D%5Bfield%5D=created&sort%5B0%5D%5Bdirection%5D=desc"
  );
  console.log("response", response);
  recipes.value = response.data.records;
});
</script>

<style lang="scss" scoped>
.recipes {
  padding: 1rem;
  height: 100%;
  min-height: calc(100vh - 104px);
  &--list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    &--items {
      border: 1px solid #3c3c3c4a;
      padding: 1rem;
    }
  }
}

.recipes-scroll {
  height: calc(100vh - 104px); /* Asegúrate de que ocupe todo el espacio disponible dentro del Panel */
}

.recipe-item {
  height: 48px;
  padding: 1rem;
  border: 1px solid #ccc;
  margin-bottom: 8px;
}

.p-scrollpanel-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
