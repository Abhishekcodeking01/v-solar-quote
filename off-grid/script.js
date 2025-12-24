/*******************************************************
 * off-grid/script.js
 * Rebuilt calculation + quotation engine for Off-Grid
 * Based on On-Grid logic + Battery integration
 *******************************************************/

/* ===========================
   1. DATASETS (editable)
   =========================== */

// OFF-GRID INVERTERS (Standard placeholder list - editable)
const inverterList = [
  { model: "Off-Grid 1kVA 12V", capacityKw: 1, warranty: "2 Years", price: 6500 },
  { model: "Off-Grid 2kVA 24V", capacityKw: 2, warranty: "2 Years", price: 14500 },
  { model: "Off-Grid 3kVA 48V", capacityKw: 3, warranty: "2 Years", price: 28000 },
  { model: "Off-Grid 5kVA 48V", capacityKw: 5, warranty: "2 Years", price: 45000 },
  { model: "Off-Grid 7.5kVA 96V", capacityKw: 7.5, warranty: "2 Years", price: 85000 },
  { model: "Off-Grid 10kVA 120V", capacityKw: 10, warranty: "2 Years", price: 110000 }
];

// SOLAR PANELS
const panelList = [
  { model: "POLY 170W/12V", watt: 170, price: 3815 },
  { model: "PV MOD LUM24550M DCR BI-TS EXWH31", watt: 550, price: 14025 },
  { model: "PV MOD LUM 24585T144 TCHC 144C EXWH31", watt: 585, price: 9694 },
  { model: "PV MOD LUM 24590T144 BI-TS-31", watt: 590, price: 9694 }
];

// BATTERIES (New for Off-Grid)
const batteryList = [
  { model: "150 Ah Tubular Battery", voltage: 12, warranty: "3 Years", price: 13500 },
  { model: "200 Ah Tubular Battery", voltage: 12, warranty: "3 Years", price: 18500 },
  { model: "100 Ah Li-Ion 48V", voltage: 48, warranty: "5 Years", price: 95000 }
];

// ACDB / DCDB
const acdbList = [
  { sku: "TSAD0AC32PH1", desc: "ACDB Single Phase 32 Amp", price: 1899.80 },
  { sku: "TSAD0AC63PH1", desc: "ACDB Single Phase 63 Amp", price: 2312.80 },
  { sku: "TSAD0AC40PH1", desc: "ACDB Single Phase 40 Amp", price: 2277.40 },
  { sku: "TSAD0AC32PH3", desc: "ACDB Three Phase 32 Amp", price: 4177.20 }
];

const dcdbList = [
  { sku: "TSADDC600V11", desc: "DCDB 1 In 1 Out With MCB", price: 1939.92 },
  { sku: "TSADDC600V22", desc: "DCDB 2 In 2 Out With Fuse", price: 2808.40 },
  { sku: "TSADDC600V21", desc: "DCDB 2 In 1 Out With MCB", price: 2997.20 }
];

// Meter Options (Usually not applicable for pure off-grid, but keeping for hybrid/compatibility if needed)
const meterOptions = [
  { code: "single", label: "Single Phase Check Meter", price: 1500 },
  { code: "three", label: "Three Phase Check Meter", price: 3500 }
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

  // Battery Select
  const battSel = $('batteryModel');
  batteryList.forEach(b => {
    const o = document.createElement('option');
    o.value = b.model;
    o.dataset.price = b.price;
    o.dataset.voltage = b.voltage;
    o.textContent = `${b.model} (${b.voltage}V) — ${fmt(b.price)}`;
    battSel.appendChild(o);
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
}

function attachEventListeners() {
  // System KW
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
  $('panelOverrideToggle').addEventListener('change', () => toggleOverrideUI('panel'));
  $('panelOverridePrice').addEventListener('input', updatePanelData);
  $('panelsUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'panels'));
  $('panelsCustomMargin').addEventListener('input', updatePanelData);

  // Battery (New)
  $('batteryModel').addEventListener('change', updateBatteryData);
  $('batteryQty').addEventListener('input', updateBatteryData);
  $('batteryOverrideToggle').addEventListener('change', () => toggleOverrideUI('battery'));
  $('batteryOverridePrice').addEventListener('input', updateBatteryData);
  $('batteryUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'battery'));
  $('batteryCustomMargin').addEventListener('input', updateBatteryData);

  // ACDB/DCDB/Cables/LA/Install/Struct - Same as On-Grid
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

  $('acCableQty').addEventListener('input', updateACCableData);
  $('acCablePrice').addEventListener('input', updateACCableData);
  $('earthCableQty').addEventListener('input', updateEarthCableData);
  $('earthCablePrice').addEventListener('input', updateEarthCableData);

  $('laQty').addEventListener('input', updateLAData);
  $('laPrice').addEventListener('input', updateLAData);

  $('installEditable').addEventListener('input', updateInstallationData);
  $('installUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null,'installation'));
  $('installCustomMargin').addEventListener('input', updateInstallationData);

  $('structEditable').addEventListener('input', updateStructureData);
  $('structUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null,'structure'));
  $('structCustomMargin').addEventListener('input', updateStructureData);

  // Earthing Set
  $('earthingSetQty').addEventListener('input', updateEarthingSetData);
  $('earthingSetOverrideToggle').addEventListener('change', () => toggleOverrideUI('earthingSet'));
  $('earthingSetOverridePrice').addEventListener('input', updateEarthingSetData);
  $('earthingSetUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'earthingSet'));
  $('earthingSetCustomMargin').addEventListener('input', updateEarthingSetData);

  // Toggles
  ['inverter','panels','battery','acdb','dcdb','acCable','earthCable','la','installation','structure','earthingSet'].forEach(pid => {
    const el = document.querySelector(`#${pid}Card input[type="checkbox"]`);
    if (el) el.addEventListener('change', () => recalcAllCards());
  });
}

function setInitialValues() {
  const kw = Math.max(1, n($('systemKw').value) || 1);
  $('installBase').value = round2(kw * 5000);
  $('structBase').value = round2(kw * 8000);
  $('installEditable').value = round2(kw * 5000);
  $('structEditable').value = round2(kw * 8000);
}

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
  recalcAllCards();
}

function computeBasePrice(sectionId, dealerPrice) {
  const overrideToggle = $(`${sectionId}OverrideToggle`);
  const overrideInput = $(`${sectionId}OverridePrice`);
  if (overrideToggle && overrideToggle.checked && overrideInput) {
    const v = n(overrideInput.value);
    if (v > 0) return v;
  }
  return dealerPrice;
}

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

// TAXATION LOGIC - Off-Grid specific
// Panels 5%, Inverter 18% (often), Battery 28% (usually), Others 18%
function getGstFor(type) {
  if (type === 'panels') return 5;
  if (type === 'battery') return 28; 
  return 18; // Inverter and others
}

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
    $('panelTotal').value = '';
    return;
  }
  const sel = $('panelModel');
  const opt = sel.selectedOptions[0];
  const kw = Math.max(0, n($('systemKw').value));
  if (!opt || !kw) return;

  const watt = n(opt.dataset.watt);
  const dealer = n(opt.dataset.price);

  const totalWatt = round2(kw * 1000);
  const qty = Math.ceil(totalWatt / Math.max(1, watt));
  const dcCapacityKw = round2((qty * watt) / 1000);

  const base = computeBasePrice('panel', dealer); // ID 'panelOverridePrice'
  const finalRate = applyMarginTo(base, 'panels'); 
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

function updateBatteryData() {
  if (!isEnabled('battery')) {
    $('batteryTotal').value = '';
    return;
  }
  const sel = $('batteryModel');
  const opt = sel.selectedOptions[0];
  if (!opt) return;

  const dealer = n(opt.dataset.price);
  const qty = Math.max(1, n($('batteryQty').value));
  
  const base = computeBasePrice('battery', dealer);
  const finalRate = applyMarginTo(base, 'battery');
  const gstPct = getGstFor('battery');
  const amount = round2(finalRate * qty);
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('batteryDealer').value = round2(dealer);
  $('batteryFinalRate').value = round2(finalRate);
  $('batteryGST').value = gstAmt;
  $('batteryTotal').value = total;
}

// ... ACDB, DCDB, Cables, LA, Installation, Structure, EarthingSet (Standard Update Functions) ...
// Copying logic from On-Grid but ensuring references exist
function updateACDBData() {
  if (!isEnabled('acdb')) { $('acdbTotal').value = ''; return; }
  const sel = $('acdbModel'); const opt = sel.selectedOptions[0]; if (!opt) return;
  const dealer = n(opt.dataset.price); const qty = Math.max(1, n($('acdbQty').value));
  const base = computeBasePrice('acdb', dealer); const finalRate = applyMarginTo(base, 'acdb');
  const total = round2(round2(finalRate * qty) * (1 + getGstFor('acdb')/100));
  $('acdbDealer').value = round2(dealer); $('acdbGST').value = round2((finalRate * qty) * getGstFor('acdb')/100); $('acdbTotal').value = total;
}
function updateDCDBData() {
  if (!isEnabled('dcdb')) { $('dcdbTotal').value = ''; return; }
  const sel = $('dcdbModel'); const opt = sel.selectedOptions[0]; if (!opt) return;
  const dealer = n(opt.dataset.price); const qty = Math.max(1, n($('dcdbQty').value));
  const base = computeBasePrice('dcdb', dealer); const finalRate = applyMarginTo(base, 'dcdb');
  const total = round2(round2(finalRate * qty) * (1 + getGstFor('dcdb')/100));
  $('dcdbDealer').value = round2(dealer); $('dcdbGST').value = round2((finalRate * qty) * getGstFor('dcdb')/100); $('dcdbTotal').value = total;
}
function updateACCableData() {
  if (!isEnabled('acCable')) { $('acCableTotal').value = ''; return; }
  const qty = n($('acCableQty').value); const price = n($('acCablePrice').value);
  const base = computeBasePrice('acCable', price); const finalRate = applyMarginTo(base, 'acCable');
  $('acCableTotal').value = round2(round2(finalRate * qty) * (1 + getGstFor('acCable')/100));
}
function updateEarthCableData() {
  if (!isEnabled('earthCable')) { $('earthCableTotal').value = ''; return; }
  const qty = n($('earthCableQty').value); const price = n($('earthCablePrice').value);
  const base = computeBasePrice('earthCable', price); const finalRate = applyMarginTo(base, 'earthCable');
  $('earthCableTotal').value = round2(round2(finalRate * qty) * (1 + getGstFor('earthCable')/100));
}
function updateLAData() {
  if (!isEnabled('la')) { $('laTotal').value = ''; return; }
  const qty = n($('laQty').value); const price = n($('laPrice').value);
  const base = computeBasePrice('la', price); const finalRate = applyMarginTo(base, 'la');
  $('laTotal').value = round2(round2(finalRate * qty) * (1 + getGstFor('la')/100));
}
function updateInstallationData() {
  if (!isEnabled('installation')) { $('installTotal').value = ''; return; }
  const qty = n($('systemKw').value); const dealer = n($('installEditable').value);
  const base = computeBasePrice('installation', dealer); const finalRate = applyMarginTo(base, 'installation');
  const total = round2(round2(finalRate * qty) * (1 + getGstFor('installation')/100));
  $('installGST').value = round2((finalRate * qty) * getGstFor('installation')/100); $('installTotal').value = total;
}
function updateStructureData() {
  if (!isEnabled('structure')) { $('structTotal').value = ''; return; }
  const qty = n($('systemKw').value); const dealer = n($('structEditable').value);
  const base = computeBasePrice('structure', dealer); const finalRate = applyMarginTo(base, 'structure');
  const total = round2(round2(finalRate * qty) * (1 + getGstFor('structure')/100));
  $('structGST').value = round2((finalRate * qty) * getGstFor('structure')/100); $('structTotal').value = total;
}
function updateEarthingSetData() {
  if (!isEnabled('earthingSet')) { $('earthingSetTotal').value = ''; return; }
  const qty = n($('earthingSetQty').value); const dealer = 3000;
  const base = computeBasePrice('earthingSet', dealer); const finalRate = applyMarginTo(base, 'earthingSet');
  const total = round2(round2(finalRate * qty) * (1 + 18/100));
  $('earthingSetDealer').value = dealer; $('earthingSetGST').value = round2((finalRate * qty) * 18/100); $('earthingSetTotal').value = total;
}

function recalcAllCards() {
  updateInverterData(); updatePanelData(); updateBatteryData();
  updateACDBData(); updateDCDBData(); updateACCableData();
  updateEarthCableData(); updateLAData(); updateInstallationData();
  updateStructureData(); updateEarthingSetData();
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
      <div class="col"><input type="number" class="cp-gst" placeholder="GST %" value="18" /></div>
      <div class="col"><button class="btn danger" onclick="removeCustomProduct(this)">Delete</button></div>
    </div>
  `;
  list.appendChild(row);
  row.querySelectorAll('input').forEach(i => i.addEventListener('input', recalcAllCards));
  row.querySelector('.cp-use-common').addEventListener('change', (e) => {
    row.querySelector('.cp-custom-margin').disabled = e.target.checked;
    recalcAllCards();
  });
}
function removeCustomProduct(btn) { btn.closest('.custom-row').remove(); recalcAllCards(); }

function gatherCustomItems() {
  const items = [];
  document.querySelectorAll('.custom-row').forEach(row => {
    const name = row.querySelector('.cp-name').value || 'Custom Item';
    const qty = Math.max(0, n(row.querySelector('.cp-qty').value));
    const price = Math.max(0, n(row.querySelector('.cp-price').value));
    if (!qty || !price) return;
    const useCommon = row.querySelector('.cp-use-common').checked;
    const customMargin = n(row.querySelector('.cp-custom-margin').value);
    const gstPct = n(row.querySelector('.cp-gst').value) || 18;
    let rate = price;
    if (useCommon) rate = round2(price * (1 + getCommonMargin()/100));
    else if (customMargin > 0) rate = round2(price * (1 + customMargin/100));
    items.push({ type: 'custom', item: name, desc: '', qty, unit: 'Nos', baseRate: rate, gstPercent: gstPct });
  });
  return items;
}

/* ===========================
   7. BUILD LINE ITEMS
   =========================== */
function buildLineItemsForQuotation() {
  const items = [];
  // Inverter
  if (isEnabled('inverter')) {
    const sel = $('inverterModel').selectedOptions[0];
    if (sel) {
      const qty = n($('inverterQty').value);
      const base = computeBasePrice('inverter', n(sel.dataset.price));
      const rate = applyMarginTo(base, 'inverter');
      items.push({ type:'inverter', item: sel.value, desc: 'Off-Grid Inverter', qty, unit:'Nos', baseRate:rate, gstPercent: getGstFor('inverter') });
    }
  }
  // Panels
  if (isEnabled('panels')) {
    const sel = $('panelModel').selectedOptions[0];
    if (sel) {
      const qty = n($('panelQty').value);
      const base = computeBasePrice('panel', n(sel.dataset.price));
      const rate = applyMarginTo(base, 'panels');
      items.push({ type:'panels', item: sel.value, desc: `${sel.dataset.watt}Wp`, qty, unit:'Nos', baseRate:rate, gstPercent: getGstFor('panels') });
    }
  }
  // Battery
  if (isEnabled('battery')) {
    const sel = $('batteryModel').selectedOptions[0];
    if (sel) {
      const qty = n($('batteryQty').value);
      const base = computeBasePrice('battery', n(sel.dataset.price));
      const rate = applyMarginTo(base, 'battery');
      items.push({ type:'battery', item: sel.value, desc: `${sel.dataset.voltage}V Battery`, qty, unit:'Nos', baseRate:rate, gstPercent: getGstFor('battery') });
    }
  }
  // Others
  if(isEnabled('acdb')){ 
    const sel=$('acdbModel').selectedOptions[0]; if(sel) {
    const qty=n($('acdbQty').value); const base=computeBasePrice('acdb',n(sel.dataset.price));
    items.push({type:'acdb',item:sel.value,desc:'',qty,unit:'Nos',baseRate:applyMarginTo(base,'acdb'),gstPercent:getGstFor('acdb')});
  }}
  if(isEnabled('dcdb')){ 
    const sel=$('dcdbModel').selectedOptions[0]; if(sel) {
    const qty=n($('dcdbQty').value); const base=computeBasePrice('dcdb',n(sel.dataset.price));
    items.push({type:'dcdb',item:sel.value,desc:'',qty,unit:'Nos',baseRate:applyMarginTo(base,'dcdb'),gstPercent:getGstFor('dcdb')});
  }}
  if(isEnabled('acCable')){ 
    const qty=n($('acCableQty').value); const pr=n($('acCablePrice').value); if(qty && pr) {
    const base=computeBasePrice('acCable',pr); 
    items.push({type:'acCable',item:'AC Cable',desc:$('acCableGauge').value,qty,unit:'Mtr',baseRate:applyMarginTo(base,'acCable'),gstPercent:getGstFor('acCable')});
  }}
  if(isEnabled('earthCable')){ 
    const qty=n($('earthCableQty').value); const pr=n($('earthCablePrice').value); if(qty && pr) {
    const base=computeBasePrice('earthCable',pr); 
    items.push({type:'earthCable',item:'Earth Cable',desc:$('earthCableGauge').value,qty,unit:'Mtr',baseRate:applyMarginTo(base,'earthCable'),gstPercent:getGstFor('earthCable')});
  }}
  if(isEnabled('la')){ 
    const qty=n($('laQty').value); const pr=n($('laPrice').value); if(qty && pr) {
    const base=computeBasePrice('la',pr); 
    items.push({type:'la',item:'Lightning Arrestor',desc:'',qty,unit:'Nos',baseRate:applyMarginTo(base,'la'),gstPercent:getGstFor('la')});
  }}
  if(isEnabled('installation')){ 
    const qty=n($('systemKw').value); const pr=n($('installEditable').value); if(qty && pr) {
    const base=computeBasePrice('installation',pr); 
    items.push({type:'installation',item:'Installation',desc:'',qty,unit:'kW',baseRate:applyMarginTo(base,'installation'),gstPercent:getGstFor('installation')});
  }}
  if(isEnabled('structure')){ 
    const qty=n($('systemKw').value); const pr=n($('structEditable').value); if(qty && pr) {
    const base=computeBasePrice('structure',pr); 
    items.push({type:'structure',item:'Structure',desc:'',qty,unit:'kW',baseRate:applyMarginTo(base,'structure'),gstPercent:getGstFor('structure')});
  }}
  if(isEnabled('earthingSet')){ 
    const qty=n($('earthingSetQty').value); const pr=3000; if(qty) {
    const base=computeBasePrice('earthingSet',pr); 
    items.push({type:'earthingSet',item:'Earthing Set',desc:'',qty,unit:'Nos',baseRate:applyMarginTo(base,'earthingSet'),gstPercent:18});
  }}
  
  gatherCustomItems().forEach(i => items.push(i));
  return items;
}

function calcTotals() {
  const items = buildLineItemsForQuotation();
  let subtotal = 0; let totalGst = 0;
  items.forEach(it => {
    const amt = round2(it.baseRate * it.qty);
    const gst = round2(amt * it.gstPercent / 100);
    subtotal += amt; totalGst += gst;
  });
  return { items, subtotal: round2(subtotal), totalGst: round2(totalGst), grandTotal: round2(subtotal + totalGst) };
}

/* ===========================
   8. QUOTATION GENERATION
   =========================== */
function generateDetailedQuote() { openInNewWindow(buildDetailedQuotationHtml(calcTotals(), 'Off-Grid')); }
function generateSummaryQuote() { openInNewWindow(buildSummaryQuotationHtml(calcTotals(), 'Off-Grid')); }
function generateShortQuote() { openInNewWindow(buildShortQuotationHtml(calcTotals(), 'Off-Grid')); }

function openInNewWindow(html) {
  const w = window.open("", "_blank");
  if(w) { w.document.write(html); w.document.close(); } else { alert("Popup blocked."); }
}

/* --- HTML TEMPLATES (Reusing On-Grid design with Off-Grid modifications) --- */
// Using the latest Design provided in conversation history
// Common Head/Style parts can be extracted to a helper if strict DRY needed, 
// but here I inline for standalone capability.

const commonStyle = `
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  <script>tailwind.config = { theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'] }, colors: { brand: { blue: '#005bac', lightBlue: '#4fa8e0', orange: '#ff9933', green: '#8cc63f' } } } } }</script>
  <style>
    @media print {
      @page { size: A4; margin: 0; }
      .page-break { page-break-before: always; break-before: page; }
      body { background: white; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .page-container { box-shadow: none; margin: 0; width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; border: none; }
      [contenteditable="true"] { outline: none; }
      .no-print { display: none !important; }
      body.print-mobile .page-container { transform: scale(0.92); transform-origin: top left; width: 108%; height: auto; overflow: visible; page-break-after: always; }
      body.print-laptop .page-container { width: 100%; height: auto; overflow: visible; max-height: none; }
    }
    body { background-color: #e5e7eb; }
    .page-container { background-color: white; background-image: url('https://github.com/Abhishekcodeking01/v-solar-quote/blob/8f2c0c796ba02307c87dda837a906dc9c079aa05/Uplodes/background%20v%20solar.png?raw=true'); background-size: cover; background-position: center; width: 210mm; min-height: 297mm; margin: 2rem auto; position: relative; box-shadow: 0 10px 15px rgba(0,0,0,0.1); display: flex; flex-direction: column; overflow: hidden; }
    .dots-pattern { background-image: radial-gradient(#4fa8e0 1px, transparent 1px); background-size: 10px 10px; width: 150px; height: 100px; position: absolute; opacity: 0.5; }
    .content-card-bg { background-color: rgba(255, 255, 255, 0.9); }
    .wave-corner-top-left-accent { position: absolute; top: 0; left: 0; width: 62%; height: 270px; background: #ff9933; border-bottom-right-radius: 100% 50%; z-index: 5; }
    .wave-corner-top-left { position: absolute; top: 0; left: 0; width: 60%; height: 250px; background-image: linear-gradient(135deg, #005bac 0%, #4fa8e0 100%); border-bottom-right-radius: 100% 50%; z-index: 10; }
  </style>
  <script>
    function printMode(mode) {
      document.body.className = 'font-sans text-gray-800';
      if (mode === 'mobile') document.body.classList.add('print-mobile');
      else if (mode === 'laptop') document.body.classList.add('print-laptop');
      window.print();
    }
  </script>
`;

function getCommonHtml(totals, type, isSummary, isShort) {
  const kw = n($('systemKw').value);
  const name = $('customerName').value || 'Customer';
  const email = $('customerEmail').value || '';
  const dateStr = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const propNo = `VS/${new Date().getFullYear()}/OG-${Math.floor(Math.random()*1000)}`;

  // Rows logic
  const specRows = totals.items.map(i => `
    <tr class="odd:bg-white/50 even:bg-gray-50/50">
      <td class="p-2 border font-semibold">${i.item}</td>
      <td class="p-2 border">${i.desc||'-'}</td>
      <td class="p-2 border">Standard</td>
      <td class="p-2 border text-center">${i.qty}</td>
      <td class="p-2 border text-center">${i.unit}</td>
    </tr>`).join('');
  
  const commRows = totals.items.map((i, idx) => `
    <tr class="odd:bg-white/50 even:bg-gray-50/50">
      <td class="p-3 border text-center">${idx+1}</td>
      <td class="p-3 border">${i.item}</td>
      <td class="p-3 border text-center">${i.unit}</td>
      <td class="p-3 border text-center">${i.qty}</td>
      <td class="p-3 border text-right">${isSummary ? '-' : fmt(i.baseRate * i.qty)}</td>
    </tr>`).join('');

  const footer = `
    <tr class="bg-white/50"><td class="p-3 border"></td><td class="p-3 border text-right font-semibold">Total GST</td><td colspan="2" class="p-3 border"></td><td class="p-3 border text-right">${fmt(totals.totalGst)}</td></tr>
    <tr class="bg-blue-50/80 font-bold border-t-2 border-brand-blue"><td class="p-4 border"></td><td colspan="3" class="p-4 border text-right">GRAND TOTAL (INR)</td><td class="p-4 border text-right text-xl text-brand-blue">${fmt(totals.grandTotal)}</td></tr>
  `;

  // 1-Page Short Quote
  if (isShort) {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${kw}KW Off-Grid ${name} ${email}</title>${commonStyle}</head>
    <body class="font-sans text-gray-800">
      <div class="fixed bottom-8 right-8 z-50 no-print flex flex-col gap-3">
        <button onclick="printMode('laptop')" class="bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i class="fas fa-laptop"></i> Laptop</button>
        <button onclick="printMode('mobile')" class="bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i class="fas fa-mobile-alt"></i> Mobile</button>
      </div>
      <div class="page-container" style="padding:40px;">
        <div class="flex justify-between items-start border-b-2 border-brand-orange pb-6 mb-8">
            <div class="w-40"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
            <div class="text-right"><h1 class="text-3xl font-bold text-brand-blue">Quotation</h1><p class="text-sm font-semibold text-gray-600"># ${propNo}</p><p class="text-sm text-gray-500">${dateStr}</p></div>
        </div>
        <div class="flex justify-between mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div><h3 class="text-xs font-bold text-gray-400 uppercase">Proposal For</h3><p class="text-lg font-bold text-brand-blue">${name}</p><p class="text-sm text-gray-600">${$('customerAddress').value}</p></div>
            <div class="text-right"><h3 class="text-xs font-bold text-gray-400 uppercase">System Details</h3><p class="text-xl font-bold text-brand-green">${kw} KW</p><p class="text-sm text-gray-600">Off-Grid System</p></div>
        </div>
        <div class="mb-8">
            <h3 class="text-lg font-bold text-brand-blue mb-4 border-l-4 border-brand-blue pl-3">Commercial Offer</h3>
            <table class="w-full text-sm border-collapse"><tr class="bg-gray-100 border-b border-gray-200"><td class="p-4 font-medium">Supply & Installation of ${kw} KW Off-Grid Solar System</td><td class="p-4 text-right font-bold">${fmt(totals.grandTotal)}</td></tr></table>
            <div class="mt-2 text-right"><p class="text-xs text-gray-500">* Inclusive of GST & Installation</p></div>
        </div>
        <div class="absolute bottom-0 left-0 w-full bg-[#001f3f] text-white p-8"><div class="flex justify-between items-center max-w-4xl mx-auto"><div><h4 class="font-bold text-lg">V-Sustain Solar Solutions</h4></div><div class="text-right text-sm"><p>+91 99-000-00476</p><p>vsustainsolarsolutions@gmail.com</p></div></div></div>
      </div>
    </body></html>`;
  }

  // Full Quote (Detailed or Summary)
  // Page 2: Reduced diagram height and removed text as requested
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${kw}KW Off-Grid ${name} ${email}</title>${commonStyle}</head>
  <body class="font-sans text-gray-800">
    <div class="fixed bottom-8 right-8 z-50 no-print flex flex-col gap-3">
        <button onclick="printMode('laptop')" class="bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i class="fas fa-laptop"></i> Laptop</button>
        <button onclick="printMode('mobile')" class="bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i class="fas fa-mobile-alt"></i> Mobile</button>
    </div>
    
    <!-- P1: Cover -->
    <div class="page-container relative flex flex-col justify-between">
        <div class="h-[13%] w-full flex justify-between items-start p-2 relative z-20 bg-white/90">
             <div class="w-36"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full object-contain"></div>
             <div class="text-right text-brand-blue"><h2 class="font-bold text-xl">V-Sustain Solar Solutions</h2><p class="text-sm">Authorized Luminous Partner</p><p class="text-sm font-bold mt-1"># ${propNo}</p><p class="text-sm">${dateStr}</p></div>
        </div>
        <div class="h-[45%] w-full overflow-hidden relative"><img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop" class="w-full h-full object-cover"></div>
        <div class="h-[42%] w-full bg-[#001f3f] text-white p-12 flex flex-col justify-center relative"><div class="relative z-10 border-l-4 border-brand-lightBlue pl-6"><h1 class="text-4xl font-bold mb-2">Techno-commercial</h1><h1 class="text-4xl font-bold mb-8">Offer</h1><div class="space-y-1"><h3 class="text-xl font-bold">${kw} KW Off-Grid Solar</h3><h3 class="text-xl font-bold border-b border-gray-500 pb-2 mb-2 w-1/2">Solution</h3><p class="text-xl text-gray-300">Proposal for</p><p class="text-2xl font-semibold">${name}</p><p class="text-lg text-gray-300">${$('customerCity').value}</p></div></div></div>
    </div>

    <!-- P2: Project Explanation (Reduced text/image) -->
    <div class="page-container page-break relative">
        <div class="wave-corner-top-left-accent h-[150px]"></div><div class="wave-corner-top-left h-[130px]"></div>
        <div class="absolute top-8 right-8 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
        <div class="relative z-20 pt-40 px-12 pb-12 flex flex-col h-full justify-between">
            <div>
                <div class="flex items-center gap-3 mb-8"><i class="far fa-arrow-alt-circle-right text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Project Explanation</h2></div>
                <!-- Diagram Reduced to 350px -->
                <div class="flex items-center justify-center mb-8 relative h-[350px]">
                    <img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/d2ac544338d64714fdc75e8008f2a733bb61ab83/Uplodes/on%20grid%20plannnt%20explained.png?raw=true" class="h-full w-full object-contain shadow-lg rounded-lg bg-white/50">
                </div>
                <div class="space-y-6 bg-white/90 p-8 rounded-xl shadow-lg border-l-4 border-brand-green">
                    <div><h4 class="font-bold text-2xl mb-2 text-brand-blue flex items-center gap-2"><i class="fas fa-solar-panel"></i> ${kw} KW Off-Grid Solution</h4><ul class="list-none ml-2 text-gray-700"><li class="flex gap-2"><i class="fas fa-check text-brand-green"></i> Battery Backup Included</li></ul></div>
                    <div><h4 class="font-bold text-2xl mb-2 text-brand-blue flex items-center gap-2"><i class="fas fa-map-marker-alt"></i> Location</h4><p class="text-lg ml-2">${$('customerAddress').value}</p></div>
                </div>
            </div>
        </div>
    </div>

    <!-- P3: Specs -->
    <div class="page-container page-break relative flex flex-col">
       <div class="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-brand-blue to-brand-lightBlue z-10"></div>
       <div class="absolute top-4 right-8 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
       <div class="relative z-20 mt-16 px-12 h-full flex flex-col justify-start pb-12">
           <div class="flex items-center justify-between mb-8 border-b-2 border-brand-orange pb-2 w-[80%]"><div class="flex items-center gap-3"><i class="far fa-file-alt text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Techno-Commercial Offer</h2></div></div>
           <div class="mb-8"><h3 class="text-lg font-bold text-brand-green mb-3 pl-2 border-l-4 border-brand-green">1. System Specifications</h3><table class="w-full text-sm border-collapse shadow-sm bg-white/90"><thead><tr class="bg-brand-green text-white"><th class="p-3 border text-left">Component</th><th class="p-3 border text-left">Description</th><th class="p-3 border">Make</th><th class="p-3 border text-center">Qty</th><th class="p-3 border text-center">UoM</th></tr></thead><tbody>${specRows}</tbody></table></div>
       </div>
    </div>

    <!-- P4: Commercial -->
    <div class="page-container page-break relative flex flex-col">
       <div class="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-brand-blue to-brand-lightBlue z-10"></div>
       <div class="absolute top-4 right-8 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
       <div class="relative z-20 mt-16 px-12 h-full flex flex-col justify-between pb-12">
           <div class="flex items-center justify-between mb-8 border-b-2 border-brand-orange pb-2 w-[80%]"><div class="flex items-center gap-3"><i class="fas fa-rupee-sign text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Commercial Proposal</h2></div></div>
           <div class="mb-8"><table class="w-full text-sm border-collapse shadow-lg bg-white/90"><thead><tr class="bg-brand-blue text-white"><th class="p-3 border w-12">#</th><th class="p-3 border text-left">Description</th><th class="p-3 border text-center">UOM</th><th class="p-3 border text-center">Qty</th><th class="p-3 border text-right">Price (INR)</th></tr></thead><tbody>${commRows}${footer}</tbody></table></div>
           <div class="flex gap-6 mt-auto"><div class="w-2/3"><h3 class="text-sm font-bold text-brand-green mb-2">Optional Services</h3><table class="w-full text-xs border-collapse shadow-sm bg-white/90"><thead><tr class="bg-gray-600 text-white"><th class="p-2 text-left">Description</th><th class="p-2 text-center">Tenure</th><th class="p-2 text-right">Cost</th></tr></thead><tbody><tr class="bg-gray-50/50 border-b"><td class="p-2 font-semibold">AMC</td><td class="p-2 text-center">5 Years</td><td class="p-2 text-right">10,000</td></tr></tbody></table></div></div>
       </div>
    </div>

    <!-- P5, P6, P7, P8 (Why Us, Payment, Terms, Contact) - Standard Content, omitted for brevity but included in output if length permits. I will include full flow. -->
    
    <!-- P5: Why Us -->
    <div class="page-container page-break relative">
        <div class="wave-corner-top-left-accent h-[150px]"></div><div class="wave-corner-top-left h-[130px]"></div>
        <div class="absolute top-8 right-8 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
        <div class="absolute top-8 left-12 z-30 flex items-center gap-3"><i class="far fa-star text-3xl text-white"></i><h2 class="text-3xl font-bold text-white">Why Choose Us?</h2></div>
        <div class="relative z-20 mt-40 px-12 h-full pb-12 flex flex-col"><p class="text-lg text-gray-600 mb-12 border-l-4 border-brand-orange pl-4 italic bg-white/60 p-2 rounded">Empowering your home with eco-friendly solutions.</p>
        <div class="grid grid-cols-2 gap-12">
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green"><i class="fas fa-drafting-compass text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Customized Solution</h3><p class="text-sm text-gray-600">Tailored specifically to your energy needs.</p></div></div>
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue"><i class="fas fa-tools text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Minimal Maintenance</h3><p class="text-sm text-gray-600">Built to last with minimal upkeep.</p></div></div>
        </div></div>
    </div>
    
    <!-- P6: Payment -->
    <div class="page-container page-break relative">
        <div class="wave-top-accent"></div><div class="wave-top"></div>
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
        <div class="relative z-20 pt-48 px-12 pb-12">
            <div class="flex items-center gap-3 mb-16 mt-8"><i class="far fa-credit-card text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Payment Terms</h2></div>
            <div class="relative px-4 mb-20"><div class="absolute top-[35%] left-0 w-full h-1 bg-gray-200 z-0 -translate-y-1/2 rounded-full"></div>
            <div class="flex justify-between items-start relative z-10">
                <div class="flex flex-col items-center w-1/3"><div class="bg-white p-2 rounded-full shadow-lg border-4 border-brand-blue w-32 h-32 flex items-center justify-center mb-6"><i class="fas fa-file-contract text-5xl text-brand-blue"></i></div><div class="bg-white p-4 rounded-xl shadow-md border-b-4 border-brand-blue w-4/5 text-center"><span class="block text-3xl font-bold text-brand-blue">25%</span><span class="block text-sm">Advance</span></div></div>
                <div class="flex flex-col items-center w-1/3"><div class="bg-white p-2 rounded-full shadow-lg border-4 border-brand-orange w-32 h-32 flex items-center justify-center mb-6"><i class="fas fa-truck-fast text-5xl text-brand-orange"></i></div><div class="bg-white p-4 rounded-xl shadow-md border-b-4 border-brand-orange w-4/5 text-center"><span class="block text-3xl font-bold text-brand-orange">65%</span><span class="block text-sm">Delivery</span></div></div>
                <div class="flex flex-col items-center w-1/3"><div class="bg-white p-2 rounded-full shadow-lg border-4 border-brand-green w-32 h-32 flex items-center justify-center mb-6"><i class="fas fa-clipboard-check text-5xl text-brand-green"></i></div><div class="bg-white p-4 rounded-xl shadow-md border-b-4 border-brand-green w-4/5 text-center"><span class="block text-3xl font-bold text-brand-green">10%</span><span class="block text-sm">Completion</span></div></div>
            </div></div>
        </div>
    </div>
    
    <!-- P7: Terms -->
    <div class="page-container page-break relative">
        <div class="wave-top-accent h-[120px]"></div><div class="wave-top h-[140px]"></div>
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
        <div class="relative z-20 mt-40 px-12">
            <div class="flex items-center gap-3 mb-6"><i class="fas fa-gavel text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Terms & Conditions</h2></div>
            <div class="grid grid-cols-1 gap-4 text-xs text-gray-800 bg-white/80 p-4 rounded">
                <div class="bg-gray-50/80 p-3 rounded border"><h4 class="font-bold text-brand-blue">1. Validity</h4><p>15 Days.</p></div>
                <div class="bg-gray-50/80 p-3 rounded border"><h4 class="font-bold text-brand-blue">2. Taxes</h4><p>Included as per norms.</p></div>
                <div class="bg-gray-50/80 p-3 rounded border"><h4 class="font-bold text-brand-blue">3. Warranty</h4><p>As per OEM.</p></div>
            </div>
        </div>
    </div>

    <!-- P8: Contact -->
    <div class="page-container page-break relative flex flex-col">
        <div class="h-[40%] w-full relative overflow-hidden"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/8f2c0c796ba02307c87dda837a906dc9c079aa05/Uplodes/bg%203.png?raw=true" class="w-full h-full object-cover"></div>
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-32 bg-white/90 p-2 rounded shadow-lg"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
        <div class="h-[60%] w-full bg-white px-12 pt-16 relative flex flex-col items-center">
             <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 -mt-24 z-20 flex items-start gap-8 border-t-8 border-brand-orange">
                <div class="flex-grow"><h2 class="text-2xl font-bold text-brand-blue">V-Sustain Solar Solutions</h2><p class="text-gray-800 font-bold">Pravesh Kumar Tiwari</p><p class="text-gray-800">+91 99-000-00476</p></div>
             </div>
        </div>
    </div>
  </body></html>`;
}
function buildDetailedQuotationHtml(totals, type) { return getCommonHtml(totals, type, false, false); }
function buildSummaryQuotationHtml(totals, type) { return getCommonHtml(totals, type, true, false); }
function buildShortQuotationHtml(totals, type) { return getCommonHtml(totals, type, false, true); }
