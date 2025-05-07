<template>
  <main class="home p-4 flex flex-row gap-4 lg:flex-nowrap flex-wrap">
    <Panel
      header="Weekly menu"
      class="lg:w-1/2 w-full"
      :toggleable="isMobile"
      :collapsed="isMobile ? true : false"
    >
      <div v-if="!isInitializing" class="home-menu grid lg:grid-cols-2 grid-cols-1 gap-2">
        <menu-card
          v-for="day in weeklyMenu"
          :key="day.id"
          :title="day.fields.dayName"
          :day="day.fields"
          :uuid="day.id"
          @update-menu-day="onSaveMenuDay"
        ></menu-card>
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
          <span v-else>Add</span>
        </Button>
      </div>
      <ScrollPanel
        v-if="!isInitializing"
        style="width: 100%; height: calc(100dvh - 128px); margin-top: 1rem"
      >
        <div
          class="shopping-list-item flex flex-row content-between items-center"
          v-for="item in shoppingList"
          :key="item.id"
          @click="onPurchaseClick(item)"
        >
          <span class="w-full" :class="{ purchased: item.fields.purchased }">
            {{ item.fields.name }}
          </span>
          <span class="pi pi-trash" @click.stop="onDeleteClick(item.id)"> </span>
        </div>
      </ScrollPanel>
      <div v-else class="text-center p-4">
        <span class="pi pi-spin pi-spinner-dotted"></span>
      </div>
    </Panel>
  </main>
</template>

<script setup>
import Panel from "primevue/panel";
import MenuCard from "@/components/MenuCard.vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import ScrollPanel from "primevue/scrollpanel";
import { onMounted, onUnmounted, ref } from "vue";

import axios from "axios";

const isMobile = ref(false);
const isInitializing = ref(false);
const weeklyMenu = ref([]);
const newItem = ref(null);
const shoppingList = ref([]);
const isAdding = ref(false);

const checkIfMobile = () => {
  isMobile.value = window.innerWidth <= 1024; // Define "móvil" como ancho <= 768px
};

onMounted(async () => {
  console.log("onMounted");
  checkIfMobile();
  window.addEventListener("resize", checkIfMobile);
  isInitializing.value = true;
  await initMenu();
  await initShoppingList();
  isInitializing.value = false;
});

onUnmounted(() => {
  console.log("onUnmounted");
  window.removeEventListener("resize", checkIfMobile);
});

const initMenu = async () => {
  console.log("initMenu");
  const response = await axios.get(
    "https://api.airtable.com/v0/appK13ISOZy5bznU1/tblVtMlqTf5B1REPb?sort%5B0%5D%5Bfield%5D=id&sort%5B0%5D%5Bdirection%5D=asc"
  );
  console.log("response menu", response);
  weeklyMenu.value = response.data.records;
};

const initShoppingList = async () => {
  console.log("initShoppingList");
  const response = await axios.get(
    "https://api.airtable.com/v0/appK13ISOZy5bznU1/tblMIs2AMHxiMOOPn?pageSize=100&sort%5B0%5D%5Bfield%5D=createdTime&sort%5B0%5D%5Bdirection%5D=desc"
  );
  console.log("response", response);
  response.data.records.forEach((record) => {
    record.fields.purchased = record.fields.purchased ? record.fields.purchased : false;
    shoppingList.value.push(record);
  });
  console.log("shoppingList", shoppingList.value);
};

const onAddItem = async () => {
  console.log("onAddItem");
  if (newItem.value) {
    isAdding.value = true;
    const response = await axios.post(
      "https://api.airtable.com/v0/appK13ISOZy5bznU1/tblMIs2AMHxiMOOPn",
      { fields: { name: newItem.value, purchased: false } }
    );
    console.log("response", response);
    shoppingList.value.unshift(response.data);
    newItem.value = null;
    isAdding.value = false;
  }
};

const onDeleteClick = async (itemId) => {
  console.log("onDeleteClick");
  const response = await axios.delete(
    `https://api.airtable.com/v0/appK13ISOZy5bznU1/tblMIs2AMHxiMOOPn/${itemId}`
  );
  console.log("response", response);
  if (response.status === 200) {
    shoppingList.value = shoppingList.value.filter((item) => item.id !== itemId);
  }
};

const onPurchaseClick = async (item) => {
  console.log("onPurchaseClick");
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
  }
};

const onSaveMenuDay = async (menuDay) => {
  console.log("onSaveMenuDay", menuDay);
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
    console.log("200");
    weeklyMenu.value = weeklyMenu.value.map((day) => {
      if (day.id === menuDay.id) {
        day.fields.meal = menuDay.meal;
        day.fields.dinner = menuDay.dinner;
      }
      return day;
    });
  }
  console.log("response", response);
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
