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
const surveyStore = useSurveyStore();
const items = ref([]);
onMounted(async () => {
  const properties = await addGeoJsonProperties(
    "/petaKerja/peta_kerja_bontang_baru.geojson"
  );
  items.value = properties;
  console.log(properties.length);
  surveyStore.totalObject.bontang_baru == properties.length;
});
const updateItem = ref([]);
const search = ref("");
const updateDialog = ref(false);

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
  await surveyStore.bulkUpdate(
    "surveyBidangTanah",
    payload,
    "survey_bidang_bontang_baru"
  );
  updateItem.value = [];
  updateDialog.value = false;
  surveyStore.getAllDoneBidangTanah();
};

const filteredItems = computed(() => {
  if (!items.value.length) return [];
  return items.value.filter((item: any) =>
    item.FID.toString().includes(search.value.toLowerCase())
  );
});
surveyStore.getAllDoneBidangTanah();
const isPersilDone = (id: any) => {
  return surveyStore.bidang_bontang_baru.some(
    (item: any) => Number(item.FID) === id && item.status === true
  );
};
</script>
