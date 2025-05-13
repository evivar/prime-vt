<template>
  <Dialog
    :visible="visible"
    :closable="true"
    pt:root:class="!border-0 "
    pt:mask:class="backdrop-blur-lg"
    class="reicpe-dialog lg:w-2/3 w-full"
    modal
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    header="New recipe"
  >
    <div class="flex flex-col gap-6 rounded-2xl">
      <div class="flex lg:flex-row flex-col gap-4">
        <!-- <span class="lg:invisible visible">Image</span> -->
        <!-- <FileUpload
          class="flex-no-wrap"
          ref="fileupload"
          mode="basic"
          name="image"
          accept="image/*"
          :maxFileSize="1000000"
        /> -->
        <InputText v-model="title" class="lg:w-full w-full" placeholder="Recipe title" />
      </div>
      <Divider />
      <span>Ingredients</span>
      <div class="grid lg:grid-cols-2 grid-cols-1 gap-4">
        <IconField v-for="(ingredient, idx) in ingredients" :key="idx">
          <InputText placeholder="Ingredient" v-model="ingredients[idx]" class="w-full" />
          <InputIcon
            class="pi pi-times cursor-pointer"
            @click="ingredients.splice(idx, 1)"
          />
        </IconField>
      </div>
      <Button
        label="Add ingredient"
        @click="ingredients.push(null)"
        class="w-full !bg-transparent !text-primary-50 !text-white !border !border-white/30 hover:!bg-white/10"
      ></Button>
      <Divider />
      <span>Steps</span>
      <Textarea v-model="steps" rows="10" />
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
import Textarea  from "primevue/textarea";
import { ref } from "vue";

const emit = defineEmits(["close", "save"]);

defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const image = ref(null);
const title = ref(null);
const ingredients = ref([null, null]);
const steps = ref("");

const onSaveClick = () => {
  const newRecipe = {
    records: [
      {
        fields: {
          image: image.value,
          title: title.value,
          ingredients: ingredients.value.toString(),
          steps: steps.value,
        },
      },
    ],
  };
  emit("save", newRecipe);
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
</style>
