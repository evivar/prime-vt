<template>
  <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4 menu-card">
    <div class="">
      <img
        class="block xl:block mx-auto rounded lg:w-40 w-full h-full object-cover"
        :src="
          recipe.fields?.imageURL
            ? recipe.fields.imageURL
            : 'src/assets/output-onlinepngtools.png'
        "
        :alt="recipe.fields.title"
      />
    </div>
    <div
      class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6"
    >
      <div class="flex flex-row md:flex-col justify-between items-start gap-2">
        <div class="flex flex-col lg:gap-8 gap-4">
          <span class="text-lg font-medium mt-2 place-items-start">{{
            recipe.fields.title
          }}</span>
          <div class="flex flex-row gap-4">
            <div class="flex flex-row gap-2" v-if="recipe.fields.time != 0">
              <span class="pi pi-clock"></span>
              <span class="text-sm w-full">{{ recipe.fields.time }} mins.</span>
            </div>
            <div class="flex flex-row gap-2">
              <span class="pi pi-star"></span>
              <span class="text-sm w-full"
                >{{ recipe.fields.difficulty }}
              </span>
            </div>
            <div class="flex flex-row gap-2">
              <span class="pi pi-users"></span>
              <span class="text-sm w-full"
                >{{ recipe.fields.portions }} pax.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col md:items-end gap-8">
        <div class="flex flex-col md:flex-col gap-2">
          <Button
            v-if="recipe.fields.url"
            icon="pi pi-eye"
            size="small"
            label="View recipe"
            class="flex-auto md:flex-initial whitespace-nowrap"
            @click="onViewRecipeURLClick(recipe.fields.url)"
          ></Button>
          <Button
            v-else
            icon="pi pi-eye"
            size="small"
            label="View recipe"
            class="flex-auto md:flex-initial whitespace-nowrap"
            @click="isViewDialogVisible = true"
          ></Button>
          <Button
            icon="pi pi-pencil"
            size="small"
            severity="secondary"
            label="Edit recipe"
            class="flex-auto md:flex-initial whitespace-nowrap"
            @click="isEditDialogVisible = true"
          ></Button>
          <Button
            icon="pi pi-trash"
            size="small"
            severity="secondary"
            label="Delete recipe"
            class="flex-auto md:flex-initial whitespace-nowrap"
            @click="onDeleteRecipeClick"
          ></Button>
        </div>
      </div>
    </div>
    <ViewRecipeDialog
      :visible="isViewDialogVisible"
      @close="isViewDialogVisible = false"
      :recipe="recipe"
    />
    <EditRecipeDialog
      :visible="isEditDialogVisible"
      :recipe="recipe"
      @close="isEditDialogVisible = false"
      @update="onUpdateRecipe"
    />
  </div>
</template>

<script setup>
import ViewRecipeDialog from "@/components/ViewRecipeDialog.vue";
import EditRecipeDialog from "@/components/EditRecipeDialog.vue";
import Panel from "primevue/panel";
import Button from "primevue/button";
import { ref, defineEmits } from "vue";

const emit = defineEmits(["deleteRecipe, update"]);

defineProps({
  recipe: {
    type: Object,
    required: true,
  },
});

const isViewDialogVisible = ref(false);
const isEditDialogVisible = ref(false);

const onViewRecipeURLClick = (url) => {
  window.open(url, "_blank");
};

const onDeleteRecipeClick = () => {
  emit("deleteRecipe");
};

const onUpdateRecipe = () => {
  isEditDialogVisible.value = false;
  emit("update");
};
</script>

<style lang="scss" scoped>
.menu-card {
  border-radius: 6px;
  border: 1px solid #3c3c3c4a;
}

.menu-card img {
  object-fit: cover;
  /* Asegura que la imagen cubra el área sin deformarse */
  height: 10rem;
}

tag {
  background-color: #3c3c3c;
  width: fit-content;
}
</style>
