<template>
  <div
    class="swipe-container"
    @touchstart="startTouch"
    @touchmove="onTouchMove"
    @touchend="endTouch"
  >
    <div class="swipe-box lg:justify-between justify-start" :style="boxStyle">
      <i v-if="isDeleting" class="delete-swipe pi pi-trash"></i>
      <span class="title" :class="{ purchased: item.fields.purchased }">{{
        item.fields.name
      }}</span>
      <i class="lg:visible invisible pi pi-trash" @click.stop="$emit('deleteItem')"></i>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["deleteItem"]);

let startX = 0;
let currentX = 0;
const boxStyle = ref({ transform: "translateX(0)" });
const isDeleting = ref(false);

function startTouch(e) {
  startX = e.touches ? e.touches[0].clientX : e.clientX;
  isDeleting.value = false;
}

function onTouchMove(e) {
  if (!startX) return;

  currentX = e.touches ? e.touches[0].clientX : e.clientX;
  const moveX = currentX - startX;

  if (moveX > 0) {
    boxStyle.value = { transform: `translateX(${moveX}px)` };
    if (moveX > 100) {
      isDeleting.value = true;
    }
  }
}

function endTouch() {
  const moveX = currentX - startX;
  if (moveX > 120) {
    boxStyle.value = { transform: `translateX(100%)` };
    setTimeout(() => {
      emit("deleteItem");
    }, 300);
  } else {
    boxStyle.value = { transform: "translateX(0)" };
    isDeleting.value = false;
  }
}
</script>

<style scoped>
.swipe-container {
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
}

.swipe-box {
  border: 1px solid #3c3c3c4a;
  border-radius: 6px;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.swipe-box span {
  margin: 0;
  padding: 1rem;
  white-space: nowrap;
}

.delete-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  font-size: 24px;
}

.swipe-box.swiped {
  transform: translateX(100%);
}

i {
  padding: 1rem;
  text-decoration: none !important;
}

.delete-swipe {
  background: red;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.purchased {
  text-decoration: line-through;
}
</style>
