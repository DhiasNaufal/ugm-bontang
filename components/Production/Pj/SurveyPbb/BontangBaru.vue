<template>
  <v-container>
    <v-row no-gutters class="items-center gap-4">
      <AppTextH5 color="primary"> Update Status Survey</AppTextH5>
      <v-btn
        class="text-none mx-2"
        variant="outlined"
        color="green"
        :disabled="updateItem.length == 0"
        @click="updateDialog = true"
        >Update</v-btn
      >
      <v-spacer></v-spacer>
      <v-col lg="3">
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          placeholder="Search..."
          density="compact"
          clearable
          hide-details
        />
      </v-col>
    </v-row>
    <v-data-table
      v-model="updateItem"
      show-select
      class="h-[calc(100vh-124px-50px)] header-theme"
      :headers="SurveyLapanganConstant.BindagTanahHeader"
      :items="filteredItems"
      item-key="name"
      :search="search"
      items-per-page="15"
      fixed-footer
      fixed-header
      return-object
    >
      <template #item.status="{ item }: any">
        <v-chip :color="isPersilDone(item.FID) ? 'success' : 'error'">
          {{ isPersilDone(item.FID) ? "DONE" : "Not Done" }}
        </v-chip>
      </template>
    </v-data-table>
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
          @click="updatePersil(true)"
        />
      </v-card-actions>
    </v-card-text>
  </AppDialog>
</template>
<script lang="ts" setup>
import SurveyLapanganConstant from "~/app/constant/SurveyLapangan.constant";
const items = ref([]);
async function addGeoJson(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const geoJson = await response.json();

    if (!geoJson.features || !Array.isArray(geoJson.features)) {
      throw new Error("Invalid GeoJSON format: Missing 'features' array");
    }

    const tableData = geoJson.features.map(
      (feature: any) => feature.properties
    );
    return tableData;
  } catch (error) {
    console.error("Error fetching GeoJSON:", error);
    return [];
  }
}
onMounted(async () => {
  items.value = await addGeoJson("/petaKerja/peta_kerja_bontang_baru.geojson");
});
const updateItem = ref([]);
const search = ref("");
const updateDialog = ref(false);
import {
  getFirestore,
  writeBatch,
  doc,
  collection,
  getDocs,
  collectionGroup,
  query,
  where,
} from "firebase/firestore";
const db = getFirestore();
const appStore = useAppStore();
const bulkUpdate = async (collectionName: any, updates: any) => {
  const batch = writeBatch(db);
  updates.forEach((item: any) => {
    if (!item.FID) return;
    const parentDocRef = doc(db, collectionName, tanggalIndoNow());
    const subCollectionRef = collection(
      parentDocRef,
      "survey_bidang_bontang_baru"
    );
    const subDocRef = doc(subCollectionRef, `FID_${item.FID.toString()}`);
    batch.set(subDocRef, item);
  });

  try {
    await batch.commit();
    appStore.toastSuccess("Batch update berhasil!");
  } catch (error: any) {
    appStore.toastError(error);
  }
};
const updatePersil = async (status: boolean) => {
  const payload = updateItem.value.map((item: any) => {
    return {
      ID: item.ID,
      FID: String(item.FID),
      KECAMATAN: item.KECAMATAN,
      KELURAHAN: item.KELURAHAN,
      ALAMAT_WP: item.ALAMAT_WP,
      ALAMAT_OP: item.ALAMAT_OP,
      status: status,
      date_created: tanggalIndoNowLengkap(),
    };
  });
  console.log(payload);
  await bulkUpdate("surveyBidangTanah", payload);
  updateItem.value = [];
  updateDialog.value = false;
  getAllDoneBidangTanah();
};

const filteredItems = computed(() => {
  if (!items.value.length) return [];
  return items.value.filter((item: any) =>
    item.FID.toString().includes(search.value.toLowerCase())
  );
});
const doneBidangTanah = ref([]);
const bidangTanahQuery = query(
  collectionGroup(db, "survey_bidang_bontang_baru"),
  where("status", "==", true)
);
const getAllDoneBidangTanah = async () => {
  const employeeSnapshot = await getDocs(bidangTanahQuery);
  let bindagTanahData: any = [];
  employeeSnapshot.forEach((doc) => {
    bindagTanahData.push({ ...doc.data() });
  });
  doneBidangTanah.value = bindagTanahData;
  console.log(bindagTanahData);
};
getAllDoneBidangTanah();
const isPersilDone = (id: any) => {
  return doneBidangTanah.value.some(
    (item: any) => Number(item.FID) === id && item.status === true
  );
};
</script>
