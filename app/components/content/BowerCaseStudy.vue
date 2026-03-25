<script lang="ts" setup>
</script>

<template>
  <div class="case-section">
    <div class="case-inner">
      <div class="case-left">
        <div class="case-label">Case Study</div>
        <h3 class="case-title">Bower in the Resources Sector</h3>
        <p class="case-desc">
          In 2024–2025, we deployed Bower for a large international mining company — processing their entire document and spatial data library into a searchable, AI-powered Knowledge Graph.
        </p>
      </div>
      <div class="case-right">
        <div class="case-stat">
          <div class="stat-num">1000s</div>
          <div class="stat-info"><strong>Mixed datasets</strong> processed including spatial data files with automatic extent extraction</div>
        </div>
        <div class="case-stat">
          <div class="stat-num">~500K</div>
          <div class="stat-info"><strong>Domain documents</strong> ingested — text extracted for chat, images for specialised processing</div>
        </div>
        <div class="case-stat">
          <div class="stat-num">ArcGIS</div>
          <div class="stat-info"><strong>Embedded UI</strong> deployed inside ESRI's ArcGIS Online — also supports OpenLayers, open-source, and standalone catalogue options</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.case-section {
  background: #18181b;
  color: white;
  padding: 3.5rem 2rem;
  border-radius: 16px;
  margin: 2rem 0;
}
.case-inner {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 3rem;
  align-items: center;
}
@media (max-width: 768px) {
  .case-inner { grid-template-columns: 1fr; gap: 2rem; }
}
.case-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #f59e0b;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.case-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: white !important;
}
.case-desc {
  color: #a1a1aa;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
}
.case-right {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.case-stat {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #27272a;
}
.case-stat:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.stat-num {
  font-size: 1.75rem;
  font-weight: 900;
  color: #f59e0b;
  line-height: 1;
  min-width: 100px;
  flex-shrink: 0;
}
.stat-info {
  font-size: 0.85rem;
  color: #a1a1aa;
  line-height: 1.5;
}
.stat-info strong {
  color: white;
}
</style>
