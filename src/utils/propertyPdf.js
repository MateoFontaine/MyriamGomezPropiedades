// src/utils/propertyPdf.js
import jsPDF from "jspdf";

/**
 * PDF más "aireado":
 * - brandName en color primary
 * - ficha técnica en caja con más padding
 * - gaps coherentes entre secciones
 * - line-height mayor en párrafos
 * Podés ajustar rápido los espacios tocando SPACING.
 */
export async function generatePropertyPDF(p, opts = {}) {
  const {
    logoUrl,
    brandName = "Inmobiliaria",
    brandSubtitle = "",
    contact = {},
    primary = [214, 31, 105], // rosa
  } = opts;

  // 🔧 todos los espacios acá:
  const SPACING = {
    margin: 52,
    headerRuleGap: 24,
    titleTopGap: 12,
    sectionGap: 24,
    sectionTitleGap: 14,
    boxPadX: 18,
    boxPadY: 18,
    rowHeight: 26,
    chipsRowGap: 12,
    chipsWrapGap: 10,
    galleryCellH: 104,
    galleryGap: 12,
    lineHeight: 16,
  };

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = SPACING.margin;
  const maxTextW = pageW - margin * 2;
  let y = margin;

  /* ---------- HEADER ---------- */
  if (logoUrl) {
    try {
      const { dataUrl, w, h } = await toDataURLWithSize(logoUrl);
      const fit = fitRect(w, h, 128, 46);
      doc.addImage(dataUrl, "PNG", margin, y - 4, fit.w, fit.h, undefined, "FAST");
    } catch {}
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...primary);               // nombre en rosa
  doc.text(brandName, margin + (logoUrl ? 140 : 0), y + 8);

  if (brandSubtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(brandSubtitle, margin + (logoUrl ? 140 : 0), y + 26);
  }
  doc.setTextColor(0);

  y += 56;
  drawRule(doc, margin, y, pageW - margin * 2);
  y += SPACING.headerRuleGap;

  /* ---------- TÍTULO + PRECIO ---------- */
  y += SPACING.titleTopGap;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(p.titulo || "Propiedad", margin, y);

  const price = p.precio ? `USD ${p.precio}` : "-";
  const badgeW = doc.getTextWidth(price) + 20;
  doc.setFillColor(...primary);
  doc.setTextColor(255);
  doc.roundedRect(pageW - margin - badgeW, y - 18, badgeW, 28, 8, 8, "F");
  doc.setFontSize(12);
  doc.text(price, pageW - margin - badgeW + 10, y + 4);
  doc.setTextColor(0);

  y += SPACING.sectionGap;

  /* ---------- FICHA TÉCNICA ---------- */
  drawSectionTitle(doc, "Ficha técnica", margin, y);
  y += SPACING.sectionTitleGap;

  const info = [
    ["Ubicación:", p.ubicacion || "-"],
    ["Tipo:", p.tipo || "-"],
    ["Categoría:", p.categoria || "-"],
    ["Dormitorios:", safe(p.dormitorios)],
    ["Baños:", safe(p["baños"])],
    ["Superficie:", p.superficie ? `${p.superficie} m²` : "-"],
    ["Código:", p.cod || "-"],
    ["Oportunidad:", truthy(p.oportunidad) ? "Sí" : "No"],
  ];

  const rows = Math.ceil(info.length / 2);
  const boxH = rows * SPACING.rowHeight + SPACING.boxPadY * 2;
  y = ensureSpace(doc, y, boxH, pageH, margin);

  const boxY = y;
  const boxW = pageW - margin * 2;
  doc.setFillColor(248); // gris muy suave
  doc.roundedRect(margin, boxY, boxW, boxH, 12, 12, "F");

  const colGap = 22;
  const colW = (boxW - colGap) / 2;
  let colX = margin + SPACING.boxPadX;
  let colY = boxY + SPACING.boxPadY;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  info.forEach((pair, i) => {
    if (i === rows) {
      colX = margin + SPACING.boxPadX + colW + colGap;
      colY = boxY + SPACING.boxPadY;
    }
    drawLabelValue(doc, pair[0], pair[1], colX, colY, colW - SPACING.boxPadX * 2);
    colY += SPACING.rowHeight;
  });

  y = boxY + boxH + SPACING.sectionGap;

  /* ---------- IMAGEN PRINCIPAL ---------- */
  const imgs = arrImgs(p);
  const main = p.imagen || imgs[0];
  if (main) {
    y = ensureSpace(doc, y, 260, pageH, margin);
    drawSectionTitle(doc, "Imagen principal", margin, y);
    y += SPACING.sectionTitleGap;
    try {
      const { dataUrl, w, h } = await toDataURLWithSize(main);
      const fit = fitRect(w, h, pageW - margin * 2, 240);
      doc.addImage(dataUrl, "JPEG", margin, y, fit.w, fit.h, undefined, "FAST");
      y += fit.h + SPACING.sectionGap;
    } catch {}
  }

  /* ---------- DESCRIPCIÓN ---------- */
  if (p.descripcion) {
    y = ensureSpace(doc, y, 60, pageH, margin);
    drawSectionTitle(doc, "Descripción", margin, y);
    y += SPACING.sectionTitleGap;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y = writeWrapped(doc, p.descripcion, margin, y, maxTextW, pageH, margin, SPACING.lineHeight);
    y += SPACING.sectionGap - 8;
  }

  /* ---------- SERVICIOS / CARACTERÍSTICAS ---------- */
  const serv = arr(p.servicios);
  const car  = arr(p.caracteristicas);
  if (serv.length || car.length) {
    y = ensureSpace(doc, y, 60, pageH, margin);
    drawSectionTitle(doc, "Servicios y características", margin, y);
    y += SPACING.sectionTitleGap;

    if (serv.length) {
      y = drawChipsLine(doc, "Servicios:", serv, margin, y, pageW, margin, SPACING);
      y += SPACING.chipsRowGap;
    }
    if (car.length) {
      y = drawChipsLine(doc, "Características:", car, margin, y, pageW, margin, SPACING);
      y += 4;
    }
    y += SPACING.sectionGap - 8;
  }

  /* ---------- GALERÍA ---------- */
  const rest = imgs.filter((u) => u !== main);
  if (rest.length) {
    y = ensureSpace(doc, y, 130, pageH, margin);
    drawSectionTitle(doc, "Galería", margin, y);
    y += SPACING.sectionTitleGap;

    const cols = 3, gap = SPACING.galleryGap;
    const cellW = (pageW - margin * 2 - gap * (cols - 1)) / cols;
    const cellH = SPACING.galleryCellH;

    for (let i = 0; i < rest.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      let x = margin + col * (cellW + gap);
      let yy = y + row * (cellH + gap);
      if (yy + cellH > pageH - margin) { doc.addPage(); y = margin; i--; continue; }
      try {
        const { dataUrl, w, h } = await toDataURLWithSize(rest[i]);
        const fit = fitRect(w, h, cellW, cellH);
        doc.addImage(dataUrl, "JPEG", x, yy, fit.w, fit.h, undefined, "FAST");
      } catch {}
    }
    y += Math.ceil(rest.length / cols) * (cellH + gap);
  }

  /* ---------- FOOTER ---------- */
  const footerY = pageH - margin + 10;
  drawRule(doc, margin, footerY - 22, pageW - margin * 2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  const left = `${brandName}${brandSubtitle ? " • " + brandSubtitle : ""}`;
  const parts = [];
  if (contact.phone) parts.push(contact.phone);
  if (contact.email) parts.push(contact.email);
  if (contact.web)   parts.push(contact.web);
  const right = parts.join(" • ") || "Generado por Codela";
  doc.text(left, margin, footerY);
  const rW = doc.getTextWidth(right);
  doc.text(right, pageW - margin - rW, footerY);
  doc.setTextColor(0);

  doc.save(`propiedad_${p.cod || p.id || "detalle"}.pdf`);
}

/* ================== Helpers ================== */
function safe(v){ return (v ?? v === 0) ? String(v) : "-"; }
function truthy(v){ return v === 1 || v === true || v === "1" || v === "true"; }
function arr(v){
  if (Array.isArray(v)) return v.filter(Boolean);
  if (typeof v === "string" && v.trim()) return v.split(",").map(s=>s.trim()).filter(Boolean);
  return [];
}
function arrImgs(p){
  if (Array.isArray(p.imagenes)) return p.imagenes.filter(Boolean);
  if (typeof p.imagenes === "string" && p.imagenes.trim())
    return p.imagenes.split(",").map(s=>s.trim()).filter(Boolean);
  return [];
}
function fitRect(w,h,maxW,maxH){ const r=Math.min(maxW/w, maxH/h, 1); return {w:w*r, h:h*r}; }
function ensureSpace(doc,y,need,pageH,margin){ if (y+need>pageH-margin){ doc.addPage(); return margin; } return y; }
function writeWrapped(doc,text,x,y,maxW,pageH,margin,lineHeight=14){
  const lines = doc.splitTextToSize(text, maxW);
  for (const line of lines){ if (y>pageH-margin){ doc.addPage(); y=margin; } doc.text(line,x,y); y+=lineHeight; }
  return y;
}
function drawRule(doc,x,y,w){ doc.setDrawColor(230); doc.setLineWidth(0.8); doc.line(x,y,x+w,y); doc.setDrawColor(0); }
function drawSectionTitle(doc,title,x,y){
  doc.setFont("helvetica","bold"); doc.setFontSize(12); doc.text(title,x,y);
  doc.setFont("helvetica","normal");
}
function drawLabelValue(doc,label,value,x,y,width){
  doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(90);
  doc.text(label, x, y);
  doc.setFont("helvetica","normal"); doc.setFontSize(11); doc.setTextColor(0);
  const lines = doc.splitTextToSize(String(value || "-"), width);
  doc.text(lines, x, y + 12);
}
function drawChip(doc,text,x,y){
  const padX=7, r=7;
  const w = doc.getTextWidth(text) + padX*2;
  doc.setFillColor(245);
  doc.roundedRect(x, y-10, w, 20, r, r, "F");
  doc.setTextColor(60);
  doc.text(text, x+padX, y+4);
  doc.setTextColor(0);
  return w;
}
function drawChipsLine(doc, title, items, margin, y, pageW, pageMargin, S){
  doc.setFont("helvetica","bold"); doc.setFontSize(10);
  doc.text(title, margin, y);
  let x = margin + doc.getTextWidth(title) + 10;
  doc.setFont("helvetica","normal"); doc.setFontSize(10);
  if (!items.length) return y + 14;
  for (const t of items){
    const chipW = doc.getTextWidth(t) + 14 + S.chipsWrapGap;
    if (x + chipW > pageW - pageMargin) { y += 24; x = margin; }
    x += drawChip(doc, t, x, y + 2) + S.chipsWrapGap;
  }
  return y + 26;
}
function loadImage(url){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.crossOrigin="anonymous"; img.referrerPolicy="no-referrer";
    img.onload=()=>resolve(img); img.onerror=reject; img.src=url;
  });
}
async function toDataURLWithSize(url){
  const img=await loadImage(url);
  const canvas=document.createElement("canvas");
  canvas.width=img.naturalWidth||img.width;
  canvas.height=img.naturalHeight||img.height;
  const ctx=canvas.getContext("2d"); ctx.drawImage(img,0,0);
  return { dataUrl: canvas.toDataURL("image/png"), w: canvas.width, h: canvas.height };
}
