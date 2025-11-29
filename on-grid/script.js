/****************************************************
 * V-SUSTAIN SOLAR SOLUTIONS – ON GRID BILLING ENGINE
 * Shows all values inside cards, supports manual price
 * override & opens quotations in a new tab with Print button.
 ****************************************************/

/*----------------------------------------------
  1. DATASETS (Inverters, Panels, ACDB, DCDB)
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

/**
 * Manual price override engine:
 * If manual-price-toggle[data-target=sectionId] is ON and input has value,
 * use that as base price. Otherwise use dealer price.
 */
function getBasePrice(sectionId, dealerPrice) {
  const toggle = document.querySelector(".manual-price-toggle[data-target='" + sectionId + "']");
  const inp = document.querySelector(".manual-price-input[data-target='" + sectionId + "']");
  if (toggle && toggle.checked && inp) {
    const val = n(inp.value);
    if (val > 0) return val;
  }
  return dealerPrice;
}

/**
 * Margin engine:
 * 1) If margin-toggle ON → use global margin
 * 2) Else if custom margin provided → use custom
 * 3) Else → no margin
 */
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

/**
 * On-grid GST:
 * Inverter + Panels → 5%
 * Others → 18%
 */
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

  document.getElementById("panelSelect").addEventListener("change", recalcPanelsCard);
  document.getElementById("systemKW").addEventListener("input", () => {
    recalcPanelsCard();
    recalcInstallStructure();
  });

  document.getElementById("inverterSelect").addEventListener("change", recalcInverterCard);
  document.getElementById("acdbSelect").addEventListener("change", recalcAcdbCard);
  document.getElementById("dcdbSelect").addEventListener("change", recalcDcdbCard);

  document.getElementById("globalMargin").addEventListener("input", () => {
    recalcInverterCard();
    recalcPanelsCard();
    recalcAcdbCard();
    recalcDcdbCard();
  });

  document.querySelectorAll(".custom-margin").forEach(inp => {
    inp.addEventListener("input", () => {
      recalcInverterCard();
      recalcPanelsCard();
      recalcAcdbCard();
      recalcDcdbCard();
    });
  });

  // manual price override change
  document.querySelectorAll(".manual-price-toggle, .manual-price-input").forEach(el => {
    el.addEventListener("change", () => {
      recalcInverterCard();
      recalcPanelsCard();
      recalcAcdbCard();
      recalcDcdbCard();
    });
    el.addEventListener("input", () => {
      recalcInverterCard();
      recalcPanelsCard();
      recalcAcdbCard();
      recalcDcdbCard();
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

  // initial
  recalcInverterCard();
  recalcPanelsCard();
  recalcAcdbCard();
  recalcDcdbCard();
  recalcInstallStructure();
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

/*----------------------------------------------
  5. CARD CALCULATIONS
-----------------------------------------------*/
function recalcInverterCard() {
  if (!isSectionEnabled("inverter")) return;

  const sel = document.getElementById("inverterSelect");
  const opt = sel.selectedOptions[0];
  if (!opt) return;

  const dealer = n(opt.dataset.price);
  const base = getBasePrice("inverter", dealer);
  const finalRate = applyMargin(base, "inverter");
  const gst = getGstPercent("inverter");
  const qty = 1;

  const amount = finalRate * qty;
  const gstAmt = amount * gst / 100;
  const total = amount + gstAmt;

  document.getElementById("inverterDealer").value = fmt(dealer);
  document.getElementById("inverterRate").value = fmt(finalRate);
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

function recalcInstallStructure() {
  const kw = n(document.getElementById("systemKW").value);
  const installField = document.getElementById("installationCost");
  const structField = document.getElementById("structureCost");

  if (kw > 0) {
    if (!installField.value) installField.value = kw * 5000;
    if (!structField.value) structField.value = kw * 8000;
  }
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
    <label>Enable</label>
    <input type="checkbox" class="cp-enable" checked>
    <label>Use Global Margin</label>
    <input type="checkbox" class="cp-margin-global" checked>
    <input type="number" placeholder="Custom Margin %" class="cp-custom-margin">
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

  // installation (use editable total)
  if (isSectionEnabled("installation")) {
    const kw = n(document.getElementById("systemKW").value);
    const total = n(document.getElementById("installationCost").value);
    if (kw > 0 && total > 0) {
      const rate = total / kw;
      items.push({
        type: "installation",
        item: "Installation & Commissioning",
        desc: "Installation services",
        qty: kw,
        unit: "kW",
        baseRate: rate,
        gstPercent: getGstPercent("installation")
      });
    }
  }

  // structure (use editable total)
  if (isSectionEnabled("structure")) {
    const kw = n(document.getElementById("systemKW").value);
    const total = n(document.getElementById("structureCost").value);
    if (kw > 0 && total > 0) {
      const rate = total / kw;
      items.push({
        type: "structure",
        item: "Module Mounting Structure",
        desc: "Structure for PV modules",
        qty: kw,
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
    const enabled = row.querySelector(".cp-enable").checked;
    if (!enabled) return;
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
  9. QUOTATION HTML (DETAILED & SUMMARY)
-----------------------------------------------*/
function buildDetailedQuotationHtml(totals) {
  const plantKw = n(document.getElementById("systemKW").value);
  const margin = getGlobalMargin();

  // subsidy
  let subsidyText = "";
  if (plantKw > 0) {
    if (plantKw <= 2) {
      subsidyText = "For on-grid residential projects up to 2 kW, government subsidy of ₹60,000 may be applicable (as per current scheme).";
    } else if (plantKw >= 3 && plantKw <= 10) {
      subsidyText = "For on-grid residential projects from 3 kW to 10 kW, government subsidy of ₹78,000 may be applicable (as per current scheme).";
    } else {
      subsidyText = "Government subsidy currently applies up to 10 kW. Please confirm scheme details at the time of ordering.";
    }
  }

  const rowsHtml = totals.items.map((it, idx) => {
    const amount = it.baseRate * it.qty;
    const gstAmt = amount * it.gstPercent / 100;
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
  }).join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>On-Grid Quotation - V-Sustain Solar Solutions</title>
  <style>
    body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; background:#f9fafb; color:#0f172a; padding:20px; }
    .quotation-wrapper { max-width:900px; margin:0 auto; background:#fff; padding:20px 24px; border-radius:12px; box-shadow:0 8px 30px rgba(15,23,42,0.18); }
    header { display:flex; justify-content:space-between; gap:16px; margin-bottom:16px; }
    .brand-left { display:flex; gap:10px; }
    .logo-placeholder { width:52px; height:52px; border-radius:999px; background:radial-gradient(circle at 30% 20%, #bbf7d0, #22c55e); box-shadow:0 0 15px rgba(34,197,94,0.7); }
    h1 { margin:0; font-size:22px; }
    h2 { margin-top:20px; margin-bottom:6px; font-size:18px; }
    .tagline { font-size:13px; color:#64748b; }
    .contact p { margin:2px 0; font-size:12px; color:#475569; }
    table { width:100%; border-collapse:collapse; margin-top:14px; font-size:12px; }
    th, td { border:1px solid #e2e8f0; padding:6px 6px; vertical-align:top; }
    th { background:#f8fafc; text-align:left; }
    tfoot td { font-weight:600; }
    .totals { margin-top:10px; text-align:right; font-size:13px; }
    .totals strong { font-size:18px; color:#16a34a; }
    .section { margin-top:18px; font-size:12px; }
    .section p { margin:3px 0; }
    .warranty-grid { display:flex; gap:10px; flex-wrap:wrap; margin-top:6px; }
    .w-card { flex:1 1 120px; background:#f1f5f9; padding:8px 10px; border-radius:8px; border:1px solid #e2e8f0; }
    .w-label { font-size:11px; color:#64748b; }
    .w-value { font-weight:600; font-size:13px; }
    .why-grid { display:flex; flex-wrap:wrap; gap:8px; margin-top:6px; }
    .why-card { flex:1 1 140px; background:#f8fafc; border-radius:8px; border:1px solid #e5e7eb; padding:8px; font-size:12px; }
    .why-icon { font-size:16px; }
    .why-title { font-weight:600; margin-top:2px; }
    .why-text { font-size:11px; color:#6b7280; margin-top:2px; }
    .bank { margin-top:8px; }
    .fine-print { font-size:11px; color:#6b7280; margin-top:4px; }
    .subsidy-box { margin-top:12px; padding:10px; border-radius:8px; background:#ecfdf5; border:1px solid #bbf7d0; font-size:12px; }
    .footer { margin-top:16px; font-size:11px; text-align:center; color:#6b7280; }
    .print-btn { margin-bottom:10px; padding:6px 12px; border-radius:8px; border:none; background:#1d4ed8; color:#fff; cursor:pointer; font-size:13px; float:right; }
    @media print {
      body { background:#fff; padding:0; }
      .quotation-wrapper { box-shadow:none; border-radius:0; }
      .print-btn { display:none; }
    }
  </style>
</head>
<body>
  <div class="quotation-wrapper">
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
    <header>
      <div class="brand-left">
        <div class="logo-placeholder"></div>
        <div>
          <h1>V-Sustain Solar Solutions</h1>
          <div class="tagline">Authorized Luminous Partner – On-Grid Solar Quotation</div>
        </div>
      </div>
      <div class="contact">
        <p>Email: <strong>vsustainsolarsolutions@gmail.com</strong></p>
        <p>Phone: <strong>+91 99-000-00476</strong></p>
        <p>Location: Bengaluru, Karnataka</p>
      </div>
    </header>

    <h2>Quotation Details</h2>
    <p>System Capacity: <strong>${plantKw} kW</strong></p>
    <p>Global Margin Applied: <strong>${margin}%</strong></p>

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
        ${rowsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6"></td>
          <td>${fmt(totals.subtotal)}</td>
          <td></td>
          <td>${fmt(totals.totalGst)}</td>
          <td>${fmt(totals.grandTotal)}</td>
        </tr>
      </tfoot>
    </table>

    <div class="totals">
      Total contract value (incl. GST): <strong>${fmt(totals.grandTotal)}</strong>
    </div>

    <div class="subsidy-box">
      <strong>Government Subsidy (On-Grid Only):</strong>
      <p>Projects up to <strong>2 kW</strong> may receive a subsidy of <strong>₹60,000</strong>.</p>
      <p>Projects from <strong>3 kW to 10 kW</strong> may receive a subsidy of <strong>₹78,000</strong>.</p>
      ${subsidyText ? "<p>" + subsidyText + "</p>" : ""}
      <p class="fine-print">Note: Subsidy schemes are subject to government policy at the time of application.</p>
    </div>

    <div class="section">
      <h2>Warranty Overview</h2>
      <div class="warranty-grid">
        <div class="w-card">
          <div class="w-label">PV Modules</div>
          <div class="w-value">30 Years*</div>
        </div>
        <div class="w-card">
          <div class="w-label">Inverter</div>
          <div class="w-value">8 Years*</div>
        </div>
        <div class="w-card">
          <div class="w-label">System</div>
          <div class="w-value">5 Years*</div>
        </div>
      </div>
      <div class="fine-print">
        *Warranty as per OEM terms & conditions. Please refer to detailed warranty documents.
      </div>
    </div>

    <div class="section">
      <h2>Why Luminous Solar</h2>
      <div class="why-grid">
        <div class="why-card">
          <div class="why-icon">⚙️</div>
          <div class="why-title">Customized Solution</div>
          <div class="why-text">System engineered for your roof, load profile and future expansion.</div>
        </div>
        <div class="why-card">
          <div class="why-icon">🧰</div>
          <div class="why-title">Minimal Maintenance</div>
          <div class="why-text">Rugged components with low downtime and easy serviceability.</div>
        </div>
        <div class="why-card">
          <div class="why-icon">🛡️</div>
          <div class="why-title">Highest Safety Standards</div>
          <div class="why-text">Proper earthing, protection devices and best-practice installation.</div>
        </div>
        <div class="why-card">
          <div class="why-icon">🏅</div>
          <div class="why-title">Quality Products</div>
          <div class="why-text">Luminous modules, inverters and BOS with proven field performance.</div>
        </div>
        <div class="why-card">
          <div class="why-icon">⚡</div>
          <div class="why-title">Reliable Power & ROI</div>
          <div class="why-text">Stable output, faster payback and attractive lifetime savings.</div>
        </div>
        <div class="why-card">
          <div class="why-icon">🌱</div>
          <div class="why-title">Eco-Friendly Branding</div>
          <div class="why-text">A visible commitment to sustainability and green energy.</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Payment Terms</h2>
      <p>• 40% Advance with PO</p>
      <p>• 50% on Material Delivery</p>
      <p>• 10% after Commissioning</p>
    </div>

    <div class="section">
      <h2>General Terms & Conditions</h2>
      <p><strong>Taxes & Duties:</strong> Any change in tax structure due to government policy will be to the consumer's account. Prices are inclusive of standard packing.</p>
      <p><strong>Validity:</strong> This quotation is valid for 15 days from the date of submission.</p>
      <p><strong>Packing:</strong> Standard packing included. Non-standard packing, if required, will be charged extra.</p>
      <p><strong>Delivery:</strong> As per mutually agreed terms and subject to Force Majeure conditions.</p>
      <p><strong>Exclusions:</strong> Damages due to improper use, third-party installation, or non-OEM accessories are not covered under warranty.</p>
      <p><strong>Cancellation:</strong> Orders once accepted cannot be cancelled without prior consent. Cancellation charges may apply as per company policy.</p>
      <p><strong>Force Majeure:</strong> Delays due to events beyond reasonable control (strikes, natural disasters, etc.) are exempt.</p>
    </div>

    <div class="section bank">
      <h2>Bank Details</h2>
      <p><strong>Bank Name:</strong> BANK OF INDIA (SANJAY NAGAR)</p>
      <p><strong>Account No:</strong> 849330150000010</p>
      <p><strong>IFSC Code:</strong> BKID0008493</p>
    </div>

    <div class="footer">
      <p>Proposal by V-Sustain Solar Solutions</p>
      <p>Authorized Luminous Partner</p>
      <p>This is a computer generated quotation. No signature is required.</p>
    </div>
  </div>
</body>
</html>
  `;
  return html;
}

function buildSummaryQuotationHtml(totals) {
  const plantKw = n(document.getElementById("systemKW").value);
  const rowsHtml = totals.items.map((it, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${it.item}</td>
      <td>${it.desc || ""}</td>
      <td>${it.qty}</td>
      <td>${it.unit}</td>
    </tr>
  `).join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Summary Quotation - V-Sustain Solar Solutions</title>
  <style>
    body { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; background:#f9fafb; color:#0f172a; padding:20px; }
    .quotation-wrapper { max-width:800px; margin:0 auto; background:#fff; padding:20px 24px; border-radius:12px; box-shadow:0 8px 30px rgba(15,23,42,0.18); }
    header { display:flex; justify-content:space-between; gap:16px; margin-bottom:16px; }
    .logo-placeholder { width:52px; height:52px; border-radius:999px; background:radial-gradient(circle at 30% 20%, #bbf7d0, #22c55e); box-shadow:0 0 15px rgba(34,197,94,0.7); }
    h1 { margin:0; font-size:22px; }
    .tagline { font-size:13px; color:#64748b; }
    table { width:100%; border-collapse:collapse; margin-top:14px; font-size:12px; }
    th, td { border:1px solid #e2e8f0; padding:6px 6px; vertical-align:top; }
    th { background:#f8fafc; text-align:left; }
    .footer { margin-top:16px; font-size:11px; text-align:center; color:#6b7280; }
    .print-btn { margin-bottom:10px; padding:6px 12px; border-radius:8px; border:none; background:#1d4ed8; color:#fff; cursor:pointer; float:right; }
    @media print { body { background:#fff; padding:0; } .quotation-wrapper { box-shadow:none; border-radius:0; } .print-btn { display:none; } }
  </style>
</head>
<body>
  <div class="quotation-wrapper">
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
    <header>
      <div style="display:flex;gap:10px;align-items:center;">
        <div class="logo-placeholder"></div>
        <div>
          <h1>V-Sustain Solar Solutions</h1>
          <div class="tagline">Summary Quotation – On-Grid Solar</div>
        </div>
      </div>
      <div style="font-size:12px;color:#475569;">
        <div>Capacity: <strong>${plantKw} kW</strong></div>
        <div>Email: vsustainsolarsolutions@gmail.com</div>
        <div>Phone: +91 99-000-00476</div>
      </div>
    </header>

    <table>
      <thead>
        <tr>
          <th>S.No</th>
          <th>Item</th>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="footer">
      <p>Proposal by V-Sustain Solar Solutions</p>
      <p>Authorized Luminous Partner</p>
    </div>
  </div>
</body>
</html>
  `;
  return html;
}

/*----------------------------------------------
  10. OPEN IN NEW WINDOW (NO AUTO PRINT)
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
