<script setup>
import { onMounted } from "vue";
import L from "leaflet";

const surveyStore = useSurveyStore();
const latitude = 0.139267;
const longitude = 117.494326;
const zoomLevel = 16;

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

  // Custom Basemap AWS
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

  if (surveyStore.bidang_bontang_baru.length === 0) {
    await surveyStore.getAllDoneBidangTanah();
  }

  // Fungsi Style
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

  // Tambahkan GeoJSON
  const geoJsonLayer = L.geoJSON(bidangBontangBaru, {
    style: getStyle,
    onEachFeature: onEachFeature,
  }).addTo(map);

  // Layer Control
  const baseMaps = {
    OpenStreetMap: osm,
  };

  const overlayMaps = {
    "Ortho Bontang": awsTiles,
    "Bidang Bontang Baru": geoJsonLayer,
  };

  L.control.layers(baseMaps, overlayMaps, { collapsed: false }).addTo(map);
});
</script>

<template>
  <div id="map" class="h-screen w-full"></div>
</template>

<style scoped>
#map {
  height: 100%;
  width: 100%;
}
</style>
