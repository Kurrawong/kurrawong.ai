<script lang="ts" setup>
const steps = [
  { num: '1', color: 'gold', title: 'Ingest & Extract', desc: 'Raw documents — PDFs, field logs, reports — are ingested and domain entities are automatically identified with their exact position on each page.' },
  { num: '2', color: 'gold', title: 'Build the Graph', desc: 'Extracted entities (minerals, locations, measurements, structures) are linked into a standards-compliant Knowledge Graph with full source provenance.' },
  { num: '3', color: 'plum', title: 'Fire Rules', desc: 'Domain rules match against extracted entities — scoring, tagging, and routing findings. Think fraud detection, anomaly flagging, compliance checks.' },
  { num: '4', color: 'plum', title: 'Trace Every Claim', desc: 'Every result links back to the exact words on the exact page of the source document. Full evidence chain — no black boxes.' },
]
</script>

<template>
  <div class="steps">
    <div v-for="step in steps" :key="step.num" class="step">
      <span class="step-num" :class="step.color === 'gold' ? 'step-gold' : 'step-plum'">{{ step.num }}</span>
      <div class="step-content">
        <h4>{{ step.title }}</h4>
        <p>{{ step.desc }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 0.5rem;
}
.step {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}
.step-num {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: 2px;
}
.step-gold {
  background: rgba(200, 146, 46, 0.12);
  color: #C8922E;
}
.step-plum {
  background: rgba(122, 62, 106, 0.12);
  color: #7A3E6A;
}
.step-content h4 {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}
.step-content p {
  font-size: 0.85rem;
  color: var(--muted-foreground);
  line-height: 1.55;
  margin: 0;
}
</style>
