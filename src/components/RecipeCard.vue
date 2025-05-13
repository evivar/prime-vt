<template>
  <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4 menu-card">
    <div class="">
      <img
        class="block xl:block mx-auto rounded w-full h-full object-cover"
        :src="
          recipe.fields?.image
            ? recipe.fields.image[0].url
            : 'src/assets/output-onlinepngtools.png'
        "
        :alt="recipe.fields.title"
      />
    </div>
    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
      <div class="flex flex-row md:flex-col justify-between items-start gap-2">
        <div class="text-lg font-medium mt-2 place-items-start">
          {{ recipe.fields.title }}
        </div>
      </div>
      <div class="flex flex-col md:items-end gap-8">
        <div class="flex flex-row md:flex-row gap-2">
          <Button
          v-if="recipe.fields.url"
            icon="pi pi-eye"
            label="View recipe"
            class="flex-auto md:flex-initial whitespace-nowrap"
            @click="onViewRecipeURLClick(recipe.fields.url)"
          ></Button>
          <Button
          v-else
            icon="pi pi-eye"
            label="View recipe"
            class="flex-auto md:flex-initial whitespace-nowrap"
            @click="isDialogVisible = true"
          ></Button>
        </div>
      </div>
    </div>
    <RecipeDialog :visible="isDialogVisible" @close="isDialogVisible=false" :recipe="recipe"/>
  </div>
</template>

<script setup>
import RecipeDialog from "@/components/RecipeDialog.vue";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { ref } from "vue";

defineProps({
  recipe: {
    type: Object,
    required: true,
  },
});

const isDialogVisible = ref(false);

const onViewRecipeURLClick = (url) => {
  window.open(url, "_blank");
};
</script>

<style lang="scss" scoped>
.menu-card {
  border-radius: 6px;
  border: 1px solid #3c3c3c4a;
}

.menu-card img {
  object-fit: cover; /* Asegura que la imagen cubra el área sin deformarse */
  width: 100%; /* Ancho completo */
  height: 10rem;
}
</style>
