<template>
  <div class="flex flex-col gap-1 w-full justify-center">
    <InputText v-model="newRecipe.title" class="w-full" placeholder="Title" />
    <Divider />
    <div class="grid lg:grid-cols-2 grid-cols-1 gap-4">
        <InputText
          v-for="(ingredient, index) in newRecipe.ingredientes"
          :key="index"
          v-model="newRecipe.ingredientes[index]"
          class="w-full"
          placeholder="Ingredient"
        />
        <Button class="col-span-2">Add ingredient</Button>
    </div>
    <Divider />
    <div class="flex flex-col gap-4">
        <InputText
            v-for="(step, index) in 30"
            :key="index"
            v-model="newRecipe.steps[index]"
            class="w-full"
            placeholder="Step"
        />
        <Button class="col-span-2">Add step</Button>
    </div>
  </div>
</template>

<script setup>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Divider from "primevue/divider";
import { reactive } from "vue";

const newRecipe = reactive({
  title: null,
  ingredientes: [null, null],
  steps: [null, null],
});
</script>

<style lang="scss" scoped></style>
