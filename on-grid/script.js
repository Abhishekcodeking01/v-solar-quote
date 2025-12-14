/*******************************************************
 * on-grid/script.js
 * FINAL – Clean, Explicit, Production-Grade
 * V-Sustain Solar Solutions
 *******************************************************/

/* =====================================================
   SECTION 1 — DATASETS (SOURCE OF TRUTH)
   ===================================================== */

// ================= ON-GRID INVERTERS =================
const inverterList = [
  { model:"NXI 120(2KW) (EXC.DONGLE)", capacityKw:2, warranty:"8 Years*", price:16882 },
  { model:"NXI 130(3KW) (EXC.DONGLE)", capacityKw:3, warranty:"8 Years*", price:17915 },
  { model:"NXI 130(3KW) (INCL.DONGLE)", capacityKw:3, warranty:"8 Years*", price:18022 },
  { model:"NXI T130(3KW) + DONGLE", capacityKw:3, warranty:"8 Years*", price:18022 },
  { model:"NXI 140(4KW) (EXC.DONGLE)", capacityKw:4, warranty:"8 Years*", price:28509 },
  { model:"NXI 150(5KW) (EXC.DONGLE)", capacityKw:5, warranty:"8 Years*", price:30508 },
  { model:"NXI 305(5KW) (EXC.DONGLE)", capacityKw:5, warranty:"8 Years*", price:45696 },
  { model:"NXI 306(6KW) (EXC.DONGLE)", capacityKw:6, warranty:"8 Years*", price:51206 },
  { model:"NXI 308(8KW) (EXC.DONGLE)", capacityKw:8, warranty:"8 Years*", price:57641 },
  { model:"NXI 310(10KW) (EXC.DONGLE)", capacityKw:10, warranty:"8 Years*", price:59110 },
  { model:"NXI 312(12KW) (EXC.DONGLE)", capacityKw:12, warranty:"8 Years*", price:63560 },
  { model:"NXI 315(15KW) (EXC.DONGLE)", capacityKw:15, warranty:"8 Years*", price:66339 },
  { model:"NXI 320(20KW) (EXC.DONGLE)", capacityKw:20, warranty:"8 Years*", price:79429 },
  { model:"NXI 325(25KW) (EXC.DONGLE)", capacityKw:25, warranty:"8 Years*", price:97180 },
  { model:"NXI 330(30KW) (EXC.DONGLE)", capacityKw:30, warranty:"8 Years*", price:110076 },
  { model:"NXI 350(50KW) (EXC.DONGLE)", capacityKw:50, warranty:"8 Years*", price:150912 },
  { model:"NXI 360(60KW) (EXC.DONGLE)", capacityKw:60, warranty:"8 Years*", price:161198 },
  { model:"NXI 380(80KW) (EXC.DONGLE)", capacityKw:80, warranty:"8 Years*", price:251588 },
  { model:"NXI 3100(100KW) (EXC.DONGLE)", capacityKw:100, warranty:"8 Years*", price:268801 },
  { model:"NXI W3125(125KW)", capacityKw:125, warranty:"8 Years*", price:317042 },
  { model:"NXI W3150(150KW)", capacityKw:150, warranty:"8 Years*", price:344553 },
  { model:"NXI A3250-HV(250KW)", capacityKw:250, warranty:"8 Years*", price:417806 },
  { model:"NXI A3250-HV(350KW)", capacityKw:350, warranty:"8 Years*", price:555492 }
];

// ================= SOLAR PANELS =================
const panelList = [
  { model:"POLY 170W/12V", watt:170, price:3815 },
  { model:"PV MOD LUM24550M DCR BI-TS EXWH31", watt:550, price:14025 },
  { model:"PV MOD LUM 24585T144 TCHC 144C EXWH31", watt:585, price:9694 },
  { model:"PV MOD LUM 24590T144 BI-TS-31", watt:590, price:9694 }
];

// ================= ACDB =================
const acdbList = [
  { sku:"TSAD0AC32PH1", desc:"ACDB Single Phase 32 Amp (0-5 kW)", price:1899.80 },
  { sku:"TSAD0AC63PH1", desc:"ACDB Single Phase 63 Amp (7 kW)", price:2312.80 },
  { sku:"TSAD0AC40PH1", desc:"ACDB Single Phase 40 Amp (9 kW)", price:2277.40 },
  { sku:"TSAD0AC80PH1", desc:"ACDB Single Phase 80 Amp (11 kW)", price:4708.20 },
  { sku:"TSADAC100PH1", desc:"ACDB Single Phase 100 Amp", price:4920.60 },
  { sku:"TSAD0AC32PH3", desc:"ACDB Three Phase 32 Amp", price:4177.20 }
];

// ================= DCDB =================
const dcdbList = [
  { sku:"TSADDC600V11", desc:"DCDB 1 In 1 Out With MCB", price:1939.92 },
  { sku:"TSADDC600V22", desc:"DCDB 2 In 2 Out With Fuse", price:2808.40 },
  { sku:"TSADDC600V21", desc:"DCDB 2 In 1 Out With MCB", price:2997.20 },
  { sku:"TSADDC600V31", desc:"DCDB 3 In 1 Out With MCB", price:3835.00 },
  { sku:"TSADDC600V41", desc:"DCDB 4 In 1 Out With MCB", price:4224.40 }
];

// ================= METER =================
const meterOptions = [
  { code:"single", label:"Single Phase Bi-Directional Meter", price:4500 },
  { code:"three", label:"Three Phase Bi-Directional Meter", price:7500 }
];

/* =====================================================
   SECTION 2 — GLOBAL CONSTANTS & HELPERS
   ===================================================== */

const GST_5 = 5;
const GST_18 = 18;

const $ = id => document.getElementById(id);
const num = v => isNaN(parseFloat(v)) ? 0 : parseFloat(v);
const round2 = v => Math.round((v + Number.EPSILON) * 100) / 100;

function formatINR(v) {
  return "₹" + round2(v).toLocaleString("en-IN");
}

/* =====================================================
   SECTION 3 — INITIALIZATION
   ===================================================== */

window.addEventListener("DOMContentLoaded", () => {
  populateDropdowns();
  attachEventListeners();
  initializeDefaults();
  recalcAll();
});

/* =====================================================
   SECTION 4 — POPULATE DROPDOWNS (NO PRICE IN LABEL)
   ===================================================== */

function populateDropdowns() {

  inverterList.forEach(inv => {
    const o = document.createElement("option");
    o.value = inv.model;
    o.dataset.price = inv.price;
    o.dataset.capacity = inv.capacityKw;
    o.textContent = `${inv.model} (${inv.capacityKw} kW)`; // ✔ NO PRICE
    $("inverterModel").appendChild(o);
  });

  panelList.forEach(p => {
    const o = document.createElement("option");
    o.value = p.model;
    o.dataset.price = p.price;
    o.dataset.watt = p.watt;
    o.textContent = `${p.model} (${p.watt} W)`; // ✔ NO PRICE
    $("panelModel").appendChild(o);
  });

  acdbList.forEach(a => {
    const o = document.createElement("option");
    o.value = a.sku;
    o.dataset.price = a.price;
    o.textContent = a.desc; // ✔ NO PRICE
    $("acdbModel").appendChild(o);
  });

  dcdbList.forEach(d => {
    const o = document.createElement("option");
    o.value = d.sku;
    o.dataset.price = d.price;
    o.textContent = d.desc; // ✔ NO PRICE
    $("dcdbModel").appendChild(o);
  });

  meterOptions.forEach(m => {
    const o = document.createElement("option");
    o.value = m.code;
    o.dataset.price = m.price;
    o.textContent = m.label; // ✔ NO PRICE
    $("meterType").appendChild(o);
  });
}

/* =====================================================
   SECTION 5 — EVENT WIRING
   ===================================================== */

function attachEventListeners() {

  $("systemKw").addEventListener("input", recalcAll);
  $("commonMargin").addEventListener("input", recalcAll);

  [
    "inverter","panels","meter","acdb","dcdb",
    "acCable","earthCable","la",
    "installation","structure","earthingSet"
  ].forEach(id => {
    const card = $(`${id}Card`);
    if (!card) return;
    const chk = card.querySelector("input[type=checkbox]");
    if (chk) chk.addEventListener("change", recalcAll);
  });
}

/* =====================================================
   SECTION 6 — CORE CALCULATION UTILITIES
   ===================================================== */

function isEnabled(section) {
  const card = $(`${section}Card`);
  if (!card) return true;
  const chk = card.querySelector("input[type=checkbox]");
  return chk ? chk.checked : true;
}

function getMargin(section) {
  const useCommon = $(`${section}UseCommonMargin`);
  const custom = $(`${section}CustomMargin`);
  if (useCommon && useCommon.checked) return num($("commonMargin").value);
  return custom ? num(custom.value) : 0;
}

function applyMargin(base, section) {
  return round2(base * (1 + getMargin(section) / 100));
}

function basePrice(section, dealer) {
  const toggle = $(`${section}OverrideToggle`);
  const override = $(`${section}OverridePrice`);
  if (toggle && toggle.checked && override && num(override.value) > 0) {
    return num(override.value);
  }
  return dealer;
}

function gstFor(section) {
  if (section === "inverter" || section === "panels") return GST_5;
  return GST_18;
}

/* =====================================================
   SECTION 7 — CARD CALCULATIONS
   ===================================================== */

/* ---------- INVERTER ---------- */
function updateInverter() {
  if (!isEnabled("inverter")) return clearSection("inverter");

  const opt = $("inverterModel").selectedOptions[0];
  if (!opt) return;

  const dealer = num(opt.dataset.price);
  const qty = Math.max(1, num($("inverterQty").value));

  const base = basePrice("inverter", dealer);
  const rate = applyMargin(base, "inverter");
  const amount = round2(rate * qty);
  const gst = round2(amount * gstFor("inverter") / 100);

  $("inverterDealer").value = dealer;
  $("inverterFinalRate").value = rate;
  $("inverterGST").value = gst;
  $("inverterTotal").value = round2(amount + gst);
}

/* ---------- PANELS ---------- */
function updatePanels() {
  if (!isEnabled("panels")) return clearSection("panel");

  const opt = $("panelModel").selectedOptions[0];
  const kw = num($("systemKw").value);
  if (!opt || !kw) return;

  const watt = num(opt.dataset.watt);
  const dealer = num(opt.dataset.price);

  const qty = Math.ceil((kw * 1000) / watt);
  const dcKw = round2((qty * watt) / 1000);

  const base = basePrice("panels", dealer);
  const rate = applyMargin(base, "panels");
  const amount = round2(rate * qty);
  const gst = round2(amount * gstFor("panels") / 100);

  $("panelQty").value = qty;
  $("panelCapacity").value = dcKw;
  $("panelDealer").value = dealer;
  $("panelFinalRate").value = rate;
  $("panelGST").value = gst;
  $("panelTotal").value = round2(amount + gst);
}

/* =====================================================
   SECTION 8 — PLACEHOLDER (CONTINUED IN PART 2)
   ===================================================== */

/* ⚠️ DO NOT RUN YET
   PART 2 WILL CONTAIN:
   - Meter / ACDB / DCDB / Cables / LA
   - Installation & Structure
   - Earthing Set (₹3000 default)
   - Custom Products
   - Quotation Builder (Detailed + Summary)
   - Subsidy Logic
   - New-tab Print Preview
*/

function recalcAll() {
  updateInverter();
  updatePanels();
}

/* utility */
function clearSection(prefix) {
  document.querySelectorAll(`[id^="${prefix}"]`).forEach(el => el.value = "");
}

/* =====================================================
   SECTION 9 — REMAINING CARD CALCULATIONS
   ===================================================== */

/* ---------- METER ---------- */
function updateMeter() {
  if (!isEnabled("meter")) return clearSection("meter");

  const opt = $("meterType").selectedOptions[0];
  if (!opt) return;

  const dealer = num(opt.dataset.price);
  const qty = Math.max(1, num($("meterQty").value));

  const base = basePrice("meter", dealer);
  const rate = applyMargin(base, "meter");
  const amount = round2(rate * qty);
  const gst = round2(amount * gstFor("meter") / 100);

  $("meterDealer").value = dealer;
  $("meterFinalRate").value = rate;
  $("meterGST").value = gst;
  $("meterTotal").value = round2(amount + gst);
}

/* ---------- ACDB ---------- */
function updateACDB() {
  if (!isEnabled("acdb")) return clearSection("acdb");

  const opt = $("acdbModel").selectedOptions[0];
  if (!opt) return;

  const dealer = num(opt.dataset.price);
  const qty = Math.max(1, num($("acdbQty").value));

  const base = basePrice("acdb", dealer);
  const rate = applyMargin(base, "acdb");
  const amount = round2(rate * qty);
  const gst = round2(amount * gstFor("acdb") / 100);

  $("acdbDealer").value = dealer;
  $("acdbFinalRate").value = rate;
  $("acdbGST").value = gst;
  $("acdbTotal").value = round2(amount + gst);
}

/* ---------- DCDB ---------- */
function updateDCDB() {
  if (!isEnabled("dcdb")) return clearSection("dcdb");

  const opt = $("dcdbModel").selectedOptions[0];
  if (!opt) return;

  const dealer = num(opt.dataset.price);
  const qty = Math.max(1, num($("dcdbQty").value));

  const base = basePrice("dcdb", dealer);
  const rate = applyMargin(base, "dcdb");
  const amount = round2(rate * qty);
  const gst = round2(amount * gstFor("dcdb") / 100);

  $("dcdbDealer").value = dealer;
  $("dcdbFinalRate").value = rate;
  $("dcdbGST").value = gst;
  $("dcdbTotal").value = round2(amount + gst);
}

/* ---------- AC CABLE ---------- */
function updateACCable() {
  if (!isEnabled("acCable")) return clearSection("acCable");

  const qty = num($("acCableQty").value);
  const dealer = num($("acCablePrice").value);
  if (!qty || !dealer) return;

  const base = basePrice("acCable", dealer);
  const rate = applyMargin(base, "acCable");
  const amount = round2(rate * qty);
  const gst = round2(amount * gstFor("acCable") / 100);

  $("acCableTotal").value = round2(amount + gst);
}

/* ---------- EARTHING CABLE ---------- */
function updateEarthCable() {
  if (!isEnabled("earthCable")) return clearSection("earthCable");

  const qty = num($("earthCableQty").value);
  const dealer = num($("earthCablePrice").value);
  if (!qty || !dealer) return;

  const base = basePrice("earthCable", dealer);
  const rate = applyMargin(base, "earthCable");
  const amount = round2(rate * qty);
  const gst = round2(amount * gstFor("earthCable") / 100);

  $("earthCableTotal").value = round2(amount + gst);
}

/* ---------- LIGHTNING ARRESTOR ---------- */
function updateLA() {
  if (!isEnabled("la")) return clearSection("la");

  const qty = num($("laQty").value);
  const dealer = num($("laPrice").value);
  if (!qty || !dealer) return;

  const base = basePrice("la", dealer);
  const rate = applyMargin(base, "la");
  const amount = round2(rate * qty);
  const gst = round2(amount * gstFor("la") / 100);

  $("laTotal").value = round2(amount + gst);
}

/* ---------- EARTHING SET (NEW) ---------- */
function updateEarthingSet() {
  if (!isEnabled("earthingSet")) return clearSection("earthingSet");

  const qty = Math.max(1, num($("earthingSetQty").value));
  const dealer = num($("earthingSetPrice").value || 3000);

  const base = basePrice("earthingSet", dealer);
  const rate = applyMargin(base, "earthingSet");
  const amount = round2(rate * qty);
  const gst = round2(amount * gstFor("earthingSet") / 100);

  $("earthingSetDealer").value = dealer;
  $("earthingSetFinalRate").value = rate;
  $("earthingSetGST").value = gst;
  $("earthingSetTotal").value = round2(amount + gst);
}

/* ---------- INSTALLATION ---------- */
function updateInstallation() {
  if (!isEnabled("installation")) return clearSection("install");

  const kw = num($("systemKw").value);
  const dealer = num($("installEditable").value);
  if (!kw || !dealer) return;

  const base = basePrice("installation", dealer);
  const rate = applyMargin(base, "installation");
  const amount = round2(rate * kw);
  const gst = round2(amount * gstFor("installation") / 100);

  $("installGST").value = gst;
  $("installTotal").value = round2(amount + gst);
}

/* ---------- STRUCTURE ---------- */
function updateStructure() {
  if (!isEnabled("structure")) return clearSection("struct");

  const kw = num($("systemKw").value);
  const dealer = num($("structEditable").value);
  if (!kw || !dealer) return;

  const base = basePrice("structure", dealer);
  const rate = applyMargin(base, "structure");
  const amount = round2(rate * kw);
  const gst = round2(amount * gstFor("structure") / 100);

  $("structGST").value = gst;
  $("structTotal").value = round2(amount + gst);
}

/* =====================================================
   SECTION 10 — RE-CALC ALL
   ===================================================== */

function recalcAll() {
  updateInverter();
  updatePanels();
  updateMeter();
  updateACDB();
  updateDCDB();
  updateACCable();
  updateEarthCable();
  updateLA();
  updateEarthingSet();
  updateInstallation();
  updateStructure();
}

/* =====================================================
   SECTION 11 — QUOTATION BUILD (NO DEALER PRICE)
   ===================================================== */

function buildLineItems() {
  const items = [];

  function pushItem(name, desc, qty, unit, rate, gst) {
    items.push({ name, desc, qty, unit, rate, gst });
  }

  if (isEnabled("inverter")) {
    const o = $("inverterModel").selectedOptions[0];
    if (o) pushItem("On-Grid Inverter", o.value, num($("inverterQty").value), "Nos", num($("inverterFinalRate").value), GST_5);
  }

  if (isEnabled("panels")) {
    const o = $("panelModel").selectedOptions[0];
    if (o) pushItem("Solar PV Modules", o.value, num($("panelQty").value), "Nos", num($("panelFinalRate").value), GST_5);
  }

  if (isEnabled("meter")) {
    const o = $("meterType").selectedOptions[0];
    if (o) pushItem("Bi-Directional Meter", o.textContent, num($("meterQty").value), "Nos", num($("meterFinalRate").value), GST_18);
  }

  if (isEnabled("acdb")) {
    const o = $("acdbModel").selectedOptions[0];
    if (o) pushItem("ACDB", o.textContent, num($("acdbQty").value), "Nos", num($("acdbFinalRate").value), GST_18);
  }

  if (isEnabled("dcdb")) {
    const o = $("dcdbModel").selectedOptions[0];
    if (o) pushItem("DCDB", o.textContent, num($("dcdbQty").value), "Nos", num($("dcdbFinalRate").value), GST_18);
  }

  if (isEnabled("earthingSet")) {
    pushItem("Earthing Set", "Complete earthing kit", num($("earthingSetQty").value), "Set", num($("earthingSetFinalRate").value), GST_18);
  }

  if (isEnabled("installation")) {
    pushItem("Installation & Commissioning", "On-site installation", num($("systemKw").value), "kW", num($("installEditable").value), GST_18);
  }

  if (isEnabled("structure")) {
    pushItem("Module Mounting Structure", "Galvanized structure", num($("systemKw").value), "kW", num($("structEditable").value), GST_18);
  }

  return items;
}

/* =====================================================
   SECTION 12 — QUOTE GENERATION
   ===================================================== */

function generateDetailedQuote() {
  const items = buildLineItems();
  let subtotal = 0, gstTotal = 0;

  items.forEach(i => {
    const amt = round2(i.rate * i.qty);
    subtotal += amt;
    gstTotal += round2(amt * i.gst / 100);
  });

  const kw = num($("systemKw").value);
  let subsidy = 0;
  if (kw <= 2) subsidy = 60000;
  else if (kw >= 3 && kw <= 10) subsidy = 78000;

  const grand = subtotal + gstTotal - subsidy;

  const win = window.open("", "_blank");
  win.document.write(`
    <h2>Quotation – V-Sustain Solar Solutions</h2>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr><th>Item</th><th>Description</th><th>Qty</th><th>Rate</th><th>Total</th></tr>
      ${items.map(i => `
        <tr>
          <td>${i.name}</td>
          <td>${i.desc}</td>
          <td>${i.qty}</td>
          <td>${formatINR(i.rate)}</td>
          <td>${formatINR(i.rate * i.qty)}</td>
        </tr>
      `).join("")}
    </table>
    <p>Subtotal: ${formatINR(subtotal)}</p>
    <p>GST: ${formatINR(gstTotal)}</p>
    <p>Subsidy: -${formatINR(subsidy)}</p>
    <h3>Grand Total: ${formatINR(grand)}</h3>
    <button onclick="window.print()">Print / Save PDF</button>
  `);
  win.document.close();
}
