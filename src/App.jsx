import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  bg: "#080D1A", surface: "#0F1625", card: "#151E30",
  card2: "#1A2438", border: "#1E2D45", borderLight: "#253755",
  amber: "#E8A020", amberDim: "#9C6A0E", amberGlow: "#F0A30A22",
  text: "#E2E8F0", muted: "#7A90B3", dim: "#3D5070",
  green: "#22C55E", greenDim: "#14532D", greenBg: "#22C55E18",
  red: "#EF4444", redDim: "#7F1D1D", redBg: "#EF444418",
  orange: "#F97316", orangeBg: "#F9731618",
  blue: "#60A5FA", purple: "#A78BFA",
};

const S = {
  card: { background: T.card, borderRadius: 12, border: `1px solid ${T.border}`, padding: "16px 20px" },
  badge: (color, bg) => ({ background: bg, color, borderRadius: 6, fontSize: 11, fontWeight: 600, padding: "2px 8px", letterSpacing: "0.04em" }),
  btn: (primary) => ({
    background: primary ? T.amber : "transparent",
    color: primary ? "#080D1A" : T.muted,
    border: primary ? "none" : `1px solid ${T.border}`,
    borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600,
    cursor: "pointer", transition: "all .15s",
  }),
};

// ─── LEGAL DOCUMENTS CATALOG ─────────────────────────────────────────────────
const LEGAL_DOCS = [
  { id: "titulo",    label: "Título de Propiedad",        icon: "📄", critical: true,  desc: "Documento notariado que acredita la propiedad del inmueble." },
  { id: "rif",       label: "RIF del Propietario",         icon: "🪪", critical: true,  desc: "Registro de Información Fiscal actualizado del vendedor." },
  { id: "catastro",  label: "Ficha Catastral",             icon: "🗺️", critical: true,  desc: "Registro municipal del inmueble y su valor catastral." },
  { id: "gravamen",  label: "Cert. de Gravámenes",         icon: "⚖️", critical: true,  desc: "Certificado que acredita que el inmueble no tiene hipotecas ni embargos." },
  { id: "solvMun",   label: "Solvencia Municipal",         icon: "🏛️", critical: false, desc: "Constancia de estar al día con los impuestos municipales." },
  { id: "solvElec",  label: "Solvencia CORPOELEC",         icon: "⚡", critical: false, desc: "Constancia de no tener deudas con el servicio eléctrico." },
  { id: "solvAgua",  label: "Solvencia Hidrocapital",      icon: "💧", critical: false, desc: "Constancia de no tener deudas con el servicio de agua." },
  { id: "plano",     label: "Plano de Mensura",            icon: "📐", critical: false, desc: "Plano técnico registrado con medidas exactas del inmueble." },
  { id: "usoConf",   label: "Constancia Uso Conforme",     icon: "✅", critical: false, desc: "Certificado de que el uso del inmueble es conforme a la zonificación." },
  { id: "rit",       label: "Registro Inmobiliario",        icon: "📋", critical: false, desc: "Inscripción en el registro inmobiliario correspondiente." },
];

// ─── SELLERS ─────────────────────────────────────────────────────────────────
const SELLERS = {
  carolina: {
    id: "carolina", name: "Carolina López", cedula: "V-12.450.889",
    phone: "+58 412 345 6789", email: "carolinalopez@propve.com",
    avatar: "CL", rating: 4.9, ops: 27,
    docs: { titulo: true, rif: true, catastro: true, gravamen: true, solvMun: true, solvElec: true, solvAgua: true, plano: true, usoConf: true, rit: true },
  },
  pablo: {
    id: "pablo", name: "Pablo Ramírez", cedula: "V-20.118.334",
    phone: "+58 424 678 9012", email: "pabloramirez@gmail.com",
    avatar: "PR", rating: 4.1, ops: 8,
    docs: { titulo: true, rif: true, catastro: false, gravamen: false, solvMun: true, solvElec: false, solvAgua: false, plano: false, usoConf: false, rit: false },
  },
  marta: {
    id: "marta", name: "Marta Vásquez", cedula: "V-16.780.112",
    phone: "+58 416 901 2345", email: "mvazquez@corp.ve",
    avatar: "MV", rating: 4.7, ops: 15,
    docs: { titulo: true, rif: true, catastro: true, gravamen: true, solvMun: false, solvElec: true, solvAgua: true, plano: false, usoConf: true, rit: true },
  },
};

// ─── PROPERTIES ──────────────────────────────────────────────────────────────
const properties = [
  { id: 1, tipo: "Galpón Industrial", zona: "La Urbina", m2: 2400, precio: 1200000, kva: 500, altura: 9, muelle: true, status: "Activo", views: 342, leads: 12, zonif: "I2", piso: "20 ton/m²", seller: "carolina", yearBuilt: 2008, description: "Galpón de alto estándar con amplia zona de maniobras y oficinas administrativas de 180m²." },
  { id: 2, tipo: "Oficina Corporativa", zona: "Chacao", m2: 380, precio: 280000, kva: 50, altura: 3, muelle: false, status: "Activo", views: 218, leads: 8, zonif: "C3", piso: "5 ton/m²", seller: "pablo", yearBuilt: 2015, description: "Suite ejecutiva en piso 7 con vista panorámica. Incluye 4 puestos de estacionamiento." },
  { id: 3, tipo: "Galpón Logístico", zona: "Guarenas", m2: 5600, precio: 2100000, kva: 800, altura: 12, muelle: true, status: "Destacado", views: 567, leads: 24, zonif: "I3", piso: "25 ton/m²", seller: "carolina", yearBuilt: 2012, description: "Centro logístico de gran capacidad. 6 muelles de carga, patio de 8.000m² y generador incluido." },
  { id: 4, tipo: "Local Comercial", zona: "Las Mercedes", m2: 180, precio: 95000, kva: 30, altura: 4, muelle: false, status: "Activo", views: 89, leads: 3, zonif: "C2", piso: "3 ton/m²", seller: "pablo", yearBuilt: 2003, description: "Local en planta baja de CC premium, con vidrieras dobles y flujo peatonal de alto tránsito." },
  { id: 5, tipo: "Centro de Distribución", zona: "Caucagua", m2: 8200, precio: 3500000, kva: 1200, altura: 14, muelle: true, status: "Activo", views: 411, leads: 19, zonif: "I4", piso: "30 ton/m²", seller: "marta", yearBuilt: 2018, description: "Megaalmacén de última generación. Certificación LEED. Capacidad para 15 contenedores simultáneos." },
  { id: 6, tipo: "Galpón Liviano", zona: "Los Teques", m2: 900, precio: 420000, kva: 200, altura: 7, muelle: false, status: "Pendiente", views: 156, leads: 6, zonif: "I1", piso: "12 ton/m²", seller: "pablo", yearBuilt: 2007, description: "Galpón versátil ideal para manufactura ligera o ensamblaje. Tres accesos independientes." },
];

// ─── CHART DATA ──────────────────────────────────────────────────────────────
const priceM2 = [
  { mes: "Oct", LaUrbina: 18, Guarenas: 12, Caucagua: 8 },
  { mes: "Nov", LaUrbina: 19, Guarenas: 12, Caucagua: 9 },
  { mes: "Dic", LaUrbina: 20, Guarenas: 13, Caucagua: 9 },
  { mes: "Ene", LaUrbina: 21, Guarenas: 14, Caucagua: 10 },
  { mes: "Feb", LaUrbina: 22, Guarenas: 15, Caucagua: 11 },
  { mes: "Mar", LaUrbina: 24, Guarenas: 15, Caucagua: 11 },
];
const demanda = [
  { zona: "La Urbina", Galpones: 58, Oficinas: 24, Locales: 18 },
  { zona: "Guarenas", Galpones: 72, Oficinas: 12, Locales: 9 },
  { zona: "Caucagua", Galpones: 91, Oficinas: 6, Locales: 4 },
  { zona: "Los Teques", Galpones: 34, Oficinas: 28, Locales: 21 },
  { zona: "Maracay", Galpones: 63, Oficinas: 18, Locales: 14 },
];
const capRates = [
  { zona: "Maracay", rate: 10.2 }, { zona: "Caucagua", rate: 9.5 },
  { zona: "Guarenas", rate: 8.8 }, { zona: "La Urbina", rate: 7.2 },
  { zona: "Los Teques", rate: 6.9 }, { zona: "Chacao", rate: 5.4 },
];
const KYCI = [
  { id: 1, name: "Roberto Méndez", cedula: "V-14.220.891", email: "rmendez@gmail.com", fecha: "21 Abr", docs: 3, status: "pending" },
  { id: 2, name: "Carmen Lossada", cedula: "V-11.887.234", email: "clossada@corp.ve", fecha: "22 Abr", docs: 4, status: "pending" },
  { id: 3, name: "Diego Fernández", cedula: "V-18.445.122", email: "dfernandez@propve.com", fecha: "23 Abr", docs: 2, status: "pending" },
  { id: 4, name: "Valentina Rojas", cedula: "V-20.113.009", email: "vrojas@hotmail.com", fecha: "24 Abr", docs: 3, status: "pending" },
];
const payments = [
  { id: "TXN-0441", realtor: "Carlos Blanco", plan: "Industrial Gold", monto: "$299", gw: "Stripe", status: "Completado", fecha: "24 Abr" },
  { id: "TXN-0440", realtor: "María González", plan: "Básico", monto: "Bs. 1.200", gw: "R4", status: "Completado", fecha: "23 Abr" },
  { id: "TXN-0439", realtor: "Pedro Castillo", plan: "Pro", monto: "$149", gw: "Stripe", status: "Completado", fecha: "23 Abr" },
  { id: "TXN-0438", realtor: "Ana Romero", plan: "Industrial Gold", monto: "Bs. 3.600", gw: "R4", status: "Pendiente", fecha: "22 Abr" },
  { id: "TXN-0437", realtor: "Luis Torres", plan: "Pro", monto: "$149", gw: "Stripe", status: "Completado", fecha: "22 Abr" },
];
const plans = [
  { nombre: "Básico", inmuebles: 3, destacados: 0, usd: 49, ves: 600, activos: 124 },
  { nombre: "Pro", inmuebles: 10, destacados: 2, usd: 149, ves: 1800, activos: 87 },
  { nombre: "Industrial Gold", inmuebles: 25, destacados: 5, usd: 299, ves: 3600, activos: 43 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getDocScore(seller) {
  if (!seller) return { total: 0, complete: 0, pct: 0, criticalOk: false };
  const total = LEGAL_DOCS.length;
  const complete = LEGAL_DOCS.filter(d => seller.docs[d.id]).length;
  const criticalOk = LEGAL_DOCS.filter(d => d.critical).every(d => seller.docs[d.id]);
  return { total, complete, pct: Math.round((complete / total) * 100), criticalOk };
}

function scoreColor(pct) {
  if (pct === 100) return T.green;
  if (pct >= 70) return T.orange;
  return T.red;
}

// ─── BASE COMPONENTS ─────────────────────────────────────────────────────────
function Pill({ label, color = T.amber, bg = T.amberGlow }) {
  return <span style={{ background: bg, color, borderRadius: 6, fontSize: 11, fontWeight: 700, padding: "2px 8px", letterSpacing: "0.05em" }}>{label}</span>;
}

function KpiCard({ label, value, sub, color = T.amber }) {
  return (
    <div style={{ ...S.card, textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 11, color: T.muted, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: T.dim, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ─── DOC STATUS MINI BAR (for cards) ─────────────────────────────────────────
function DocMiniBar({ seller }) {
  const score = getDocScore(seller);
  const color = scoreColor(score.pct);
  return (
    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 10, color: T.muted, letterSpacing: "0.05em" }}>DOCUMENTACIÓN LEGAL</span>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{score.complete}/{score.total} docs</span>
      </div>
      {/* Progress bar */}
      <div style={{ height: 4, background: T.surface, borderRadius: 4, marginBottom: 6 }}>
        <div style={{ height: "100%", width: `${score.pct}%`, background: color, borderRadius: 4, transition: "width .4s" }} />
      </div>
      {/* Doc icons row */}
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {LEGAL_DOCS.map(doc => {
          const ok = seller?.docs[doc.id];
          return (
            <div key={doc.id} title={`${doc.label}: ${ok ? "✓ Disponible" : "✗ No disponible"}`}
              style={{ width: 20, height: 20, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10,
                background: ok ? T.greenBg : T.redBg, border: `1px solid ${ok ? T.green + "44" : T.red + "44"}`,
                color: ok ? T.green : T.red, cursor: "default" }}>
              {ok ? "✓" : "✗"}
            </div>
          );
        })}
      </div>
      {!score.criticalOk && (
        <div style={{ marginTop: 6, fontSize: 10, color: T.orange, display: "flex", alignItems: "center", gap: 4 }}>
          <span>⚠</span> Faltan documentos críticos · Ver detalle
        </div>
      )}
    </div>
  );
}

// ─── PROPERTY DETAIL MODAL ───────────────────────────────────────────────────
function PropModal({ prop, onClose }) {
  const seller = SELLERS[prop.seller];
  const score = getDocScore(seller);
  const scoreCol = scoreColor(score.pct);
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000000bb", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 16, width: "100%", maxWidth: 780, maxHeight: "90vh", overflowY: "auto", fontFamily: "system-ui,-apple-system,sans-serif" }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${T.card2} 0%, ${T.surface} 100%)`, padding: "24px 28px", borderBottom: `1px solid ${T.border}`, borderRadius: "16px 16px 0 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, color: T.muted, letterSpacing: "0.08em", marginBottom: 4 }}>{prop.zona} · {prop.zonif} · Est. {prop.yearBuilt}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 6 }}>{prop.tipo}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: T.amber }}>${(prop.precio / 1000).toFixed(0)}K <span style={{ fontSize: 14, fontWeight: 400, color: T.muted }}>USD · ${Math.round(prop.precio / prop.m2)}/m²</span></div>
            </div>
            <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.muted, borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 18 }}>×</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, padding: "0 28px" }}>
          {[["info", "📋 Información"], ["legal", "⚖️ Documentación Legal"], ["seller", "👤 Vendedor"]].map(([id, label]) => (
            <div key={id} onClick={() => setActiveTab(id)}
              style={{ padding: "12px 18px", cursor: "pointer", fontSize: 13, fontWeight: activeTab === id ? 700 : 400,
                color: activeTab === id ? T.amber : T.muted,
                borderBottom: activeTab === id ? `2px solid ${T.amber}` : "2px solid transparent",
                marginBottom: -1, transition: "all .15s" }}>
              {label}
            </div>
          ))}
        </div>

        <div style={{ padding: "24px 28px" }}>

          {/* TAB: INFO */}
          {activeTab === "info" && (
            <div>
              <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, marginTop: 0 }}>{prop.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                {[
                  ["Área Total", prop.m2.toLocaleString() + " m²", "📐"],
                  ["Altura Libre", prop.altura + " metros", "📏"],
                  ["Potencia", prop.kva + " kVA", "⚡"],
                  ["Carga Piso", prop.piso, "🏋️"],
                  ["Zonificación", prop.zonif, "🗺️"],
                  ["Muelle Carga", prop.muelle ? "Sí" : "No", "🚚"],
                  ["Vistas", prop.views.toLocaleString(), "👁️"],
                  ["Leads", prop.leads, "📞"],
                ].map(([k, v, icon]) => (
                  <div key={k} style={{ background: T.surface, borderRadius: 10, padding: "12px 14px", border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: 10, color: T.dim, letterSpacing: "0.05em" }}>{k.toUpperCase()}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: T.amberGlow, border: `1px solid ${T.amber}33`, borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.amber, marginBottom: 4 }}>💡 Información al comprador</div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
                  La compra-venta puede realizarse independientemente del estado de la documentación.
                  Se recomienda solicitar al vendedor los documentos faltantes antes de firmar la Opción de Compra.
                  NodoEstate no es responsable por irregularidades documentales.
                </div>
              </div>
            </div>
          )}

          {/* TAB: LEGAL */}
          {activeTab === "legal" && (
            <div>
              {/* Score header */}
              <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <div style={{ flex: 1, background: T.surface, borderRadius: 12, padding: "16px 20px", border: `1px solid ${T.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: scoreCol }}>{score.pct}%</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Documentación completa</div>
                  <div style={{ height: 6, background: T.card, borderRadius: 4, marginTop: 10 }}>
                    <div style={{ height: "100%", width: `${score.pct}%`, background: scoreCol, borderRadius: 4 }} />
                  </div>
                </div>
                <div style={{ flex: 2, background: T.surface, borderRadius: 12, padding: "16px 20px", border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: score.criticalOk ? T.green : T.red, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    {score.criticalOk ? "✅ Documentos críticos completos" : "🚨 Faltan documentos críticos"}
                  </div>
                  <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7 }}>
                    {score.criticalOk
                      ? "El vendedor tiene todos los documentos esenciales para formalizar la transferencia de propiedad. Se puede proceder con la negociación."
                      : "Existen documentos críticos ausentes que pueden complicar la protocolización ante el Registro Inmobiliario. Solicite al vendedor regularizar antes de firmar."
                    }
                  </div>
                  {score.pct < 100 && (
                    <div style={{ marginTop: 10, fontSize: 11, color: T.orange, background: T.orangeBg, padding: "6px 10px", borderRadius: 6 }}>
                      ⚠ La documentación incompleta no impide la compra. Es decisión del comprador continuar.
                    </div>
                  )}
                </div>
              </div>

              {/* Documents list */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {LEGAL_DOCS.map(doc => {
                  const ok = seller?.docs[doc.id];
                  return (
                    <div key={doc.id} style={{
                      background: ok ? T.greenBg : T.redBg,
                      border: `1px solid ${ok ? T.green + "44" : T.red + "44"}`,
                      borderRadius: 10, padding: "12px 14px",
                      display: "flex", alignItems: "flex-start", gap: 12,
                    }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                        background: ok ? T.green + "22" : T.red + "22", flexShrink: 0 }}>
                        {doc.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: ok ? T.green : T.red }}>
                            {ok ? "✓" : "✗"}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{doc.label}</span>
                          {doc.critical && (
                            <span style={{ fontSize: 9, background: T.amber + "22", color: T.amber, borderRadius: 4, padding: "1px 5px", fontWeight: 700 }}>CRÍTICO</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{doc.desc}</div>
                        {!ok && (
                          <div style={{ marginTop: 6, fontSize: 10, color: T.orange, fontWeight: 600 }}>
                            📋 Solicitar al vendedor
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 16, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.6 }}>
                  📌 <strong style={{ color: T.muted }}>Nota legal:</strong> NodoEstate verifica la existencia de los documentos declarados por el vendedor pero no certifica su autenticidad.
                  Se recomienda contratar un abogado inmobiliario para revisar la documentación antes de protocolizar cualquier operación.
                </div>
              </div>
            </div>
          )}

          {/* TAB: SELLER */}
          {activeTab === "seller" && (
            <div>
              <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.amber + "22", border: `2px solid ${T.amber}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: T.amber, flexShrink: 0 }}>
                  {seller?.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>{seller?.name}</div>
                  <div style={{ fontSize: 13, color: T.muted }}>C.I. {seller?.cedula}</div>
                  <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: T.amber }}>⭐ {seller?.rating}/5.0</span>
                    <span style={{ fontSize: 12, color: T.muted }}>·</span>
                    <span style={{ fontSize: 12, color: T.muted }}>{seller?.ops} operaciones</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div style={{ background: T.surface, borderRadius: 10, padding: "12px 16px", border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 10, color: T.dim, marginBottom: 4 }}>TELÉFONO</div>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>📞 {seller?.phone}</div>
                </div>
                <div style={{ background: T.surface, borderRadius: 10, padding: "12px 16px", border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 10, color: T.dim, marginBottom: 4 }}>CORREO</div>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>✉️ {seller?.email}</div>
                </div>
              </div>
              {/* Seller doc summary */}
              <div style={{ background: T.surface, borderRadius: 10, padding: "16px", border: `1px solid ${T.border}`, marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.muted, marginBottom: 10 }}>DOCUMENTACIÓN DEL VENDEDOR</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: scoreCol }}>{score.pct}%</div>
                    <div style={{ fontSize: 10, color: T.dim }}>Completitud</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: T.green }}>{score.complete}</div>
                    <div style={{ fontSize: 10, color: T.dim }}>Disponibles</div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: T.red }}>{score.total - score.complete}</div>
                    <div style={{ fontSize: 10, color: T.dim }}>Faltantes</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {LEGAL_DOCS.map(doc => {
                    const ok = seller?.docs[doc.id];
                    return (
                      <div key={doc.id} title={doc.label}
                        style={{ background: ok ? T.greenBg : T.redBg, border: `1px solid ${ok ? T.green + "44" : T.red + "44"}`,
                          borderRadius: 6, padding: "4px 8px", fontSize: 10, color: ok ? T.green : T.red, fontWeight: 600 }}>
                        {ok ? "✓" : "✗"} {doc.icon}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{ ...S.btn(true), flex: 1 }}>📞 Contactar vendedor</button>
                <button style={{ ...S.btn(false), flex: 1 }}>💬 Enviar mensaje</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PROPERTY CARD ────────────────────────────────────────────────────────────
function PropCard({ p, onClick }) {
  const seller = SELLERS[p.seller];
  const score = getDocScore(seller);
  const statusColor = p.status === "Destacado" ? T.amber : p.status === "Activo" ? T.green : T.muted;
  const tipoEmoji = p.tipo.includes("Galpón") || p.tipo.includes("Centro") ? "🏭" : p.tipo.includes("Oficina") ? "🏢" : "🏪";

  return (
    <div onClick={onClick} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all .2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.amber + "66"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${T.amber}12`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>

      {/* Image area */}
      <div style={{ background: `linear-gradient(135deg, ${T.card2} 0%, ${T.surface} 100%)`, height: 110, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontSize: 44 }}>{tipoEmoji}</span>
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <Pill label={p.status} color={statusColor} bg={statusColor + "22"} />
        </div>
        {p.muelle && <div style={{ position: "absolute", bottom: 8, left: 10, background: T.blue + "22", color: T.blue, borderRadius: 4, fontSize: 10, fontWeight: 700, padding: "2px 6px" }}>🚚 MUELLE</div>}
        {/* Doc score badge */}
        <div style={{ position: "absolute", top: 10, left: 10, background: scoreColor(score.pct) + "22", border: `1px solid ${scoreColor(score.pct)}44`, borderRadius: 6, padding: "2px 7px", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: scoreColor(score.pct) }}>DOCS {score.pct}%</span>
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: "0.05em", marginBottom: 4 }}>{p.zona} · {p.zonif}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 10 }}>{p.tipo}</div>

        {/* Tech specs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
          {[["Área", p.m2.toLocaleString() + " m²"], ["Altura", p.altura + " m"], ["kVA", p.kva], ["Piso", p.piso]].map(([k, v]) => (
            <div key={k} style={{ background: T.surface, borderRadius: 6, padding: "5px 8px" }}>
              <div style={{ fontSize: 10, color: T.dim }}>{k}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: T.muted }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Price + seller */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: T.amber }}>${(p.precio / 1000).toFixed(0)}K</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: T.amber + "22", border: `1px solid ${T.amber}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: T.amber }}>{seller?.avatar}</div>
            <span style={{ fontSize: 11, color: T.muted }}>{seller?.name.split(" ")[0]}</span>
          </div>
        </div>

        {/* Legal doc mini bar */}
        <DocMiniBar seller={seller} />
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onSelect }) {
  const roles = [
    { key: "user", icon: "⌖", title: "Explorador", desc: "Busca propiedades comerciales e industriales. Filtros avanzados, mapa geoespacial, estado legal de cada inmueble y métricas de mercado.", color: T.blue },
    { key: "realtor", icon: "◈", title: "Realtor", desc: "Gestiona tu portafolio, analiza el rendimiento de tus publicaciones y administra tu wallet de créditos.", color: T.amber },
    { key: "admin", icon: "◉", title: "Administrador", desc: "KYC de corredores, auditoría de pagos Stripe/R4 y gestión de planes de suscripción.", color: T.purple },
  ];
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, background: T.amber, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#080D1A", fontWeight: 900 }}>N</div>
          <span style={{ fontSize: 24, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>Nodo<span style={{ color: T.amber }}>Estate</span></span>
        </div>
        <p style={{ color: T.muted, fontSize: 14, margin: 0 }}>Marketplace Inmobiliario Comercial & Industrial · Demo Interactivo</p>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 820 }}>
        {roles.map(r => (
          <div key={r.key} onClick={() => onSelect(r.key)} style={{ width: 240, background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "28px 24px", cursor: "pointer", transition: "all .2s", textAlign: "center" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = r.color; e.currentTarget.style.background = T.card2; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.card; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ fontSize: 32, marginBottom: 12, color: r.color }}>{r.icon}</div>
            <div style={{ fontSize: 14, color: T.dim, marginBottom: 4 }}>Entrar como</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: r.color, marginBottom: 12 }}>{r.title}</div>
            <p style={{ color: T.muted, fontSize: 12, lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
          </div>
        ))}
      </div>
      <p style={{ color: T.dim, fontSize: 12, marginTop: 36 }}>Stack: React · GCP · Node.js/NestJS · BigQuery · Firestore</p>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ role, section, setSection, setRole }) {
  const roleColor = role === "user" ? T.blue : role === "realtor" ? T.amber : T.purple;
  const roleLabel = role === "user" ? "Explorador" : role === "realtor" ? "Realtor" : "Admin";
  const navUser = [{ id: "search", icon: "⊞", label: "Buscar Propiedades" }, { id: "bi", icon: "◫", label: "Mercado & BI" }];
  const navRealtor = [{ id: "dashboard", icon: "◧", label: "Dashboard" }, { id: "wallet", icon: "◈", label: "Wallet & Créditos" }, { id: "listings", icon: "⊟", label: "Mis Publicaciones" }, { id: "bi", icon: "◫", label: "Mercado & BI" }];
  const navAdmin = [{ id: "kyc", icon: "◉", label: "KYC Corredores" }, { id: "payments", icon: "◆", label: "Auditoría de Pagos" }, { id: "plans", icon: "◪", label: "Gestión de Planes" }, { id: "bi", icon: "◫", label: "Mercado & BI" }];
  const nav = role === "user" ? navUser : role === "realtor" ? navRealtor : navAdmin;
  const defaultSection = role === "user" ? "search" : role === "realtor" ? "dashboard" : "kyc";
  const active = section || defaultSection;

  return (
    <aside style={{ width: 225, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0, fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <div style={{ padding: "0 20px 20px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, background: T.amber, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#080D1A", fontWeight: 900 }}>N</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Nodo<span style={{ color: T.amber }}>Estate</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: roleColor + "22", border: `1px solid ${roleColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: roleColor, fontWeight: 700 }}>{roleLabel[0]}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>Demo User</div>
            <div style={{ fontSize: 10, color: roleColor, fontWeight: 700, letterSpacing: "0.05em" }}>{roleLabel.toUpperCase()}</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "14px 10px" }}>
        {nav.map(n => (
          <div key={n.id} onClick={() => setSection(n.id)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 2,
              background: active === n.id ? roleColor + "18" : "transparent",
              color: active === n.id ? roleColor : T.muted, fontSize: 13, fontWeight: active === n.id ? 600 : 400,
              transition: "all .15s", borderLeft: active === n.id ? `2px solid ${roleColor}` : "2px solid transparent" }}>
            <span style={{ fontSize: 14 }}>{n.icon}</span> {n.label}
          </div>
        ))}
      </nav>
      <div style={{ padding: "14px 10px", borderTop: `1px solid ${T.border}` }}>
        <div onClick={() => { setRole(null); setSection(null); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, cursor: "pointer", color: T.dim, fontSize: 12 }}
          onMouseEnter={e => e.currentTarget.style.color = T.red}
          onMouseLeave={e => e.currentTarget.style.color = T.dim}>
          ← Cambiar rol
        </div>
      </div>
    </aside>
  );
}

// ─── USER VIEW ────────────────────────────────────────────────────────────────
function UserView({ section }) {
  const [tipo, setTipo] = useState("Todos");
  const [zona, setZona] = useState("Todas");
  const [minKva, setMinKva] = useState(0);
  const [muelle, setMuelle] = useState(false);
  const [docsFilter, setDocsFilter] = useState("Todos");
  const [mapView, setMapView] = useState(false);
  const [selectedProp, setSelectedProp] = useState(null);

  const tipos = ["Todos", "Galpón Industrial", "Galpón Logístico", "Centro de Distribución", "Oficina Corporativa", "Local Comercial"];
  const zonas = ["Todas", "La Urbina", "Guarenas", "Caucagua", "Chacao", "Las Mercedes", "Los Teques"];

  const filtered = properties.filter(p => {
    const seller = SELLERS[p.seller];
    const score = getDocScore(seller);
    if (tipo !== "Todos" && p.tipo !== tipo) return false;
    if (zona !== "Todas" && p.zona !== zona) return false;
    if (p.kva < minKva) return false;
    if (muelle && !p.muelle) return false;
    if (docsFilter === "Completos" && score.pct < 100) return false;
    if (docsFilter === "Criticos OK" && !score.criticalOk) return false;
    if (docsFilter === "Incompletos" && score.pct === 100) return false;
    return true;
  });

  return (
    <div style={{ padding: 28, fontFamily: "system-ui,-apple-system,sans-serif", color: T.text }}>
      {selectedProp && <PropModal prop={selectedProp} onClose={() => setSelectedProp(null)} />}

      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>Buscar Propiedades</h2>
        <p style={{ margin: "4px 0 0", color: T.muted, fontSize: 13 }}>Activos comerciales e industriales · Con estado documental en tiempo real</p>
      </div>

      {/* Filters */}
      <div style={{ ...S.card, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 140px" }}>
            <div style={{ fontSize: 10, color: T.dim, marginBottom: 5, letterSpacing: "0.06em" }}>TIPO</div>
            <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, padding: "7px 10px", fontSize: 12 }}>
              {tipos.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ flex: "1 1 120px" }}>
            <div style={{ fontSize: 10, color: T.dim, marginBottom: 5, letterSpacing: "0.06em" }}>ZONA</div>
            <select value={zona} onChange={e => setZona(e.target.value)} style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, padding: "7px 10px", fontSize: 12 }}>
              {zonas.map(z => <option key={z}>{z}</option>)}
            </select>
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <div style={{ fontSize: 10, color: T.dim, marginBottom: 5, letterSpacing: "0.06em" }}>DOCS LEGALES</div>
            <select value={docsFilter} onChange={e => setDocsFilter(e.target.value)} style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, color: T.text, padding: "7px 10px", fontSize: 12 }}>
              {["Todos", "Completos", "Criticos OK", "Incompletos"].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <div style={{ fontSize: 10, color: T.dim, marginBottom: 5, letterSpacing: "0.06em" }}>POTENCIA MÍNIMA: <strong style={{ color: T.amber }}>{minKva} kVA</strong></div>
            <input type="range" min={0} max={1200} step={50} value={minKva} onChange={e => setMinKva(+e.target.value)} style={{ width: "100%" }} />
          </div>
          <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${muelle ? T.blue : T.border}`, background: muelle ? T.blue + "33" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              onClick={() => setMuelle(!muelle)}>
              {muelle && <span style={{ color: T.blue, fontSize: 12 }}>✓</span>}
            </div>
            <span style={{ fontSize: 12, color: T.muted }}>Muelle</span>
          </div>
          <div onClick={() => setMapView(!mapView)} style={{ ...S.btn(false), cursor: "pointer", padding: "8px 14px", fontSize: 12 }}>
            {mapView ? "⊞ Cuadrícula" : "⊙ Mapa"}
          </div>
        </div>
      </div>

      {/* Results count + legend */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: T.muted }}>{filtered.length} propiedades encontradas</span>
        <div style={{ display: "flex", gap: 12 }}>
          {[["Docs completos", T.green], ["Docs parciales", T.orange], ["Docs incompletos", T.red]].map(([l, c]) => (
            <span key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.muted }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "inline-block" }} />{l}
            </span>
          ))}
        </div>
      </div>

      {mapView ? (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, height: 400, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "relative", width: 600, height: 320 }}>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${T.surface} 0%, ${T.card2} 100%)`, borderRadius: 10, border: `1px solid ${T.borderLight}` }}>
              {[
                { top: "25%", left: "45%", label: "La Urbina" }, { top: "35%", left: "72%", label: "Guarenas" },
                { top: "55%", left: "80%", label: "Caucagua" }, { top: "30%", left: "40%", label: "Chacao" },
                { top: "45%", left: "35%", label: "Las Mercedes" }, { top: "60%", left: "30%", label: "Los Teques" },
              ].filter(pin => filtered.some(p => p.zona === pin.label)).map(pin => {
                const zoneProp = filtered.find(p => p.zona === pin.label);
                const seller = zoneProp ? SELLERS[zoneProp.seller] : null;
                const score = getDocScore(seller);
                const col = scoreColor(score.pct);
                return (
                  <div key={pin.label} style={{ position: "absolute", top: pin.top, left: pin.left, transform: "translate(-50%,-50%)", textAlign: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50% 50% 50% 0", background: col, transform: "rotate(-45deg)", border: `2px solid ${T.bg}`, cursor: "pointer" }} />
                    <div style={{ marginTop: 6, fontSize: 10, color: T.text, fontWeight: 600, background: T.card + "dd", padding: "2px 6px", borderRadius: 4 }}>{pin.label}</div>
                  </div>
                );
              })}
              <div style={{ position: "absolute", bottom: 12, right: 12, fontSize: 11, color: T.muted }}>Google Maps SDK · Color = estado documental</div>
            </div>
          </div>
          <p style={{ color: T.dim, fontSize: 12, margin: 0 }}>{filtered.length} propiedades · Los pines reflejan el estado documental del vendedor</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 16 }}>
            {filtered.map(p => <PropCard key={p.id} p={p} onClick={() => setSelectedProp(p)} />)}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", color: T.dim, padding: "60px 0", fontSize: 14 }}>
                No hay propiedades con esos filtros.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── REALTOR VIEW ─────────────────────────────────────────────────────────────
function RealtorView({ section, setSection }) {
  const view = section || "dashboard";
  const [credits] = useState(12);
  const [selectedProp, setSelectedProp] = useState(null);
  const myProps = properties.slice(0, 4);

  if (view === "wallet") return (
    <div style={{ padding: 28, fontFamily: "system-ui,-apple-system,sans-serif", color: T.text }}>
      <h2 style={{ margin: "0 0 20px", fontSize: 22, fontWeight: 800 }}>Wallet de Publicaciones</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div style={{ ...S.card, flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 8 }}>Créditos disponibles</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: T.amber }}>{credits}</div>
          <div style={{ fontSize: 12, color: T.dim }}>Publicaciones restantes</div>
        </div>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 12 }}>
          {plans.map(pl => (
            <div key={pl.nombre} style={{ ...S.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{pl.nombre}</div>
                <div style={{ fontSize: 12, color: T.muted }}>{pl.inmuebles} inmuebles · {pl.destacados} destacados</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: T.amber }}>${pl.usd}<span style={{ fontSize: 12 }}>/mes</span></div>
                <button style={{ ...S.btn(true), marginTop: 6, fontSize: 12, padding: "5px 14px" }}>Suscribirse</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...S.card }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.muted, marginBottom: 12 }}>Pago · Stripe (USD) o Banco R4 (VES)</div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, padding: "12px 16px", cursor: "pointer" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.blue, marginBottom: 4 }}>STRIPE</div>
            <div style={{ fontSize: 11, color: T.muted }}>Tarjeta internacional · USD</div>
          </div>
          <div style={{ flex: 1, background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`, padding: "12px 16px", cursor: "pointer" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.amber, marginBottom: 4 }}>BANCO R4</div>
            <div style={{ fontSize: 11, color: T.muted }}>Transferencia local · VES</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (view === "listings") return (
    <div style={{ padding: 28, fontFamily: "system-ui,-apple-system,sans-serif", color: T.text }}>
      {selectedProp && <PropModal prop={selectedProp} onClose={() => setSelectedProp(null)} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Mis Publicaciones</h2>
        <button style={{ ...S.btn(true) }}>+ Nueva publicación</button>
      </div>
      {/* Doc alert banner */}
      <div style={{ background: T.orangeBg, border: `1px solid ${T.orange}44`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.orange }}>Documentación incompleta detectada</div>
          <div style={{ fontSize: 11, color: T.muted }}>2 de tus inmuebles tienen documentos faltantes. Completar la documentación aumenta la confianza del comprador y acelera la venta.</div>
        </div>
      </div>
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {["Propiedad", "Zona", "Área", "Precio", "Vistas", "Leads", "CTR", "Docs Legales", "Status"].map(h => (
                <th key={h} style={{ padding: "11px 14px", textAlign: "left", color: T.dim, fontWeight: 600, fontSize: 10, letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myProps.map(p => {
              const seller = SELLERS[p.seller];
              const score = getDocScore(seller);
              const ctr = ((p.leads / p.views) * 100).toFixed(1);
              const statusColor = p.status === "Destacado" ? T.amber : p.status === "Activo" ? T.green : T.muted;
              return (
                <tr key={p.id} style={{ borderBottom: `1px solid ${T.border}28`, cursor: "pointer" }}
                  onClick={() => setSelectedProp(p)}
                  onMouseEnter={e => e.currentTarget.style.background = T.surface}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "11px 14px", color: T.text, fontWeight: 600 }}>{p.tipo}</td>
                  <td style={{ padding: "11px 14px", color: T.muted }}>{p.zona}</td>
                  <td style={{ padding: "11px 14px", color: T.muted }}>{p.m2.toLocaleString()} m²</td>
                  <td style={{ padding: "11px 14px", color: T.amber, fontWeight: 700 }}>${(p.precio / 1000).toFixed(0)}K</td>
                  <td style={{ padding: "11px 14px", color: T.muted }}>{p.views.toLocaleString()}</td>
                  <td style={{ padding: "11px 14px", color: T.muted }}>{p.leads}</td>
                  <td style={{ padding: "11px 14px" }}><span style={{ color: +ctr > 2 ? T.green : T.muted, fontWeight: 600 }}>{ctr}%</span></td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", align: "center", gap: 4 }}>
                      <div style={{ height: 4, width: 48, background: T.surface, borderRadius: 4 }}>
                        <div style={{ height: "100%", width: `${score.pct}%`, background: scoreColor(score.pct), borderRadius: 4 }} />
                      </div>
                      <span style={{ fontSize: 10, color: scoreColor(score.pct), fontWeight: 700 }}>{score.pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "11px 14px" }}><Pill label={p.status} color={statusColor} bg={statusColor + "22"} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 28, fontFamily: "system-ui,-apple-system,sans-serif", color: T.text }}>
      <div style={{ background: `linear-gradient(135deg, ${T.amberDim}44 0%, ${T.card2} 100%)`, border: `1px solid ${T.amber}33`, borderRadius: 14, padding: "20px 24px", marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: T.amber, fontWeight: 700, marginBottom: 4 }}>PANEL REALTOR</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.text }}>Bienvenido, Carlos Blanco</div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>Plan Industrial Gold · 12 créditos disponibles · Últ. sync: hace 3 min</div>
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        <KpiCard label="Vistas Totales" value="12,847" sub="↑ 18% vs mes anterior" />
        <KpiCard label="Leads Generados" value="342" sub="↑ 31% vs mes anterior" color={T.green} />
        <KpiCard label="CTR Promedio" value="2.66%" sub="Benchmark: 1.8%" color={T.blue} />
        <KpiCard label="Inmuebles Activos" value="8 / 25" sub="Créditos: 12 restantes" color={T.purple} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ ...S.card }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.muted, marginBottom: 16 }}>Rendimiento semanal</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={[
              { d: "Lu", vistas: 1240, leads: 38 }, { d: "Ma", vistas: 1890, leads: 52 },
              { d: "Mi", vistas: 1540, leads: 44 }, { d: "Ju", vistas: 2100, leads: 61 },
              { d: "Vi", vistas: 2340, leads: 70 }, { d: "Sa", vistas: 980, leads: 29 }, { d: "Do", vistas: 720, leads: 18 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="d" tick={{ fill: T.dim, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.dim, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="vistas" stroke={T.amber} fill={T.amber + "22"} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ ...S.card }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.muted, marginBottom: 14 }}>Mis top propiedades</div>
          {properties.slice(0, 4).map(p => {
            const seller = SELLERS[p.seller];
            const score = getDocScore(seller);
            const ctr = ((p.leads / p.views) * 100).toFixed(1);
            return (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}28` }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{p.tipo}</div>
                  <div style={{ fontSize: 11, color: T.dim }}>{p.zona}</div>
                </div>
                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                  <div style={{ fontSize: 11, color: T.muted }}>{p.views.toLocaleString()} vistas</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10, color: +ctr > 2 ? T.green : T.muted }}>{ctr}% CTR</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: scoreColor(score.pct), background: scoreColor(score.pct) + "22", padding: "1px 5px", borderRadius: 4 }}>DOCS {score.pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN VIEW ───────────────────────────────────────────────────────────────
function AdminView({ section, setSection }) {
  const view = section || "kyc";
  const [kyc, setKyc] = useState(KYCI);

  if (view === "payments") return (
    <div style={{ padding: 28, fontFamily: "system-ui,-apple-system,sans-serif", color: T.text }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800 }}>Auditoría de Pagos</h2>
      <p style={{ color: T.muted, fontSize: 13, margin: "0 0 20px" }}>Transacciones consolidadas · Stripe USD + Banco R4 VES</p>
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <KpiCard label="Ingresos (USD)" value="$2,840" sub="Este mes · Stripe" color={T.blue} />
        <KpiCard label="Ingresos (VES)" value="Bs. 21.6k" sub="Este mes · R4" color={T.amber} />
        <KpiCard label="Transacciones" value="47" sub="3 pendientes" color={T.green} />
      </div>
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {["ID", "Realtor", "Plan", "Monto", "Pasarela", "Fecha", "Estado"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: T.dim, fontWeight: 600, fontSize: 11, letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${T.border}28` }}
                onMouseEnter={e => e.currentTarget.style.background = T.surface}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "12px 16px", color: T.dim, fontFamily: "monospace", fontSize: 11 }}>{p.id}</td>
                <td style={{ padding: "12px 16px", color: T.text, fontWeight: 600 }}>{p.realtor}</td>
                <td style={{ padding: "12px 16px", color: T.muted }}>{p.plan}</td>
                <td style={{ padding: "12px 16px", color: T.amber, fontWeight: 700 }}>{p.monto}</td>
                <td style={{ padding: "12px 16px" }}><Pill label={p.gw} color={p.gw === "Stripe" ? T.blue : T.amber} bg={p.gw === "Stripe" ? T.blue + "22" : T.amber + "22"} /></td>
                <td style={{ padding: "12px 16px", color: T.dim }}>{p.fecha}</td>
                <td style={{ padding: "12px 16px" }}><Pill label={p.status} color={p.status === "Completado" ? T.green : T.muted} bg={p.status === "Completado" ? T.green + "22" : T.muted + "22"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (view === "plans") return (
    <div style={{ padding: 28, fontFamily: "system-ui,-apple-system,sans-serif", color: T.text }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Gestión de Planes</h2>
        <button style={{ ...S.btn(true) }}>+ Nuevo plan</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {plans.map((pl, i) => (
          <div key={pl.nombre} style={{ ...S.card, border: i === 2 ? `1px solid ${T.amber}66` : `1px solid ${T.border}` }}>
            {i === 2 && <Pill label="PREMIUM" color={T.amber} bg={T.amberGlow} />}
            <div style={{ fontSize: 18, fontWeight: 800, color: T.text, margin: "12px 0 4px" }}>{pl.nombre}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: T.amber }}>${pl.usd}<span style={{ fontSize: 14, fontWeight: 400, color: T.muted }}>/mes</span></div>
            <div style={{ fontSize: 12, color: T.dim, marginBottom: 16 }}>Bs. {pl.ves.toLocaleString()}/mes</div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {[`${pl.inmuebles} inmuebles publicados`, `${pl.destacados} inmuebles destacados`, "Dashboard de analytics", pl.inmuebles >= 10 ? "Soporte prioritario" : "Soporte estándar"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: T.muted }}>
                  <span style={{ color: T.green, fontSize: 10 }}>✓</span> {f}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button style={{ ...S.btn(false), flex: 1, fontSize: 12 }}>Editar</button>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: T.dim, textAlign: "center" }}>{pl.activos} realtors activos</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: 28, fontFamily: "system-ui,-apple-system,sans-serif", color: T.text }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800 }}>KYC · Verificación de Corredores</h2>
      <p style={{ color: T.muted, fontSize: 13, margin: "0 0 20px" }}>Validación de identidad y credenciales de corredores inmobiliarios</p>
      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        <KpiCard label="Pendientes" value={kyc.filter(k => k.status === "pending").length} sub="Requieren revisión" color={T.amber} />
        <KpiCard label="Aprobados" value={kyc.filter(k => k.status === "approved").length} sub="Este mes" color={T.green} />
        <KpiCard label="Rechazados" value={kyc.filter(k => k.status === "rejected").length} sub="Este mes" color={T.red} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {kyc.map(k => (
          <div key={k.id} style={{ ...S.card, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: T.muted, flexShrink: 0 }}>
              {k.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{k.name}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{k.cedula} · {k.email}</div>
            </div>
            <div style={{ fontSize: 12, color: T.dim }}>{k.docs} docs · {k.fecha}</div>
            {k.status === "pending" ? (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setKyc(prev => prev.map(x => x.id === k.id ? { ...x, status: "approved" } : x))}
                  style={{ ...S.btn(false), fontSize: 12, color: T.green, borderColor: T.green + "44" }}>✓ Aprobar</button>
                <button onClick={() => setKyc(prev => prev.map(x => x.id === k.id ? { ...x, status: "rejected" } : x))}
                  style={{ ...S.btn(false), fontSize: 12, color: T.red, borderColor: T.red + "44" }}>✗ Rechazar</button>
              </div>
            ) : (
              <Pill label={k.status === "approved" ? "Aprobado" : "Rechazado"} color={k.status === "approved" ? T.green : T.red} bg={k.status === "approved" ? T.green + "22" : T.red + "22"} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BI VIEW ──────────────────────────────────────────────────────────────────
function BIView() {
  return (
    <div style={{ padding: 28, fontFamily: "system-ui,-apple-system,sans-serif", color: T.text }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800 }}>Inteligencia de Mercado</h2>
      <p style={{ color: T.muted, fontSize: 13, margin: "0 0 20px" }}>Indicadores en tiempo real · Procesados por BigQuery</p>
      <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
        <KpiCard label="Cap Rate Promedio" value="8.1%" sub="Mercado industrial VEN" color={T.amber} />
        <KpiCard label="Absorción Galpones" value="↑ 12%" sub="vs trimestre anterior" color={T.green} />
        <KpiCard label="$/m² · La Urbina" value="$24" sub="Máximo histórico" color={T.blue} />
        <KpiCard label="Propiedades activas" value="1,284" sub="Plataforma total" color={T.purple} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ ...S.card }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.muted, marginBottom: 4 }}>Precio/m² por zona · últimos 6 meses</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            {[["La Urbina", T.amber], ["Guarenas", T.blue], ["Caucagua", T.green]].map(([z, c]) => (
              <span key={z} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: T.muted }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} />{z}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={priceM2}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="mes" tick={{ fill: T.dim, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.dim, fontSize: 11 }} axisLine={false} tickLine={false} unit="$" />
              <Tooltip contentStyle={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: T.muted }} formatter={(v) => [`$${v}/m²`]} />
              <Area type="monotone" dataKey="LaUrbina" stroke={T.amber} fill={T.amber + "18"} strokeWidth={2} name="La Urbina" />
              <Area type="monotone" dataKey="Guarenas" stroke={T.blue} fill={T.blue + "18"} strokeWidth={2} name="Guarenas" />
              <Area type="monotone" dataKey="Caucagua" stroke={T.green} fill={T.green + "18"} strokeWidth={2} name="Caucagua" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ ...S.card }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.muted, marginBottom: 4 }}>Cap Rate por zona (%)</div>
          <div style={{ fontSize: 11, color: T.dim, marginBottom: 14 }}>Rendimiento anualizado · mercado industrial</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={capRates} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis type="number" tick={{ fill: T.dim, fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <YAxis dataKey="zona" type="category" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} width={75} />
              <Tooltip contentStyle={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: T.muted }} formatter={(v) => [`${v}%`, "Cap Rate"]} />
              <Bar dataKey="rate" fill={T.amber} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ ...S.card }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.muted, marginBottom: 4 }}>Demanda por tipo de activo</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          {[["Galpones", T.amber], ["Oficinas", T.blue], ["Locales", T.purple]].map(([l, c]) => (
            <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: T.muted }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} />{l}
            </span>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={demanda}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="zona" tick={{ fill: T.dim, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: T.dim, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: T.card2, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: T.muted }} />
            <Bar dataKey="Galpones" fill={T.amber} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Oficinas" fill={T.blue} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Locales" fill={T.purple} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState(null);
  const [section, setSection] = useState(null);

  if (!role) return <LoginScreen onSelect={(r) => { setRole(r); setSection(null); }} />;

  const MainContent = () => {
    if (section === "bi") return <BIView />;
    if (role === "user") return <UserView section={section} />;
    if (role === "realtor") return <RealtorView section={section} setSection={setSection} />;
    return <AdminView section={section} setSection={setSection} />;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <Sidebar role={role} section={section} setSection={setSection} setRole={setRole} />
      <main style={{ flex: 1, overflowY: "auto", maxHeight: "100vh" }}>
        <MainContent />
      </main>
    </div>
  );
}
