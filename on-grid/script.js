/****************************************************
 * V-SUSTAIN SOLAR SOLUTIONS – ON GRID BILLING ENGINE
 ****************************************************/

/*----------------------------------------------
  1. DATASETS
-----------------------------------------------*/
const inverterList = [
  { model: "NXI 120(2KW) (EXC.DONGLE)", price: 16882 },
  { model: "NXI 130(3KW) (EXC.DONGLE)", price: 17915 },
  { model: "NXI 130(3KW) (INCL.DONGLE)", price: 18022 },
  { model: "NXI T130(3KW) + DONGLE", price: 18022 },
  { model: "NXI 140(4KW) (EXC.DONGLE)", price: 28509 },
  { model: "NXI 150(5KW) (EXC.DONGLE)", price: 30508 },
  { model: "NXI 305(5KW) (EXC.DONGLE)", price: 45696 },
  { model: "NXI 306(6KW) (EXC.DONGLE)", price: 51206 },
  { model: "NXI 308(8KW) (EXC.DONGLE)", price: 57641 },
  { model: "NXI 310(10KW) (EXC.DONGLE)", price: 59110 },
  { model: "NXI 312(12KW) (EXC.DONGLE)", price: 63560 },
  { model: "NXI 315(15KW) (EXC.DONGLE)", price: 66339 },
  { model: "NXI 320(20KW) (EXC.DONGLE)", price: 79429 },
  { model: "NXI 325(25KW) (EXC.DONGLE)", price: 97180 },
  { model: "NXI 330(30KW) (EXC.DONGLE)", price: 110076 },
  { model: "NXI 350(50KW) (EXC.DONGLE)", price: 150912 },
  { model: "NXI 360(60KW) (EXC.DONGLE)", price: 161198 },
  { model: "NXI 380(80KW) (EXC.DONGLE)", price: 251588 },
  { model: "NXI 3100(100KW) (EXC.DONGLE)", price: 268801 },
  { model: "NXI W3125(125KW) (INCL.DONGLE)", price: 317042 },
  { model: "NXI W3150(150KW) (INCL.DONGLE)", price: 344553 },
  { model: "NXI A3250-HV(250KW) (800VAC UTILITY GRADE GTI)", price: 417806 },
  { model: "NXI A3250-HV(350KW) (800VAC UTILITY GRADE GTI)", price: 555492 }
];

const panelList = [
  { model: "POLY 170W/12V", watt: 170, price: 3815 },
  { model: "PV MOD LUM24550M DCR BI-TS EXWH31", watt: 550, price: 14025 },
  { model: "PV MOD LUM 24585T144 TCHC 144C EXWH31", watt: 585, price: 9694 },
  { model: "PV MOD LUM 24590T144 BI-TS-31", watt: 590, price: 9694 }
];

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

// Random meter prices as requested
const meterOptions = [
  { code: "single", label: "Single Phase", price: 4500 },
  { code: "three", label: "Three Phase", price: 7500 }
];

/*----------------------------------------------
  2. HELPERS
-----------------------------------------------*/
const n = v => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));
const fmt = v => "₹" + n(v).toLocaleString("en-IN", { maximumFractionDigits: 2 });

function isSectionEnabled(id) {
  const chk = document.querySelector("input[type='checkbox'][data-target='" + id + "']");
  return chk ? chk.checked : true;
}

function getGlobalMargin() {
  return n(document.getElementById("globalMargin").value);
}

function getBasePrice(sectionId, dealerPrice) {
  const toggle = document.querySelector(".manual-price-toggle[data-target='" + sectionId + "']");
  const inp = document.querySelector(".manual-price-input[data-target='" + sectionId + "']");
  if (toggle && toggle.checked && inp) {
    const val = n(inp.value);
    if (val > 0) return val;
  }
  return dealerPrice;
}

function applyMargin(base, sectionId) {
  const global = getGlobalMargin();
  const toggle = document.querySelector(".margin-toggle[data-target='" + sectionId + "']");
  const customInp = document.querySelector(".custom-margin[data-target='" + sectionId + "']");
  const custom = customInp ? n(customInp.value) : 0;

  if (toggle && toggle.checked) {
    return base + (base * global / 100);
  } else if (custom > 0) {
    return base + (base * custom / 100);
  } else {
    return base;
  }
}

// On-grid GST logic
function getGstPercent(sectionId) {
  if (sectionId === "inverter" || sectionId === "panels") return 5;
  return 18;
}

/*----------------------------------------------
  3. INIT
-----------------------------------------------*/
window.addEventListener("DOMContentLoaded", () => {
  loadInverters();
  loadPanels();
  loadACDB();
  loadDCDB();
  loadMeters();

  document.getElementById("panelSelect").addEventListener("change", recalcPanelsCard);
  document.getElementById("systemKW").addEventListener("input", handleSystemKwChange);

  document.getElementById("inverterSelect").addEventListener("change", recalcInverterCard);
  document.getElementById("acdbSelect").addEventListener("change", recalcAcdbCard);
  document.getElementById("dcdbSelect").addEventListener("change", recalcDcdbCard);
  document.getElementById("meterType").addEventListener("change", recalcMeterCard);
  document.getElementById("meterQty").addEventListener("input", recalcMeterCard);

  // installation / structure inputs
  document.getElementById("installationQty").addEventListener("input", recalcInstallationCard);
  document.getElementById("installationBaseRate").addEventListener("input", recalcInstallationCard);
  document.getElementById("structureQty").addEventListener("input", recalcStructureCard);
  document.getElementById("structureBaseRate").addEventListener("input", recalcStructureCard);

  document.getElementById("globalMargin").addEventListener("input", () => {
    recalcInverterCard();
    recalcPanelsCard();
    recalcAcdbCard();
    recalcDcdbCard();
    recalcMeterCard();
    recalcInstallationCard();
    recalcStructureCard();
  });

  document.querySelectorAll(".custom-margin").forEach(inp => {
    inp.addEventListener("input", () => {
      recalcInverterCard();
      recalcPanelsCard();
      recalcAcdbCard();
      recalcDcdbCard();
      recalcMeterCard();
      recalcInstallationCard();
      recalcStructureCard();
    });
  });

  document.querySelectorAll(".manual-price-toggle, .manual-price-input").forEach(el => {
    el.addEventListener("change", () => {
      recalcInverterCard();
      recalcPanelsCard();
      recalcAcdbCard();
      recalcDcdbCard();
      recalcMeterCard();
      recalcInstallationCard();
      recalcStructureCard();
    });
    el.addEventListener("input", () => {
      recalcInverterCard();
      recalcPanelsCard();
      recalcAcdbCard();
      recalcDcdbCard();
      recalcMeterCard();
      recalcInstallationCard();
      recalcStructureCard();
    });
  });

  // enable/disable cards
  document.querySelectorAll("input[type='checkbox'][data-target]").forEach(chk => {
    chk.addEventListener("change", function () {
      const card = this.closest(".card");
      if (!card) return;
      if (this.checked) card.classList.remove("disabled");
      else card.classList.add("disabled");
    });
  });

  // custom products
  document.getElementById("addCustomProduct").addEventListener("click", addCustomProductRow);
  // delegate delete button
  document.getElementById("customProducts").addEventListener("click", e => {
    if (e.target.classList.contains("cp-delete")) {
      const row = e.target.closest(".custom-row");
      if (row) row.remove();
    }
  });

  // quote buttons
  document.getElementById("generateDetailed").addEventListener("click", () => {
    const totals = calcTotals();
    const html = buildDetailedQuotationHtml(totals);
    openInNewWindow(html);
  });

  document.getElementById("generateSummary").addEventListener("click", () => {
    const totals = calcTotals();
    const html = buildSummaryQuotationHtml(totals);
    openInNewWindow(html);
  });

  // initial defaults
  handleSystemKwChange();
  recalcInverterCard();
  recalcPanelsCard();
  recalcAcdbCard();
  recalcDcdbCard();
  recalcMeterCard();
  recalcInstallationCard();
  recalcStructureCard();
});

/*----------------------------------------------
  4. LOADERS
-----------------------------------------------*/
function loadInverters() {
  const sel = document.getElementById("inverterSelect");
  inverterList.forEach(inv => {
    const opt = document.createElement("option");
    opt.value = inv.model;
    opt.dataset.price = inv.price;
    opt.textContent = `${inv.model} – ${fmt(inv.price)}`;
    sel.appendChild(opt);
  });
}

function loadPanels() {
  const sel = document.getElementById("panelSelect");
  panelList.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.model;
    opt.dataset.price = p.price;
    opt.dataset.watt = p.watt;
    opt.textContent = `${p.model} – ${p.watt}W – ${fmt(p.price)}`;
    sel.appendChild(opt);
  });
}

function loadACDB() {
  const sel = document.getElementById("acdbSelect");
  acdbList.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.sku;
    opt.dataset.price = a.price;
    opt.textContent = `${a.desc} (${a.sku}) – ${fmt(a.price)}`;
    sel.appendChild(opt);
  });
}

function loadDCDB() {
  const sel = document.getElementById("dcdbSelect");
  dcdbList.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.sku;
    opt.dataset.price = a.price;
    opt.textContent = `${a.desc} (${a.sku}) – ${fmt(a.price)}`;
    sel.appendChild(opt);
  });
}

function loadMeters() {
  const sel = document.getElementById("meterType");
  meterOptions.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.code;
    opt.dataset.price = m.price;
    opt.textContent = `${m.label} – ${fmt(m.price)}`;
    sel.appendChild(opt);
  });
}

/*----------------------------------------------
  5. CARD RECALC
-----------------------------------------------*/
function recalcInverterCard() {
  if (!isSectionEnabled("inverter")) return;
  const sel = document.getElementById("inverterSelect");
  const opt = sel.selectedOptions[0];
  if (!opt) return;

  const dealer = n(opt.dataset.price);
  const base = getBasePrice("inverter", dealer);
  const rate = applyMargin(base, "inverter");
  const gst = getGstPercent("inverter");
  const qty = 1;
  const amount = rate * qty;
  const gstAmt = amount * gst / 100;
  const total = amount + gstAmt;

  document.getElementById("inverterDealer").value = fmt(dealer);
  document.getElementById("inverterRate").value = fmt(rate);
  document.getElementById("inverterGst").value = gst + "%";
  document.getElementById("inverterTotal").value = fmt(total);
}

function recalcPanelsCard() {
  if (!isSectionEnabled("panels")) return;

  const kw = n(document.getElementById("systemKW").value);
  const sel = document.getElementById("panelSelect");
  const opt = sel.selectedOptions[0];
  if (!kw || !opt) return;

  const watt = n(opt.dataset.watt);
  const dealer = n(opt.dataset.price);
  const base = getBasePrice("panels", dealer);
  const perRate = applyMargin(base, "panels");

  const totalWatt = kw * 1000;
  const qty = Math.ceil(totalWatt / watt);
  const dcCapacityKw = (qty * watt) / 1000;

  const gst = getGstPercent("panels");
  const amount = perRate * qty;
  const gstAmt = amount * gst / 100;
  const total = amount + gstAmt;

  document.getElementById("panelQty").value = qty;
  document.getElementById("panelCapacityKw").value = dcCapacityKw.toFixed(2) + " kW";
  document.getElementById("panelDealer").value = fmt(dealer);
  document.getElementById("panelRate").value = fmt(perRate);
  document.getElementById("panelGst").value = gst + "%";
  document.getElementById("panelTotal").value = fmt(total);
}

function recalcAcdbCard() {
  if (!isSectionEnabled("acdb")) return;
  const sel = document.getElementById("acdbSelect");
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const dealer = n(opt.dataset.price);
  const base = getBasePrice("acdb", dealer);
  const rate = applyMargin(base, "acdb");
  document.getElementById("acdbDealer").value = fmt(dealer);
  document.getElementById("acdbRate").value = fmt(rate);
}

function recalcDcdbCard() {
  if (!isSectionEnabled("dcdb")) return;
  const sel = document.getElementById("dcdbSelect");
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const dealer = n(opt.dataset.price);
  const base = getBasePrice("dcdb", dealer);
  const rate = applyMargin(base, "dcdb");
  document.getElementById("dcdbDealer").value = fmt(dealer);
  document.getElementById("dcdbRate").value = fmt(rate);
}

function recalcMeterCard() {
  if (!isSectionEnabled("meter")) return;
  const sel = document.getElementById("meterType");
  const opt = sel.selectedOptions[0];
  if (!opt) return;

  const dealer = n(opt.dataset.price);
  const qty = n(document.getElementById("meterQty").value) || 1;
  const base = getBasePrice("meter", dealer);
  const rate = applyMargin(base, "meter");
  const gst = getGstPercent("meter");
  const amount = rate * qty;
  const gstAmt = amount * gst / 100;
  const total = amount + gstAmt;

  document.getElementById("meterDealer").value = fmt(dealer);
  document.getElementById("meterRate").value = fmt(rate);
  document.getElementById("meterGst").value = gst + "%";
  document.getElementById("meterTotal").value = fmt(total);
}

function handleSystemKwChange() {
  const kw = n(document.getElementById("systemKW").value);

  const instQty = document.getElementById("installationQty");
  const instBase = document.getElementById("installationBaseRate");
  const structQty = document.getElementById("structureQty");
  const structBase = document.getElementById("structureBaseRate");

  if (kw > 0) {
    if (!instQty.value || n(instQty.value) === 0) instQty.value = kw;
    if (!structQty.value || n(structQty.value) === 0) structQty.value = kw;
  }

  if (!instBase.value || n(instBase.value) === 0) instBase.value = 5000;
  if (!structBase.value || n(structBase.value) === 0) structBase.value = 8000;

  recalcPanelsCard();
  recalcInstallationCard();
  recalcStructureCard();
}

function recalcInstallationCard() {
  if (!isSectionEnabled("installation")) return;

  const qty = n(document.getElementById("installationQty").value);
  const dealerBase = n(document.getElementById("installationBaseRate").value);
  if (!qty || !dealerBase) {
    document.getElementById("installationRate").value = "";
    document.getElementById("installationGst").value = "";
    document.getElementById("installationTotal").value = "";
    return;
  }

  const base = getBasePrice("installation", dealerBase);
  const rate = applyMargin(base, "installation");
  const gst = getGstPercent("installation");
  const amount = rate * qty;
  const gstAmt = amount * gst / 100;
  const total = amount + gstAmt;

  document.getElementById("installationRate").value = fmt(rate);
  document.getElementById("installationGst").value = gst + "%";
  document.getElementById("installationTotal").value = fmt(total);
}

function recalcStructureCard() {
  if (!isSectionEnabled("structure")) return;

  const qty = n(document.getElementById("structureQty").value);
  const dealerBase = n(document.getElementById("structureBaseRate").value);
  if (!qty || !dealerBase) {
    document.getElementById("structureRate").value = "";
    document.getElementById("structureGst").value = "";
    document.getElementById("structureTotal").value = "";
    return;
  }

  const base = getBasePrice("structure", dealerBase);
  const rate = applyMargin(base, "structure");
  const gst = getGstPercent("structure");
  const amount = rate * qty;
  const gstAmt = amount * gst / 100;
  const total = amount + gstAmt;

  document.getElementById("structureRate").value = fmt(rate);
  document.getElementById("structureGst").value = gst + "%";
  document.getElementById("structureTotal").value = fmt(total);
}

/*----------------------------------------------
  6. CUSTOM PRODUCTS
-----------------------------------------------*/
function addCustomProductRow() {
  const box = document.getElementById("customProducts");
  const row = document.createElement("div");
  row.className = "custom-row";
  row.innerHTML = `
    <input type="text" placeholder="Product Name" class="cp-name">
    <input type="number" placeholder="Qty" class="cp-qty">
    <input type="number" placeholder="Price" class="cp-price">
    <label>Use Global Margin</label>
    <input type="checkbox" class="cp-margin-global" checked>
    <input type="number" placeholder="Custom Margin %" class="cp-custom-margin">
    <button type="button" class="cp-delete">Delete</button>
  `;
  box.appendChild(row);
}

/*----------------------------------------------
  7. BUILD LINE ITEMS
-----------------------------------------------*/
function buildLineItems() {
  const items = [];

  // inverter
  if (isSectionEnabled("inverter")) {
    const sel = document.getElementById("inverterSelect");
    const opt = sel.selectedOptions[0];
    if (opt) {
      const dealer = n(opt.dataset.price);
      const base = getBasePrice("inverter", dealer);
      const rate = applyMargin(base, "inverter");
      const gst = getGstPercent("inverter");
      items.push({
        type: "inverter",
        item: "On-Grid Inverter",
        desc: opt.textContent,
        qty: 1,
        unit: "Nos",
        baseRate: rate,
        gstPercent: gst
      });
    }
  }

  // panels
  if (isSectionEnabled("panels")) {
    const sel = document.getElementById("panelSelect");
    const opt = sel.selectedOptions[0];
    const qty = n(document.getElementById("panelQty").value);
    if (opt && qty > 0) {
      const dealer = n(opt.dataset.price);
      const base = getBasePrice("panels", dealer);
      const rate = applyMargin(base, "panels");
      const gst = getGstPercent("panels");
      items.push({
        type: "panels",
        item: "Solar PV Modules",
        desc: opt.textContent,
        qty,
        unit: "Nos",
        baseRate: rate,
        gstPercent: gst
      });
    }
  }

  // meter
  if (isSectionEnabled("meter")) {
    const sel = document.getElementById("meterType");
    const opt = sel.selectedOptions[0];
    const qty = n(document.getElementById("meterQty").value) || 1;
    if (opt && qty > 0) {
      const dealer = n(opt.dataset.price);
      const base = getBasePrice("meter", dealer);
      const rate = applyMargin(base, "meter");
      items.push({
        type: "meter",
        item: "Bi-Directional Meter",
        desc: opt.textContent,
        qty,
        unit: "Nos",
        baseRate: rate,
        gstPercent: getGstPercent("meter")
      });
    }
  }

  // ACDB
  if (isSectionEnabled("acdb")) {
    const sel = document.getElementById("acdbSelect");
    const opt = sel.selectedOptions[0];
    if (opt) {
      const dealer = n(opt.dataset.price);
      const base = getBasePrice("acdb", dealer);
      const rate = applyMargin(base, "acdb");
      items.push({
        type: "acdb",
        item: "ACDB",
        desc: opt.textContent,
        qty: 1,
        unit: "Nos",
        baseRate: rate,
        gstPercent: getGstPercent("acdb")
      });
    }
  }

  // DCDB
  if (isSectionEnabled("dcdb")) {
    const sel = document.getElementById("dcdbSelect");
    const opt = sel.selectedOptions[0];
    if (opt) {
      const dealer = n(opt.dataset.price);
      const base = getBasePrice("dcdb", dealer);
      const rate = applyMargin(base, "dcdb");
      items.push({
        type: "dcdb",
        item: "DCDB",
        desc: opt.textContent,
        qty: 1,
        unit: "Nos",
        baseRate: rate,
        gstPercent: getGstPercent("dcdb")
      });
    }
  }

  // AC cable
  if (isSectionEnabled("accable")) {
    const gauge = document.getElementById("acGauge").value || "";
    const qty = n(document.getElementById("acQty").value);
    const price = n(document.getElementById("acPrice").value);
    if (qty > 0 && price > 0) {
      const rate = applyMargin(price, "accable");
      items.push({
        type: "accable",
        item: "AC Cable",
        desc: gauge,
        qty,
        unit: "Mtr",
        baseRate: rate,
        gstPercent: getGstPercent("accable")
      });
    }
  }

  // earthing cable
  if (isSectionEnabled("earthing")) {
    const gauge = document.getElementById("earthGauge").value || "";
    const qty = n(document.getElementById("earthQty").value);
    const price = n(document.getElementById("earthPrice").value);
    if (qty > 0 && price > 0) {
      const rate = applyMargin(price, "earthing");
      items.push({
        type: "earthing",
        item: "Earthing Cable",
        desc: gauge,
        qty,
        unit: "Mtr",
        baseRate: rate,
        gstPercent: getGstPercent("earthing")
      });
    }
  }

  // installation (rate per kW, qty from field)
  if (isSectionEnabled("installation")) {
    const qty = n(document.getElementById("installationQty").value);
    const dealerBase = n(document.getElementById("installationBaseRate").value);
    if (qty > 0 && dealerBase > 0) {
      const base = getBasePrice("installation", dealerBase);
      const rate = applyMargin(base, "installation");
      items.push({
        type: "installation",
        item: "Installation & Commissioning",
        desc: "Installation services",
        qty,
        unit: "kW",
        baseRate: rate,
        gstPercent: getGstPercent("installation")
      });
    }
  }

  // structure
  if (isSectionEnabled("structure")) {
    const qty = n(document.getElementById("structureQty").value);
    const dealerBase = n(document.getElementById("structureBaseRate").value);
    if (qty > 0 && dealerBase > 0) {
      const base = getBasePrice("structure", dealerBase);
      const rate = applyMargin(base, "structure");
      items.push({
        type: "structure",
        item: "Module Mounting Structure",
        desc: "Structure for PV modules",
        qty,
        unit: "kW",
        baseRate: rate,
        gstPercent: getGstPercent("structure")
      });
    }
  }

  // lightning
  if (isSectionEnabled("lightning")) {
    const qty = n(document.getElementById("lightQty").value);
    const price = n(document.getElementById("lightPrice").value);
    if (qty > 0 && price > 0) {
      const rate = applyMargin(price, "lightning");
      items.push({
        type: "lightning",
        item: "Lightning Arrestor",
        desc: "",
        qty,
        unit: "Nos",
        baseRate: rate,
        gstPercent: getGstPercent("lightning")
      });
    }
  }

  // custom products
  document.querySelectorAll(".custom-row").forEach(row => {
    const name = row.querySelector(".cp-name").value || "Custom Item";
    const qty = n(row.querySelector(".cp-qty").value);
    const price = n(row.querySelector(".cp-price").value);
    if (!qty || !price) return;
    const useGlobal = row.querySelector(".cp-margin-global").checked;
    const customMargin = n(row.querySelector(".cp-custom-margin").value);
    let rate = price;
    if (useGlobal) {
      rate = price + price * getGlobalMargin() / 100;
    } else if (customMargin > 0) {
      rate = price + price * customMargin / 100;
    }
    items.push({
      type: "custom",
      item: name,
      desc: "",
      qty,
      unit: "Nos",
      baseRate: rate,
      gstPercent: getGstPercent("custom")
    });
  });

  return items;
}

/*----------------------------------------------
  8. TOTALS
-----------------------------------------------*/
function calcTotals() {
  const items = buildLineItems();
  let subtotal = 0;
  let totalGst = 0;

  items.forEach(it => {
    const amount = it.baseRate * it.qty;
    const gstAmt = amount * it.gstPercent / 100;
    subtotal += amount;
    totalGst += gstAmt;
  });

  const grandTotal = subtotal + totalGst;
  return { items, subtotal, totalGst, grandTotal };
}

/*----------------------------------------------
  9. QUOTATION HTML (same as previous version)
-----------------------------------------------*/
function buildDetailedQuotationHtml(totals) {
  const plantKw = n(document.getElementById("systemKW").value);
  const margin = getGlobalMargin();

  // Try to pull customer info from existing inputs; fallback to placeholders
  const customerName =
    (document.getElementById("customerName") || {}).value || "Customer Name";
  const customerAddress =
    (document.getElementById("customerAddress") || {}).value ||
    "Customer address line 1, line 2";
  const customerCity =
    (document.getElementById("customerCity") || {}).value ||
    "City, State, Pincode";

  const today = new Date();
  const proposalDate = today.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const proposalNo = "VSS-" + today.getFullYear() + (today.getMonth() + 1) + "-" + today.getDate();

  // Specification table (no pricing, just component list)
  const specRowsHtml = totals.items
    .map(
      (it, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${it.item}</td>
        <td>${it.desc || ""}</td>
        <td>V-Sustain / Luminous</td>
        <td>${it.qty}</td>
        <td>${it.unit}</td>
      </tr>
    `
    )
    .join("");

  // Commercial table (pricing summary for each line item)
  const commercialRowsHtml = totals.items
    .map((it, idx) => {
      const amount = it.baseRate * it.qty;
      const gstAmt = (amount * it.gstPercent) / 100;
      const total = amount + gstAmt;
      return `
      <tr>
        <td>${idx + 1}</td>
        <td>${it.item}</td>
        <td>${it.desc || ""}</td>
        <td>${it.qty}</td>
        <td>${it.unit}</td>
        <td>${fmt(it.baseRate)}</td>
        <td>${fmt(amount)}</td>
        <td>${it.gstPercent}%</td>
        <td>${fmt(gstAmt)}</td>
        <td>${fmt(total)}</td>
      </tr>
    `;
    })
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>On-Grid Techno-Commercial Proposal - V-Sustain Solar Solutions</title>
  <style>
    :root {
      --brand-blue: #0057b7;
      --brand-blue-soft: #eff6ff;
      --brand-orange: #f97316;
      --brand-bg: #f3f4f6;
      --text-main: #0f172a;
      --text-muted: #6b7280;
      --card-radius: 16px;
    }
    * { box-sizing:border-box; }
    body {
      margin:0;
      padding:20px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:#e5e7eb;
      color:var(--text-main);
    }
    .proposal {
      max-width:900px;
      margin:0 auto;
      background:#fff;
      box-shadow:0 10px 40px rgba(15,23,42,0.25);
      border-radius:20px;
      overflow:hidden;
    }
    .page {
      padding:28px 32px;
      min-height:1120px; /* A4-ish */
      position:relative;
    }
    .page:not(:last-child) {
      page-break-after: always;
      border-bottom:1px solid #e5e7eb;
    }
    .page-header-top {
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:16px;
      margin-bottom:20px;
    }
    .logo-slot {
      width:72px;
      height:72px;
      border-radius:18px;
      background:linear-gradient(135deg,#dbeafe,#1d4ed8);
      display:flex;
      align-items:center;
      justify-content:center;
      color:#eff6ff;
      font-size:11px;
      text-align:center;
      box-shadow:0 8px 24px rgba(37,99,235,0.4);
    }
    .brand-text h1 {
      margin:0;
      font-size:22px;
      color:#0f172a;
    }
    .brand-text p {
      margin:2px 0;
      font-size:12px;
      color:var(--text-muted);
    }
    .badge-year {
      padding:8px 14px;
      background:var(--brand-orange);
      color:#fff;
      border-radius:999px;
      font-weight:600;
      font-size:12px;
      box-shadow:0 4px 12px rgba(248,113,113,0.4);
    }
    .cover-hero {
      margin-top:12px;
      border-radius:18px;
      overflow:hidden;
      position:relative;
      height:420px;
      background:#111827;
      color:#e5e7eb;
    }
    .cover-hero-main {
      position:absolute;
      inset:0;
      background-image:linear-gradient(to bottom,rgba(15,23,42,0.15),rgba(15,23,42,0.7)),
        url("cover-banner-placeholder.jpg");
      background-size:cover;
      background-position:center;
    }
    .cover-overlay {
      position:absolute;
      inset:0;
      display:flex;
      flex-direction:column;
      justify-content:space-between;
      padding:22px;
    }
    .cover-tagline {
      font-size:13px;
      letter-spacing:0.08em;
      text-transform:uppercase;
      color:#bfdbfe;
    }
    .cover-title {
      font-size:26px;
      font-weight:700;
      max-width:340px;
    }
    .cover-bottom {
      display:flex;
      justify-content:space-between;
      align-items:flex-end;
      gap:16px;
      font-size:12px;
    }
    .cover-proposal-meta p {
      margin:2px 0;
    }
    .mini-card {
      width:150px;
      padding:10px 12px;
      border-radius:16px;
      background:rgba(15,23,42,0.85);
      border:1px solid rgba(148,163,184,0.5);
      font-size:11px;
    }
    .mini-card strong { display:block; font-size:12px; margin-bottom:2px; }

    .page-title {
      display:flex;
      align-items:center;
      gap:8px;
      margin-bottom:12px;
      margin-top:4px;
    }
    .page-title-icon {
      width:24px;
      height:24px;
      border-radius:999px;
      background:var(--brand-blue-soft);
      color:var(--brand-blue);
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:14px;
    }
    .page-title h2 {
      margin:0;
      font-size:18px;
    }
    .section-subtitle {
      font-size:12px;
      color:var(--text-muted);
      margin-bottom:12px;
    }

    .two-col {
      display:grid;
      grid-template-columns: minmax(0,2fr) minmax(0,1.4fr);
      gap:18px;
    }
    .card {
      background:#f9fafb;
      border-radius:var(--card-radius);
      padding:14px 16px;
      border:1px solid #e5e7eb;
    }
    .card h3 {
      margin:0 0 6px;
      font-size:14px;
    }
    .card p {
      margin:3px 0;
      font-size:12px;
      color:var(--text-muted);
    }

    .info-list {
      list-style:none;
      padding:0;
      margin:0;
      font-size:12px;
      color:var(--text-muted);
    }
    .info-list li {
      margin-bottom:4px;
    }

    table {
      width:100%;
      border-collapse:collapse;
      font-size:11.5px;
      margin-top:8px;
    }
    th, td {
      padding:6px 6px;
      border:1px solid #e5e7eb;
      vertical-align:top;
    }
    th {
      background:#eff6ff;
      text-align:left;
      font-size:11px;
    }

    .notes-box {
      margin-top:10px;
      padding:10px;
      border-radius:10px;
      border:1px dashed #cbd5f5;
      font-size:11px;
      color:var(--text-muted);
      min-height:60px;
    }

    .why-grid {
      display:grid;
      grid-template-columns: repeat(auto-fit,minmax(150px,1fr));
      gap:12px;
      margin-top:10px;
    }
    .why-card {
      background:#ecfeff;
      border-radius:16px;
      padding:10px 12px;
      border:1px solid #bae6fd;
      box-shadow:0 6px 12px rgba(8,47,73,0.09);
      font-size:12px;
    }
    .why-card-title {
      font-weight:600;
      margin-bottom:4px;
      display:flex;
      align-items:center;
      gap:6px;
    }
    .why-icon {
      width:22px;
      height:22px;
      border-radius:999px;
      background:#0ea5e9;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:13px;
      color:#e0f2fe;
    }
    .why-card p {
      margin:0;
      color:#475569;
      font-size:11px;
    }

    .testimonial-row {
      margin-top:14px;
      display:grid;
      grid-template-columns: repeat(4,1fr);
      gap:8px;
    }
    .testimonial-placeholder {
      height:80px;
      border-radius:10px;
      background:repeating-linear-gradient(
          135deg,#e5e7eb,#e5e7eb 4px,#f9fafb 4px,#f9fafb 8px
      );
      border:1px dashed #c4c4c4;
      font-size:9px;
      color:#6b7280;
      display:flex;
      align-items:center;
      justify-content:center;
      text-align:center;
      padding:4px;
    }

    .payment-flow {
      display:flex;
      justify-content:space-between;
      gap:10px;
      margin:10px 0 16px;
      font-size:11px;
    }
    .payment-step {
      flex:1;
      text-align:center;
    }
    .payment-circle {
      width:56px;
      height:56px;
      border-radius:999px;
      margin:0 auto 4px;
      background:#dbeafe;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:24px;
      color:#1d4ed8;
    }

    .warranty-strip {
      margin-top:8px;
      background:#ecfccb;
      border-radius:14px;
      padding:10px 12px;
      display:flex;
      justify-content:space-around;
      font-size:11px;
    }
    .w-block {
      text-align:center;
      flex:1;
    }
    .w-label {
      font-size:11px;
      color:#4b5563;
    }
    .w-value {
      font-size:15px;
      font-weight:700;
      color:#166534;
    }

    .summary-highlight {
      margin-top:10px;
      padding:10px 12px;
      border-radius:14px;
      background:#fefce8;
      border:1px solid #facc15;
      font-size:12px;
    }
    .summary-highlight strong {
      font-size:15px;
      color:#b45309;
    }

    .fine-print {
      margin-top:6px;
      font-size:10px;
      color:#6b7280;
    }

    .flex-row {
      display:flex;
      gap:16px;
    }
    .flex-1 { flex:1; }

    .charge-table td, .charge-table th {
      font-size:11px;
    }

    .terms p {
      font-size:11px;
      color:#4b5563;
      margin:3px 0 5px;
    }
    .terms strong {
      color:#111827;
    }

    .footer-strip {
      position:absolute;
      bottom:16px;
      left:32px;
      right:32px;
      display:flex;
      justify-content:space-between;
      font-size:10px;
      color:#9ca3af;
    }

    .editable[contenteditable="true"] {
      outline:1px dashed transparent;
      transition:outline-color 0.15s;
      cursor:text;
    }
    .editable[contenteditable="true"]:hover {
      outline-color:#bfdbfe;
    }
    .editable[contenteditable="true"]:focus {
      outline-color:#2563eb;
      background:#eff6ff;
    }
  </style>
</head>
<body>
  <div class="proposal">

    <!-- PAGE 1: COVER -->
    <section class="page">
      <div class="page-header-top">
        <div style="display:flex;gap:10px;align-items:center;">
          <div class="logo-slot editable" contenteditable="true">
            LOGO<br />PLACEHOLDER
          </div>
          <div class="brand-text">
            <h1 class="editable" contenteditable="true">V-Sustain Solar Solutions</h1>
            <p class="editable" contenteditable="true">Authorized Luminous Partner • Bengaluru, Karnataka</p>
            <p class="editable" contenteditable="true">Techno-Commercial Solar Rooftop Proposal</p>
          </div>
        </div>
        <div>
          <div class="badge-year">${today.getFullYear()}</div>
        </div>
      </div>

      <div class="cover-hero">
        <div class="cover-hero-main"></div>
        <div class="cover-overlay">
          <div>
            <div class="cover-tagline editable" contenteditable="true">
              Sustainable Rooftop Solar • Clean Energy • Smart Investment
            </div>
            <div class="cover-title editable" contenteditable="true">
              ${plantKw || "XX"} kW Rooftop Solar Solution
            </div>
          </div>
          <div class="cover-bottom">
            <div class="cover-proposal-meta">
              <p><strong>Proposal For:</strong> <span class="editable" contenteditable="true">${customerName}</span></p>
              <p class="editable" contenteditable="true">${customerAddress}</p>
              <p class="editable" contenteditable="true">${customerCity}</p>
            </div>
            <div class="mini-card">
              <strong>Proposal Details</strong>
              <div>Type: On-Grid Solar</div>
              <div>Date: ${proposalDate}</div>
              <div>Proposal No: ${proposalNo}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-strip">
        <span class="editable" contenteditable="true">
          V-Sustain Solar Solutions • Techno-commercial Offer
        </span>
        <span>Page 1</span>
      </div>
    </section>

    <!-- PAGE 2: PROJECT OVERVIEW & SYSTEM SPEC -->
    <section class="page">
      <div class="page-title">
        <div class="page-title-icon">➤</div>
        <h2 class="editable" contenteditable="true">Project Overview</h2>
      </div>
      <p class="section-subtitle editable" contenteditable="true">
        This section summarizes the proposed on-grid rooftop solar solution, project configuration and key
        technical parameters for the system.
      </p>

      <div class="two-col">
        <div class="card">
          <h3 class="editable" contenteditable="true">On-Grid Solar Working Methodology</h3>
          <p class="editable" contenteditable="true">
            Solar PV modules convert sunlight into DC power, which is fed to the on-grid inverter. The inverter
            synchronizes with the utility grid and supplies power to your home or facility. Excess energy can be
            exported to the grid as per net-metering policy.
          </p>
          <div class="notes-box editable" contenteditable="true">
            [Placeholder for working methodology diagram / infographic]<br />
            Replace this box with an image like: sun → panels → inverter → bidirectional meter → grid / home.
          </div>
        </div>
        <div class="card">
          <h3 class="editable" contenteditable="true">Project Snapshot</h3>
          <ul class="info-list">
            <li><strong>Customer:</strong> <span class="editable" contenteditable="true">${customerName}</span></li>
            <li><strong>Location:</strong> <span class="editable" contenteditable="true">${customerCity}</span></li>
            <li><strong>System Capacity:</strong> <span class="editable" contenteditable="true">${plantKw || "XX"} kW On-Grid</span></li>
            <li><strong>Application:</strong> <span class="editable" contenteditable="true">Residential / Commercial Rooftop</span></li>
            <li><strong>Expected Life:</strong> <span class="editable" contenteditable="true">25+ years for PV modules</span></li>
            <li><strong>Grid Type:</strong> <span class="editable" contenteditable="true">3 Phase / Single Phase (as per site)</span></li>
          </ul>
          <p class="editable" contenteditable="true">
            This proposal is prepared based on preliminary load understanding and site assumptions. Final design
            will be confirmed post detailed site survey.
          </p>
        </div>
      </div>

      <div class="page-title" style="margin-top:24px;">
        <div class="page-title-icon">➤</div>
        <h2 class="editable" contenteditable="true">System Specification</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Description</th>
            <th>Make</th>
            <th>Qty</th>
            <th>UoM</th>
          </tr>
        </thead>
        <tbody>
          ${specRowsHtml}
        </tbody>
      </table>

      <div class="notes-box editable" contenteditable="true">
        Notes: Miscellaneous items such as fasteners, conduits, termination accessories, labels, etc., are considered
        as per standard design & Luminous-approved bill of materials.
      </div>

      <div class="footer-strip">
        <span class="editable" contenteditable="true">System Specification • V-Sustain Solar Solutions</span>
        <span>Page 2</span>
      </div>
    </section>

    <!-- PAGE 3: WHY LUMINOUS & TESTIMONIALS -->
    <section class="page">
      <div class="page-title">
        <div class="page-title-icon">➤</div>
        <h2 class="editable" contenteditable="true">Why Luminous Solar with V-Sustain</h2>
      </div>
      <p class="section-subtitle editable" contenteditable="true">
        Eco-Friendly Branding • Loyal • Sustainable Future.
      </p>

      <div class="why-grid">
        <div class="why-card">
          <div class="why-card-title">
            <div class="why-icon">⚙️</div>
            <span class="editable" contenteditable="true">Customized Solution</span>
          </div>
          <p class="editable" contenteditable="true">
            System engineered for your specific roof, load pattern and future expansion needs.
          </p>
        </div>
        <div class="why-card">
          <div class="why-card-title">
            <div class="why-icon">🧰</div>
            <span class="editable" contenteditable="true">Minimal Maintenance</span>
          </div>
          <p class="editable" contenteditable="true">
            Robust components with low downtime, backed by reliable service support.
          </p>
        </div>
        <div class="why-card">
          <div class="why-card-title">
            <div class="why-icon">🛡️</div>
            <span class="editable" contenteditable="true">Highest Safety Standards</span>
          </div>
          <p class="editable" contenteditable="true">
            Proper protection devices, earthing, and wiring practices ensure safe operation.
          </p>
        </div>
        <div class="why-card">
          <div class="why-card-title">
            <div class="why-icon">🏅</div>
            <span class="editable" contenteditable="true">Quality Products & Services</span>
          </div>
          <p class="editable" contenteditable="true">
            Luminous modules, inverters and BOS with proven performance across India.
          </p>
        </div>
        <div class="why-card">
          <div class="why-card-title">
            <div class="why-icon">⚡</div>
            <span class="editable" contenteditable="true">Reliable Power & Quick ROI</span>
          </div>
          <p class="editable" contenteditable="true">
            Designed for stable energy output and attractive payback period.
          </p>
        </div>
        <div class="why-card">
          <div class="why-card-title">
            <div class="why-icon">🌱</div>
            <span class="editable" contenteditable="true">Smart & Sustainable Investment</span>
          </div>
          <p class="editable" contenteditable="true">
            Demonstrate your commitment to sustainability while reducing electricity bills.
          </p>
        </div>
      </div>

      <div style="margin-top:22px;">
        <h3 class="editable" contenteditable="true">Customer Testimonials & Site Gallery</h3>
        <div class="testimonial-row">
          <div class="testimonial-placeholder editable" contenteditable="true">
            Image Placeholder 1<br />Replace with project photo / testimonial
          </div>
          <div class="testimonial-placeholder editable" contenteditable="true">
            Image Placeholder 2
          </div>
          <div class="testimonial-placeholder editable" contenteditable="true">
            Image Placeholder 3
          </div>
          <div class="testimonial-placeholder editable" contenteditable="true">
            Image Placeholder 4
          </div>
        </div>
      </div>

      <div class="footer-strip">
        <span class="editable" contenteditable="true">Why Luminous Solar • Testimonials</span>
        <span>Page 3</span>
      </div>
    </section>

    <!-- PAGE 4: PAYMENT TERMS & WARRANTY -->
    <section class="page">
      <div class="page-title">
        <div class="page-title-icon">➤</div>
        <h2 class="editable" contenteditable="true">Payment & Warranty Terms</h2>
      </div>

      <h3 class="editable" contenteditable="true">Payment Terms</h3>
      <div class="payment-flow">
        <div class="payment-step">
          <div class="payment-circle">1</div>
          <div class="editable" contenteditable="true">40% Advance with Purchase Order</div>
        </div>
        <div class="payment-step">
          <div class="payment-circle">2</div>
          <div class="editable" contenteditable="true">50% on Material Delivery</div>
        </div>
        <div class="payment-step">
          <div class="payment-circle">3</div>
          <div class="editable" contenteditable="true">10% after Commissioning</div>
        </div>
      </div>

      <h3 class="editable" contenteditable="true">Warranty Terms</h3>
      <div class="warranty-strip">
        <div class="w-block">
          <div class="w-label editable" contenteditable="true">PV Modules</div>
          <div class="w-value editable" contenteditable="true">30 Years*</div>
        </div>
        <div class="w-block">
          <div class="w-label editable" contenteditable="true">Inverter</div>
          <div class="w-value editable" contenteditable="true">8 Years*</div>
        </div>
        <div class="w-block">
          <div class="w-label editable" contenteditable="true">System</div>
          <div class="w-value editable" contenteditable="true">5 Years*</div>
        </div>
      </div>
      <div class="fine-print editable" contenteditable="true">
        *Note: Please refer to the detailed terms & conditions and OEM warranty cards for more information.
        Warranty is as per manufacturer / OEM guidelines and may vary by model.
      </div>

      <div class="footer-strip">
        <span class="editable" contenteditable="true">Payment & Warranty Terms</span>
        <span>Page 4</span>
      </div>
    </section>

    <!-- PAGE 5: COMMERCIAL OFFER & CHARGEABLE SERVICES -->
    <section class="page">
      <div class="page-title">
        <div class="page-title-icon">➤</div>
        <h2 class="editable" contenteditable="true">Commercial Offer</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Item</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Rate (₹)</th>
            <th>Amount (₹)</th>
            <th>GST%</th>
            <th>GST Amt (₹)</th>
            <th>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${commercialRowsHtml}
        </tbody>
      </table>

      <div class="summary-highlight">
        <div>Subtotal (before GST): <strong>${fmt(totals.subtotal)}</strong></div>
        <div>GST Total: <strong>${fmt(totals.totalGst)}</strong></div>
        <div>Grand Total (inclusive of GST): <strong>${fmt(totals.grandTotal)}</strong></div>
      </div>

      <div class="flex-row" style="margin-top:18px;">
        <div class="flex-1">
          <h3 class="editable" contenteditable="true">Chargeable Services (Optional)</h3>
          <table class="charge-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Description</th>
                <th>Tenure</th>
                <th>Cost (INR)</th>
              </tr>
            </thead>
            <tbody class="editable" contenteditable="true">
              <tr>
                <td>01</td>
                <td>Annual Maintenance Contract (AMC)</td>
                <td>60 Months</td>
                <td>As discussed</td>
              </tr>
              <tr>
                <td>02</td>
                <td>Cleaning & Preventive Check-up</td>
                <td>6 Months</td>
                <td>As discussed</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex-1">
          <h3 class="editable" contenteditable="true">Project Notes</h3>
          <div class="notes-box editable" contenteditable="true">
            Add any special commercial remarks here: scope boundaries, inclusions/exclusions, schedule
            assumptions, etc.
          </div>
        </div>
      </div>

      <div class="footer-strip">
        <span class="editable" contenteditable="true">Commercial Offer & Services</span>
        <span>Page 5</span>
      </div>
    </section>

    <!-- PAGE 6: GENERAL TERMS & CONDITIONS -->
    <section class="page">
      <div class="page-title">
        <div class="page-title-icon">➤</div>
        <h2 class="editable" contenteditable="true">General Terms & Conditions</h2>
      </div>

      <div class="terms editable" contenteditable="true">
        <p>These General Terms and Conditions have been agreed between the customer/consumer and the Channel Partner only.</p>

        <p><strong>Validity</strong><br/>
        Quotation is valid for 15 Days from the date of submission.</p>

        <p><strong>Taxes & Duties</strong><br/>
        On Materials, if after acceptance of Purchase Order due to change of government policy any new taxes are applicable,
        such rates will be to the Consumer's account. Prices are inclusive of standard packing.</p>

        <p><strong>Packing</strong><br/>
        Packing shall be done as per our standard. In case non-standard packaging, customer needs to pay extra.</p>

        <p><strong>Delivery Period</strong><br/>
        The goods will be delivered as per the agreed terms & conditions as per duly accepted PO. Deliveries are subject to
        "Force Majeure".</p>

        <p><strong>Force Majeure</strong><br/>
        The offer is subject to force majeure by which it means cause beyond our reasonable control such as war invasion,
        civil disobedience, government orders or restrictions, strikes, lockouts, riots, materials wagons, shipping space or
        any other earthquakes, goods, accident, breakdown of machinery, delay or inability to obtain labour, raw material,
        causes whatsoever beyond our reasonable control, affecting us or our subcontractors, suppliers, etc.</p>

        <p><strong>Exclusions</strong><br/>
        The warranty shall not apply to defects resulting from:
        • Any materials, components, tools, design, or software provided by Consumers.<br/>
        • Negligence or willful misconduct of Consumers.<br/>
        • Parts, accessories or attachments other than those supplied by Consumers.<br/>
        • Improper service work, installation or alterations carried out by Consumers or third party without V-Sustain Solar Solutions' written consent.<br/>
        • Any trial or experiment carried out by the Consumers on the system without V-Sustain Solar Solutions' written consent.<br/>
        • Use of unsuitable material or consumables by Consumers; OR<br/>
        • Any use, service or operation of any equipment, parts or components which is not in conformity with manuals,
          instructions or specifications provided by the manufacturer or which is otherwise not in accordance with
          normal industry practice.</p>

        <p><strong>Cancellation</strong><br/>
        Order received and acknowledged by us shall not be subject to cancellation, either wholly or partly for any reason
        whatsoever, without our consent. Cancellation may attract cancellation charges as per company policy.</p>
      </div>

      <div class="flex-row" style="margin-top:14px;">
        <div class="flex-1">
          <h3 class="editable" contenteditable="true">Bank Details</h3>
          <p class="editable" contenteditable="true">
            BANK NAME: BANK OF INDIA (SANJAY NAGAR)<br/>
            ACCOUNT NO: 849330150000010<br/>
            IFSC CODE: BKID0008493
          </p>
        </div>
        <div class="flex-1">
          <h3 class="editable" contenteditable="true">Contact</h3>
          <p class="editable" contenteditable="true">
            Proposal by V-Sustain Solar Solutions<br/>
            Authorized Luminous Partner<br/>
            vsustainsolarsolutions@gmail.com<br/>
            Pravesh Kumar Tiwari<br/>
            +91 99-000-00476
          </p>
        </div>
      </div>

      <div class="footer-strip">
        <span class="editable" contenteditable="true">General Terms & Conditions</span>
        <span>Page 6</span>
      </div>
    </section>

  </div>

  <script>
    // Small helper: remove contenteditable before print if needed (optional)
    // window.addEventListener('beforeprint', () => {
    //   document.querySelectorAll('.editable').forEach(el => el.removeAttribute('contenteditable'));
    // });
  </script>
</body>
</html>
  `;
  return html;
}


/*----------------------------------------------
  10. OPEN IN NEW WINDOW
-----------------------------------------------*/
function openInNewWindow(html) {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup blocked. Please allow popups for this site to see the quotation.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}
