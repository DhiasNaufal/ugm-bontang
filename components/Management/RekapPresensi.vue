<template>
  <div class="min-h-screen">
    <v-container fluid class="h-full">
      <v-row>
        <v-col>
          <div class="flex gap-2">
            <AppInputDatePicker v-model="dateFilter" />
            <v-btn color="primary" @click="filterByDate"> Filter</v-btn>
          </div>
        </v-col>
      </v-row>
      <v-data-table
        :headers="header"
        :items="employeePresence"
        fixed-header
        fixed-footer
      >
        <template #item.keterangan="{ item }: any">
          {{ item.statusKerja ? item.work_type : item.izin_type }}
        </template>
        <template #item.statusKerja="{ item }: any">
          <v-chip :color="item.statusKerja ? 'success' : 'error'">{{
            item.statusKerja ? "Masuk" : "Izin"
          }}</v-chip>
        </template>
        <template #item.check_in_time="{ item }: any">
          <v-chip
            v-if="item.check_in_time"
            color="info"
            label
            variant="outlined"
          >
            {{ item.check_in_time }}
          </v-chip>
          <p v-else>-</p>
        </template>
        <template #item.check_out_time="{ item }: any">
          {{ item.check_out_time ? item.check_out_time : "-" }}
        </template>
        <template #item.action="{ item }: any">
          <AppButton
            label="Detail"
            color="primary"
            variant="outlined"
            @click="openDetail(item)"
          />
        </template>
      </v-data-table>
    </v-container>
  </div>
  <AppDialogPresensiDetail
    v-model="presensiDetail"
    :selected-employee="selectedItem"
  />
</template>
<script setup lang="ts">
const dateFilter = ref(tanggalIndoNow());
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import pjConstant from "~/app/constant/pj.constant";
const db = useFirestore();
const employeePresence: any = ref([]);
// const employeeQuery = query(
//   collectionGroup(db, "presensi_log"),
//   where("tanggal", "==", "2025-03-06")
// );
const getAllEmployee = async () => {
  const employeeQuery = query(
    collectionGroup(db, "presensi_log"),
    where("tanggal", "==", dateFilter.value)
  );
  const employeeSnapshot = await getDocs(employeeQuery);
  let employeeData: any = [];
  employeeSnapshot.forEach((doc) => {
    employeeData.push({ ...doc.data() });
  });
  employeePresence.value = employeeData;
};
getAllEmployee();
const header: any = pjConstant.employeeStatusHeader;

const presensiDetail = ref(false);
const selectedItem = ref({});
const openDetail = (item: any) => {
  presensiDetail.value = true;
  selectedItem.value = item;
};
const filterByDate = () => {
  console.log("first");
  getAllEmployee();
};
</script>
