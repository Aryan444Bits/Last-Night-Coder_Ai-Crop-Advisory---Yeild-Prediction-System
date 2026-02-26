/* =============================================
   FarmAI – app.js
   SPA Router + Advisory & Yield UI Logic
   ============================================= */

'use strict';

// ROUTER

const PAGES = { home: 'page-home', advisory: 'page-advisory', yield: 'page-yield' };

function navigate(pageKey) {
    const key = PAGES[pageKey] ? pageKey : 'home';
    Object.entries(PAGES).forEach(([k, id]) => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.toggle('active', k === key);
            if (k === key) el.classList.add('page-transition');
        }
    });
    document.querySelectorAll('[data-page]').forEach(link => {
        link.classList.toggle('active', link.dataset.page === key);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
}

window.addEventListener('DOMContentLoaded', () => {
    const hash = location.hash.replace('#', '');
    navigate(hash || 'home');
});

document.addEventListener('click', e => {
    const link = e.target.closest('[data-page]');
    if (!link) return;
    e.preventDefault();
    const page = link.dataset.page;
    history.pushState({}, '', '#' + page);
    navigate(page);
});

window.addEventListener('popstate', () => {
    const hash = location.hash.replace('#', '');
    navigate(hash || 'home');
});

//  NAVBAR / HAMBURGER

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const open = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', open);
});

function closeMenu() { navLinks.classList.remove('open'); }

window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', scrollY > 10);
});


//  PARTICLES

(function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 3 + 1;
        Object.assign(p.style, {
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            width: size + 'px',
            height: size + 'px',
            animationDuration: (Math.random() * 18 + 10) + 's',
            animationDelay: (Math.random() * 12) + 's',
        });
        container.appendChild(p);
    }
})();


//  COUNTER ANIMATION

function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
        const target = +el.dataset.target;
        const dur = 1800;
        const step = 16;
        const inc = target / (dur / step);
        let cur = 0;
        const id = setInterval(() => {
            cur += inc;
            if (cur >= target) { el.textContent = target; clearInterval(id); }
            else { el.textContent = Math.floor(cur); }
        }, step);
    });
}

// Observe hero for counter trigger
const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); heroObserver.disconnect(); }
}, { threshold: 0.3 });
const heroEl = document.querySelector('.hero');
if (heroEl) heroObserver.observe(heroEl);


// TYPEWRITER
const TYPEWRITER_PHRASES = [
    'Powered by AI',
    '& Yield Prediction',
    'for Smarter Farming',
    'Backed by Data',
];
let twIdx = 0, twChar = 0, twDeleting = false;
const twEl = document.getElementById('typewriter');

function typeWrite() {
    if (!twEl) return;
    const phrase = TYPEWRITER_PHRASES[twIdx];
    twEl.textContent = phrase.slice(0, twChar);
    if (!twDeleting) {
        twChar++;
        if (twChar > phrase.length) { twDeleting = true; setTimeout(typeWrite, 1600); return; }
    } else {
        twChar--;
        if (twChar === 0) { twDeleting = false; twIdx = (twIdx + 1) % TYPEWRITER_PHRASES.length; }
    }
    setTimeout(typeWrite, twDeleting ? 45 : 80);
}
typeWrite();

// SLIDER ↔ INPUT SYNC

const SLIDER_PAIRS = [
    ['nitrogen', 'nitrogen-slider'],
    ['phosphorus', 'phosphorus-slider'],
    ['potassium', 'potassium-slider'],
    ['temperature', 'temperature-slider'],
    ['humidity', 'humidity-slider'],
    ['ph', 'ph-slider'],
    ['rainfall', 'rainfall-slider'],
    ['yield-rainfall', 'yield-rainfall-slider'],
    ['yield-temp', 'yield-temp-slider'],
];

SLIDER_PAIRS.forEach(([inputId, sliderId]) => {
    const inp = document.getElementById(inputId);
    const sld = document.getElementById(sliderId);
    if (!inp || !sld) return;
    sld.addEventListener('input', () => { inp.value = sld.value; if (inputId === 'ph') updatePH(sld.value); });
    inp.addEventListener('input', () => { sld.value = inp.value; if (inputId === 'ph') updatePH(inp.value); });
});

function updatePH(val) {
    const indicator = document.getElementById('ph-indicator');
    if (!indicator) return;
    const pct = ((val - 3.5) / (9.5 - 3.5)) * 100;
    indicator.style.left = Math.min(100, Math.max(0, pct)) + '%';
}

// CROP DATA

const CROP_DB = {
    rice: { emoji: '🌾', scientific: 'Oryza sativa', baseYield: 3.8, color: '#38bd6c' },
    maize: { emoji: '🌽', scientific: 'Zea mays', baseYield: 4.5, color: '#f0a500' },
    wheat: { emoji: '🌾', scientific: 'Triticum aestivum', baseYield: 3.2, color: '#d4a017' },
    chickpea: { emoji: '🫘', scientific: 'Cicer arietinum', baseYield: 1.4, color: '#c8a45a' },
    kidneybeans: { emoji: '🫘', scientific: 'Phaseolus vulgaris', baseYield: 1.2, color: '#8b4513' },
    pigeonpeas: { emoji: '🫘', scientific: 'Cajanus cajan', baseYield: 1.0, color: '#b08050' },
    mothbeans: { emoji: '🫘', scientific: 'Vigna aconitifolia', baseYield: 0.8, color: '#a09060' },
    mungbean: { emoji: '🫘', scientific: 'Vigna radiata', baseYield: 1.1, color: '#78a050' },
    blackgram: { emoji: '🫘', scientific: 'Vigna mungo', baseYield: 0.9, color: '#444' },
    lentil: { emoji: '🫘', scientific: 'Lens culinaris', baseYield: 1.3, color: '#c8813a' },
    pomegranate: { emoji: '🍎', scientific: 'Punica granatum', baseYield: 8.5, color: '#e63946' },
    banana: { emoji: '🍌', scientific: 'Musa acuminata', baseYield: 22.0, color: '#ffe05d' },
    mango: { emoji: '🥭', scientific: 'Mangifera indica', baseYield: 10.0, color: '#f4a022' },
    grapes: { emoji: '🍇', scientific: 'Vitis vinifera', baseYield: 15.0, color: '#9b59b6' },
    watermelon: { emoji: '🍉', scientific: 'Citrullus lanatus', baseYield: 30.0, color: '#2ecc71' },
    muskmelon: { emoji: '🍈', scientific: 'Cucumis melo', baseYield: 14.0, color: '#f9c74f' },
    apple: { emoji: '🍎', scientific: 'Malus domestica', baseYield: 8.0, color: '#e63946' },
    orange: { emoji: '🍊', scientific: 'Citrus sinensis', baseYield: 20.0, color: '#f77f00' },
    papaya: { emoji: '🧡', scientific: 'Carica papaya', baseYield: 25.0, color: '#f4a261' },
    coconut: { emoji: '🥥', scientific: 'Cocos nucifera', baseYield: 5.0, color: '#8d6748' },
    cotton: { emoji: '🌿', scientific: 'Gossypium hirsutum', baseYield: 1.8, color: '#f9f9f9' },
    jute: { emoji: '🌿', scientific: 'Corchorus capsularis', baseYield: 2.5, color: '#a8c256' },
    coffee: { emoji: '☕', scientific: 'Coffea arabica', baseYield: 0.8, color: '#6b3f20' },
};

const CROP_CONDITIONS = {
    rice: { N: [60, 110], P: [30, 55], K: [30, 55], T: [20, 35], H: [75, 95], pH: [5.5, 7.0], R: [150, 300] },
    maize: { N: [60, 100], P: [35, 60], K: [15, 50], T: [18, 28], H: [55, 80], pH: [5.5, 7.5], R: [50, 200] },
    wheat: { N: [60, 100], P: [40, 70], K: [40, 80], T: [10, 22], H: [40, 70], pH: [6.0, 7.5], R: [30, 150] },
    chickpea: { N: [0, 40], P: [55, 115], K: [70, 140], T: [15, 27], H: [14, 50], pH: [5.5, 7.0], R: [20, 90] },
    kidneybeans: { N: [0, 25], P: [55, 115], K: [15, 35], T: [18, 28], H: [45, 75], pH: [5.5, 7.0], R: [40, 120] },
    pigeonpeas: { N: [0, 40], P: [55, 100], K: [15, 35], T: [20, 30], H: [30, 70], pH: [5.0, 7.0], R: [30, 110] },
    mothbeans: { N: [0, 25], P: [35, 55], K: [15, 35], T: [25, 38], H: [35, 65], pH: [5.0, 7.0], R: [20, 80] },
    mungbean: { N: [0, 40], P: [35, 55], K: [15, 35], T: [22, 32], H: [55, 80], pH: [5.5, 7.5], R: [30, 100] },
    blackgram: { N: [20, 50], P: [55, 100], K: [15, 35], T: [22, 32], H: [55, 80], pH: [5.0, 7.0], R: [30, 100] },
    lentil: { N: [0, 40], P: [55, 100], K: [15, 35], T: [12, 22], H: [30, 65], pH: [5.5, 7.5], R: [20, 80] },
    pomegranate: { N: [0, 35], P: [15, 70], K: [185, 205], T: [20, 35], H: [80, 95], pH: [5.5, 7.0], R: [20, 110] },
    banana: { N: [80, 120], P: [70, 110], K: [40, 60], T: [22, 35], H: [75, 95], pH: [5.5, 7.0], R: [100, 300] },
    mango: { N: [0, 30], P: [15, 65], K: [15, 30], T: [25, 35], H: [45, 65], pH: [5.5, 7.5], R: [40, 160] },
    grapes: { N: [0, 20], P: [10, 50], K: [180, 205], T: [20, 35], H: [55, 80], pH: [5.5, 7.0], R: [20, 100] },
    watermelon: { N: [80, 120], P: [10, 50], K: [40, 100], T: [25, 38], H: [75, 95], pH: [5.5, 7.0], R: [20, 100] },
    muskmelon: { N: [0, 30], P: [10, 110], K: [40, 100], T: [25, 38], H: [70, 90], pH: [5.5, 7.5], R: [20, 100] },
    apple: { N: [0, 40], P: [100, 140], K: [130, 205], T: [11, 22], H: [80, 95], pH: [5.5, 7.0], R: [80, 200] },
    orange: { N: [0, 20], P: [5, 10], K: [5, 15], T: [20, 35], H: [85, 95], pH: [5.5, 7.0], R: [80, 200] },
    papaya: { N: [35, 65], P: [40, 80], K: [35, 60], T: [25, 40], H: [85, 95], pH: [5.5, 7.0], R: [90, 250] },
    coconut: { N: [15, 30], P: [5, 20], K: [30, 50], T: [25, 38], H: [85, 95], pH: [5.0, 8.0], R: [100, 300] },
    cotton: { N: [100, 140], P: [30, 90], K: [15, 55], T: [22, 35], H: [65, 85], pH: [5.5, 8.0], R: [40, 200] },
    jute: { N: [55, 90], P: [35, 65], K: [35, 65], T: [22, 35], H: [70, 95], pH: [6.0, 7.5], R: [100, 300] },
    coffee: { N: [0, 40], P: [15, 65], K: [15, 30], T: [18, 28], H: [55, 85], pH: [4.5, 7.0], R: [60, 200] },
};

// ADVISORY DATA

const ADVISORY_DATA = {
    rice: {
        overview: { title: '🌾 Rice Overview', body: 'Rice (Oryza sativa) is one of the world\'s most important staple crops, cultivated across tropical and subtropical regions. It thrives best in warm, humid conditions with standing water during the early growth stage.', bullets: [{ h: 'Growth Duration', t: '100–150 days depending on variety (short-grain, long-grain, Basmati).' }, { h: 'Optimal Season', t: 'Kharif season (June–November) in South Asia; two crops per year in tropical regions.' }, { h: 'Soil Type', t: 'Alluvial clayey soils with good water retention capacity.' }] },
        soil: { title: '🌱 Soil Care', body: 'Maintain soil moisture by flooding paddies up to 5 cm during transplanting and tillering.', bullets: [{ h: 'Puddling', t: 'Puddle the soil 2–3 weeks before transplanting to reduce percolation and weed germination.' }, { h: 'Nutrient Top-up', t: 'Apply split doses of Nitrogen: 50% basal + 25% at tillering + 25% at panicle initiation.' }, { h: 'Organic Matter', t: 'Incorporate crop residues or green manure (Sesbania) before transplanting.' }] },
        irrigation: { title: '💧 Irrigation', body: 'Rice requires continuous submergence during vegetative stages and intermittent irrigation at grain filling.', bullets: [{ h: 'Transplanting Phase', t: 'Maintain 2–5 cm standing water for 2 weeks after transplanting.' }, { h: 'Tillering', t: 'Allow soil to dry and crack once to promote root deepening, then re-flood.' }, { h: 'Grain Filling', t: 'Maintain 2 cm water until 2 weeks before harvest; drain field 10 days before cutting.' }] },
        disease: { title: '🛡️ Disease & Pest Management', body: 'Monitor weekly for blast, sheath blight, and brown planthopper.', bullets: [{ h: 'Rice Blast', t: 'Apply Tricyclazole or Isoprothiolane at first symptom. Avoid excess nitrogen.' }, { h: 'Brown Planthopper', t: 'Use neem-based pesticides; drain fields to disrupt breeding.' }, { h: 'Stem Borer', t: 'Install light traps; apply Chlorpyrifos granules in the whorls.' }] },
        harvest: { title: '🌾 Harvesting', body: 'Harvest when 80–85% of the grains are straw-yellow.', bullets: [{ h: 'Timing', t: '100–130 days after transplanting; grain moisture should be 20–25%.' }, { h: 'Method', t: 'Use combine harvester or manual sickle; dry threshed grain to 14% moisture for storage.' }, { h: 'Post-Harvest', t: 'Store in airtight bins/bags; keep humidity below 70% to prevent mould.' }] },
    },
    maize: {
        overview: { title: '🌽 Maize Overview', body: 'Maize (Zea mays) is a versatile cereal grown for food, feed, and industrial use. It is a C4 plant that is highly efficient in water and light usage.', bullets: [{ h: 'Growth Duration', t: '90–120 days depending on hybrid variety.' }, { h: 'Optimal Season', t: 'Kharif and Rabi; tolerates a wide range of climates.' }, { h: 'Soil Type', t: 'Well-drained loamy soils; pH 5.8–7.5.' }] },
        soil: { title: '🌱 Soil Care', body: 'Deep tillage is essential for maize root development.', bullets: [{ h: 'Ploughing', t: 'Plough 20–25 cm deep before sowing; apply FYM at 10 tonnes/ha.' }, { h: 'Fertiliser', t: 'Apply 120 kg N, 60 kg P₂O₅, 40 kg K₂O per hectare.' }, { h: 'Micronutrients', t: 'Zinc deficiency is common; apply 25 kg ZnSO₄/ha before sowing.' }] },
        irrigation: { title: '💧 Irrigation', body: 'Maize is sensitive to water stress at emergence and tasseling.', bullets: [{ h: 'Germination Phase', t: 'Ensure adequate soil moisture at planting; irrigate lightly if dry.' }, { h: 'Tasseling & Silking', t: 'Most critical stage — avoid any water stress during this period.' }, { h: 'Grain Filling', t: 'Keep soil at 70% field capacity until dough stage.' }] },
        disease: { title: '🛡️ Disease & Pest Management', body: 'Fall armyworm (FAW) is currently the most serious pest of maize globally.', bullets: [{ h: 'Fall Armyworm', t: 'Apply Spinetoram or Emamectin benzoate; use sand + lime mixture in whorl.' }, { h: 'Maize Lethal Necrosis', t: 'Use certified disease-free seeds; rogue infected plants early.' }, { h: 'Stalk Rot', t: 'Avoid waterlogging; apply balanced nutrition to improve plant vigour.' }] },
        harvest: { title: '🌾 Harvesting', body: 'Harvest when husk turns brown and grains show a black layer.', bullets: [{ h: 'Maturity Signs', t: 'Black hilum layer at base of grain; grain moisture 25–30%.' }, { h: 'Drying', t: 'Sun-dry or mechanically dry to below 13.5% moisture before storage.' }, { h: 'Storage', t: 'Store in hermetic bags; fumigate with phosphine if long-term storage is needed.' }] },
    },
};

// Fallback generic advisory for crops not explicitly listed
function getAdvisory(crop) {
    if (ADVISORY_DATA[crop]) return ADVISORY_DATA[crop];
    const info = CROP_DB[crop] || CROP_DB['rice'];
    return {
        overview: { title: `${info.emoji} ${cap(crop)} Overview`, body: `${cap(crop)} (${info.scientific}) is a commercially important crop that can be successfully grown with good agronomic practices tailored to your local conditions.`, bullets: [{ h: 'Growth Period', t: 'Varies by variety and region; consult local crop calendar.' }, { h: 'Key Requirement', t: 'Ensure adequate soil preparation, balanced fertilisation and timely sowing.' }, { h: 'Variety Selection', t: 'Choose certified, high-yielding varieties adapted to your agro-climatic zone.' }] },
        soil: { title: '🌱 Soil Preparation', body: 'Proper soil preparation is the foundation of a successful crop.', bullets: [{ h: 'Tillage', t: 'Deep plough and prepare fine seedbed; incorporate organic matter.' }, { h: 'Soil Testing', t: 'Conduct soil test and apply fertilisers based on test recommendations.' }, { h: 'pH Correction', t: 'Apply lime if pH < 5.5 or gypsum if pH > 8 to optimise nutrient availability.' }] },
        irrigation: { title: '💧 Water Management', body: 'Efficient irrigation conserves water and prevents disease.', bullets: [{ h: 'Scheduling', t: 'Irrigate based on crop-water demand; use drip or sprinkler systems where possible.' }, { h: 'Critical Stages', t: 'Ensure adequate moisture at flowering and grain/fruit filling stages.' }, { h: 'Drainage', t: 'Ensure field drainage to prevent waterlogging and root diseases.' }] },
        disease: { title: '🛡️ Pest & Disease Control', body: 'Integrated Pest Management (IPM) reduces chemical dependence.', bullets: [{ h: 'Scouting', t: 'Monitor fields weekly; identify pests/diseases early for effective control.' }, { h: 'Biological Control', t: 'Encourage natural predators; use bio-pesticides (neem, Bt) where applicable.' }, { h: 'Chemical Control', t: 'Use registered pesticides as per label; observe safe-harvest intervals.' }] },
        harvest: { title: '🌾 Harvest & Storage', body: 'Timely harvest prevents losses and maintains quality.', bullets: [{ h: 'Right Stage', t: 'Harvest at physiological maturity to maximise yield and quality.' }, { h: 'Post-Harvest', t: 'Dry produce to safe moisture level before storage.' }, { h: 'Storage Hygiene', t: 'Clean and disinfect stores; use hermetic storage to prevent insect damage.' }] },
    };
}

function cap(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

// CROP RECOMMENDATION LOGIC (RULE-BASED)

function recommendCrop(params) {
    const { N, P, K, T, H, pH, R } = params;
    const scores = [];
    Object.entries(CROP_CONDITIONS).forEach(([crop, cond]) => {
        let score = 0;
        if (inRange(N, cond.N)) score += 15;
        if (inRange(P, cond.P)) score += 14;
        if (inRange(K, cond.K)) score += 14;
        if (inRange(T, cond.T)) score += 18;
        if (inRange(H, cond.H)) score += 16;
        if (inRange(pH, cond.pH)) score += 14;
        if (inRange(R, cond.R)) score += 9;
        // Partial credit for being close
        score += proximityScore(N, cond.N) * 7;
        score += proximityScore(T, cond.T) * 8;
        score += proximityScore(pH, cond.pH) * 7;
        scores.push({ crop, score });
    });
    scores.sort((a, b) => b.score - a.score);
    const best = scores[0];
    const pct = Math.min(99, Math.round(60 + (best.score / 100) * 39));
    return { best: best.crop, confidence: pct, alternatives: scores.slice(1, 4).map(s => s.crop) };
}

function inRange(val, [lo, hi]) { return val >= lo && val <= hi; }
function proximityScore(val, [lo, hi]) {
    if (inRange(val, [lo, hi])) return 1;
    const mid = (lo + hi) / 2;
    const span = (hi - lo) / 2 || 1;
    const dist = Math.abs(val - mid);
    return Math.max(0, 1 - dist / (span * 2));
}

// ADVISORY FORM

const advForm = document.getElementById('advisory-form');
const stepInput = document.getElementById('step-input');
const stepResult = document.getElementById('step-result');

advForm && advForm.addEventListener('submit', e => {
    e.preventDefault();
    const params = {
        N: +document.getElementById('nitrogen').value,
        P: +document.getElementById('phosphorus').value,
        K: +document.getElementById('potassium').value,
        T: +document.getElementById('temperature').value,
        H: +document.getElementById('humidity').value,
        pH: +document.getElementById('ph').value,
        R: +document.getElementById('rainfall').value,
    };
    showLoading('spinner', 'submit-text', 'Analysing…');
    setTimeout(() => {
        const result = recommendCrop(params);
        renderCropResult(result, params);
        hideLoading('spinner', 'submit-text', 'Analyse &amp; Recommend Crop');
        stepInput.classList.add('hidden');
        stepResult.classList.remove('hidden');
    }, 1600);
});

document.getElementById('reset-advisory') && document.getElementById('reset-advisory').addEventListener('click', () => {
    stepInput.classList.remove('hidden');
    stepResult.classList.add('hidden');
    advForm.reset();
    SLIDER_PAIRS.slice(0, 7).forEach(([inputId, sliderId]) => {
        const sld = document.getElementById(sliderId);
        if (sld) { sld.value = sld.defaultValue; document.getElementById(inputId).value = ''; }
    });
});

function renderCropResult(result, params) {
    const { best, confidence, alternatives } = result;
    const info = CROP_DB[best] || CROP_DB['rice'];

    document.getElementById('cr-emoji').textContent = info.emoji;
    document.getElementById('cr-name').textContent = cap(best);
    document.getElementById('cr-scientific').textContent = info.scientific;
    document.getElementById('conf-pct').textContent = confidence + '%';
    setTimeout(() => document.getElementById('conf-fill').style.width = confidence + '%', 100);

    // Param pills
    const paramsEl = document.getElementById('cr-params');
    paramsEl.innerHTML = [
        ['N', params.N, 'mg/kg'], ['P', params.P, 'mg/kg'], ['K', params.K, 'mg/kg'],
        ['Temp', params.T, '°C'], ['Humidity', params.H, '%'], ['pH', params.pH, ''],
        ['Rainfall', params.R, 'mm'],
    ].map(([k, v, u]) => `<div class="cr-param"><b>${k}</b> ${v}${u}</div>`).join('');

    // Alternative tags
    document.getElementById('cr-alt-tags').innerHTML = alternatives.map(c =>
        `<span class="cr-alt-tag">${CROP_DB[c]?.emoji || '🌿'} ${cap(c)}</span>`
    ).join('');

    // Advisory
    renderAdvisory(best);
}

// ADVISORY TABS

let currentAdvisory = null;

function renderAdvisory(crop) {
    currentAdvisory = getAdvisory(crop);
    setAdvisoryTab('overview');
}

document.querySelectorAll('.adv-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.adv-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setAdvisoryTab(btn.dataset.tab);
    });
});

function setAdvisoryTab(tabKey) {
    if (!currentAdvisory) return;
    const data = currentAdvisory[tabKey];
    const content = document.getElementById('advisory-content');
    if (!data || !content) return;
    content.innerHTML = `
    <div class="adv-panel">
      <h4>${data.title}</h4>
      <p>${data.body}</p>
      <div class="adv-bullets">
        ${data.bullets.map(b => `<div class="adv-bullet"><div><b>${b.h}:</b> ${b.t}</div></div>`).join('')}
      </div>
    </div>
  `;
}

//  YIELD FORM
const STATE_LABELS = {
    andhra_pradesh: 'Andhra Pradesh', assam: 'Assam', bihar: 'Bihar', gujarat: 'Gujarat',
    haryana: 'Haryana', karnataka: 'Karnataka', kerala: 'Kerala',
    madhya_pradesh: 'Madhya Pradesh', maharashtra: 'Maharashtra', odisha: 'Odisha',
    punjab: 'Punjab', rajasthan: 'Rajasthan', tamil_nadu: 'Tamil Nadu',
    telangana: 'Telangana', uttar_pradesh: 'Uttar Pradesh', west_bengal: 'West Bengal',
};
const SEASON_LABELS = { kharif: 'Kharif', rabi: 'Rabi', zaid: 'Zaid', whole_year: 'Whole Year' };

// State factor (simplified regional multipliers)
const STATE_FACTOR = {
    andhra_pradesh: 1.05, assam: 0.92, bihar: 0.88, gujarat: 1.02,
    haryana: 1.15, karnataka: 1.00, kerala: 1.08,
    madhya_pradesh: 0.95, maharashtra: 1.00, odisha: 0.90,
    punjab: 1.20, rajasthan: 0.85, tamil_nadu: 1.05,
    telangana: 1.03, uttar_pradesh: 1.00, west_bengal: 1.02,
};
const SEASON_FACTOR = { kharif: 1.05, rabi: 1.00, zaid: 0.90, whole_year: 1.10 };

const yieldForm = document.getElementById('yield-form');
yieldForm && yieldForm.addEventListener('submit', e => {
    e.preventDefault();
    showLoading('yield-spinner', 'yield-submit-text', 'Computing…');
    const crop = document.getElementById('yield-crop').value;
    const season = document.getElementById('yield-season').value;
    const state = document.getElementById('yield-state').value;
    const area = +document.getElementById('yield-area').value;
    const rainfall = +document.getElementById('yield-rainfall').value;
    const fertiliser = +document.getElementById('yield-fertiliser').value;
    const pesticide = +document.getElementById('yield-pesticide').value;
    const temp = +document.getElementById('yield-temp').value;

    setTimeout(() => {
        hideLoading('yield-spinner', 'yield-submit-text', 'Predict Yield');
        renderYieldResult({ crop, season, state, area, rainfall, fertiliser, pesticide, temp });
    }, 1800);
});

document.getElementById('reset-yield') && document.getElementById('reset-yield').addEventListener('click', () => {
    document.getElementById('yield-results').classList.add('hidden');
    document.getElementById('yield-placeholder').classList.remove('hidden');
    document.getElementById('yield-form').reset();
});

function renderYieldResult({ crop, season, state, area, rainfall, fertiliser, pesticide, temp }) {
    const info = CROP_DB[crop] || CROP_DB['rice'];
    let yieldPerHa = info.baseYield;

    // Apply modifiers
    const sf = STATE_FACTOR[state] || 1.0;
    const sn = SEASON_FACTOR[season] || 1.0;
    yieldPerHa *= sf * sn;

    // Rainfall factor
    const rainNorm = Math.min(1.15, Math.max(0.7, rainfall / 1200));
    yieldPerHa *= rainNorm;

    // Fertiliser boost (diminishing returns)
    const fertFactor = 1 + Math.min(0.3, fertiliser / 600);
    yieldPerHa *= fertFactor;

    // Temp factor
    const optTemp = 26;
    const tempDev = Math.abs(temp - optTemp) / 10;
    yieldPerHa *= Math.max(0.75, 1 - tempDev * 0.15);

    // Pesticide (small positive effect)
    yieldPerHa *= (1 + Math.min(0.1, pesticide / 100));

    // Add small realistic noise
    yieldPerHa *= (0.95 + Math.random() * 0.1);
    yieldPerHa = Math.round(yieldPerHa * 100) / 100;
    const totalYield = Math.round(yieldPerHa * area * 10) / 10;

    // Gauge pct (relative to max expected for crop)
    const maxYield = info.baseYield * 1.6;
    const gaugePct = Math.min(100, Math.round((yieldPerHa / maxYield) * 100));

    // Render
    document.getElementById('yield-placeholder').classList.add('hidden');
    const resultsEl = document.getElementById('yield-results');
    resultsEl.classList.remove('hidden');

    document.getElementById('yr-crop-display').textContent = `${info.emoji} ${cap(crop)}`;
    document.getElementById('yr-season').textContent = SEASON_LABELS[season] || season;
    document.getElementById('yr-area').textContent = area + ' ha';
    document.getElementById('yr-rain').textContent = rainfall + ' mm';
    document.getElementById('yr-region').textContent = STATE_LABELS[state] || state;
    document.getElementById('yr-total').textContent = totalYield + ' tonnes';

    // Animate number
    animateNumber(document.getElementById('yr-num'), 0, yieldPerHa, 1200, 2);

    // Gauge
    setTimeout(() => {
        document.getElementById('yr-gauge-fill').style.width = gaugePct + '%';
    }, 200);

    // Insights
    buildInsights({ crop, yieldPerHa, rainfall, fertiliser, temp, state, season });
}

function buildInsights({ crop, yieldPerHa, rainfall, fertiliser, temp, state, season }) {
    const list = document.getElementById('yr-insights-list');
    const insights = [];
    if (fertiliser > 300) insights.push('High fertiliser input detected — consider splitting doses to prevent nutrient runoff.');
    if (fertiliser < 50) insights.push('Low fertiliser input — increasing N-P-K application may improve yield significantly.');
    if (rainfall > 2500) insights.push('Very high rainfall — ensure field drainage infrastructure to prevent waterlogging.');
    if (rainfall < 300) insights.push('Low rainfall — consider supplementary irrigation to avoid crop water stress.');
    if (temp > 35) insights.push(`High temperature (${temp}°C) may reduce grain filling — consider heat-tolerant varieties.`);
    if (temp < 18) insights.push(`Cool temperature (${temp}°C) may slow growth — use plastic mulch to improve soil warmth.`);
    if (STATE_FACTOR[state] >= 1.1) insights.push(`${STATE_LABELS[state]} historically shows high yields for ${cap(crop)} — great choice!`);
    if (insights.length === 0) insights.push(`Conditions appear favourable for ${cap(crop)} cultivation in ${SEASON_LABELS[season]} season.`);
    insights.push(`Predicted yield of ${yieldPerHa.toFixed(2)} t/ha — use certified seeds and good GAP practices to reach this target.`);
    list.innerHTML = insights.map(i => `<li>${i}</li>`).join('');
}

function animateNumber(el, from, to, duration, decimals) {
    const start = performance.now();
    function step(now) {
        const progress = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = (from + (to - from) * ease).toFixed(decimals);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// LOADING HELPERS
function showLoading(spinnerId, textId, loadingText) {
    const spinner = document.getElementById(spinnerId);
    const textEl = document.getElementById(textId);
    if (spinner) spinner.classList.remove('hidden');
    if (textEl) textEl.textContent = loadingText;
}
function hideLoading(spinnerId, textId, originalHTML) {
    const spinner = document.getElementById(spinnerId);
    const textEl = document.getElementById(textId);
    if (spinner) spinner.classList.add('hidden');
    if (textEl) textEl.innerHTML = originalHTML;
}

// CARD HOVER ANIMATIONS (Intersection Observer)

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.feature-card, .step-card, .team-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    revealObserver.observe(el);
});