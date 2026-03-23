<script lang="ts" setup>
</script>

<template>
  <div class="demo-wrap">
    <!-- Document shell -->
    <div class="doc-shell">
      <div class="doc-toolbar">
        <span class="dot-w"></span><span class="dot-w"></span><span class="dot-w"></span>
        <span class="doc-filename">RC22-047_Pilbara_field_log.pdf</span>
      </div>
      <div class="doc-body">
        <p class="doc-title-inner">RC Drilling Report — Pilbara Craton, Western Australia</p>
        <p class="doc-meta">Hole ID: RC22-047 &nbsp;·&nbsp; Collar: 550340mE / 7652110mN (MGA94 z50) &nbsp;·&nbsp; Logged: J. Hargreaves &nbsp;·&nbsp; 2022-08-14</p>
        <hr class="doc-divider"/>
        <div class="doc-text">
          <p>Hole RC22-047 was drilled to a final depth of <span class="ent ent-measure">312 m</span> at an azimuth of <span class="ent ent-measure">270° / −60°</span> from surface collar within the <span class="ent ent-loc">Marble Bar Greenstone Belt</span>. Geology was logged against <span class="ent ent-loc">GSWA</span> lithocode standards throughout.</p>
          <span class="key-phrase">Anomalous <span class="ent ent-mineral">chalcopyrite</span> and <span class="ent ent-mineral">bornite</span> mineralisation intersected within a strongly <span class="ent ent-struct">silicified shear zone</span> at <span class="ent ent-measure">187–204 m</span>, hosted in <span class="ent ent-litho">felsic volcanics</span> — consistent with a <span class="ent ent-struct">VMS-style</span> structural setting.</span>
          <p>The <span class="ent ent-litho">mafic schist</span> unit between <span class="ent ent-measure">145–183 m</span> shows pervasive <span class="ent ent-struct">foliation</span> trending <span class="ent ent-measure">340°/72°W</span>, with minor <span class="ent ent-mineral">pyrite</span> stringers along <span class="ent ent-struct">cleavage planes</span>. Samples submitted to <span class="ent ent-loc">Intertek Genalysis, Perth</span> for <span class="ent ent-mineral">Cu</span>, <span class="ent ent-mineral">Au</span>, and <span class="ent ent-mineral">Ag</span> multi-element suite.</p>
        </div>
        <div class="legend">
          <div class="leg-item"><div class="leg-swatch" style="background:#7A3E6A;"></div> Mineral</div>
          <div class="leg-item"><div class="leg-swatch" style="background:#2E5B9A;"></div> Location</div>
          <div class="leg-item"><div class="leg-swatch" style="background:#C8922E;"></div> Measurement</div>
          <div class="leg-item"><div class="leg-swatch" style="background:#3B6D11;"></div> Lithology</div>
          <div class="leg-item"><div class="leg-swatch" style="background:#993C1D;"></div> Structure</div>
        </div>
      </div>
    </div>

    <!-- Torn edge -->
    <div class="torn"></div>

    <!-- Rule panel -->
    <div class="rule-panel">
      <div class="rule-header">
        <span>matched rule</span>
        <span class="badge-plum">sulphide anomaly detector</span>
      </div>
      <div class="rule-grid">
        <div class="rule-triggers">
          <div class="rule-triggers-label">entities matched</div>
          <span class="rule-tag" style="background:#EDD6E8;color:#5a2450;">MINERAL</span>
          <span class="rule-tag" style="background:#FAECE7;color:#712B13;">STRUCTURE</span>
          <span class="rule-tag" style="background:#FAEEDA;color:#633806;">MEASUREMENT</span>
          <span class="rule-tag" style="background:#EAF3DE;color:#27500A;">LITHOLOGY</span>
        </div>
        <div class="rule-code">
          <span class="cm">// flag Cu-sulphide intersections in structural hosts</span><br>
          <span class="kw">RULE</span> sulphide_anomaly {<br>
          &nbsp;&nbsp;mineral <span class="kw">IN</span> [<span class="val">"chalcopyrite"</span>, <span class="val">"bornite"</span>, <span class="val">"pyrite"</span>]<br>
          &nbsp;&nbsp;structure <span class="kw">IN</span> [<span class="val">"shear zone"</span>, <span class="val">"VMS-style"</span>]<br>
          &nbsp;&nbsp;interval.metres <span class="kw">&gt;</span> <span class="nc">10</span><br>
          } <span class="kw">SCORE</span> <span class="nc">+0.8</span> → <span class="out">tag("Cu-sulphide anomaly")</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nc">+0.6</span> → <span class="out">tag("VMS host sequence")</span><br>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="nc">+0.5</span> → <span class="out">route("assay_priority_queue")</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-wrap { max-width: 100%; }

.doc-shell {
  border: 1px solid var(--border);
  border-radius: 14px 14px 0 0;
  background: white;
  overflow: hidden;
}
.doc-toolbar {
  background: var(--secondary);
  border-bottom: 1px solid var(--border);
  padding: 8px 16px;
  display: flex; align-items: center; gap: 10px;
}
.doc-filename { font-size: 12px; color: var(--muted-foreground); font-family: monospace; }
.dot-w { width: 10px; height: 10px; border-radius: 50%; background: var(--border); display: inline-block; }

.doc-body { padding: 24px 28px 18px; }
.doc-title-inner { font-size: 14px; font-weight: 700; color: var(--foreground); margin: 0 0 4px !important; }
.doc-meta { font-size: 9.5px; font-family: monospace; color: var(--muted-foreground); margin: 0 0 16px !important; letter-spacing: 0.02em; }
.doc-divider { border: none; border-top: 1px solid var(--border); margin: 0 0 14px; }
.doc-text { font-size: 12.5px; line-height: 1.85; color: var(--foreground); }
.doc-text p { margin: 0 0 12px !important; }

.ent { display: inline; border-radius: 3px; padding: 1px 4px; font-size: 11.5px; cursor: default; }
.ent-mineral { background: #EDD6E8; color: #5a2450; border-bottom: 2px solid #7A3E6A; }
.ent-loc { background: #E6F1FB; color: #0C447C; border-bottom: 2px solid #2E5B9A; }
.ent-measure { background: #FAEEDA; color: #633806; border-bottom: 2px solid #C8922E; }
.ent-litho { background: #EAF3DE; color: #27500A; border-bottom: 2px solid #3B6D11; }
.ent-struct { background: #FAECE7; color: #712B13; border-bottom: 2px solid #993C1D; }

.key-phrase {
  border: 2px solid rgba(185,38,18,0.7);
  border-radius: 4px;
  padding: 7px 12px;
  margin: 4px 0 14px;
  display: block;
  font-style: italic;
  background: rgba(255,237,60,0.22);
}

.torn {
  display: block; width: 100%; height: 22px; background: white;
  clip-path: polygon(
    0% 0%, 2% 60%, 4.5% 20%, 7% 80%, 9.5% 30%, 12% 90%, 14.5% 25%,
    17% 70%, 19.5% 15%, 22% 85%, 24.5% 35%, 27% 75%, 29.5% 20%,
    32% 65%, 34.5% 10%, 37% 80%, 39.5% 30%, 42% 70%, 44.5% 15%,
    47% 90%, 49.5% 40%, 52% 75%, 54.5% 20%, 57% 60%, 59.5% 10%,
    62% 80%, 64.5% 35%, 67% 70%, 69.5% 20%, 72% 85%, 74.5% 30%,
    77% 65%, 79.5% 15%, 82% 75%, 84.5% 25%, 87% 80%, 89.5% 20%,
    92% 90%, 94.5% 35%, 97% 65%, 100% 20%, 100% 0%
  );
  border-left: 1px solid var(--border);
  border-right: 1px solid var(--border);
  position: relative; top: -1px;
}

.legend {
  display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0 0; padding-top: 12px;
  border-top: 1px solid var(--border);
}
.leg-item { display: flex; align-items: center; gap: 4px; font-size: 9.5px; color: var(--muted-foreground); }
.leg-swatch { width: 20px; height: 3px; border-radius: 2px; }

.rule-panel {
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}
.rule-header {
  background: var(--secondary);
  border-bottom: 1px solid var(--border);
  padding: 8px 16px;
  font-size: 10px; font-family: monospace;
  color: var(--muted-foreground);
  display: flex; align-items: center; gap: 8px;
}
.badge-plum {
  font-size: 9px; padding: 2px 8px; border-radius: 99px;
  font-family: monospace;
  background: #EDD6E8; color: #5a2450;
}
.rule-grid { display: grid; grid-template-columns: 120px 1fr; }
.rule-triggers {
  padding: 12px 10px; background: var(--secondary);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column; gap: 5px;
}
.rule-triggers-label { font-size: 9px; font-family: monospace; color: var(--muted-foreground); margin-bottom: 3px; letter-spacing: 0.08em; }
.rule-tag { font-size: 9px; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-weight: 500; display: inline-block; }
.rule-code {
  padding: 12px 16px; font-family: monospace; font-size: 10.5px;
  line-height: 1.85; color: var(--foreground); background: white;
}
.cm { color: var(--muted-foreground); font-style: italic; }
.kw { color: #7A3E6A; font-weight: 500; }
.val { color: #3B6D11; }
.nc { color: #C8922E; }
.out { color: #2E5B9A; }
</style>
