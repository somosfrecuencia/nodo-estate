import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ── DATA ──────────────────────────────────────────────────────────────────────
const DOCS_LIST = [
  { id: "titulo",      label: "Título de Propiedad",     critical: true  },
  { id: "rif",         label: "RIF del Vendedor",         critical: true  },
  { id: "catastro",    label: "Ficha Catastral",          critical: true  },
  { id: "gravamenes",  label: "Cert. de Gravámenes",      critical: true  },
  { id: "solvencia",   label: "Solvencia Municipal",      critical: false },
  { id: "corpoelec",   label: "Solvencia CORPOELEC",      critical: false },
  { id: "hidrocapital",label: "Solvencia Hidrocapital",   critical: false },
  { id: "plano",       label: "Plano de Mensura",         critical: false },
  { id: "uso",         label: "Constancia Uso Conforme",  critical: false },
  { id: "registro",    label: "Registro Inmobiliario",    critical: true  },
];

const SELLERS = {
  carolina: {
    name: "Carolina López", initials: "CL", color: "#22c55e",
    rating: 4.9, verified: true,
    docs: ["titulo","rif","catastro","gravamenes","solvencia","corpoelec","hidrocapital","plano","uso","registro"],
  },
  pablo: {
    name: "Pablo Ramírez", initials: "PR", color: "#ef4444",
    rating: 3.2, verified: false,
    docs: ["titulo","rif","catastro","solvencia"],
  },
  marta: {
    name: "Marta Vásquez", initials: "MV", color: "#f59e0b",
    rating: 4.1, verified: true,
    docs: ["titulo","rif","catastro","gravamenes","solvencia","corpoelec","hidrocapital","registro"],
  },
};

const PROPERTIES = [
  { id:1, title:"Galpón Industrial",    type:"galpon",   zone:"La Urbina",  class:"I2", area:2400, height:9,  kva:500, floor:"20 ton/m²", price:1200, seller:"carolina", status:"Activo",    featured:false, muelle:true  },
  { id:2, title:"Oficina Corporativa",  type:"oficina",  zone:"Chacao",     class:"C3", area:380,  height:3,  kva:50,  floor:"5 ton/m²",  price:280,  seller:"pablo",    status:"Activo",    featured:false, muelle:false },
  { id:3, title:"Galpón Logístico",     type:"galpon",   zone:"Guarenas",   class:"I3", area:5600, height:12, kva:800, floor:"25 ton/m²", price:2100, seller:"carolina", status:"Destacado", featured:true,  muelle:true  },
  { id:4, title:"Local Comercial",      type:"local",    zone:"Baruta",     class:"C1", area:210,  height:4,  kva:30,  floor:"3 ton/m²",  price:185,  seller:"marta",    status:"Activo",    featured:false, muelle:false },
  { id:5, title:"Planta Industrial",    type:"planta",   zone:"Zona Ind.",  class:"I1", area:8200, height:14, kva:1200,floor:"40 ton/m²", price:3800, seller:"marta",    status:"Activo",    featured:false, muelle:true  },
  { id:6, title:"Depósito Climatizado", type:"deposito", zone:"La Yaguara", class:"I2", area:1800, height:8,  kva:300, floor:"15 ton/m²", price:950,  seller:"pablo",    status:"Activo",    featured:false, muelle:true  },
];

const MARKET_DATA = [
  { mes:"Ene", precio:850, demanda:65 }, { mes:"Feb", precio:920, demanda:72 },
  { mes:"Mar", precio:880, demanda:68 }, { mes:"Abr", precio:1050, demanda:81 },
  { mes:"May", precio:980, demanda:75 }, { mes:"Jun", precio:1120, demanda:88 },
];

const EMOJI = { galpon:"🏭", oficina:"🏢", local:"🏪", planta:"⚙️", deposito:"📦" };

// ── HELPERS ───────────────────────────────────────────────────────────────────
function docsScore(seller) {
  const s = SELLERS[seller];
  return { count: s.docs.length, total: DOCS_LIST.length, pct: Math.round(s.docs.length / DOCS_LIST.length * 100) };
}
function hasCriticalMissing(seller) {
  const s = SELLERS[seller];
  return DOCS_LIST.filter(d => d.critical && !s.docs.includes(d.id)).length > 0;
}
function scoreColor(pct) {
  if (pct === 100) return "#22c55e";
  if (pct >= 70)  return "#f59e0b";
  return "#ef4444";
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const S = {
  app: { minHeight:"100vh", background:"#0a0f1a", color:"#e2e8f0", fontFamily:"'Inter',sans-serif", overflowX:"hidden" },

  // Mobile nav bar (bottom)
  mobileNav: { position:"fixed", bottom:0, left:0, right:0, background:"#111827", borderTop:"1px solid #1e2d45", display:"flex", zIndex:100, paddingBottom:"env(safe-area-inset-bottom)" },
  mobileNavBtn: (active) => ({ flex:1, padding:"10px 4px 8px", display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:"none", border:"none", color: active ? "#38bdf8" : "#64748b", fontSize:10, cursor:"pointer" }),

  // Desktop sidebar
  sidebar: { width:240, background:"#111827", borderRight:"1px solid #1e2d45", display:"flex", flexDirection:"column", minHeight:"100vh", flexShrink:0 },
  sidebarLogo: { padding:"20px 16px 16px", borderBottom:"1px solid #1e2d45" },
  logoMark: { width:36, height:36, background:"linear-gradient(135deg,#38bdf8,#0ea5e9)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, color:"#fff" },

  // Layout
  desktopLayout: { display:"flex" },
  main: { flex:1, padding:"20px 16px 80px", maxWidth:"100%" },
  mainDesktop: { flex:1, padding:"28px 28px 28px", overflowY:"auto" },

  // Cards
  card: { background:"#111827", border:"1px solid #1e2d45", borderRadius:12, padding:16, marginBottom:12 },
  cardHighlight: { background:"#111827", border:"1px solid #38bdf8", borderRadius:12, padding:16, marginBottom:12 },

  // Property card
  propCard: (featured) => ({
    background: featured ? "linear-gradient(135deg,#0d1f35,#111827)" : "#111827",
    border: `1px solid ${featured ? "#38bdf8" : "#1e2d45"}`,
    borderRadius:14, padding:16, cursor:"pointer",
    transition:"transform .15s,box-shadow .15s",
    marginBottom:12,
  }),

  // Badges
  badge: (color, bg) => ({ display:"inline-flex", alignItems:"center", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, color, background:bg, border:`1px solid ${color}40` }),

  // Doc icons row
  docIcon: (ok) => ({ width:22, height:22, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, background: ok ? "#14532d" : "#3f1515", color: ok ? "#22c55e" : "#ef4444", border:`1px solid ${ok ? "#22c55e" : "#ef4444"}40` }),

  // Seller avatar
  avatar: (color) => ({ width:32, height:32, borderRadius:"50%", background:color+"22", border:`2px solid ${color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color, flexShrink:0 }),

  // Buttons
  btnPrimary: { background:"linear-gradient(135deg,#0ea5e9,#38bdf8)", border:"none", borderRadius:8, padding:"10px 20px", color:"#fff", fontWeight:600, fontSize:13, cursor:"pointer" },
  btnSecondary: { background:"transparent", border:"1px solid #1e2d45", borderRadius:8, padding:"8px 14px", color:"#94a3b8", fontSize:12, cursor:"pointer" },

  // Inputs / selects
  select: { background:"#0d1520", border:"1px solid #1e2d45", borderRadius:8, padding:"8px 10px", color:"#e2e8f0", fontSize:13, width:"100%" },
  input: { background:"#0d1520", border:"1px solid #1e2d45", borderRadius:8, padding:"8px 10px", color:"#e2e8f0", fontSize:13, width:"100%", outline:"none" },

  // Modal
  overlay: { position:"fixed", inset:0, background:"#000a", zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"center" },
  modal: { background:"#111827", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:600, maxHeight:"90vh", overflowY:"auto", padding:"20px 16px 40px" },
  modalDesktop: { background:"#111827", borderRadius:16, width:"100%", maxWidth:640, maxHeight:"85vh", overflowY:"auto", padding:28, margin:"auto" },

  // Tab
  tab: (active) => ({ padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", fontWeight:600, fontSize:13, background: active ? "#0ea5e9" : "transparent", color: active ? "#fff" : "#64748b" }),

  // Progress bar
  progressBar: (pct, color) => ({ height:6, borderRadius:3, background:`linear-gradient(90deg,${color} ${pct}%,#1e2d45 ${pct}%)` }),

  // Text helpers
  label: { fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:".05em", marginBottom:2 },
  value: { fontSize:15, fontWeight:600, color:"#e2e8f0" },
  muted: { fontSize:12, color:"#64748b" },
  price: { fontSize:20, fontWeight:800, color:"#38bdf8" },
};

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function DocIcons({ seller }) {
  const s = SELLERS[seller];
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:8 }}>
      {DOCS_LIST.map(d => (
        <div key={d.id} style={S.docIcon(s.docs.includes(d.id))} title={d.label}>
          {s.docs.includes(d.id) ? "✓" : "✗"}
        </div>
      ))}
    </div>
  );
}

function SellerAvatar({ seller, size=32 }) {
  const s = SELLERS[seller];
  return <div style={{...S.avatar(s.color), width:size, height:size, fontSize:size*0.38}}>{s.initials}</div>;
}

function PropertyCard({ prop, onClick }) {
  const sc = docsScore(prop.seller);
  const color = scoreColor(sc.pct);
  const missing = hasCriticalMissing(prop.seller);
  return (
    <div style={S.propCard(prop.featured)} onClick={onClick}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <span style={S.badge(color, color+"18")}>{`DOCS ${sc.pct}%`}</span>
          {prop.muelle && <span style={S.badge("#94a3b8","#1e2d4540")}>🚢 MUELLE</span>}
        </div>
        <span style={S.badge(prop.featured ? "#f59e0b" : "#22c55e", prop.featured ? "#f59e0b18" : "#22c55e18")}>
          {prop.featured ? "Destacado" : prop.status}
        </span>
      </div>

      {/* Title */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <span style={{ fontSize:28 }}>{EMOJI[prop.type]}</span>
        <div>
          <div style={{ fontSize:11, color:"#64748b" }}>{prop.zone} · {prop.class}</div>
          <div style={{ fontSize:16, fontWeight:700, color:"#e2e8f0" }}>{prop.title}</div>
        </div>
      </div>

      {/* Stats grid - 2 cols on mobile */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
        {[
          { label:"Área", val:`${prop.area.toLocaleString()} m²` },
          { label:"Altura", val:`${prop.height} m` },
          { label:"kVA", val:prop.kva },
          { label:"Piso", val:prop.floor },
        ].map(({label,val}) => (
          <div key={label} style={{ background:"#0d1520", borderRadius:8, padding:"8px 10px" }}>
            <div style={S.label}>{label}</div>
            <div style={{ fontSize:14, fontWeight:600 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Price + seller */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={S.price}>${prop.price}K</div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <SellerAvatar seller={prop.seller} />
          <span style={{ fontSize:13, color:"#94a3b8" }}>{SELLERS[prop.seller].name.split(" ")[0]}</span>
        </div>
      </div>

      {/* Docs */}
      <div style={{ borderTop:"1px solid #1e2d45", paddingTop:10 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
          <span style={S.muted}>DOCUMENTACIÓN LEGAL</span>
          <span style={{ fontSize:12, fontWeight:700, color }}>{sc.count}/{sc.total} docs</span>
        </div>
        <div style={S.progressBar(sc.pct, color)} />
        <DocIcons seller={prop.seller} />
        {missing && (
          <div style={{ marginTop:8, padding:"6px 10px", background:"#431407", borderRadius:6, fontSize:11, color:"#fb923c" }}>
            ⚠️ Docs críticos faltantes — la compra puede proceder a decisión del comprador
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyModal({ prop, onClose, isMobile }) {
  const [tab, setTab] = useState("info");
  const sc = docsScore(prop.seller);
  const color = scoreColor(sc.pct);
  const s = SELLERS[prop.seller];

  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={isMobile ? S.modal : { ...S.modalDesktop, alignSelf:"center" }}>
        {/* Handle bar (mobile) */}
        {isMobile && <div style={{ width:40, height:4, background:"#1e2d45", borderRadius:2, margin:"0 auto 16px" }} />}

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:11, color:"#64748b" }}>{prop.zone} · {prop.class}</div>
            <div style={{ fontSize:20, fontWeight:700 }}>{prop.title}</div>
            <div style={S.price}>${prop.price}K</div>
          </div>
          <button onClick={onClose} style={{ background:"#1e2d45", border:"none", borderRadius:8, width:32, height:32, color:"#94a3b8", cursor:"pointer", fontSize:16 }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, background:"#0d1520", borderRadius:10, padding:4, marginBottom:16 }}>
          {[["info","📋 Info"],["docs","⚖️ Legal"],["seller","👤 Vendedor"]].map(([id,label]) => (
            <button key={id} style={S.tab(tab===id)} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {tab === "info" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                ["Área",`${prop.area.toLocaleString()} m²`],
                ["Altura",`${prop.height} m`],
                ["kVA",prop.kva],
                ["Piso",prop.floor],
                ["Zona",prop.zone],
                ["Clasificación",prop.class],
                ["Muelle",prop.muelle?"Sí":"No"],
                ["Estado",prop.status],
              ].map(([l,v]) => (
                <div key={l} style={{ background:"#0d1520", borderRadius:8, padding:"10px 12px" }}>
                  <div style={S.label}>{l}</div>
                  <div style={{ fontSize:14, fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "docs" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
              <span style={{ fontWeight:600 }}>Estado Documental</span>
              <span style={{ fontWeight:700, color }}>{sc.count}/{sc.total} ({sc.pct}%)</span>
            </div>
            <div style={{ ...S.progressBar(sc.pct, color), marginBottom:16 }} />
            {DOCS_LIST.map(d => {
              const ok = s.docs.includes(d.id);
              return (
                <div key={d.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid #1e2d4540" }}>
                  <div style={S.docIcon(ok)}>{ok ? "✓" : "✗"}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color: ok ? "#e2e8f0" : "#94a3b8" }}>{d.label}</div>
                    {d.critical && <span style={{ fontSize:10, color:"#ef4444" }}>CRÍTICO</span>}
                  </div>
                  {!ok && <span style={{ fontSize:11, color:"#64748b" }}>Solicitar</span>}
                </div>
              );
            })}
            {hasCriticalMissing(prop.seller) && (
              <div style={{ marginTop:12, padding:"10px 12px", background:"#431407", borderRadius:8, fontSize:12, color:"#fb923c", lineHeight:1.5 }}>
                ⚠️ Esta propiedad tiene documentos críticos faltantes. La venta puede proceder, pero es decisión y responsabilidad del comprador continuar.
              </div>
            )}
          </div>
        )}

        {tab === "seller" && (
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, padding:16, background:"#0d1520", borderRadius:10 }}>
              <SellerAvatar seller={prop.seller} size={48} />
              <div>
                <div style={{ fontWeight:700, fontSize:16 }}>{s.name}</div>
                <div style={{ fontSize:12, color:"#64748b" }}>
                  ⭐ {s.rating} · {s.verified ? "✅ Verificado" : "❌ No verificado"}
                </div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <div style={{ background:"#0d1520", borderRadius:8, padding:"10px 12px" }}>
                <div style={S.label}>Docs completos</div>
                <div style={{ fontSize:18, fontWeight:700, color }}>{sc.count}/{sc.total}</div>
              </div>
              <div style={{ background:"#0d1520", borderRadius:8, padding:"10px 12px" }}>
                <div style={S.label}>Completitud</div>
                <div style={{ fontSize:18, fontWeight:700, color }}>{sc.pct}%</div>
              </div>
            </div>
          </div>
        )}

        <button style={{ ...S.btnPrimary, width:"100%", marginTop:16, padding:"14px" }}>
          Contactar Vendedor
        </button>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState(null);
  const [view, setView] = useState("search");
  const [selected, setSelected] = useState(null);
  const [filterType, setFilterType] = useState("todos");
  const [filterDocs, setFilterDocs] = useState("todos");
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);

  // Responsive listener
  useState(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  });

  const filtered = PROPERTIES.filter(p => {
    if (filterType !== "todos" && p.type !== filterType) return false;
    const sc = docsScore(p.seller);
    if (filterDocs === "completos" && sc.pct < 100) return false;
    if (filterDocs === "incompletos" && sc.pct === 100) return false;
    if (filterDocs === "criticos" && hasCriticalMissing(p.seller)) return false;
    return true;
  });

  // LOGIN SCREEN
  if (!role) {
    return (
      <div style={{ ...S.app, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:20 }}>
        <div style={{ width:"100%", maxWidth:360 }}>
          <div style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ width:56, height:56, background:"linear-gradient(135deg,#38bdf8,#0ea5e9)", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:24, color:"#fff", margin:"0 auto 12px" }}>N</div>
            <div style={{ fontSize:24, fontWeight:800, color:"#e2e8f0" }}>NodoEstate</div>
            <div style={{ fontSize:13, color:"#64748b", marginTop:4 }}>Marketplace comercial e industrial</div>
          </div>
          {[
            { id:"explorador", icon:"⌖", label:"Explorador", desc:"Busca y filtra propiedades" },
            { id:"realtor",    icon:"◈", label:"Realtor",    desc:"Gestiona tus publicaciones" },
            { id:"admin",      icon:"◉", label:"Admin",      desc:"KYC, pagos y métricas" },
          ].map(r => (
            <div key={r.id} onClick={() => setRole(r.id)}
              style={{ background:"#111827", border:"1px solid #1e2d45", borderRadius:12, padding:"16px 18px", marginBottom:10, cursor:"pointer", display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize:24 }}>{r.icon}</span>
              <div>
                <div style={{ fontWeight:700, color:"#e2e8f0" }}>{r.label}</div>
                <div style={{ fontSize:12, color:"#64748b" }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // MAIN LAYOUT
  const navItems = [
    { id:"search", icon:"🔍", label:"Buscar" },
    { id:"market", icon:"📊", label:"Mercado" },
  ];

  const SearchView = () => (
    <div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:20, fontWeight:800, marginBottom:4 }}>Buscar Propiedades</div>
        <div style={{ fontSize:13, color:"#64748b" }}>Activos comerciales e industriales · Estado documental en tiempo real</div>
      </div>

      {/* Filters */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
        <div>
          <div style={S.label}>Tipo</div>
          <select style={S.select} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="galpon">Galpón</option>
            <option value="oficina">Oficina</option>
            <option value="local">Local</option>
            <option value="planta">Planta</option>
            <option value="deposito">Depósito</option>
          </select>
        </div>
        <div>
          <div style={S.label}>Docs legales</div>
          <select style={S.select} value={filterDocs} onChange={e => setFilterDocs(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="completos">100% completos</option>
            <option value="criticos">Críticos OK</option>
            <option value="incompletos">Incompletos</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:12, marginBottom:12, flexWrap:"wrap" }}>
        <span style={{ fontSize:11, color:"#22c55e" }}>● Docs completos</span>
        <span style={{ fontSize:11, color:"#f59e0b" }}>● Docs parciales</span>
        <span style={{ fontSize:11, color:"#ef4444" }}>● Docs incompletos</span>
      </div>

      <div style={{ fontSize:12, color:"#64748b", marginBottom:12 }}>{filtered.length} propiedades encontradas</div>

      {filtered.map(p => (
        <PropertyCard key={p.id} prop={p} onClick={() => setSelected(p)} />
      ))}
    </div>
  );

  const MarketView = () => (
    <div>
      <div style={{ fontSize:20, fontWeight:800, marginBottom:16 }}>Mercado & BI</div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
        {[
          { label:"Precio Prom/m²", val:"$485", up:true },
          { label:"Propiedades",    val:"342",  up:true },
          { label:"Vol. Mensual",   val:"$12M", up:false },
          { label:"Días en mercado",val:"28",   up:false },
        ].map(({label,val,up}) => (
          <div key={label} style={S.card}>
            <div style={S.label}>{label}</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#e2e8f0" }}>{val}</div>
            <div style={{ fontSize:11, color: up ? "#22c55e" : "#ef4444" }}>{up ? "▲" : "▼"} vs mes anterior</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ fontWeight:600, marginBottom:12 }}>Evolución de precios</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={MARKET_DATA}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
            <XAxis dataKey="mes" stroke="#64748b" tick={{ fontSize:11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize:11 }} />
            <Tooltip contentStyle={{ background:"#111827", border:"1px solid #1e2d45", borderRadius:8, fontSize:12 }} />
            <Area type="monotone" dataKey="precio" stroke="#38bdf8" fill="url(#grad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={S.card}>
        <div style={{ fontWeight:600, marginBottom:12 }}>Demanda por mes</div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={MARKET_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
            <XAxis dataKey="mes" stroke="#64748b" tick={{ fontSize:11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize:11 }} />
            <Tooltip contentStyle={{ background:"#111827", border:"1px solid #1e2d45", borderRadius:8, fontSize:12 }} />
            <Bar dataKey="demanda" fill="#0ea5e9" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  // ── MOBILE LAYOUT
  if (isMobile) {
    return (
      <div style={S.app}>
        {/* Top bar */}
        <div style={{ background:"#111827", borderBottom:"1px solid #1e2d45", padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ ...S.logoMark, width:28, height:28, fontSize:13 }}>N</div>
            <span style={{ fontWeight:800, fontSize:15 }}>NodoEstate</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"#0ea5e940", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#38bdf8" }}>
              {role[0].toUpperCase()}
            </div>
            <button onClick={() => setRole(null)} style={{ background:"none", border:"none", color:"#64748b", fontSize:11, cursor:"pointer" }}>Salir</button>
          </div>
        </div>

        {/* Content */}
        <div style={{ ...S.main, paddingBottom:80 }}>
          {view === "search" ? <SearchView /> : <MarketView />}
        </div>

        {/* Bottom nav */}
        <div style={S.mobileNav}>
          {navItems.map(n => (
            <button key={n.id} style={S.mobileNavBtn(view===n.id)} onClick={() => setView(n.id)}>
              <span style={{ fontSize:20 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
          <button style={S.mobileNavBtn(false)} onClick={() => setRole(null)}>
            <span style={{ fontSize:20 }}>🚪</span>
            Salir
          </button>
        </div>

        {selected && <PropertyModal prop={selected} onClose={() => setSelected(null)} isMobile={true} />}
      </div>
    );
  }

  // ── DESKTOP LAYOUT
  return (
    <div style={{ ...S.app, ...S.desktopLayout }}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.sidebarLogo}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={S.logoMark}>N</div>
            <span style={{ fontWeight:800, fontSize:16 }}>NodoEstate</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 10px", background:"#0d1520", borderRadius:8 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:"#0ea5e940", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#38bdf8" }}>
              {role[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>Demo User</div>
              <div style={{ fontSize:10, color:"#38bdf8", textTransform:"uppercase", letterSpacing:".1em" }}>{role}</div>
            </div>
          </div>
        </div>

        <nav style={{ padding:"12px 8px", flex:1 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setView(n.id)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:8, border:"none", cursor:"pointer", marginBottom:4, background: view===n.id ? "#0ea5e920" : "transparent", color: view===n.id ? "#38bdf8" : "#64748b", fontWeight: view===n.id ? 600 : 400, fontSize:14 }}>
              {n.icon} {n.label}
            </button>
          ))}
        </nav>

        <div style={{ padding:"12px 8px", borderTop:"1px solid #1e2d45" }}>
          <button onClick={() => setRole(null)} style={{ ...S.btnSecondary, width:"100%" }}>← Cambiar rol</button>
        </div>
      </div>

      {/* Main */}
      <div style={S.mainDesktop}>
        {view === "search" ? <SearchView /> : <MarketView />}
      </div>

      {selected && <PropertyModal prop={selected} onClose={() => setSelected(null)} isMobile={false} />}
    </div>
  );
}
