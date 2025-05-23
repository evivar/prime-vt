<template>
  <Dialog
    :visible="visible"
    :closable="false"
    pt:root:class="!border-0 "
    pt:mask:class="backdrop-blur-lg"
    class="reicpe-dialog lg:w-2/3 w-full"
    modal
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <div class="inline-flex items-center justify-between w-full gap-4">
        <span class="font-bold whitespace-nowrap">New recipe</span>
      </div>
    </template>
    <div class="flex flex-col gap-6 rounded-2xl">
      <div class="flex lg:flex-row flex-col-reverse gap-2 w-full items-center">
        <div class="flex flex-row items-center gap-2 w-full">
          <FileUpload
            mode="basic"
            @select="onFileSelect"
            customUpload
            auto
            severity="secondary"
            class="p-button-outlined"
            chooseLabel="Choose Image"
          />
          <img
            v-if="src"
            :src="src"
            alt="Image"
            class="shadow-md rounded-xl w-32 sm:w-64"
            style="filter: grayscale(100%)"
          />
        </div>
        <InputText
          v-model="recipe.fields.title"
          class="w-full"
          placeholder="Recipe title"
        />
      </div>
      <Divider />
      <span v-if="recipe.fields.url">URL</span>
      <InputText
        v-if="recipe.fields.url"
        v-model="recipe.fields.url"
        class="w-full"
        placeholder="Recipe URL"
      />
      <span v-if="!recipe.fields.url">Ingredients</span>
      <div
        v-if="!recipe.fields.url && ingredients.length !== 0"
        class="grid lg:grid-cols-2 grid-cols-1 gap-4"
      >
        <IconField v-for="(ingredient, idx) in ingredients" :key="idx">
          <InputText
            placeholder="Ingredient"
            v-model="ingredients[idx]"
            class="w-full"
            required
          />
          <InputIcon
            class="pi pi-times cursor-pointer"
            @click="ingredients.splice(idx, 1)"
          />
        </IconField>
      </div>
      <Button
        v-if="!recipe.fields.url"
        label="Add ingredient"
        @click="ingredients.push(null)"
        class="w-full !bg-transparent !text-primary-50 !text-white !border !border-white/30 hover:!bg-white/10"
      ></Button>
      <Divider v-if="!recipe.fields.url" />
      <span v-if="!recipe.fields.url">Steps</span>
      <Textarea v-if="!recipe.fields.url" v-model="recipe.fields.steps" rows="10" />
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
        <Button
          label="Save"
          @click="onSaveClick"
          class="w-full !bg-transparent !text-primary-50 !text-white !border !border-white/30 hover:!bg-white/10"
        ></Button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Divider from "primevue/divider";
import InputText from "primevue/inputtext";
import FileUpload from "primevue/fileupload";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Textarea from "primevue/textarea";
import ToggleSwitch from "primevue/toggleswitch";
import { onMounted, onUnmounted, ref, watch } from "vue";
import axios from "axios";
import { useToast } from "primevue/usetoast";

const emit = defineEmits(["close", "update"]);

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  recipe: {
    type: Object,
    required: true,
  },
});

const toast = useToast();
const ingredients = ref(
  props.recipe.fields.ingredients?.length > 0
    ? props.recipe.fields.ingredients.split(",").map((item) => item.trim())
    : []
);
const src = ref(props.recipe.fields.image ? props.recipe.fields.image[0].url : null);

const onFileSelect = (event) => {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    src.value = e.target.result;
  };

  reader.readAsDataURL(file);
};

const onSaveClick = async () => {
  const response = await axios.patch(
    `https://api.airtable.com/v0/appK13ISOZy5bznU1/tblQYAwgASHHYQ0MJ/${props.recipe.id}`,
    {
      fields: {
        title: props.recipe.fields.title,
        url: props.recipe.fields.url ? props.recipe.fields.url : null,
        ingredients: ingredients.value.toString(),
        steps: props.recipe.fields.steps,
      },
    }
  );
  if (response.status === 200) {
    toast.add({
      severity: "success",
      summary: "Recipe updated",
      detail: "Recipe updated successfully",
      life: 3000,
    });
    ingredients.value = [];
    emit("update");
  } else {
    toast.add({
      severity: "error",
      summary: "Error editing recipe",
      detail: "Try again later",
      life: 3000,
    });
  }
};
</script>

<style lang="scss" scoped>
img {
  width: 10rem;
  border-radius: 6px;
}

.title {
  font-weight: 700;
}
</style>
