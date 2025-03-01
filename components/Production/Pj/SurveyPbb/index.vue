<template>
  <v-container fluid class="h-full">
    <v-card class="h-full" variant="flat">
      <v-container fluid class="h-full">
        <v-tabs
          v-model="tab"
          color="primary"
          density="compact"
          selected-class="font-weight-bold"
        >
          <v-tab
            v-for="(item, index) in kelurahan"
            :key="index"
            :value="item.value"
            class="text-none"
          >
            {{ item.title }}
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="bontang_baru">
            <ProductionPjSurveyPbbBontangBaru />
          </v-window-item>
          <v-window-item value="api_api"> api api</v-window-item>
          <v-window-item value="loktuan">loktuan</v-window-item>
        </v-window>
      </v-container>
    </v-card>
  </v-container>
  <AppDialog v-model="updateDialog" title="Update Persil" width="500">
    <v-card-text>
      Pastikan data yang akan diupdate sudah benar
      <v-card-actions>
        <v-spacer></v-spacer>
        <AppButton
          label="Cancel"
          color="info"
          variant="outlined"
          @click="updateDialog = false"
        />
        <AppButton
          form="presensiForm"
          label="Update"
          color="success"
          @click="updatePersil"
        />
      </v-card-actions>
    </v-card-text>
  </AppDialog>
</template>
<script setup>
import persilMock from "~/app/mock/persil.mock";
import persilConstant from "~/app/constant/persil.constant";
import { getFirestore, writeBatch, doc, collection } from "firebase/firestore";
const db = getFirestore();
const bulkUpdate = async (collectionName, updates) => {
  const batch = writeBatch(db);
  updates.forEach((item) => {
    const docRef = doc(db, collectionName, item.D_NOP);
    batch.set(docRef, item);
  });

  try {
    await batch.commit();
    appStore.toastSuccess("Batch update berhasil!");
  } catch (error) {
    appStore.toastError("Error saat batch update:", error);
  }
};
const appStore = useAppStore();
const updateId = ref([]);
const search = ref("");
const updateDialog = ref(false);
const updatePersil = async () => {
  const payload = updateId.value.map((item) => {
    return { D_NOP: item, status: true };
  });
  await bulkUpdate("surveyProgress", payload);
  updateId.value = [];
  updateDialog.value = false;
};
const surveyProgress = useCollection(collection(db, "surveyProgress"));
const isPersilDone = (id) => {
  return surveyProgress.value.some(
    (item) => item.D_NOP === id && item.status === true
  );
};

const tab = ref();
const kelurahan = [
  { title: "Bontang Baru", value: "bontang_baru" },
  { title: "Api Api", value: "api_api" },
  { title: "Loktuan", value: "loktuan" },
];
</script>
