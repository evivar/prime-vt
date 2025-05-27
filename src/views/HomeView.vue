<template>
  <main class="home p-4 flex flex-row gap-4 lg:flex-nowrap flex-wrap">
    <Panel
      header="Weekly menu"
      class="lg:w-1/2 w-full"
      :toggleable="isMobile"
      :collapsed="isMobile ? true : false"
    >
      <div v-if="!isInitializing" class="home-menu grid lg:grid-cols-2 grid-cols-1 gap-2">
        <MenuCard
          v-for="day, idx in weeklyMenu"
          :key="day.id"
          :title="day.fields.dayName ? day.fields.dayName : daysOfWeek[idx]"
          :day="day.fields"
          :uuid="day.id"
          @update-menu-day="onSaveMenuDay"
        ></MenuCard>
      </div>
      <div v-else class="text-center p-4">
        <span class="pi pi-spin pi-spinner-dotted"></span>
      </div>
    </Panel>
    <Panel header="Shopping list" class="shopping-list-panel lg:w-1/2 w-full">
      <div class="flex flex-row gap-4">
        <InputText
          v-model="newItem"
          class="w-[80%]"
          @keypress.enter="onAddItem"
        ></InputText>
        <Button :disabled="!newItem" class="w-[20%]" id="add-btn" @click="onAddItem">
          <span v-if="isAdding" class="pi pi-spin pi-spinner"></span>
          <span v-else>{{ $t("buttons.add") }}</span>
        </Button>
      </div>
      <ScrollPanel
        v-if="!isInitializing"
        style="width: 100%; height: calc(100dvh - 200px); margin-top: 1rem"
      >
        <div v-if="shoppingList.length === 0" class="text-center">
          {{ $t("home.shoppingListEmpty") }}
        </div>
        <SwipeToDelete
          v-else
          v-for="item in shoppingList"
          :item="item"
          :key="item.id"
          @click="onPurchaseClick(item)"
          @delete-item="onDeleteClick(item.id)"
        />
      </ScrollPanel>
      <div v-else class="text-center p-4">
        <span class="pi pi-spin pi-spinner-dotted"></span>
      </div>
    </Panel>
  </main>
</template>

<script setup>
import Panel from "primevue/panel";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ScrollPanel from "primevue/scrollpanel";
import SwipeToDelete from "@/components/SwipeToDelete.vue";
import MenuCard from "@/components/MenuCard.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useToast } from "primevue/usetoast";

import axios from "axios";
import { useShoppingListStore } from "@/stores/shoppingList";
const toast = useToast();

const shoppingListStore = useShoppingListStore();

const isMobile = ref(false);
const isInitializing = ref(false);
const weeklyMenu = ref([]);
const newItem = ref(null);
const shoppingList = ref([]);
const isAdding = ref(false);
const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 1024; // Define "móvil" como ancho <= 768px
};

onMounted(async () => {
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
  isInitializing.value = true;
  await initMenu();
  await initShoppingList();
  isInitializing.value = false;
});

onUnmounted(() => {
  window.removeEventListener("resize", checkIfMobile);
});

const initMenu = async () => {
  const response = await axios.get(
    "https://api.airtable.com/v0/appK13ISOZy5bznU1/tblVtMlqTf5B1REPb?sort%5B0%5D%5Bfield%5D=id&sort%5B0%5D%5Bdirection%5D=asc"
  );

  if (response.status === 200) {
    weeklyMenu.value = response.data.records;
    toast.add({
      severity: "success",
      summary: "Menu intialized",
      detail: "Weekly menu initialized successfully",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error initializing weekly menu",
      detail: "Try again later",
      life: 3000,
    });
  }
};

const initShoppingList = async () => {
  const response = await axios.get(
    "https://api.airtable.com/v0/appK13ISOZy5bznU1/tblMIs2AMHxiMOOPn?pageSize=100&sort%5B0%5D%5Bfield%5D=createdTime&sort%5B0%5D%5Bdirection%5D=desc"
  );

  if (response.status === 200) {
    response.data.records.forEach((record) => {
      record.fields.purchased = record.fields.purchased ? record.fields.purchased : false;
      shoppingList.value.push(record);
      shoppingListStore.shoppingList.push(record);
    });
    toast.add({
      severity: "success",
      summary: "Shopping list intialized",
      detail: "Shopping list initialized successfully",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error initializing shopping list",
      detail: "Try again later",
      life: 3000,
    });
  }
};

const onAddItem = async () => {
  if (newItem.value) {
    isAdding.value = true;
    const response = await axios.post(
      "https://api.airtable.com/v0/appK13ISOZy5bznU1/tblMIs2AMHxiMOOPn",
      { fields: { name: newItem.value, purchased: false } }
    );
    if (response.status === 200) {
      shoppingList.value.unshift(response.data);
      shoppingListStore.shoppingList.unshift(response.data);
      toast.add({
        severity: "success",
        summary: "Item added",
        detail: "Item added to shopping list",
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Error adding item",
        detail: "Try again later",
        life: 3000,
      });
    }
    newItem.value = null;
    isAdding.value = false;
  }
};

const onDeleteClick = async (itemId) => {
  const response = await axios.delete(
    `https://api.airtable.com/v0/appK13ISOZy5bznU1/tblMIs2AMHxiMOOPn/${itemId}`
  );

  if (response.status === 200) {
    shoppingList.value = shoppingList.value.filter((item) => item.id !== itemId);
    shoppingListStore.shoppingList = shoppingListStore.shoppingList.filter((item) => item.id !== itemId);
  }
};

const onPurchaseClick = async (item) => {
  delete item.fields.uuid;
  delete item.fields.createdTime;
  const response = await axios.put(
    `https://api.airtable.com/v0/appK13ISOZy5bznU1/tblMIs2AMHxiMOOPn/${item.id}`,
    {
      fields: { purchased: !item.fields.purchased, ...item.fields },
    }
  );
  if (response.status === 200) {
    shoppingList.value = shoppingList.value.map((i) => {
      if (i.id === item.id) {
        i.fields.purchased = !item.fields.purchased;
      }
      return i;
    });
    useShoppingListStore.shoppingList = useShoppingListStore.shoppingList.map((i) => {
      if (i.id === item.id) {
        i.fields.purchased = !item.fields.purchased;
      }
      return i;
    });
  }
};

const onSaveMenuDay = async (menuDay) => {
  const response = await axios.put(
    `https://api.airtable.com/v0/appK13ISOZy5bznU1/tblVtMlqTf5B1REPb/${menuDay.id}`,
    {
      fields: {
        meal: menuDay.meal,
        dinner: menuDay.dinner,
      },
    }
  );
  if (response.status === 200) {
    weeklyMenu.value = weeklyMenu.value.map((day) => {
      if (day.id === menuDay.id) {
        day.fields.meal = menuDay.meal;
        day.fields.dinner = menuDay.dinner;
      }
      return day;
    });
    toast.add({
      severity: "success",
      summary: `${day.fields.dayName} menu updated`,
      detail: "Weekly menu updated successfully",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Error updating weekly menu",
      detail: "Try again later",
      life: 3000,
    });
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: 1rem;
  height: 100%;
  & > .shopping-list-panel {
    // height: 100%;
  }
}

.shopping-list-item {
  border: 1px solid #3c3c3c4a;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.purchased {
  text-decoration: line-through;
}

.pi-spinner-dotted {
  font-size: xx-large;
}

#add-btn > span {
  font-weight: 900;
}
</style>
