<template>
  <Dialog
    :visible="visible"
    pt:root:class="!border-0 !bg-transparent"
    pt:mask:class="backdrop-blur-sm"
    class="reicpe-dialog lg:w-2/3 w-full p-4"
    modal
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    header="Recipe"
    style="
      background-image: radial-gradient(
        circle at left top,
        var(--p-primary-400),
        var(--p-primary-700)
      );
    "
  >
    <div
      class="flex flex-col px-8 py-8 gap-6 rounded-2xl"
    >
      <div class="mx-auto my-auto place-items-center">
        <img
          :src="
            recipe.fields.image
              ? recipe.fields.image[0].url
              : 'src/assets/output-onlinepngtools-white.png'
          "
          :alt="recipe.fields.title"
        />
      </div>
      <div class="content flex flex-col gap-2">
        <span class="font-extrabold underline text-lg">Ingredients</span>
        <span>{{ recipe.fields.ingredients }}</span>
        <span class="font-extrabold underline text-lg">Steps</span>
        <p v-for="(step, index) in recipe.fields.steps.split('.')" :key="index">
          {{ step.trim() }}.
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
</script>

<style lang="scss" scoped>
img {
  width: 20rem;
  height: 20rem;
}
</style>
