<script lang="ts" setup>
</script>

<template>
  <div class="py-6">
    <svg viewBox="0 0 920 390" xmlns="http://www.w3.org/2000/svg" class="w-full max-w-[920px] h-auto overflow-visible mx-auto block">
      <defs>
        <marker id="km-arr-gold" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0,10 3.5,0 7" fill="#C8922E"/>
        </marker>
        <marker id="km-arr-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0,10 3.5,0 7" fill="#2F6B3E"/>
        </marker>
        <filter id="km-shadow" x="-6%" y="-6%" width="116%" height="136%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#2B2F33" flood-opacity="0.08"/>
        </filter>
      </defs>

      <!-- LEFT PANEL — SKOS Data Pattern -->
      <g filter="url(#km-shadow)">
        <rect x="12" y="24" width="228" height="326" rx="12" fill="white" stroke="#7A3E6A" stroke-width="1.5" stroke-opacity="0.45"/>
        <rect x="12" y="24" width="228" height="46" rx="12" fill="rgba(122,62,106,0.11)" stroke="#7A3E6A" stroke-width="1.5" stroke-opacity="0.45"/>
        <rect x="12" y="56" width="228" height="14" fill="rgba(122,62,106,0.11)"/>
        <text x="126" y="42" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="9" fill="#7A3E6A" letter-spacing="2">SKOS CONCEPT PATTERN</text>
        <text x="126" y="60" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13.5" font-weight="700" fill="#2B2F33">Vocabulary Term</text>
        <line x1="30" y1="82" x2="222" y2="82" stroke="#7A3E6A" stroke-opacity="0.15" stroke-width="1"/>
        <rect x="22" y="90" width="208" height="54" rx="7" fill="rgba(122,62,106,0.05)"/>
        <text x="34" y="106" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="9.5" fill="#7A3E6A">skos:prefLabel</text>
        <text x="34" y="121" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11.5" font-weight="600" fill="#2B2F33">Preferred Name</text>
        <text x="34" y="136" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10" fill="#6B7280">The official name for this term</text>
        <rect x="22" y="153" width="208" height="54" rx="7" fill="rgba(122,62,106,0.05)"/>
        <text x="34" y="169" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="9.5" fill="#7A3E6A">skos:definition</text>
        <text x="34" y="184" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11.5" font-weight="600" fill="#2B2F33">Definition</text>
        <text x="34" y="199" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10" fill="#6B7280">A clear, authoritative description</text>
        <rect x="22" y="216" width="208" height="54" rx="7" fill="rgba(122,62,106,0.05)"/>
        <text x="34" y="232" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="9.5" fill="#7A3E6A">skos:broader</text>
        <text x="34" y="247" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11.5" font-weight="600" fill="#2B2F33">Broader Term</text>
        <text x="34" y="262" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10" fill="#6B7280">Parent concept in the hierarchy</text>
        <rect x="22" y="279" width="208" height="54" rx="7" fill="rgba(122,62,106,0.05)"/>
        <text x="34" y="295" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="9.5" fill="#7A3E6A">skos:inScheme</text>
        <text x="34" y="310" font-family="ui-sans-serif,system-ui,sans-serif" font-size="11.5" font-weight="600" fill="#2B2F33">Vocabulary</text>
        <text x="34" y="325" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10" fill="#6B7280">Which vocabulary this belongs to</text>
      </g>
      <text x="126" y="368" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10.5" fill="#7A3E6A">Standard pattern — defined once</text>

      <!-- Arrow 1 -->
      <line x1="244" y1="187" x2="318" y2="187" stroke="#C8922E" stroke-width="2" marker-end="url(#km-arr-gold)"/>
      <text x="281" y="179" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="9" fill="#C8922E">generates</text>

      <!-- CENTER PANEL — Data Entry Form -->
      <g filter="url(#km-shadow)">
        <rect x="326" y="24" width="242" height="326" rx="12" fill="white" stroke="#C8922E" stroke-width="1.8" stroke-opacity="0.6"/>
        <rect x="326" y="24" width="242" height="46" rx="12" fill="rgba(200,146,46,0.12)" stroke="#C8922E" stroke-width="1.8" stroke-opacity="0.6"/>
        <rect x="326" y="56" width="242" height="14" fill="rgba(200,146,46,0.12)"/>
        <circle cx="348" cy="47" r="5" fill="#C8922E" opacity="0.3"/>
        <circle cx="366" cy="47" r="5" fill="#C8922E" opacity="0.3"/>
        <circle cx="384" cy="47" r="5" fill="#C8922E" opacity="0.55"/>
        <text x="447" y="42" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="9" fill="#C8922E" letter-spacing="2">K-MAKER</text>
        <text x="447" y="60" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13.5" font-weight="700" fill="#2B2F33">Data Entry Form</text>
        <line x1="343" y1="82" x2="551" y2="82" stroke="#C8922E" stroke-opacity="0.18" stroke-width="1"/>
        <text x="343" y="103" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10" fill="#6B7280">Preferred Name</text>
        <rect x="343" y="109" width="212" height="29" rx="6" fill="#FDFAF5" stroke="#C8922E" stroke-width="1.2" stroke-opacity="0.5"/>
        <text x="356" y="128" font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" fill="#2B2F33">Sandstone</text>
        <text x="343" y="157" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10" fill="#6B7280">Definition</text>
        <rect x="343" y="163" width="212" height="50" rx="6" fill="#FDFAF5" stroke="#C8922E" stroke-width="1.2" stroke-opacity="0.5"/>
        <text x="356" y="180" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10.5" fill="#2B2F33">A clastic sedimentary rock</text>
        <text x="356" y="195" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10.5" fill="#2B2F33">composed of sand-size grains.</text>
        <text x="343" y="233" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10" fill="#6B7280">Broader Term</text>
        <rect x="343" y="239" width="212" height="29" rx="6" fill="#FDFAF5" stroke="#C8922E" stroke-width="1.2" stroke-opacity="0.5"/>
        <text x="356" y="258" font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" fill="#2B2F33">Sedimentary Rock</text>
        <path d="M539,250 l6,8 l6,-8z" fill="#C8922E" opacity="0.65"/>
        <text x="343" y="288" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10" fill="#6B7280">Vocabulary</text>
        <rect x="343" y="294" width="212" height="29" rx="6" fill="#FDFAF5" stroke="#C8922E" stroke-width="1.2" stroke-opacity="0.5"/>
        <text x="356" y="313" font-family="ui-sans-serif,system-ui,sans-serif" font-size="12" fill="#2B2F33">Lithology Vocabulary</text>
        <path d="M539,305 l6,8 l6,-8z" fill="#C8922E" opacity="0.65"/>
        <rect x="367" y="328" width="160" height="22" rx="11" fill="#C8922E"/>
        <text x="447" y="343" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10.5" font-weight="600" fill="white">Save Term</text>
      </g>
      <text x="447" y="368" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10.5" fill="#C8922E">Interface in clear and simple terms</text>

      <!-- Arrow 2 -->
      <line x1="572" y1="187" x2="644" y2="187" stroke="#2F6B3E" stroke-width="2" marker-end="url(#km-arr-green)"/>
      <text x="608" y="179" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="9" fill="#2F6B3E">stored as</text>

      <!-- RIGHT PANEL — Knowledge Graph -->
      <g filter="url(#km-shadow)">
        <rect x="652" y="24" width="258" height="326" rx="12" fill="white" stroke="#2F6B3E" stroke-width="1.5" stroke-opacity="0.45"/>
        <rect x="652" y="24" width="258" height="46" rx="12" fill="rgba(47,107,62,0.10)" stroke="#2F6B3E" stroke-width="1.5" stroke-opacity="0.45"/>
        <rect x="652" y="56" width="258" height="14" fill="rgba(47,107,62,0.10)"/>
        <text x="781" y="42" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="9" fill="#2F6B3E" letter-spacing="2">KNOWLEDGE GRAPH</text>
        <text x="781" y="60" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="13.5" font-weight="700" fill="#2B2F33">Linked Data Record</text>
        <line x1="670" y1="82" x2="892" y2="82" stroke="#2F6B3E" stroke-opacity="0.15" stroke-width="1"/>
        <circle cx="781" cy="197" r="30" fill="rgba(47,107,62,0.12)" stroke="#2F6B3E" stroke-width="2"/>
        <text x="781" y="193" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10" font-weight="700" fill="#2F6B3E">Sand-</text>
        <text x="781" y="207" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10" font-weight="700" fill="#2F6B3E">stone</text>
        <line x1="781" y1="167" x2="781" y2="122" stroke="#2F6B3E" stroke-width="1.2" stroke-opacity="0.4" stroke-dasharray="3,2"/>
        <rect x="732" y="96" width="98" height="24" rx="12" fill="rgba(47,107,62,0.08)" stroke="#2F6B3E" stroke-width="1.2" stroke-opacity="0.55"/>
        <text x="781" y="112" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10.5" fill="#2B2F33">Sandstone</text>
        <text x="793" y="147" text-anchor="start" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#9CA3AF">prefLabel</text>
        <line x1="811" y1="197" x2="856" y2="197" stroke="#2F6B3E" stroke-width="1.2" stroke-opacity="0.4" stroke-dasharray="3,2"/>
        <rect x="857" y="181" width="82" height="32" rx="14" fill="rgba(47,107,62,0.08)" stroke="#2F6B3E" stroke-width="1.2" stroke-opacity="0.55"/>
        <text x="898" y="195" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="9.5" fill="#2B2F33">Lithology</text>
        <text x="898" y="207" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="9.5" fill="#2B2F33">Vocab</text>
        <text x="833" y="191" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="7.5" fill="#9CA3AF">inScheme</text>
        <line x1="781" y1="227" x2="781" y2="272" stroke="#2F6B3E" stroke-width="1.2" stroke-opacity="0.4" stroke-dasharray="3,2"/>
        <rect x="714" y="273" width="134" height="24" rx="12" fill="rgba(47,107,62,0.08)" stroke="#2F6B3E" stroke-width="1.2" stroke-opacity="0.55"/>
        <text x="781" y="289" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10.5" fill="#2B2F33">Sedimentary Rock</text>
        <text x="793" y="268" text-anchor="start" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#9CA3AF">broader</text>
        <line x1="751" y1="197" x2="706" y2="197" stroke="#2F6B3E" stroke-width="1.2" stroke-opacity="0.4" stroke-dasharray="3,2"/>
        <rect x="659" y="181" width="46" height="32" rx="8" fill="rgba(47,107,62,0.08)" stroke="#2F6B3E" stroke-width="1.2" stroke-opacity="0.55"/>
        <text x="682" y="196" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="9" fill="#2B2F33">"A</text>
        <text x="682" y="207" text-anchor="middle" font-family="ui-monospace,SFMono-Regular,Menlo,monospace" font-size="9" fill="#2B2F33">clas…"</text>
        <text x="718" y="191" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="7.5" fill="#9CA3AF">definition</text>
        <line x1="781" y1="297" x2="781" y2="326" stroke="#2F6B3E" stroke-width="1" stroke-opacity="0.2" stroke-dasharray="2,2"/>
        <circle cx="781" cy="331" r="5" fill="rgba(47,107,62,0.2)" stroke="#2F6B3E" stroke-width="1" stroke-opacity="0.4"/>
        <text x="792" y="335" font-family="ui-sans-serif,system-ui,sans-serif" font-size="8" fill="#9CA3AF">+ more relations…</text>
      </g>
      <text x="781" y="368" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="10.5" fill="#2F6B3E">Connected, queryable, governed</text>
    </svg>
           <p class="text-left text-gray-500 mb-4" style="font-style: italic;"> <small>From SKOS vocabulary pattern to knowledge graphs, the user only has to interact with simple UI fields that are tailored to look and feel like any other organisational application.</small></p>
  </div>
</template>
