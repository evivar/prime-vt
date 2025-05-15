<template>
  <Card class="h-full border">
    <template #subtitle
      ><span class="subtitle">{{ title }}</span></template
    >
    <template #content>
      <div class="menu-card--content flex flex-col gap-4">
        <span v-if="!isEditing">{{ day.meal ? day.meal : "-" }}</span>
        <InputText
          v-if="isEditing"
          v-model="meal"
          size="small"
          class="w-full"
          placeholder="Comida"
        />
        <span v-if="!isEditing">{{ day.dinner ? day.dinner : "-" }}</span>
        <InputText
          v-if="isEditing"
          v-model="dinner"
          size="small"
          class="w-full"
          placeholder="Cena"
        />
      </div>
    </template>
    <template #footer>
      <div class="flex gap-4 mt-4">
        <Button
          v-if="isEditing"
          size="small"
          label="Cancel"
          severity="secondary"
          outlined
          class="w-1/2"
          @click="onCancelClick"
        />
        <Button
          v-if="!isEditing"
          size="small"
          label="Edit"
          class="w-full"
          @click="onEditClick"
        />
        <Button v-else size="small" label="Save" class="w-1/2" @click="onSaveClick" />
      </div>
    </template>
  </Card>
</template>

<script setup>
import Button from "primevue/button";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import { ref } from "vue";
import { defineEmits, defineProps } from "vue";

const emit = defineEmits(["updateMenuDay"]);

const props = defineProps({
  title: {
    type: String,
    default: "Card title",
  },
  day: {
    type: Object,
    default: () => ({}),
  },
  uuid: {
    type: String,
    required: true,
  },
});

const isEditing = ref(false);
const meal = ref(null);
const dinner = ref(null);

const onEditClick = () => {
  isEditing.value = !isEditing.value;
  console.log("day", props.day);
  meal.value = props.day.meal;
  dinner.value = props.day.dinner;
};

const onCancelClick = () => {
  isEditing.value = false;
};

const onSaveClick = () => {
  isEditing.value = false;
  emit("updateMenuDay", {
    id: props.uuid,
    meal: meal.value,
    dinner: dinner.value,
  });
};
</script>

<style lang="scss" scoped>
.border {
  border: 1px solid #3c3c3c4a;
}

.subtitle {
  font-weight: 700 !important;
}
</style>
