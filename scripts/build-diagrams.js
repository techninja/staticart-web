/**
 * Render mermaid diagrams to SVG using shared config.
 * Usage: node scripts/build-diagrams.js [--watch]
 * @module scripts/build-diagrams
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, watch } from 'node:fs';
import { join } from 'node:path';

const ASSETS = join(import.meta.dirname, '..', 'src', 'assets');
const CONFIG = join(ASSETS, 'mermaid-config.json');

function buildAll() {
  const sources = readdirSync(ASSETS).filter((f) => f.endsWith('.mmd'));

  if (!sources.length) {
    console.log('No .mmd files found in src/assets/');
    return;
  }

  for (const file of sources) {
  const input = join(ASSETS, file);
  const output = join(ASSETS, file.replace('.mmd', '.svg'));

  execSync(
    `npx @mermaid-js/mermaid-cli -i "${input}" -o "${output}" --backgroundColor transparent --configFile "${CONFIG}"`,
    { stdio: 'inherit' },
  );

  let svg = readFileSync(output, 'utf8');

  // Round all rect corners
  svg = svg.replace(/<rect([^>]*?)\/>/g, (match, attrs) => {
    if (attrs.includes('rx=') || !attrs.includes('width=')) return match;
    return `<rect${attrs} rx="6" ry="6"/>`;
  });

  // Enlarge arrowheads
  svg = svg.replace(
    /markerWidth="8" markerHeight="8"/g,
    'markerWidth="16" markerHeight="16"',
  );
  svg = svg.replace(
    /markerWidth="10\.5" markerHeight="14"/g,
    'markerWidth="20" markerHeight="24"',
  );
  svg = svg.replace(
    /markerWidth="11" markerHeight="11"/g,
    'markerWidth="18" markerHeight="18"',
  );

  // Thicken edge strokes to match larger arrowheads
  svg = svg.replace(
    /#my-svg .edgePath .path\{stroke:#475569;stroke-width:1px;\}/g,
    '#my-svg .edgePath .path{stroke:#475569;stroke-width:1.5px;}',
  );
  svg = svg.replace(
    /#my-svg .flowchart-link\{stroke:#475569;fill:none;\}/g,
    '#my-svg .flowchart-link{stroke:#475569;fill:none;stroke-width:1.5px;}',
  );

  // Cluster fills — opaque now that edges render on top
  svg = svg.replace(
    /#my-svg .cluster rect\{fill:transparent;/g,
    '#my-svg .cluster rect{fill:#f1f5f9;',
  );

  // Reorder SVG: move edgePaths and edgeLabels after clusters so arrows render on top
  svg = svg.replace(
    /(<g class="edgePaths">.*?<\/g>)\s*(<g class="edgeLabels">.*?<\/g>)\s*(<g class="nodes">)/gs,
    '$3$1$2',
  );

  // Bold + larger cluster labels with enough room
  svg = svg.replace(
    /class="cluster-label"/g,
    'class="cluster-label" style="font-weight:600;font-size:15px"',
  );
  // Widen foreignObject for bold text
  svg = svg.replace(
    /(class="cluster-label"[^<]*<foreignObject[^>]*?)width="([\d.]+)" height="(\d+)"/g,
    (match, prefix, w, h) => {
      const newW = Math.ceil(parseFloat(w) * 1.25);
      return `${prefix}width="${newW}" height="30"`;
    },
  );

  writeFileSync(output, svg);
  console.log(`✓ ${file} → ${file.replace('.mmd', '.svg')}`);
  }
}

buildAll();

if (process.argv.includes('--watch')) {
  let timeout;
  const rebuild = (eventType, filename) => {
    if (!filename?.endsWith('.mmd') && filename !== 'mermaid-config.json') return;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log(`\n⟳ ${filename} changed, rebuilding…`);
      try {
        buildAll();
      } catch (err) {
        console.error(`✗ Build failed: ${err.message}`);
      }
    }, 300);
  };

  watch(ASSETS, rebuild);
  console.log('\nWatching src/assets/ for .mmd and config changes…');
}
