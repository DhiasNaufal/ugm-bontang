<template>
  <LMap
    ref="map"
    style="height: 100vh"
    :zoom="zoom"
    :center="[0.12505772302512846, 117.48004699561473]"
    :use-global-leaflet="false"
  >
    <LTileLayer
      url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      layer-type="base"
      name="OpenStreetMap"
    />
    <LGeoJson
      v-if="surveyStore.refreshPersil"
      :geojson="geojson"
      :options-style="geoStyler"
      :key="geojsonKey"
    />
  </LMap>
</template>

<script setup>
import { ref } from "vue";
import { collection, getFirestore } from "firebase/firestore";
const geojson = ref(undefined);
const batas = ref(undefined);
const zoom = ref(15);
const db = getFirestore();
const surveyStore = useSurveyStore();
const geoStyler = (feature) => ({
  fillColor: checkFeature(feature) ? "rgb(39,214,0,1)" : "rgba(0, 0, 0, 0)",
  fillOpacity: 1,
  color: "yellow",
  weight: 4,
});
const geojsonKey = ref(0);
const API_KEY = useRuntimeConfig().public.mapTilesKey;
onMounted(async () => {
  const response = await fetch("/Bontang_web.geojson");
  const batasBontang = await fetch("/new_bontang.geojson");
  geojson.value = await response.json();
  batas.value = await batasBontang.json();
});
const surveyProgress = useCollection(collection(db, "surveyProgress"));
function checkFeature(feature) {
  return surveyProgress.value.some(
    (item) => item.D_NOP === feature.properties.D_NOP && item.status === true
  );
}
</script>
