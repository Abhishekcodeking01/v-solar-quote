/*******************************************************
 * on-grid/script.js
 * Rebuilt calculation + quotation engine for On-Grid
 * Author: Generated for V-Sustain Solar Solutions
 *******************************************************/

/* ===========================
   1. DATASETS (editable)
   =========================== */

// ON-GRID INVERTERS (model / capacity / warranty / dealer price)
const inverterList = [
  { model: "NXI 120(2KW) (EXC.DONGLE)", capacityKw: 2, warranty: "8 Years*", price: 16882 },
  { model: "NXI 130(3KW) (EXC.DONGLE)", capacityKw: 3, warranty: "8 Years*", price: 17915 },
  { model: "NXI 130(3KW) (INCL.DONGLE)", capacityKw: 3, warranty: "8 Years*", price: 18022 },
  { model: "NXI T130(3KW) + DONGLE", capacityKw: 3, warranty: "8 Years*", price: 18022 },
  { model: "NXI 140(4KW) (EXC.DONGLE)", capacityKw: 4, warranty: "8 Years*", price: 28509 },
  { model: "NXI 150(5KW) (EXC.DONGLE)", capacityKw: 5, warranty: "8 Years*", price: 30508 },
  { model: "NXI 305(5KW) (EXC.DONGLE)", capacityKw: 5, warranty: "8 Years*", price: 45696 },
  { model: "NXI 306(6KW) (EXC.DONGLE)", capacityKw: 6, warranty: "8 Years*", price: 51206 },
  { model: "NXI 308(8KW) (EXC.DONGLE)", capacityKw: 8, warranty: "8 Years*", price: 57641 },
  { model: "NXI 310(10KW) (EXC.DONGLE)", capacityKw: 10, warranty: "8 Years*", price: 59110 },
  { model: "NXI 312(12KW) (EXC.DONGLE)", capacityKw: 12, warranty: "8 Years*", price: 63560 },
  { model: "NXI 315(15KW) (EXC.DONGLE)", capacityKw: 15, warranty: "8 Years*", price: 66339 },
  { model: "NXI 320(20KW) (EXC.DONGLE)", capacityKw: 20, warranty: "8 Years*", price: 79429 },
  { model: "NXI 325(25KW) (EXC.DONGLE)", capacityKw: 25, warranty: "8 Years*", price: 97180 },
  { model: "NXI 330(30KW) (EXC.DONGLE)", capacityKw: 30, warranty: "8 Years*", price: 110076 },
  { model: "NXI 350(50KW) (EXC.DONGLE)", capacityKw: 50, warranty: "8 Years*", price: 150912 },
  { model: "NXI 360(60KW) (EXC.DONGLE)", capacityKw: 60, warranty: "8 Years*", price: 161198 },
  { model: "NXI 380(80KW) (EXC.DONGLE)", capacityKw: 80, warranty: "8 Years*", price: 251588 },
  { model: "NXI 3100(100KW) (EXC.DONGLE)", capacityKw: 100, warranty: "8 Years*", price: 268801 },
  { model: "NXI W3125(125KW) (INCL.DONGLE)", capacityKw: 125, warranty: "8 Years*", price: 317042 },
  { model: "NXI W3150(150KW) (INCL.DONGLE)", capacityKw: 150, warranty: "8 Years*", price: 344553 },
  { model: "NXI A3250-HV(250KW)", capacityKw: 250, warranty: "8 Years*", price: 417806 },
  { model: "NXI A3250-HV(350KW)", capacityKw: 350, warranty: "8 Years*", price: 555492 }
];

// SOLAR PANELS (model / watt / dealer price)
const panelList = [
  { model: "POLY 170W/12V", watt: 170, price: 3815 },
  { model: "PV MOD LUM24550M DCR BI-TS EXWH31", watt: 550, price: 14025 },
  { model: "PV MOD LUM 24585T144 TCHC 144C EXWH31", watt: 585, price: 9694 },
  { model: "PV MOD LUM 24590T144 BI-TS-31", watt: 590, price: 9694 }
];

// ACDB / DCDB
const acdbList = [
  { sku: "TSAD0AC32PH1", desc: "ACDB Single Phase 32 Amp (0-5 Kw)", price: 1899.80 },
  { sku: "TSAD0AC63PH1", desc: "ACDB Single Phase 63 Amp (7 Kw)", price: 2312.80 },
  { sku: "TSAD0AC40PH1", desc: "ACDB Single Phase 40 Amp (9 Kw)", price: 2277.40 },
  { sku: "TSAD0AC80PH1", desc: "ACDB Single Phase 80 Amp (11 Kw)", price: 4708.20 },
  { sku: "TSADAC100PH1", desc: "ACDB Single Phase 100 Amp", price: 4920.60 },
  { sku: "TSAD0AC32PH3", desc: "ACDB Three Phase 32 Amp", price: 4177.20 }
];

const dcdbList = [
  { sku: "TSADDC600V11", desc: "DCDB 1 In 1 Out With MCB", price: 1939.92 },
  { sku: "TSADDC600V22", desc: "DCDB 2 In 2 Out With Fuse", price: 2808.40 },
  { sku: "TSADDC600V21", desc: "DCDB 2 In 1 Out With MCB", price: 2997.20 },
  { sku: "TSADDC600V31", desc: "DCDB 3 In 1 Out With MCB", price: 3835.00 },
  { sku: "TSADDC600V41", desc: "DCDB 4 In 1 Out With MCB", price: 4224.40 },
  { sku: "TSADDC600V11F", desc: "DCDB 1 In 1 Out With Fuse (A)", price: 1711.00 },
  { sku: "TSADC600V21F", desc: "DCDB 2 In 1 Out With Fuse", price: 2383.60 },
  { sku: "TSADC600V31F", desc: "DCDB 3 In 1 Out With Fuse", price: 2725.80 },
  { sku: "TSADC600V41F", desc: "DCDB 4 In 1 Out With Fuse", price: 3103.40 }
];

// Meter Options
const meterOptions = [
  { code: "single", label: "Single Phase", price: 4500 },
  { code: "three", label: "Three Phase", price: 7500 }
];

/* ===========================
   2. HELPERS & FORMATTING
   =========================== */
const n = v => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));
const round2 = v => Math.round((v + Number.EPSILON) * 100) / 100;
const fmt = v => {
  const num = n(v);
  return "₹" + num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

function $(id) { return document.getElementById(id); }

/* ===========================
   3. INITIALIZATION
   =========================== */
window.addEventListener('DOMContentLoaded', () => {
  populateSelects();
  attachEventListeners();
  setInitialValues();
  recalcAllCards();
});

/* populate dropdowns */
function populateSelects() {
  const invSel = $('inverterModel');
  inverterList.forEach(inv => {
    const o = document.createElement('option');
    o.value = inv.model;
    o.dataset.price = inv.price;
    o.dataset.capacity = inv.capacityKw;
    o.textContent = `${inv.model} — ${inv.capacityKw} kW — ${fmt(inv.price)}`;
    invSel.appendChild(o);
  });

  const panelSel = $('panelModel');
  panelList.forEach(p => {
    const o = document.createElement('option');
    o.value = p.model;
    o.dataset.watt = p.watt;
    o.dataset.price = p.price;
    o.textContent = `${p.model} — ${p.watt} W — ${fmt(p.price)}`;
    panelSel.appendChild(o);
  });

  const acdbSel = $('acdbModel');
  acdbList.forEach(a => {
    const o = document.createElement('option');
    o.value = a.sku;
    o.dataset.price = a.price;
    o.textContent = `${a.desc} — ${fmt(a.price)}`;
    acdbSel.appendChild(o);
  });

  const dcdbSel = $('dcdbModel');
  dcdbList.forEach(d => {
    const o = document.createElement('option');
    o.value = d.sku;
    o.dataset.price = d.price;
    o.textContent = `${d.desc} — ${fmt(d.price)}`;
    dcdbSel.appendChild(o);
  });

  const meterSel = $('meterType');
  meterOptions.forEach(m => {
    const o = document.createElement('option');
    o.value = m.code;
    o.dataset.price = m.price;
    o.textContent = `${m.label} — ${fmt(m.price)}`;
    meterSel.appendChild(o);
  });
}

/* attach UI event handlers */
function attachEventListeners() {
  // System KW and common margin
  $('systemKw').addEventListener('input', () => { updateSystemDependent(); recalcAllCards(); });
  $('commonMargin').addEventListener('input', () => recalcAllCards());

  // Inverter
  $('inverterModel').addEventListener('change', updateInverterData);
  $('inverterQty').addEventListener('input', updateInverterData);
  $('inverterOverrideToggle').addEventListener('change', () => toggleOverrideUI('inverter'));
  $('inverterOverridePrice').addEventListener('input', updateInverterData);
  $('inverterUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'inverter'));
  $('inverterCustomMargin').addEventListener('input', updateInverterData);

  // Panels
  $('panelModel').addEventListener('change', updatePanelData);
  $('panelOverrideToggle').addEventListener('change', () => toggleOverrideUI('panels'));
  $('panelOverridePrice').addEventListener('input', updatePanelData);
  $('panelsUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'panels'));
  $('panelsCustomMargin').addEventListener('input', updatePanelData);

  // Meter
  $('meterType').addEventListener('change', updateMeterData);
  $('meterQty').addEventListener('input', updateMeterData);
  $('meterOverrideToggle').addEventListener('change', () => toggleOverrideUI('meter'));
  $('meterOverridePrice').addEventListener('input', updateMeterData);
  $('meterUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'meter'));
  $('meterCustomMargin').addEventListener('input', updateMeterData);

  // ACDB/DCDB
  $('acdbModel').addEventListener('change', updateACDBData);
  $('acdbQty').addEventListener('input', updateACDBData);
  $('acdbOverrideToggle').addEventListener('change', () => toggleOverrideUI('acdb'));
  $('acdbOverridePrice').addEventListener('input', updateACDBData);
  $('acdbUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'acdb'));
  $('acdbCustomMargin').addEventListener('input', updateACDBData);

  $('dcdbModel').addEventListener('change', updateDCDBData);
  $('dcdbQty').addEventListener('input', updateDCDBData);
  $('dcdbOverrideToggle').addEventListener('change', () => toggleOverrideUI('dcdb'));
  $('dcdbOverridePrice').addEventListener('input', updateDCDBData);
  $('dcdbUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'dcdb'));
  $('dcdbCustomMargin').addEventListener('input', updateDCDBData);

  // AC cable & Earth cable
  $('acCableQty').addEventListener('input', updateACCableData);
  $('acCablePrice').addEventListener('input', updateACCableData);
  $('earthCableQty').addEventListener('input', updateEarthCableData);
  $('earthCablePrice').addEventListener('input', updateEarthCableData);

  // LA, installation, structure
  $('laQty').addEventListener('input', updateLAData);
  $('laPrice').addEventListener('input', updateLAData);

  $('installEditable').addEventListener('input', updateInstallationData);
  $('installUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null,'installation'));
  $('installCustomMargin').addEventListener('input', updateInstallationData);

  $('structEditable').addEventListener('input', updateStructureData);
  $('structUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null,'structure'));
  $('structCustomMargin').addEventListener('input', updateStructureData);

  // enable/disable products via header toggles
  ['inverter','panels','meter','acdb','dcdb','acCable','earthCable','la','installation','structure'].forEach(pid => {
    const el = document.querySelector(`#${pid}Card input[type="checkbox"]`);
    if (el) el.addEventListener('change', () => recalcAllCards());
  });

  // custom product add
  // addCustomProduct defined later; button calls addCustomProduct()

  // quote buttons (functions defined later)
  // generateDetailedQuote() and generateSummaryQuote() will be global functions bound in HTML
}

/* set initial values for installation/structure base */
function setInitialValues() {
  const kw = Math.max(1, n($('systemKw').value) || 1);
  $('installBase').value = round2(kw * 5000);
  $('structBase').value = round2(kw * 8000);
  $('installEditable').value = round2(kw * 5000);
  $('structEditable').value = round2(kw * 8000);
}

/* update system dependent values (panel qty, base rates) */
function updateSystemDependent() {
  const kw = Math.max(0, n($('systemKw').value));
  if (kw > 0) {
    $('installBase').value = round2(kw * 5000);
    $('structBase').value = round2(kw * 8000);
    if (!n($('installEditable').value)) $('installEditable').value = round2(kw * 5000);
    if (!n($('structEditable').value)) $('structEditable').value = round2(kw * 8000);
  } else {
    $('installBase').value = '';
    $('structBase').value = '';
  }
}

/* ===========================
   4. CORE COMPUTATION HELPERS
   =========================== */

function getCommonMargin() {
  return Math.max(0, n($('commonMargin').value));
}

function toggleCustomMarginInput(sectionId) {
  const useCommon = $(`${sectionId}UseCommonMargin`) ? $(`${sectionId}UseCommonMargin`).checked : true;
  const customInp = $(`${sectionId}CustomMargin`);
  if (customInp) customInp.disabled = useCommon;
  recalcAllCards();
}

function toggleOverrideUI(sectionId) {
  const toggle = $(`${sectionId}OverrideToggle`);
  const overrideInput = $(`${sectionId}OverridePrice`);
  if (!toggle || !overrideInput) return;
  if (toggle.checked) {
    overrideInput.classList.remove('hidden');
    overrideInput.disabled = false;
  } else {
    overrideInput.classList.add('hidden');
    overrideInput.disabled = true;
    overrideInput.value = '';
  }
  recalcAllCards();
}

function toggleProduct(section) {
  // card's checkbox changed — recalc totals; HTML binds checkbox to on change
  recalcAllCards();
}

/* compute effective base price for a section (applies manual override if set) */
function computeBasePrice(sectionId, dealerPrice) {
  const overrideToggle = $(`${sectionId}OverrideToggle`);
  const overrideInput = $(`${sectionId}OverridePrice`);
  if (overrideToggle && overrideToggle.checked && overrideInput) {
    const v = n(overrideInput.value);
    if (v > 0) return v;
  }
  return dealerPrice;
}

/* apply margin (either common or custom) */
function applyMarginTo(base, sectionId) {
  const useCommonEl = $(`${sectionId}UseCommonMargin`);
  const customEl = $(`${sectionId}CustomMargin`);
  const common = getCommonMargin();
  if (useCommonEl && useCommonEl.checked) {
    return round2(base * (1 + common / 100));
  } else if (customEl && n(customEl.value) > 0) {
    return round2(base * (1 + n(customEl.value) / 100));
  } else {
    return round2(base);
  }
}

/* get GST percent for on-grid items
   Panels & Inverter => 5%
   Rest => 18%
*/
function getGstFor(type) {
  if (type === 'panels' || type === 'inverter') return 5;
  return 18;
}

/* check if a section is enabled (header toggle) */
function isEnabled(sectionId) {
  const chk = $(`${sectionId}Card`) ? $(`${sectionId}Card`).querySelector('input[type="checkbox"]') : null;
  if (!chk) return true;
  return chk.checked;
}

/* ===========================
   5. CARD-SPECIFIC UPDATERS
   =========================== */

function updateInverterData() {
  if (!isEnabled('inverter')) {
    $('inverterDealer').value = '';
    $('inverterFinalRate').value = '';
    $('inverterGST').value = '';
    $('inverterTotal').value = '';
    return;
  }
  const sel = $('inverterModel');
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const dealer = n(opt.dataset.price);
  const qty = Math.max(1, n($('inverterQty').value));
  const base = computeBasePrice('inverter', dealer);
  const finalRate = applyMarginTo(base, 'inverter');
  const gstPct = getGstFor('inverter');
  const amount = round2(finalRate * qty);
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('inverterDealer').value = round2(dealer);
  $('inverterFinalRate').value = round2(finalRate);
  $('inverterGST').value = gstAmt;
  $('inverterTotal').value = total;
}

function updatePanelData() {
  if (!isEnabled('panels')) {
    $('panelDealer').value = '';
    $('panelFinalRate').value = '';
    $('panelQty').value = '';
    $('panelCapacity').value = '';
    $('panelGST').value = '';
    $('panelTotal').value = '';
    return;
  }
  const sel = $('panelModel');
  const opt = sel.selectedOptions[0];
  const kw = Math.max(0, n($('systemKw').value));
  if (!opt || !kw) {
    // clear
    $('panelQty').value = '';
    $('panelCapacity').value = '';
    $('panelDealer').value = '';
    $('panelFinalRate').value = '';
    $('panelGST').value = '';
    $('panelTotal').value = '';
    return;
  }

  const watt = n(opt.dataset.watt);
  const dealer = n(opt.dataset.price);

  // total watt required = kw * 1000, qty = ceil(totalWatt / watt)
  const totalWatt = round2(kw * 1000);
  const qty = Math.ceil(totalWatt / Math.max(1, watt));
  const dcCapacityKw = round2((qty * watt) / 1000);

  const base = computeBasePrice('panels', dealer);
  const finalRate = applyMarginTo(base, 'panels'); // rate per panel after margin
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('panels');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('panelQty').value = qty;
  $('panelCapacity').value = dcCapacityKw;
  $('panelDealer').value = round2(dealer);
  $('panelFinalRate').value = round2(finalRate);
  $('panelGST').value = gstAmt;
  $('panelTotal').value = total;
}

function updateMeterData() {
  if (!isEnabled('meter')) {
    $('meterDealer').value = '';
    $('meterTotal').value = '';
    $('meterGST').value = '';
    return;
  }
  const sel = $('meterType');
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const dealer = n(opt.dataset.price);
  const qty = Math.max(1, n($('meterQty').value));
  const base = computeBasePrice('meter', dealer);
  const finalRate = applyMarginTo(base, 'meter');
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('meter');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('meterDealer').value = round2(dealer);
  $('meterGST').value = gstAmt;
  $('meterTotal').value = total;
}

function updateACDBData() {
  if (!isEnabled('acdb')) {
    $('acdbDealer').value = '';
    $('acdbTotal').value = '';
    $('acdbGST').value = '';
    return;
  }
  const sel = $('acdbModel');
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const dealer = n(opt.dataset.price);
  const qty = Math.max(1, n($('acdbQty').value));
  const base = computeBasePrice('acdb', dealer);
  const finalRate = applyMarginTo(base, 'acdb');
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('acdb');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('acdbDealer').value = round2(dealer);
  $('acdbGST').value = gstAmt;
  $('acdbTotal').value = total;
}

function updateDCDBData() {
  if (!isEnabled('dcdb')) {
    $('dcdbDealer').value = '';
    $('dcdbTotal').value = '';
    $('dcdbGST').value = '';
    return;
  }
  const sel = $('dcdbModel');
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const dealer = n(opt.dataset.price);
  const qty = Math.max(1, n($('dcdbQty').value));
  const base = computeBasePrice('dcdb', dealer);
  const finalRate = applyMarginTo(base, 'dcdb');
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('dcdb');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('dcdbDealer').value = round2(dealer);
  $('dcdbGST').value = gstAmt;
  $('dcdbTotal').value = total;
}

function updateACCableData() {
  if (!isEnabled('acCable')) {
    $('acCableTotal').value = '';
    return;
  }
  const qty = Math.max(0, n($('acCableQty').value));
  const price = Math.max(0, n($('acCablePrice').value));
  if (!qty || !price) {
    $('acCableTotal').value = '';
    return;
  }
  const base = computeBasePrice('acCable', price);
  const finalRate = applyMarginTo(base, 'acCable');
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('acCable');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);
  $('acCableTotal').value = total;
}

function updateEarthCableData() {
  if (!isEnabled('earthCable')) {
    $('earthCableTotal').value = '';
    return;
  }
  const qty = Math.max(0, n($('earthCableQty').value));
  const price = Math.max(0, n($('earthCablePrice').value));
  if (!qty || !price) {
    $('earthCableTotal').value = '';
    return;
  }
  const base = computeBasePrice('earthCable', price);
  const finalRate = applyMarginTo(base, 'earthCable');
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('earthCable');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);
  $('earthCableTotal').value = total;
}

function updateLAData() {
  if (!isEnabled('la')) {
    $('laTotal').value = '';
    return;
  }
  const qty = Math.max(0, n($('laQty').value));
  const price = Math.max(0, n($('laPrice').value));
  if (!qty || !price) {
    $('laTotal').value = '';
    return;
  }
  const base = computeBasePrice('la', price);
  const finalRate = applyMarginTo(base, 'la');
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('la');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);
  $('laTotal').value = total;
}

function updateInstallationData() {
  if (!isEnabled('installation')) {
    $('installGST').value = '';
    $('installTotal').value = '';
    return;
  }
  const qty = Math.max(0, n($('systemKw').value));
  const baseDealer = Math.max(0, n($('installEditable').value));
  if (!qty || !baseDealer) {
    $('installGST').value = '';
    $('installTotal').value = '';
    return;
  }
  const base = computeBasePrice('installation', baseDealer);
  const finalRate = applyMarginTo(base, 'installation'); // rate per kW
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('installation');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);
  $('installGST').value = gstAmt;
  $('installTotal').value = total;
}

function updateStructureData() {
  if (!isEnabled('structure')) {
    $('structGST').value = '';
    $('structTotal').value = '';
    return;
  }
  const qty = Math.max(0, n($('systemKw').value));
  const baseDealer = Math.max(0, n($('structEditable').value));
  if (!qty || !baseDealer) {
    $('structGST').value = '';
    $('structTotal').value = '';
    return;
  }
  const base = computeBasePrice('structure', baseDealer);
  const finalRate = applyMarginTo(base, 'structure'); // rate per kW
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('structure');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);
  $('structGST').value = gstAmt;
  $('structTotal').value = total;
}

/* recalc all cards */
function recalcAllCards() {
  updateInverterData();
  updatePanelData();
  updateMeterData();
  updateACDBData();
  updateDCDBData();
  updateACCableData();
  updateEarthCableData();
  updateLAData();
  updateInstallationData();
  updateStructureData();
  updateCustomProductsPreview(); // updates any visible UI for custom products
  updateEarthingSetData();
}

/* ===========================
   6. CUSTOM PRODUCTS
   =========================== */

function addCustomProduct() {
  const list = $('customProductList');
  const idx = list.children.length + 1;
  const row = document.createElement('div');
  row.className = 'custom-row';
  row.dataset.idx = idx;
  row.innerHTML = `
    <div class="row small">
      <div class="col"><input type="text" class="cp-name" placeholder="Product name"/></div>
      <div class="col"><input type="number" class="cp-qty" placeholder="Qty" value="1" min="1"/></div>
      <div class="col"><input type="number" class="cp-price" placeholder="Price" /></div>
      <div class="col"><label class="switch-small"><input type="checkbox" class="cp-use-common" checked><span class="slider-small round"></span></label></div>
      <div class="col"><input type="number" class="cp-custom-margin" placeholder="Margin %" disabled /></div>
      <div class="col"><button class="btn danger" onclick="removeCustomProduct(this)">Delete</button></div>
    </div>
  `;
  list.appendChild(row);

  // wire events
  row.querySelector('.cp-use-common').addEventListener('change', (e) => {
    const cm = row.querySelector('.cp-custom-margin');
    cm.disabled = e.target.checked;
    recalcAllCards();
  });
  row.querySelector('.cp-qty').addEventListener('input', recalcAllCards);
  row.querySelector('.cp-price').addEventListener('input', recalcAllCards);
  row.querySelector('.cp-custom-margin').addEventListener('input', recalcAllCards);
}

function removeCustomProduct(btn) {
  const row = btn.closest('.custom-row');
  if (row) {
    row.remove();
    recalcAllCards();
  }
}

function updateCustomProductsPreview() {
  // No preview UI currently required, but this is placeholder for if you want to show totals per custom product
}

/* Build custom items for invoice */
function gatherCustomItems() {
  const items = [];
  document.querySelectorAll('.custom-row').forEach(row => {
    const name = row.querySelector('.cp-name').value || 'Custom Item';
    const qty = Math.max(0, n(row.querySelector('.cp-qty').value));
    const price = Math.max(0, n(row.querySelector('.cp-price').value));
    if (!qty || !price) return;
    const useCommon = row.querySelector('.cp-use-common').checked;
    const customMargin = n(row.querySelector('.cp-custom-margin').value);
    let rate = price;
    if (useCommon) {
      rate = round2(price * (1 + getCommonMargin()/100));
    } else if (customMargin > 0) {
      rate = round2(price * (1 + customMargin/100));
    }
    const gstPct = getGstFor('custom'); // custom -> 18% default
    items.push({
      type: 'custom',
      item: name,
      desc: '',
      qty,
      unit: 'Nos',
      baseRate: rate,
      gstPercent: gstPct
    });
  });
  return items;
}

/* ===========================
   7. BUILD LINE ITEMS & TOTALS
   =========================== */

function buildLineItemsForQuotation() {
  const items = [];

  // inverter
  if (isEnabled('inverter')) {
    const sel = $('inverterModel').selectedOptions[0];
    if (sel) {
      const qty = Math.max(1, n($('inverterQty').value));
      const dealer = n(sel.dataset.price);
      const base = computeBasePrice('inverter', dealer);
      const rate = applyMarginTo(base, 'inverter');
      items.push({
  type: 'inverter',
  item: sel.value,
  desc: `${sel.value} (${sel.dataset.capacity} kW)`,
  qty,
  unit: 'Nos',
  baseRate: rate,
  gstPercent: getGstFor('inverter')
});
    }
  }

  // panels
  if (isEnabled('panels')) {
    const sel = $('panelModel').selectedOptions[0];
    if (sel) {
      const qty = Math.max(0, n($('panelQty').value));
      const dealer = n(sel.dataset.price);
      const base = computeBasePrice('panels', dealer);
      const rate = applyMarginTo(base, 'panels');
      items.push({
  type: 'panels',
  item: sel.value,
  desc: `${sel.value} (${sel.dataset.watt} Wp)`,
  qty,
  unit: 'Nos',
  baseRate: rate,
  gstPercent: getGstFor('panels')
});
    }
  }

  // meter
  if (isEnabled('meter')) {
    const sel = $('meterType').selectedOptions[0];
    if (sel) {
      const qty = Math.max(1, n($('meterQty').value));
      const dealer = n(sel.dataset.price);
      const base = computeBasePrice('meter', dealer);
      const rate = applyMarginTo(base, 'meter');
      items.push({
  type: 'meter',
  item: 'Bi-Directional Meter',
  desc: sel.value === 'single' ? 'Single Phase' : 'Three Phase',
  qty,
  unit: 'Nos',
  baseRate: rate,
  gstPercent: getGstFor('meter')
});
    }
  }

  // ACDB
  if (isEnabled('acdb')) {
    const sel = $('acdbModel').selectedOptions[0];
    if (sel) {
      const qty = Math.max(1, n($('acdbQty').value));
      const dealer = n(sel.dataset.price);
      const base = computeBasePrice('acdb', dealer);
      const rate = applyMarginTo(base, 'acdb');
      items.push({ type:'acdb', item: sel.value, desc: sel.value, qty, unit:'Nos', baseRate: rate, gstPercent: getGstFor('acdb') });
    }
  }

  // DCDB
  if (isEnabled('dcdb')) {
    const sel = $('dcdbModel').selectedOptions[0];
    if (sel) {
      const qty = Math.max(1, n($('dcdbQty').value));
      const dealer = n(sel.dataset.price);
      const base = computeBasePrice('dcdb', dealer);
      const rate = applyMarginTo(base, 'dcdb');
      items.push({ type:'dcdb', item: sel.value, desc: sel.value, qty, unit:'Nos', baseRate: rate, gstPercent: getGstFor('dcdb') });
    }
  }

  // AC cable
  if (isEnabled('acCable')) {
    const qty = Math.max(0, n($('acCableQty').value));
    const price = Math.max(0, n($('acCablePrice').value));
    if (qty && price) {
      const base = computeBasePrice('acCable', price);
      const rate = applyMarginTo(base, 'acCable');
      items.push({ type:'acCable', item: 'AC Cable', desc: $('acCableGauge').value || '', qty, unit: 'Mtr', baseRate: rate, gstPercent: getGstFor('acCable') });
    }
  }

  // Earth cable
  if (isEnabled('earthCable')) {
    const qty = Math.max(0, n($('earthCableQty').value));
    const price = Math.max(0, n($('earthCablePrice').value));
    if (qty && price) {
      const base = computeBasePrice('earthCable', price);
      const rate = applyMarginTo(base, 'earthCable');
      items.push({ type:'earthCable', item: 'Earthing Cable', desc: $('earthCableGauge').value || '', qty, unit: 'Mtr', baseRate: rate, gstPercent: getGstFor('earthCable') });
    }
  }

  // Lightning arrestor
  if (isEnabled('la')) {
    const qty = Math.max(0, n($('laQty').value));
    const price = Math.max(0, n($('laPrice').value));
    if (qty && price) {
      const base = computeBasePrice('la', price);
      const rate = applyMarginTo(base, 'la');
      items.push({ type:'la', item: 'Lightning Arrestor', desc:'', qty, unit:'Nos', baseRate: rate, gstPercent: getGstFor('la') });
    }
  }

   // Earthing Set
if (isEnabled('earthingSet')) {
  const qty = Math.max(1, n($('earthingSetQty').value));
  const dealer = 3000;
  const base = computeBasePrice('earthingSet', dealer);
  const rate = applyMarginTo(base, 'earthingSet');

  items.push({
    type: 'earthingSet',
    item: 'Earthing Set',
    desc: 'Earthing Set (Complete Kit)',
    qty,
    unit: 'Nos',
    baseRate: rate,
    gstPercent: 18
  });
}

  // installation
  if (isEnabled('installation')) {
    const qty = Math.max(0, n($('systemKw').value));
    const baseDealer = Math.max(0, n($('installEditable').value));
    if (qty && baseDealer) {
      const base = computeBasePrice('installation', baseDealer);
      const rate = applyMarginTo(base, 'installation');
      items.push({ type:'installation', item: 'Installation & Commissioning', desc:'Installation services', qty, unit:'kW', baseRate: rate, gstPercent: getGstFor('installation') });
    }
  }

  // structure
  if (isEnabled('structure')) {
    const qty = Math.max(0, n($('systemKw').value));
    const baseDealer = Math.max(0, n($('structEditable').value));
    if (qty && baseDealer) {
      const base = computeBasePrice('structure', baseDealer);
      const rate = applyMarginTo(base, 'structure');
      items.push({ type:'structure', item: 'Module Mounting Structure', desc:'Structure for PV modules', qty, unit:'kW', baseRate: rate, gstPercent: getGstFor('structure') });
    }
  }

  // custom products
  const customItems = gatherCustomItems();
  customItems.forEach(ci => items.push(ci));

  return items;
}

/* calculate totals */
function calcTotals() {
  const items = buildLineItemsForQuotation();
  let subtotal = 0;
  let totalGst = 0;
  items.forEach(it => {
    const amount = round2(it.baseRate * it.qty);
    const gstAmt = round2(amount * it.gstPercent / 100);
    subtotal = round2(subtotal + amount);
    totalGst = round2(totalGst + gstAmt);
  });
  const grandTotal = round2(subtotal + totalGst);

  // subsidy logic for ON-GRID
  const kw = Math.max(0, n($('systemKw').value));
  let subsidy = 0;
  if (kw > 0 && kw <= 2) subsidy = 60000;
  else if (kw >= 3 && kw <= 10) subsidy = 78000;

  return { items, subtotal, totalGst, grandTotal, subsidy };
}

/* ===========================
   8. QUOTATION HTML (Detailed & Summary)
   =========================== */

function generateDetailedQuote() {
    const quoteWindow = window.open("v-sustain-solar-quotation", "v-sustain-quote");

    const customerName = document.getElementById("customerName").value || "N/A";
    const customerAddress = document.getElementById("customerAddress").value || "N/A";
    const customerCity = document.getElementById("customerCity").value || "N/A";
    const customerEmail = document.getElementById("customerEmail").value || "N/A";

    const tableHTML = buildFinalTable(); // ← uses your existing table builder

    const html = `
    <html>
    <head>
        <title>V-Sustain Solar Energy – Detailed Quotation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background: #ffffff;
                color: #0f172a;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                color: #075985;
            }
            .divider {
                margin: 14px 0;
                border-bottom: 1px solid #94a3b8;
            }
            .customer-info {
                font-size: 14px;
                margin-bottom: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 12px;
            }
            th, td {
                padding: 10px;
                border: 1px solid #cbd5e1;
                text-align: left;
                font-size: 14px;
            }
            th {
                background: #e2e8f0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 13px;
                color: #475569;
            }
        </style>
    </head>

    <body>
        <div class="header">
            <h1>V-Sustain Solar Energy</h1>
            <div>Solar EPC Solutions – Bangalore</div>
            <div>support@vsustain.com • +91-XXXXXXXXXX</div>
        </div>

        <div class="divider"></div>

        <div class="customer-info">
            <strong>Customer Name:</strong> ${customerName}<br>
            <strong>Address:</strong> ${customerAddress}<br>
            <strong>City:</strong> ${customerCity}<br>
            <strong>Email:</strong> ${customerEmail}<br>
        </div>

        <h2>DETAILED QUOTATION</h2>

        ${tableHTML}

        <div class="footer">
            Thank you for choosing V-Sustain Solar Energy.
        </div>
    </body>
    </html>
    `;

    quoteWindow.document.write(html);
    quoteWindow.document.close();
}

function generateSummaryQuote() {
    const quoteWindow = window.open("v-sustain-solar-summary", "v-sustain-summary");

    const tableHTML = buildFinalTable(); // Same table for summary

    const html = `
    <html>
    <head>
        <title>V-Sustain Solar Energy – Summary</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                background: #ffffff;
                color: #0f172a;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                color: #075985;
            }
            .divider {
                margin: 14px 0;
                border-bottom: 1px solid #94a3b8;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 12px;
            }
            th, td {
                padding: 10px;
                border: 1px solid #cbd5e1;
                text-align: left;
            }
            th {
                background: #e2e8f0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                color: #475569;
                font-size: 13px;
            }
        </style>
    </head>

    <body>
        <div class="header">
            <h1>V-Sustain Solar Energy</h1>
            <div>Quick Summary Quotation</div>
        </div>

        <div class="divider"></div>

        ${tableHTML}

        <div class="footer">
            Thank you for choosing V-Sustain Solar Energy.
        </div>
    </body>
    </html>
    `;

    quoteWindow.document.write(html);
    quoteWindow.document.close();
}

/* builds a multi-page detailed quotation HTML (editable content) */
function buildDetailedQuotationHtml(totals, systemType) {
  const plantKw = Math.max(0, n($('systemKw').value));
  const customerName = ($('customerName') || {}).value || 'Customer Name';
  const customerAddress = ($('customerAddress') || {}).value || '';
  const customerCity = ($('customerCity') || {}).value || '';
  const customerEmail = ($('customerEmail') || {}).value || '';
  const date = new Date();
  const proposalDate = date.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  const proposalNo = `VSS-${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

  // build spec rows (component list without price)
  const specRows = totals.items.map((it, idx) => {
    return `<tr>
      <td>${idx+1}</td>
      <td>${it.item}</td>
      <td>${escapeHtml(it.desc || '')}</td>
      <td>V-Sustain / Luminous</td>
      <td style="text-align:right">${it.qty}</td>
      <td style="text-align:center">${it.unit}</td>
    </tr>`;
  }).join('');

  // build pricing rows
  const pricingRows = totals.items.map((it, idx) => {
    const amount = round2(it.baseRate * it.qty);
    const gstAmt = round2(amount * it.gstPercent / 100);
    const total = round2(amount + gstAmt);
    return `<tr>
      <td>${idx+1}</td>
      <td>${it.item}</td>
      <td>${escapeHtml(it.desc || '')}</td>
      <td style="text-align:right">${it.qty}</td>
      <td style="text-align:center">${it.unit}</td>
      <td style="text-align:right">${fmt(it.baseRate)}</td>
      <td style="text-align:right">${fmt(amount)}</td>
      <td style="text-align:right">${it.gstPercent}%</td>
      <td style="text-align:right">${fmt(gstAmt)}</td>
      <td style="text-align:right">${fmt(total)}</td>
    </tr>`;
  }).join('');

  // subsidy row (if applicable)
  const subsidyRow = totals.subsidy > 0 ? `
    <tr>
      <td colspan="9" style="text-align:right"><strong>Subsidy (applied)</strong></td>
      <td style="text-align:right">-${fmt(totals.subsidy)}</td>
    </tr>
  ` : '';

  // Full HTML (multi-page)
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Quotation - V-Sustain Solar Solutions</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    /* Minimal inline styles for the printed quotation */
    body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#0f172a; margin:0; padding:0; background:#f3f4f6; }
    .doc { max-width:900px; margin:18px auto; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(2,6,23,0.08); overflow:hidden; }
    .page { padding:28px 34px; min-height:1120px; position:relative; }
    .page + .page { page-break-before: always; }
    header.top { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:14px; }
    .logo { width:74px; height:74px; border-radius:12px; background:linear-gradient(135deg,#dbeafe,#1d4ed8); display:flex; align-items:center; justify-content:center; color:white; font-weight:700; }
    h1 { margin:0; font-size:20px; }
    .meta { text-align:right; font-size:12px; color:#475569; }
    .cover-hero { height:340px; border-radius:10px; overflow:hidden; background-image: linear-gradient(180deg, rgba(2,6,23,0.12), rgba(2,6,23,0.45)), url('cover-banner-placeholder.jpg'); background-size:cover; background-position:center; display:flex; align-items:flex-end; padding:18px; color:#fff; }
    .cover-hero h2 { margin:0; font-size:30px; }
    .section { margin-top:16px; }
    table { width:100%; border-collapse:collapse; font-size:12px; margin-top:8px; }
    th, td { padding:8px 8px; border:1px solid #edf2f7; vertical-align:top; }
    th { background:#eff6ff; text-align:left; font-weight:600; }
    tfoot td { font-weight:700; }
    .right { text-align:right; }
    .small { font-size:11px; color:#64748b; }
    .note-box { margin-top:8px; padding:10px; border-radius:8px; background:#fff7ed; border:1px solid #fef3c7; }
    .editable { outline: none; }
    .footer { position:absolute; bottom:18px; left:34px; right:34px; display:flex; justify-content:space-between; font-size:11px; color:#94a3b8; }
    .warranty { display:flex; gap:12px; margin-top:8px; }
    .w-card { flex:1; background:#ecfccb; padding:10px; border-radius:8px; text-align:center; }
  </style>
</head>
<body>
  <div class="doc">

    <!-- PAGE 1: COVER -->
    <section class="page">
      <header class="top">
        <div style="display:flex;gap:12px;align-items:center;">
          <div class="logo editable" contenteditable="true">VSS</div>
          <div>
            <h1 contenteditable="true">V-Sustain Solar Solutions</h1>
            <div class="small editable" contenteditable="true">Authorized Luminous Partner • Bengaluru</div>
          </div>
        </div>
        <div class="meta">
          <div contenteditable="true"><strong>Proposal For:</strong> ${escapeHtml(customerName)}</div>
          <div class="small" contenteditable="true">${escapeHtml(customerAddress)} ${escapeHtml(customerCity)}</div>
          <div style="margin-top:8px;"><strong>Date:</strong> ${proposalDate}</div>
          <div><strong>Proposal No:</strong> ${proposalNo}</div>
        </div>
      </header>

      <div class="cover-hero">
        <div>
          <h2 contenteditable="true">${plantKw} kW On-Grid Rooftop Solar Solution</h2>
          <div class="small editable" contenteditable="true" style="margin-top:8px;">
            Clean energy for sustainable savings. Proposal prepared based on preliminary site inputs.
          </div>
        </div>
      </div>

      <div class="section">
        <h3 contenteditable="true">Prepared By</h3>
        <div class="small editable" contenteditable="true">
          V-Sustain Solar Solutions<br/>Pravesh Kumar Tiwari<br/>vsustainsolarsolutions@gmail.com • +91 99-000-00476
        </div>
      </div>

      <div class="footer"> <div>V-Sustain Solar Solutions</div> <div>Page 1</div> </div>
    </section>

    <!-- PAGE 2: PROJECT OVERVIEW + SPEC -->
    <section class="page">
      <h2 contenteditable="true">Project Overview</h2>
      <div class="small editable" contenteditable="true">
        System Type: ${escapeHtml(systemType)} • Site: ${escapeHtml(customerCity)} • Capacity: ${plantKw} kW
      </div>

      <div class="section">
        <h3 contenteditable="true">System Description</h3>
        <div class="small editable" contenteditable="true">
          This proposed system comprises high-efficiency PV modules, inverter, BOS items and a robust mounting structure.
          Final design will be confirmed after site survey and structural checks.
        </div>
      </div>

      <div class="section">
        <h3 contenteditable="true">System Specification</h3>
        <table>
          <thead>
            <tr><th>S.No</th><th>Component</th><th>Description</th><th>Make</th><th>Qty</th><th>UoM</th></tr>
          </thead>
          <tbody>
            ${specRows}
          </tbody>
        </table>
      </div>

      <div class="footer"> <div>System Specification</div> <div>Page 2</div> </div>
    </section>

    <!-- PAGE 3: WHY LUMINOUS & WARRANTY -->
    <section class="page">
      <h2 contenteditable="true">Why Luminous</h2>
      <div class="small editable" contenteditable="true">
        Eco-Friendly Branding • Loyal • Sustainable Future. Customized solutions, minimal maintenance, quality products.
      </div>

      <div class="warranty">
        <div class="w-card editable" contenteditable="true">
          <div style="font-weight:700">PV Modules</div>
          <div>30 Years*</div>
        </div>
        <div class="w-card editable" contenteditable="true">
          <div style="font-weight:700">Inverter</div>
          <div>8 Years*</div>
        </div>
        <div class="w-card editable" contenteditable="true">
          <div style="font-weight:700">System</div>
          <div>5 Years*</div>
        </div>
      </div>

      <div class="section">
        <h3 contenteditable="true">Customer Gallery / Testimonials</h3>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px;">
          <div style="height:80px;border-radius:8px;background:#f1f5f9;border:1px dashed #e2e8f0" contenteditable="true">Image 1</div>
          <div style="height:80px;border-radius:8px;background:#f1f5f9;border:1px dashed #e2e8f0" contenteditable="true">Image 2</div>
          <div style="height:80px;border-radius:8px;background:#f1f5f9;border:1px dashed #e2e8f0" contenteditable="true">Image 3</div>
          <div style="height:80px;border-radius:8px;background:#f1f5f9;border:1px dashed #e2e8f0" contenteditable="true">Image 4</div>
        </div>
      </div>

      <div class="footer"> <div>Why Luminous • Warranty</div> <div>Page 3</div> </div>
    </section>

    <!-- PAGE 4: COMMERCIAL OFFER (PRICE BREAKUP) -->
    <section class="page">
      <h2 contenteditable="true">Commercial Offer</h2>

      <table>
        <thead>
          <tr>
            <th>S.No</th><th>Item</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate (₹)</th><th>Amount (₹)</th><th>GST%</th><th>GST (₹)</th><th>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${pricingRows}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="6"></td>
            <td class="right">${fmt(totals.subtotal)}</td>
            <td></td>
            <td class="right">${fmt(totals.totalGst)}</td>
            <td class="right">${fmt(totals.grandTotal)}</td>
          </tr>
          ${subsidyRow}
        </tfoot>
      </table>

      <div class="section note-box editable" contenteditable="true">
        Payment Terms: 40% Advance with PO • 50% on Material Delivery • 10% after Commissioning
      </div>

      <div class="footer"> <div>Commercial Offer</div> <div>Page 4</div> </div>
    </section>

    <!-- PAGE 5: TERMS & BANK DETAILS -->
    <section class="page">
      <h2 contenteditable="true">Terms & Conditions</h2>
      <div class="small editable" contenteditable="true">
        These General Terms and Conditions have been agreed between the customer/consumer and the Channel Partner only.
        Quotation is valid for 15 Days from date of submission. Taxes & Duties: On materials, if after acceptance of Purchase Order due to change of government policy any new taxes are applicable, they will be to the Consumer's account.
      </div>

      <div style="display:flex;gap:12px;margin-top:10px;">
        <div style="flex:1">
          <h3 contenteditable="true">Bank Details</h3>
          <div class="small editable" contenteditable="true">
            BANK NAME: BANK OF INDIA (SANJAY NAGAR)<br/>
            ACCOUNT NO: 849330150000010<br/>
            IFSC CODE: BKID0008493
          </div>
        </div>
        <div style="flex:1">
          <h3 contenteditable="true">Contact</h3>
          <div class="small editable" contenteditable="true">
            V-Sustain Solar Solutions<br/>vsustainsolarsolutions@gmail.com<br/>Pravesh Kumar Tiwari<br/>+91 99-000-00476
          </div>
        </div>
      </div>

      <div class="footer"> <div>Terms & Conditions</div> <div>Page 5</div> </div>
    </section>

  </div>

  <script>
    // nothing here — this is a generated static doc; contenteditable fields allow on-the-fly edits
    // user can use browser print to generate PDF
  </script>
</body>
</html>`;

  return html;
}

/* builds a compact summary quotation (items + qty + total) */
function buildSummaryQuotationHtml(totals, systemType) {
  const plantKw = Math.max(0, n($('systemKw').value));
  const customerName = ($('customerName') || {}).value || 'Customer Name';
  const date = new Date();
  const proposalDate = date.toLocaleDateString('en-IN');

  const rows = totals.items.map((it, idx) => {
    return `<tr><td>${idx+1}</td><td>${it.item}</td><td>${escapeHtml(it.desc||'')}</td><td style="text-align:right">${it.qty}</td><td style="text-align:right">${fmt(round2(it.baseRate*it.qty))}</td></tr>`;
  }).join('');

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Summary Quote</title><style>
    body{font-family:system-ui;padding:18px;color:#0f172a}table{width:100%;border-collapse:collapse}th,td{border:1px solid #e6eef7;padding:8px}
  </style></head><body>
    <h2>Summary Quotation - V-Sustain Solar Solutions</h2>
    <div><strong>For:</strong> ${escapeHtml(customerName)} • ${escapeHtml(systemType)} • ${plantKw} kW</div>
    <div style="margin-top:12px">
      <table><thead><tr><th>S.No</th><th>Item</th><th>Description</th><th>Qty</th><th>Value (₹)</th></tr></thead><tbody>${rows}</tbody></table>
    </div>
    <div style="margin-top:12px"><strong>Grand Total (incl. GST):</strong> ${fmt(totals.grandTotal)}</div>
    <div style="margin-top:18px">Proposal Date: ${proposalDate}</div>
  </body></html>`;

  return html;
}

/* open the generated html in a new tab */
function openInNewWindow(html) {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup blocked. Allow popups for this site to see the quotation.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

/* small escape to avoid raw HTML breakouts from descriptions */
function escapeHtml(text) {
  return String(text || '').replace(/[&<>"']/g, function (m) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m];
  });
}

/* ===========================
   9. Finish / Helpers & Boot
   =========================== */

// initialization helper to avoid missing elements in different builds
function safeGet(id) {
  const el = document.getElementById(id);
  return el ? el : { value: '', checked: false };
}

// Small helper to initialize UI states when file first loads
(function boot() {
  // ensure custom margin inputs disabled by default where "use common" is checked
  ['inverter','panels','meter','acdb','dcdb','installation','structure'].forEach(id => {
    toggleCustomMarginInput(id);
  });
})();
