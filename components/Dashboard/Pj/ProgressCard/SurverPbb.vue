<template>
  <AppCardProgressCircular
    title="Survey PBB"
    :value="surveyedCount"
    done-color="primary"
    :target-value="13000"
  />
</template>
<script lang="ts" setup>
const surveyStore = useSurveyStore();
const surveyedCount = ref(0);
if (surveyStore.bidang_bontang_baru.length === 0) {
  await surveyStore.getAllDoneBidangTanah();
}
surveyedCount.value = surveyStore.bidang_bontang_baru.filter(
  (item: any) => item.status === true
).length;
</script>
