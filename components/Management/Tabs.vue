<template>
  <v-container class="h-full" fluid>
    <v-card class="h-full" variant="flat">
      <v-container>
        <v-tabs
          v-model="tab"
          color="primary"
          density="compact"
          selected-class="font-weight-bold"
        >
          <v-tab
            v-for="(item, index) in employeeActions"
            :key="index"
            :value="item.value"
            class="text-none"
          >
            {{ item.item }}
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item value="tambah_bo">
            <ManagementEmployee />
          </v-window-item>
          <v-window-item value="rekap_presensi">
            <ManagementRekapPresensi />
          </v-window-item>
          <!-- <v-window-item
            v-for="(item, index) in employeeActions"
            :key="index"
            :value="item.value"
          >
            <ProductionPjPetaGarisEmployeeTable :employee="item" />
          </v-window-item> -->
        </v-window>
      </v-container>
    </v-card>
  </v-container>
</template>
<script lang="ts" setup>
const tab = ref();
const employeeActions = ref([
  { item: "Tambah BO", value: "tambah_bo" },
  { item: "Presensi Employee", value: "rekap_presensi" },
]);
</script>
