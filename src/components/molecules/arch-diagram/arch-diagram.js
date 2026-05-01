/**
 * Architecture diagram — CSS grid layout with SVG arrow overlay.
 * @module components/molecules/arch-diagram
 */

import { html, define } from 'hybrids';
import '#atoms/app-icon/index.js';

/**
 * Create an SVG marker definition.
 * @param {SVGElement} svg
 * @param {string} id
 * @param {string} color
 */
function ensureMarker(svg, id, color) {
  if (svg.querySelector(`#${id}`)) return;
  let defs = svg.querySelector('defs');
  if (!defs) {
    defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.insertBefore(defs, svg.firstChild);
  }
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  Object.entries({
    id, viewBox: '0 0 10 10', refX: '9', refY: '5',
    markerWidth: '8', markerHeight: '8', orient: 'auto-start-reverse',
  }).forEach(([k, v]) => marker.setAttribute(k, v));
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
  path.setAttribute('fill', color);
  marker.appendChild(path);
  defs.appendChild(marker);
}

/**
 * Get a point on the edge of an element relative to the SVG container.
 * @param {DOMRect} container
 * @param {Element} el
 * @param {'top'|'bottom'|'left'|'right'} side
 * @param {number} gap
 */
function edgePoint(container, el, side, gap = 6) {
  const r = el.getBoundingClientRect();
  const x = r.left - container.left;
  const y = r.top - container.top;
  switch (side) {
    case 'top': return { x: x + r.width / 2, y: y - gap };
    case 'bottom': return { x: x + r.width / 2, y: y + r.height + gap };
    case 'left': return { x: x - gap, y: y + r.height / 2 };
    case 'right': return { x: x + r.width + gap, y: y + r.height / 2 };
    default: return { x: x + r.width / 2, y };
  }
}

/**
 * Add a path element to the SVG.
 * @param {SVGElement} svg
 * @param {string} d
 * @param {Object} opts
 */
function addPath(svg, d, { color = '#475569', width = '1.5', bidirectional = false } = {}) {
  const markerId = `arrow-${color.replace('#', '')}`;
  ensureMarker(svg, markerId, color);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', width);
  path.setAttribute('fill', 'none');
  path.setAttribute('marker-end', `url(#${markerId})`);
  if (bidirectional) path.setAttribute('marker-start', `url(#${markerId})`);
  svg.appendChild(path);
}

/**
 * Add a label to the SVG.
 * @param {SVGElement} svg
 * @param {number} x
 * @param {number} y
 * @param {string} text
 * @param {Object} opts
 */
function addLabel(svg, x, y, text, { color = '#475569', anchor = 'start' } = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  Object.entries({
    x, y, 'font-size': '12', fill: color, 'text-anchor': anchor,
    stroke: 'var(--color-surface, #fff)', 'stroke-width': '3',
    'paint-order': 'stroke', 'font-family': 'system-ui, -apple-system, sans-serif',
  }).forEach(([k, v]) => el.setAttribute(k, v));
  el.textContent = text;
  svg.appendChild(el);
}

/** @param {HTMLElement} host */
function drawAllArrows(host) {
  const svg = host.querySelector('.arch-diagram__arrows');
  if (!svg || window.innerWidth < 640) return;

  while (svg.lastChild) svg.removeChild(svg.lastChild);

  const box = svg.getBoundingClientRect();
  const el = (id) => host.querySelector(`[data-arch="${id}"]`);
  const db = el('db-group');
  const api = el('api-group');
  const checkout = el('checkout');
  const rebuild = el('rebuild');
  const cdn = el('cdn-group');
  if (!db || !api || !checkout || !rebuild || !cdn) return;

  // DB ↔ API (stock & orders) — horizontal bidirectional
  const dbR = edgePoint(box, db, 'right');
  const apiL = edgePoint(box, api, 'left');
  const midX = (dbR.x + apiL.x) / 2;
  const midY = Math.min(dbR.y, apiL.y);
  addPath(svg, `M ${dbR.x} ${dbR.y} L ${apiL.x} ${apiL.y}`, { bidirectional: true });
  addLabel(svg, midX, midY - 6, 'Stock & Orders', { anchor: 'middle' });

  // DB → Build Trigger (stock changed) — vertical
  const dbB = edgePoint(box, db, 'bottom');
  const rebT = edgePoint(box, rebuild, 'top');
  addPath(svg, `M ${dbB.x} ${dbB.y} L ${rebT.x} ${rebT.y}`);
  addLabel(svg, dbB.x + 8, (dbB.y + rebT.y) / 2 + 4, 'Stock Changed');

  // Build Trigger → CDN (deploy) — vertical, route through midpoint
  const rebB = edgePoint(box, rebuild, 'bottom');
  const cdnT = edgePoint(box, cdn, 'top');
  const deployMidY = (rebB.y + cdnT.y) / 2;
  addPath(svg, `M ${rebB.x} ${rebB.y} L ${rebB.x} ${deployMidY} L ${cdnT.x} ${deployMidY} L ${cdnT.x} ${cdnT.y}`);
  addLabel(svg, Math.min(rebB.x, cdnT.x) + 8, deployMidY - 6, 'Deploy');

  // CDN → POST /checkout (golden) — route up through right gutter
  const cdnR = edgePoint(box, cdn, 'right');
  const chkR = edgePoint(box, checkout, 'right');
  const gutterX = Math.max(cdnR.x, chkR.x) + 14;
  addPath(
    svg,
    `M ${cdnR.x} ${cdnR.y} L ${gutterX} ${cdnR.y} L ${gutterX} ${chkR.y} L ${chkR.x} ${chkR.y}`,
    { color: '#d97706', width: '2' },
  );
}

export default define({
  tag: 'arch-diagram',
  arrows: {
    value: false,
    connect(host, _key, invalidate) {
      const draw = () => {
        drawAllArrows(host);
        host.arrows = true;
        invalidate();
      };
      requestAnimationFrame(() => requestAnimationFrame(draw));
      const onResize = () => requestAnimationFrame(draw);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    },
  },
  render: {
    value: () => html`
      <div class="arch-diagram">
        <svg class="arch-diagram__arrows" xmlns="http://www.w3.org/2000/svg"></svg>

        <div class="arch-diagram__left">
          <div class="arch-diagram__group" data-arch="db-group">
            <div class="arch-diagram__group-title">
              <app-icon name="database" size="sm"></app-icon> Database
            </div>
            <div class="arch-diagram__node">DynamoDB</div>
          </div>

          <div class="arch-diagram__flow-label">↓ Stock Changed</div>

          <div class="arch-diagram__node" data-arch="rebuild">
            <app-icon name="hammer" size="sm"></app-icon>
            Build Trigger (GitHub Actions)
          </div>
        </div>

        <div class="arch-diagram__group" data-arch="api-group">
          <div class="arch-diagram__group-title">
            <app-icon name="server" size="sm"></app-icon> API (Lambda)
          </div>
          <div class="arch-diagram__api-list">
            <div class="arch-diagram__node arch-diagram__node--checkout" data-arch="checkout">
              POST /checkout
            </div>
            <div class="arch-diagram__node">POST /webhook</div>
            <div class="arch-diagram__node">GET /stock</div>
            <div class="arch-diagram__node">GET /orders</div>
            <div class="arch-diagram__node">GET /session</div>
          </div>
        </div>

        <div class="arch-diagram__flow-label">↓ Deploy</div>
        <div class="arch-diagram__checkout-label">
          <app-icon name="shopping-cart" size="sm"></app-icon> Checkout ↑
        </div>

        <div class="arch-diagram__group arch-diagram__group--cdn" data-arch="cdn-group">
          <div class="arch-diagram__group-title">
            <app-icon name="globe" size="sm"></app-icon> Static Site (CDN)
          </div>
          <div class="arch-diagram__cdn-row">
            <div class="arch-diagram__node">Product pages</div>
            <div class="arch-diagram__node">Cart (localStorage)</div>
            <div class="arch-diagram__node">SPA (Hybrids.js)</div>
          </div>
        </div>
      </div>
    `,
    shadow: false,
  },
});
