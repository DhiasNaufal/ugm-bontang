<script setup>
import { ref, onMounted } from "vue";
import L from "leaflet";
const surveyStore = useSurveyStore();
const latitude = 0.139267;
const longitude = 117.494326;
const zoomLevel = 16;

const totalPolygons = ref(0); // Total bidang dalam GeoJSON
const surveyedCount = ref(0); // Bidang yang sudah disurvei
const progress = ref(0); // Persentase progress

onMounted(async () => {
  // Inisialisasi peta
  const map = L.map("map").setView([latitude, longitude], zoomLevel);

  // Basemap OSM
  const osm = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors",
    }
  ).addTo(map);

  // AWS Tiles sebagai overlay
  const awsTiles = L.tileLayer(
    "https://basemap-ortho.s3.ap-southeast-2.amazonaws.com/bontang-ortho-tiles/{z}/{x}/{y}.png",
    {
      tms: true,
      minZoom: 12,
      maxZoom: 19,
    }
  ).addTo(map);

  // Fetch Data GeoJSON
  const geoJsonBontangBaru = await fetch(
    "/petaKerja/peta_kerja_bontang_baru.geojson"
  );
  const bidangBontangBaru = await geoJsonBontangBaru.json();

  totalPolygons.value = bidangBontangBaru.features.length; // Simpan total bidang tanah

  if (surveyStore.bidang_bontang_baru.length === 0) {
    await surveyStore.getAllDoneBidangTanah();
  }

  // Hitung jumlah bidang yang sudah disurvei
  surveyedCount.value = surveyStore.bidang_bontang_baru.filter(
    (item) => item.status === true
  ).length;
  progress.value = (surveyedCount.value / totalPolygons.value) * 100; // Kalkulasi progress

  // Fungsi Style GeoJSON
  const getStyle = (feature) => {
    const fid = feature?.properties?.FID;
    const isSurveyed = surveyStore.bidang_bontang_baru.some(
      (item) => item.FID === String(fid) && item.status === true
    );
    return {
      fillColor: isSurveyed ? "green" : "rgba(139, 146, 152, 1)",
      weight: 1,
      color: "white",
      fillOpacity: isSurveyed ? 1 : 0.5,
    };
  };

  // Event GeoJSON
  const onEachFeature = (feature, layer) => {
    const fid = feature?.properties?.FID;
    const isSurveyed = surveyStore.bidang_bontang_baru.some(
      (item) => item.FID === String(fid) && item.status === true
    );
    layer.bindPopup(`
      <div style="font-family: Arial, sans-serif; max-width: 300px;">
        <p><strong>Kecamatan:</strong> ${feature.properties.KECAMATAN}</p>
        <p><strong>Kelurahan:</strong> ${feature.properties.KELURAHAN}</p>
        <p><strong>Alamat OP:</strong> ${feature.properties.ALAMAT_OP}</p>
        <p><strong>Alamat WP:</strong> ${feature.properties.ALAMAT_WP}</p>
        <p><strong>Status:</strong> ${
          isSurveyed
            ? "<span style='color: green;'>Sudah Disurvey</span>"
            : "<span style='color: red;'>Belum Disurvey</span>"
        }</p>
      </div>
    `);

    layer.on({
      mouseover: (e) => e.target.setStyle({ weight: 5, color: "yellow" }),
      mouseout: (e) => e.target.setStyle({ weight: 1, color: "white" }),
    });
  };

  // Tambahkan GeoJSON ke peta
  const geoJsonLayer = L.geoJSON(bidangBontangBaru, {
    style: getStyle,
    onEachFeature: onEachFeature,
  }).addTo(map);

  // Layer Control
  const baseMaps = { OpenStreetMap: osm };
  const overlayMaps = {
    "AWS Tiles": awsTiles,
    "Bidang Bontang Baru": geoJsonLayer,
  };

  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
});
</script>

<template>
  <div class="map-container">
    <!-- Peta -->
    <div id="map" class="map"></div>

    <div class="progress-container">
      <div class="text-left mb-2">
        <p class="text-lg font-semibold">Progres Bontang Baru</p>
        <p class="">
          Selesai {{ surveyedCount }} dari
          {{ totalPolygons }}
        </p>
      </div>
      <v-progress-circular
        :model-value="progress"
        :size="140"
        :width="20"
        color="success"
      >
        {{ Math.round(progress) }}%
      </v-progress-circular>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map {
  height: 100%;
  width: 100%;
}

.progress-circle {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 5px;
  z-index: 999;
}

.progress-container {
  z-index: 999;
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
}

.progress-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}
</style>
