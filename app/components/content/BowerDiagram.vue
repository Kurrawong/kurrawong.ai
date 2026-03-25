<script lang="ts" setup>
</script>

<template>
  <div class="flex items-center justify-center py-4">
    <svg viewBox="0 0 640 500" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-[640px] h-auto overflow-visible">
      <defs>
        <marker id="ah-plum" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0 0,8 4,0 8" fill="#7A3E6A"/>
        </marker>
        <marker id="ah-forest" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0 0,8 4,0 8" fill="#2F6B3E"/>
        </marker>
        <radialGradient id="kg-grad" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FFF8EC"/>
          <stop offset="100%" stop-color="#F5E3C0"/>
        </radialGradient>
        <filter id="card-shadow" x="-5%" y="-5%" width="110%" height="128%">
          <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#2B2F33" flood-opacity="0.08"/>
        </filter>
      </defs>

      <!-- CONNECTORS — plum in, forest out -->
      <path class="march-in" stroke="#7A3E6A" stroke-opacity="0.8" marker-end="url(#ah-plum)"
        d="M 154,110 C 154,150 188,170 212,190"/>
      <path class="march-in" stroke="#7A3E6A" stroke-opacity="0.8" marker-end="url(#ah-plum)"
        d="M 486,110 C 486,150 452,170 428,190"/>
      <path class="march-out" stroke="#2F6B3E" stroke-opacity="0.8" marker-end="url(#ah-forest)"
        d="M 218,312 C 202,344 168,360 154,382"/>
      <path class="march-out" stroke="#2F6B3E" stroke-opacity="0.8" marker-end="url(#ah-forest)"
        d="M 422,312 C 438,344 472,360 486,382"/>

      <!-- TOP LEFT — Structured (plum) -->
      <g filter="url(#card-shadow)">
        <rect x="20" y="20" width="268" height="90" rx="13" fill="rgba(122,62,106,0.08)"
          stroke="#7A3E6A" stroke-width="1.4" stroke-opacity="0.4"/>
        <text x="36" y="47" font-family="monospace" font-size="9.5" fill="#7A3E6A" letter-spacing="1.8">INPUT</text>
        <text x="36" y="69" font-family="sans-serif" font-size="18" font-weight="700" fill="#2B2F33">Structured</text>
        <text x="36" y="88" font-family="monospace" font-size="11" fill="#6B7280">Databases, tables, APIs</text>
      </g>

      <!-- TOP RIGHT — Unstructured (plum) -->
      <g filter="url(#card-shadow)">
        <rect x="352" y="20" width="268" height="90" rx="13" fill="rgba(122,62,106,0.08)"
          stroke="#7A3E6A" stroke-width="1.4" stroke-opacity="0.4"/>
        <text x="368" y="47" font-family="monospace" font-size="9.5" fill="#7A3E6A" letter-spacing="1.8">INPUT</text>
        <text x="368" y="69" font-family="sans-serif" font-size="18" font-weight="700" fill="#2B2F33">Unstructured</text>
        <text x="368" y="88" font-family="monospace" font-size="11" fill="#6B7280">PDFs, docs, emails, images</text>
      </g>

      <!-- KNOWLEDGE GRAPH ELLIPSE (gold) -->
      <g>
        <ellipse cx="320" cy="252" rx="142" ry="86" fill="none"
          stroke="#C8922E" stroke-width="1" stroke-opacity="0.15"/>
        <ellipse cx="320" cy="252" rx="128" ry="72" fill="url(#kg-grad)"
          stroke="#C8922E" stroke-width="2" stroke-opacity="0.7"/>
        <text x="320" y="218" font-family="sans-serif" font-size="17" font-weight="700"
          fill="#2B2F33" text-anchor="middle">Knowledge Graph</text>
        <rect x="260" y="222" width="120" height="2.5" rx="1.5" fill="#C8922E" opacity="0.35"/>
        <g stroke="#C8922E" stroke-width="1.15" fill="none" opacity="0.3">
          <line x1="300" y1="248" x2="336" y2="243"/>
          <line x1="336" y1="243" x2="358" y2="263"/>
          <line x1="358" y1="263" x2="340" y2="284"/>
          <line x1="340" y1="284" x2="303" y2="286"/>
          <line x1="303" y1="286" x2="281" y2="268"/>
          <line x1="281" y1="268" x2="300" y2="248"/>
          <line x1="300" y1="248" x2="340" y2="284"/>
          <line x1="336" y1="243" x2="303" y2="286"/>
          <line x1="303" y1="286" x2="320" y2="305"/>
          <line x1="340" y1="284" x2="320" y2="305"/>
          <line x1="281" y1="268" x2="303" y2="286"/>
        </g>
        <g fill="#C8922E">
          <circle class="gnode" cx="300" cy="248" r="4.5"/>
          <circle class="gnode" cx="336" cy="243" r="4.5"/>
          <circle class="gnode" cx="358" cy="263" r="4.5"/>
          <circle class="gnode" cx="340" cy="284" r="4.5"/>
          <circle class="gnode" cx="303" cy="286" r="4.5"/>
          <circle class="gnode" cx="281" cy="268" r="4.5"/>
          <circle class="gnode" cx="320" cy="305" r="4.5"/>
        </g>
      </g>

      <!-- BOTTOM LEFT — Rule-Based (forest green) -->
      <g filter="url(#card-shadow)">
        <rect x="20" y="382" width="268" height="108" rx="13" fill="rgba(47,107,62,0.09)"
          stroke="#2F6B3E" stroke-width="1.4" stroke-opacity="0.4"/>
        <text x="36" y="409" font-family="monospace" font-size="9.5" fill="#2F6B3E" letter-spacing="1.8">PROCESSING</text>
        <text x="36" y="431" font-family="sans-serif" font-size="16" font-weight="700" fill="#2B2F33">Rule-Based</text>
        <text x="36" y="451" font-family="monospace" font-size="10.5" fill="#6B7280">SHACL rules, scoring,</text>
        <text x="36" y="467" font-family="monospace" font-size="10.5" fill="#6B7280">fraud detection, routing</text>
      </g>

      <!-- BOTTOM RIGHT — Document Provenance (forest green) -->
      <g filter="url(#card-shadow)">
        <rect x="352" y="382" width="268" height="108" rx="13" fill="rgba(47,107,62,0.09)"
          stroke="#2F6B3E" stroke-width="1.4" stroke-opacity="0.4"/>
        <text x="368" y="409" font-family="monospace" font-size="9.5" fill="#2F6B3E" letter-spacing="1.8">RETRIEVAL</text>
        <text x="368" y="431" font-family="sans-serif" font-size="16" font-weight="700" fill="#2B2F33">Document Provenance</text>
        <text x="368" y="451" font-family="monospace" font-size="10.5" fill="#6B7280">Query source documents by</text>
        <text x="368" y="467" font-family="monospace" font-size="10.5" fill="#6B7280">page position, content, context</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.march-in, .march-out {
  fill: none;
  stroke-width: 1.8;
  stroke-dasharray: 6 4;
  animation: march 1.6s linear infinite;
}
@keyframes march { to { stroke-dashoffset: -20; } }

.gnode {
  animation: gpulse 2.4s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}
.gnode:nth-child(1) { animation-delay: 0.00s; }
.gnode:nth-child(2) { animation-delay: 0.34s; }
.gnode:nth-child(3) { animation-delay: 0.68s; }
.gnode:nth-child(4) { animation-delay: 1.02s; }
.gnode:nth-child(5) { animation-delay: 1.36s; }
.gnode:nth-child(6) { animation-delay: 1.70s; }
.gnode:nth-child(7) { animation-delay: 2.04s; }
@keyframes gpulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(1.65); }
}
</style>
