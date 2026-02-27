/* ═══════════════════════════════════════════════════
   Smart Agriculture AI — Unified Frontend Logic
   1. Tab navigation
   2. AI Crop Advisory (rule-based local prediction → AI advisory)
   3. Yield Prediction (ML model via Flask)
   4. Chain feature: Advisory → Yield
═══════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────
   CROP DATASET (rule-based prediction)
───────────────────────────────────── */
// ================= DATASET (realistic averages) =================
const crops = [
  { name: "rice", N: 120, P: 40, K: 40, temp: 27, humidity: 85, rainfall: 1400, ph: 6.2 },
  { name: "maize", N: 150, P: 60, K: 40, temp: 25, humidity: 65, rainfall: 700, ph: 6.3 },
  { name: "wheat", N: 120, P: 50, K: 40, temp: 20, humidity: 60, rainfall: 450, ph: 6.5 },
  { name: "barley", N: 90, P: 40, K: 40, temp: 18, humidity: 55, rainfall: 400, ph: 6.5 },
  { name: "sorghum", N: 100, P: 40, K: 40, temp: 30, humidity: 50, rainfall: 500, ph: 6.2 },
  { name: "millet", N: 80, P: 40, K: 40, temp: 29, humidity: 45, rainfall: 350, ph: 6.3 },
  { name: "cotton", N: 150, P: 60, K: 60, temp: 28, humidity: 65, rainfall: 700, ph: 6.5 },
  { name: "sugarcane", N: 250, P: 115, K: 115, temp: 28, humidity: 80, rainfall: 1500, ph: 6.8 },
  { name: "potato", N: 120, P: 100, K: 120, temp: 18, humidity: 70, rainfall: 600, ph: 5.8 },
  { name: "tomato", N: 180, P: 120, K: 150, temp: 25, humidity: 65, rainfall: 600, ph: 6.2 },
  { name: "onion", N: 120, P: 75, K: 125, temp: 22, humidity: 60, rainfall: 500, ph: 6.3 },
  { name: "cabbage", N: 150, P: 125, K: 100, temp: 18, humidity: 75, rainfall: 600, ph: 6.5 },
  { name: "cauliflower", N: 150, P: 100, K: 100, temp: 17, humidity: 75, rainfall: 600, ph: 6.5 },
  { name: "brinjal", N: 180, P: 150, K: 120, temp: 26, humidity: 70, rainfall: 650, ph: 6.3 },
  { name: "okra", N: 100, P: 50, K: 50, temp: 28, humidity: 65, rainfall: 600, ph: 6.5 },
  { name: "soybean", N: 30, P: 60, K: 40, temp: 25, humidity: 65, rainfall: 650, ph: 6.4 },
  { name: "groundnut", N: 25, P: 50, K: 75, temp: 27, humidity: 60, rainfall: 550, ph: 6.3 },
  { name: "lentil", N: 20, P: 40, K: 20, temp: 20, humidity: 55, rainfall: 400, ph: 6.5 },
  { name: "chickpea", N: 20, P: 50, K: 40, temp: 22, humidity: 50, rainfall: 400, ph: 6.6 },
  { name: "peas", N: 25, P: 75, K: 60, temp: 18, humidity: 65, rainfall: 450, ph: 6.5 },
  { name: "banana", N: 300, P: 150, K: 300, temp: 27, humidity: 85, rainfall: 2000, ph: 6.5 },
  { name: "mango", N: 75, P: 20, K: 70, temp: 27, humidity: 60, rainfall: 800, ph: 6.5 },
  { name: "apple", N: 200, P: 200, K: 200, temp: 15, humidity: 65, rainfall: 900, ph: 6.5 },
  { name: "grapes", N: 300, P: 300, K: 600, temp: 25, humidity: 60, rainfall: 600, ph: 6.7 },
  { name: "pomegranate", N: 250, P: 125, K: 250, temp: 26, humidity: 55, rainfall: 500, ph: 6.8 },
  { name: "coffee", N: 120, P: 40, K: 120, temp: 22, humidity: 80, rainfall: 1800, ph: 6.0 },
  { name: "tea", N: 100, P: 40, K: 100, temp: 20, humidity: 85, rainfall: 2000, ph: 5.5 },
  { name: "turmeric", N: 150, P: 60, K: 108, temp: 25, humidity: 80, rainfall: 1500, ph: 6.0 },
  { name: "ginger", N: 80, P: 50, K: 80, temp: 24, humidity: 80, rainfall: 1500, ph: 6.0 },
  { name: "garlic", N: 40, P: 75, K: 75, temp: 20, humidity: 60, rainfall: 500, ph: 6.3 }
];


// ================= UPDATED predictCrop (same name & params) =================
function predictCrop(N, P, K, temp, humidity, rainfall, ph) {

  let best = null;
  let bestScore = Infinity;

  crops.forEach(crop => {

    const score =
      Math.abs(N - crop.N) / crop.N +
      Math.abs(P - crop.P) / crop.P +
      Math.abs(K - crop.K) / crop.K +
      Math.abs(temp - crop.temp) / crop.temp +
      Math.abs(humidity - crop.humidity) / crop.humidity +
      Math.abs(rainfall - crop.rainfall) / crop.rainfall +
      Math.abs(ph - crop.ph) / crop.ph;

    if (score < bestScore) {
      bestScore = score;
      best = crop.name;
    }

  });

  return best; // same return type as before
}

/* ─────────────────────────────────────
   STATE
───────────────────────────────────── */
let currentCrop = null;
let currentClimateData = {};

/* ─────────────────────────────────────
   DOM REFS
───────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const advisorBtn = document.getElementById('advisorBtn');
const cropBadge = document.getElementById('cropBadge');
const badgeEmoji = document.getElementById('badgeEmoji');
const badgeName = document.getElementById('badgeCropName');
const emptyState = document.getElementById('emptyState');
const advPanel = document.getElementById('advisoryPanel');
const advGrid = document.getElementById('advisoryGrid');
const advEmoji = document.getElementById('advEmoji');
const advCropName = document.getElementById('advCropName');
const advOverview = document.getElementById('advOverview');
const chainBtn = document.getElementById('chainBtn');
const toast = document.getElementById('toast');

/* ─────────────────────────────────────
   TABS
───────────────────────────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ─────────────────────────────────────
   THEME
───────────────────────────────────── */
themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'light' : 'dark';
  themeToggle.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('agriTheme', document.documentElement.dataset.theme);
});

const savedTheme = localStorage.getItem('agriTheme');
if (savedTheme) {
  document.documentElement.dataset.theme = savedTheme;
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

/* ─────────────────────────────────────
   CHAIN: Advisor → Yield Tab
───────────────────────────────────── */
function chainToYield() {
  if (!currentCrop) return;
  // Switch to yield tab
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector('[data-tab="yield"]').classList.add('active');
  document.getElementById('tab-yield').classList.add('active');

  // Pre-fill what we can from advisory data
  if (currentClimateData.rainfall)
    document.getElementById('yRainfall').value = currentClimateData.rainfall;
  if (currentClimateData.temp)
    document.getElementById('yTemp').value = currentClimateData.temp;

  // Set current year
  document.getElementById('yYear').value = new Date().getFullYear();

  showToast(`✅ Switched to Yield tab. Select your country and crop to predict yield.`, 'success');
  document.getElementById('tab-yield').scrollIntoView({ behavior: 'smooth' });
}

/* ═══════════════════════════════════════════════
   1. ADVISORY FLOW
═══════════════════════════════════════════════ */
async function runAdvisory() {
  const N = parseFloat(document.getElementById('N').value);
  const P = parseFloat(document.getElementById('P').value);
  const K = parseFloat(document.getElementById('K').value);
  const temp = parseFloat(document.getElementById('temp').value);
  const humidity = parseFloat(document.getElementById('humidity').value);
  const rainfall = parseFloat(document.getElementById('rainfall').value);
  const ph = parseFloat(document.getElementById('ph').value);

  if ([N, P, K, temp, humidity, rainfall, ph].some(v => isNaN(v))) {
    showToast('⚠️ Please fill in all fields before analyzing.', 'error');
    return;
  }

  // Store climate data for chaining
  currentClimateData = { temp, humidity, rainfall };

  const crop = predictCrop(N, P, K, temp, humidity, rainfall, ph);

  if (!crop) {
    showToast('❌ No matching crop found for these values. Try adjusting your inputs.', 'error');
    resetAdvisory();
    return;
  }

  currentCrop = crop;

  // Show badge
  badgeName.textContent = cap(crop);
  badgeEmoji.textContent = '🌱';
  cropBadge.classList.add('show');
  chainBtn.style.display = 'block';

  // Loading state
  setLoading(advisorBtn, true, 'Fetching Advisory...');
  showSkeleton(crop);

  try {
    const advisory = await fetchAdvisory(crop);
    renderAdvisory(advisory);
  } catch (err) {
    showToast(`❌ ${err.message}`, 'error');
    resetAdvisory();
  } finally {
    setLoading(advisorBtn, false, '🔍 Analyze & Get Advisory');
  }
}

async function fetchAdvisory(crop) {
  const response = await fetch('/api/advisory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crop })
  });
  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.error || 'Failed to fetch advisory.');
  return data.advisory;
}

function showSkeleton(crop) {
  emptyState.style.display = 'none';
  advPanel.classList.add('show');
  advEmoji.textContent = '🌱';
  advCropName.textContent = cap(crop);
  advOverview.textContent = 'Generating AI advisory…';
  advGrid.innerHTML = Array(8).fill(0).map(() => `
    <div class="adv-card">
      <div class="skeleton" style="width:40px;height:40px;border-radius:10px;margin-bottom:14px;"></div>
      <div class="skeleton" style="height:13px;width:55%;margin-bottom:12px;"></div>
      <div class="skeleton" style="height:10px;width:100%;margin-bottom:8px;"></div>
      <div class="skeleton" style="height:10px;width:82%;margin-bottom:8px;"></div>
      <div class="skeleton" style="height:10px;width:68%;"></div>
    </div>
  `).join('');
}

function renderAdvisory(a) {
  if (!a) return;
  advEmoji.textContent = a.emoji || '🌱';
  advCropName.textContent = cap(a.crop || currentCrop);
  advOverview.textContent = a.overview || '';
  badgeEmoji.textContent = a.emoji || '🌱';
  advGrid.innerHTML = '';

  advGrid.appendChild(makeCard({
    icon: '☀️', iconClass: 'icon-amber', title: a.best_season?.title || 'Best Season',
    html: `<div class="primary-badge">${esc(a.best_season?.primary || '')}</div>
          <p style="font-size:13px;color:var(--text-secondary);line-height:1.5;">${esc(a.best_season?.details || '')}</p>`
  }));

  advGrid.appendChild(makeCard({
    icon: '📊', iconClass: 'icon-green', title: a.yield_info?.title || 'Expected Yield',
    html: `<div class="yield-stats">
            <div class="yield-stat"><div class="yield-stat-label">Avg. Yield</div><div class="yield-stat-value">${esc(a.yield_info?.average || 'N/A')}</div></div>
            <div class="yield-stat"><div class="yield-stat-label">Market Value</div><div class="yield-stat-value">${esc(a.yield_info?.market || 'N/A')}</div></div>
          </div>` }));

  advGrid.appendChild(makeCard({
    icon: '🧪', iconClass: 'icon-teal', title: a.fertilizers?.title || 'Best Fertilizers',
    html: `<div class="primary-badge">${esc(a.fertilizers?.primary || '')}</div>${makeList(a.fertilizers?.list || [], 'var(--teal)')}`
  }));

  advGrid.appendChild(makeCard({
    icon: '🐛', iconClass: 'icon-red', title: a.insecticides?.title || 'Pest & Disease Control',
    html: `<div class="primary-badge">${esc(a.insecticides?.primary || '')}</div>${makeList(a.insecticides?.list || [], 'var(--red)')}`
  }));

  advGrid.appendChild(makeCard({
    icon: '🌡️', iconClass: 'icon-blue', title: a.conditions?.title || 'Ideal Conditions',
    html: `<div class="conditions-grid">${buildConditions(a.conditions)}</div>`
  }));

  advGrid.appendChild(makeCard({
    icon: '🚜', iconClass: 'icon-orange', title: a.techniques?.title || 'Best Farming Techniques',
    html: makeList(a.techniques?.list || [], 'var(--amber)')
  }));

  advGrid.appendChild(makeCard({
    icon: '⚠️', iconClass: 'icon-amber', title: a.precautions?.title || 'Key Precautions',
    html: makeList(a.precautions?.list || [], 'var(--amber)')
  }));

  advGrid.appendChild(makeCard({
    icon: '💡', iconClass: 'icon-purple', title: a.care_tips?.title || 'Care & Pro Tips',
    html: makeList(a.care_tips?.list || [], 'var(--purple)')
  }));

  advGrid.appendChild(makeCard({
    icon: '📅', iconClass: 'icon-green', title: a.timeline?.title || 'Crop Timeline',
    fullWidth: true, html: buildTimeline(a.timeline?.phases || [])
  }));

  advPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ═══════════════════════════════════════════════
   2. YIELD PREDICTION FLOW
═══════════════════════════════════════════════ */
async function runYieldPrediction() {
  const Year = document.getElementById('yYear').value.trim();
  const rainfall = document.getElementById('yRainfall').value.trim();
  const pesticides = document.getElementById('yPesticides').value.trim();
  const temp = document.getElementById('yTemp').value.trim();
  const area = document.getElementById('yArea').value.trim();
  const item = document.getElementById('yItem').value.trim();

  // Hide previous results
  document.getElementById('yieldResult').style.display = 'none';
  document.getElementById('yieldError').style.display = 'none';

  if (!Year || !rainfall || !pesticides || !temp || !area || !item) {
    showYieldError('Please fill in all fields before predicting.');
    return;
  }

  setLoading(document.getElementById('yieldBtn'), true, 'Predicting...');

  try {
    const formData = new FormData();
    formData.append('Year', Year);
    formData.append('average_rain_fall_mm_per_year', rainfall);
    formData.append('pesticides_tonnes', pesticides);
    formData.append('avg_temp', temp);
    formData.append('Area', area);
    formData.append('Item', item);

    const response = await fetch('/predict', { method: 'POST', body: formData });
    const data = await response.json();

    if (!data.success) {
      showYieldError(data.error);
      return;
    }

    // Show result
    document.getElementById('yieldKg').textContent = data.predicted_yield_kg.toLocaleString() + ' kg';
    document.getElementById('yieldHg').textContent = data.predicted_yield_hg.toLocaleString();
    document.getElementById('yieldCropDisplay').textContent = data.matched_item;
    document.getElementById('yieldAreaDisplay').textContent = data.matched_area;
    document.getElementById('yieldResult').style.display = 'block';

    showToast(`✅ Yield predicted for ${data.matched_item} in ${data.matched_area}!`, 'success');
  } catch (err) {
    showYieldError('Network error. Please make sure the server is running.');
  } finally {
    setLoading(document.getElementById('yieldBtn'), false, '📈 Predict Yield');
  }
}

function showYieldError(msg) {
  const el = document.getElementById('yieldError');
  document.getElementById('yieldErrorMsg').textContent = msg;
  el.style.display = 'flex';
  showToast('⚠️ ' + msg, 'error');
}

/* ─────────────────────────────────────
   CARD / LIST / TIMELINE BUILDERS
───────────────────────────────────── */
function makeCard({ icon, iconClass, title, html, fullWidth = false }) {
  const div = document.createElement('div');
  div.className = 'adv-card' + (fullWidth ? ' full-width' : '');
  div.innerHTML = `<div class="adv-card-icon ${iconClass}">${icon}</div><h3>${esc(title)}</h3>${html}`;
  return div;
}

function makeList(items, borderColor = 'var(--green-500)') {
  if (!items.length) return '<p style="color:var(--text-muted);font-size:13px;">No data available.</p>';
  return `<ul class="adv-list">${items.map(i => `<li style="border-left-color:${borderColor}">${esc(i)}</li>`).join('')}</ul>`;
}

function buildConditions(cond) {
  if (!cond) return '';
  return [
    { label: '🪨 Soil', value: cond.soil },
    { label: '💧 Water', value: cond.water },
    { label: '☀️ Sunlight', value: cond.sunlight },
    { label: '📏 Spacing', value: cond.spacing },
  ].map(f => `
    <div class="condition-item">
      <div class="condition-label">${f.label}</div>
      <div class="condition-value">${esc(f.value || 'N/A')}</div>
    </div>`).join('');
}

function buildTimeline(phases) {
  if (!phases.length) return '<p style="color:var(--text-muted);font-size:13px;">No timeline data.</p>';
  return `<div class="timeline">${phases.map(p => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-phase">
        <span class="timeline-phase-name">${esc(p.phase)}</span>
        <span class="timeline-duration">${esc(p.duration)}</span>
      </div>
      <div class="timeline-details">${esc(p.details)}</div>
    </div>`).join('')}</div>`;
}

/* ─────────────────────────────────────
   UTILS
───────────────────────────────────── */
function resetAdvisory() {
  advPanel.classList.remove('show');
  emptyState.style.display = '';
  cropBadge.classList.remove('show');
  chainBtn.style.display = 'none';
  currentCrop = null;
}

function setLoading(btn, isLoading, text) {
  if (isLoading) {
    btn.classList.add('loading');
    btn.querySelector('.btn-text').textContent = text;
  } else {
    btn.classList.remove('loading');
    btn.querySelector('.btn-text').textContent = text;
  }
}

let toastTimer;
function showToast(msg, type = '') {
  toast.textContent = msg;
  toast.className = `toast show${type ? ' ' + type : ''}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function esc(s) {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
