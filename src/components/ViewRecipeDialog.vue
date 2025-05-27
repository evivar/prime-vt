<template>
  <Dialog
    :visible="visible"
    :closable="false"
    pt:root:class="!border-0 "
    pt:mask:class="backdrop-blur-lg"
    class="reicpe-dialog lg:w-2/3 w-full"
    modal
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :header="recipe.fields.title"
  >
    <div class="flex flex-col gap-6 rounded-2xl">
      <div class="mx-auto my-auto place-items-center">
        <img
          class="lg:w-80 w-1/2"
          :src="
            recipe.fields.imageURL
              ? recipe.fields.imageURL
              : 'src/assets/output-onlinepngtools-white.png'
          "
          :alt="recipe.fields.title"
        />
      </div>
      <div class="content flex flex-col gap-2">
        <div class="flex lg:flex-row flex-row justify-between">
          <span class="font-extrabold underline lg:text-lg title">Ingredients</span>
          <Button
            :disabled="
              !recipe.fields.ingredients || recipe.fields.ingredients?.length === 0
            "
            size="small"
            @click="onAddToShoppingListClick(recipe.fields.ingredients)"
          >
            <span class="lg:flex hidden">Add to shoping list</span>
            <i class="pi pi-cart-plus"></i>
          </Button>
        </div>
        <div>
          <ul
            class="lg:grid lg:grid-cols-2 lg:gap-2 flex flex-col gap-2 list-disc list-inside"
          >
            <li
              v-for="ingredient in formatIngredients(recipe.fields.ingredients)"
              :key="ingredient"
            >
              {{ ingredient }}
            </li>
          </ul>
        </div>
        <span class="font-extrabold underline lg:text-lg title">Steps</span>
        <p class="preserve-lines">
          {{ recipe.fields.steps }}
        </p>
      </div>
      <div class="flex items-center gap-4">
        <Button
          v-if="false"
          label="Cancel"
          @click="closeCallback"
          text
          class="!p-4 w-full !text-primary-50 !border !border-white/30 hover:!bg-white/10"
        ></Button>
        <Button
          label="Close"
          @click="$emit('close')"
          class="w-full !bg-transparent !text-primary-50 !text-white !border !border-white/30 hover:!bg-white/10"
        ></Button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

import axios from "axios";
const toast = useToast();

defineEmits(["close", "update:visible"]);

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  recipe: {
    type: Object,
    required: true,
  },
});

const formatIngredients = (ingredients) => {
  if (!ingredients) return [];
  else {
    return ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
};

const onAddToShoppingListClick = async (ingredients) => {
  // isAdding.value = true;
  const ingredientsFields = [];
  ingredients
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .forEach((item) => {
      ingredientsFields.push({fields: {name: item, purchased: false}});
    });
  const response = await axios.post(
    "https://api.airtable.com/v0/appK13ISOZy5bznU1/tblMIs2AMHxiMOOPn",
    { records: ingredientsFields }
  );
  if (response.status === 200) {
    toast.add({
      severity: "success",
      summary: "Items added",
      detail: "Items added to shopping list",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error adding items",
      detail: "Try again later",
      life: 3000,
    });
  }
  // isAdding.value = false;
};
</script>

<style lang="scss" scoped>
img {
  width: 20rem;
  border-radius: 6px;
}

.title {
  font-weight: 700;
}

.preserve-lines {
  /* respeta saltos de línea, pero colapsa espacios extra */
  white-space: pre-line;
}
</style>
