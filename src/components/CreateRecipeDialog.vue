<template>
  <Dialog
    :visible="visible"
    :closable="false"
    pt:root:class="!border-0 "
    pt:mask:class="backdrop-blur-lg"
    class="reicpe-dialog lg:w-2/4 w-full"
    modal
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <div class="inline-flex items-center justify-between w-full gap-4">
        <span class="font-bold whitespace-nowrap">New recipe</span>
        <div class="flex items-center gap-2">
          <span>URL</span>
          <ToggleSwitch v-model="isURL" />
        </div>
      </div>
    </template>
    <div class="flex flex-col gap-6 rounded-2xl">
    <div class="flex flex-col gap-2">
      <div class="flex lg:flex-row flex-col-reverse gap-2 w-full items-center">
        <InputText v-model="title" class="w-full" placeholder="Recipe title" />
        <InputText v-model="imageURL" class="w-full" placeholder="Recipe image URL" />
      </div>
      <div class="flex lg:flex-row flex-col gap-4 w-full lg:items-center">
        <div class="flex flex-row gap-2 items-center lg:w-1/3 w-full">
          <span class="label w-full">Portions</span>
          <InputNumber v-model="portions" class="w-full" />
        </div>
        <div class="flex flex-row gap-2 items-center lg:w-1/3 w-full">
          <span class="label w-full">Time </span>
          <InputNumber v-model="time" class="w-full" :step="10" suffix=" mins." />
        </div>
        <div class="flex flex-row gap-2 items-center lg:w-1/3 w-full">
          <span class="label w-full">Difficulty</span>
          <Rating v-model="difficulty" :stars="5" class="w-full" /> 
        </div>
        </div>
      </div>
      <Divider />
      <span v-if="isURL">URL</span>
      <InputText v-if="isURL" v-model="url" class="w-full" placeholder="Recipe URL" />
      <span v-if="!isURL">Ingredients</span>
      <div
        v-if="!isURL && ingredients.length !== 0"
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
        v-if="!isURL"
        label="Add ingredient"
        @click="ingredients.push(null)"
        class="w-full !bg-transparent !text-primary-50 !text-white !border !border-white/30 hover:!bg-white/10"
      ></Button>
      <Divider v-if="!isURL" />
      <span v-if="!isURL">Steps</span>
      <Textarea v-if="!isURL" v-model="steps" rows="10" />
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
          :disabled="!title || (isURL ? !url : !steps)"
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
import Rating from "primevue/rating";
import InputNumber from "primevue/inputnumber";
import { onUnmounted, ref } from "vue";

const emit = defineEmits(["close", "save"]);

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const image = ref(null);
const title = ref(null);
const isURL = ref(false);
const ingredients = ref([]);
const steps = ref("");
const fileupload = ref();
const url = ref(null);
const src = ref(null);
const imageURL = ref(null);
const difficulty = ref(0);
const portions = ref(0);
const time = ref(0);

onUnmounted(() => {
  title.value = null;
  isURL.value = false;
  ingredients.value = [];
  steps.value = "";
  url.value = null;
  imageURL.value = null;
});

const upload = () => {
  fileupload.value.upload();
};

const onFileSelect = (event) => {
  const file = event.files[0];
  const reader = new FileReader();

  reader.onload = async (e) => {
    src.value = e.target.result;
  };

  reader.readAsDataURL(file);
};

const onSaveClick = () => {
  const newRecipe = {
    records: [
      {
        fields: {
          title: title.value,
          ingredients: ingredients.value.toString(),
          steps: steps.value,
          url: isURL.value ? url.value : null,
          imageURL: imageURL.value ? imageURL.value : null,
          portions: portions.value ? portions.value : 0,
          time: time.value ? time.value : 0,
          difficulty: difficulty.value ? difficulty.value : 0
        },
      },
    ],
  };

  emit("save", newRecipe);
  title.value = null;
  isURL.value = false;
  ingredients.value = [];
  steps.value = "";
  url.value = null;
  imageURL.value = null;
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
