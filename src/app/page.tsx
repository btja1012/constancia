"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);
const ConstanciaZona  = dynamic(() => import("@/components/ConstanciaZonaEducativa"), { ssr: false });
const ConstanciaIVSS  = dynamic(() => import("@/components/ConstanciaIVSS"),          { ssr: false });
const ConstanciaBanco = dynamic(() => import("@/components/ConstanciaBanco"),          { ssr: false });

type TipoConstancia = "zona" | "ivss" | "banco";

interface Empleado { nombre: string; cedula: string; cargo: string; fecha_ingreso: string; ubicacion: string; }
interface Config   { director_nombre: string; director_cargo: string; institucion: string; }

const TIPOS = [
  {
    id: "zona" as TipoConstancia,
    label: "Zona Educativa N°14",
    sub: "Mérida",
    icon: "🎓",
    from: "from-blue-600", to: "to-indigo-600",
    ring: "focus:ring-blue-400",
    btn: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
    light: "bg-blue-50 text-blue-700 border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    id: "ivss" as TipoConstancia,
    label: "IVSS",
    sub: "Mérida",
    icon: "🏥",
    from: "from-emerald-600", to: "to-teal-600",
    ring: "focus:ring-emerald-400",
    btn: "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "banco" as TipoConstancia,
    label: "Entidad Bancaria",
    sub: "Carta al banco",
    icon: "🏦",
    from: "from-violet-600", to: "to-purple-600",
    ring: "focus:ring-violet-400",
    btn: "from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500",
    light: "bg-violet-50 text-violet-700 border-violet-200",
    badge: "bg-violet-100 text-violet-700",
  },
];

function formatDate(dateStr: string) {
  const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const d = new Date(dateStr + "T12:00:00");
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

export default function Home() {
  const [tipo,      setTipo]      = useState<TipoConstancia>("zona");
  const [cedula,    setCedula]    = useState("");
  const [nacimiento,setNacimiento]= useState("");
  const [tramite,   setTramite]   = useState("Fines Legales");
  const [entidad,   setEntidad]   = useState("");
  const [empleado,  setEmpleado]  = useState<Empleado | null>(null);
  const [config,    setConfig]    = useState<Config | null>(null);
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  const t = TIPOS.find((x) => x.id === tipo)!;

  const buscar = async () => {
    setError(""); setEmpleado(null);
    if (!cedula || !nacimiento) { setError("Ingresa la cédula y fecha de nacimiento."); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/buscar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cedula, nacimiento }) });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else { setEmpleado(data.empleado); setConfig(data.config); }
    } catch { setError("Error de conexión. Intenta de nuevo."); }
    finally  { setLoading(false); }
  };

  const hoy         = formatDate(new Date().toISOString().split("T")[0]);
  const fechaIngreso = empleado ? formatDate(empleado.fecha_ingreso) : "";

  const pdfDoc = empleado && config ? (
    tipo === "zona"  ? <ConstanciaZona  nombre={empleado.nombre} cedula={empleado.cedula} cargo={empleado.cargo} fechaIngreso={fechaIngreso} ubicacion={empleado.ubicacion} directorNombre={config.director_nombre} directorCargo={config.director_cargo} tramite={tramite || "Fines Legales"} hoy={hoy} /> :
    tipo === "ivss"  ? <ConstanciaIVSS  nombre={empleado.nombre} cedula={empleado.cedula} cargo={empleado.cargo} fechaIngreso={fechaIngreso} ubicacion={empleado.ubicacion} directorNombre={config.director_nombre} directorCargo={config.director_cargo} tramite={tramite || "Trámite IVSS"} hoy={hoy} /> :
                       <ConstanciaBanco nombre={empleado.nombre} cedula={empleado.cedula} cargo={empleado.cargo} fechaIngreso={fechaIngreso} ubicacion={empleado.ubicacion} directorNombre={config.director_nombre} directorCargo={config.director_cargo} entidadBancaria={entidad} tramite={tramite || "Trámite bancario"} hoy={hoy} />
  ) : null;

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0f0f1a] flex items-start justify-center px-4 py-10">

      {/* Orbs de fondo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`orb-a absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br ${t.from} ${t.to} opacity-[0.12] blur-3xl transition-all duration-700`} />
        <div className={`orb-b absolute -bottom-48 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tl ${t.from} ${t.to} opacity-[0.10] blur-3xl transition-all duration-700`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.02] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-5 z-10">

        {/* Header */}
        <div className="text-center animate-fade-in-up">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${t.from} ${t.to} shadow-lg mb-4 transition-all duration-500 text-2xl`}>
            {t.icon}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Constancias</h1>
          <p className="text-white/40 text-sm mt-1">CDCE Tovar · Sistema de Documentos</p>
        </div>

        {/* Tipo selector */}
        <div className="animate-fade-in-up delay-100 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-2xl p-4">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">Tipo de constancia</p>
          <div className="grid grid-cols-3 gap-2">
            {TIPOS.map((opt) => (
              <button key={opt.id}
                onClick={() => { setTipo(opt.id); setEmpleado(null); setError(""); }}
                className={`relative flex flex-col items-center gap-1 px-2 py-3 rounded-xl text-xs font-semibold transition-all duration-300 ${
                  tipo === opt.id
                    ? `bg-gradient-to-br ${opt.from} ${opt.to} text-white shadow-lg scale-[1.03] pill-active`
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.07]"
                }`}>
                <span className="text-xl">{opt.icon}</span>
                <span className="leading-tight text-center">{opt.label}</span>
                <span className="text-[10px] opacity-70">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div className="animate-fade-in-up delay-200 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">Verificar empleado</p>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Cédula de Identidad</label>
              <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && buscar()}
                placeholder="Ej: 8707544"
                className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Fecha de Nacimiento</label>
              <input type="date" value={nacimiento} onChange={(e) => setNacimiento(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 text-white/80 focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition [color-scheme:dark]`} />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Motivo del Trámite</label>
              <input type="text" value={tramite} onChange={(e) => setTramite(e.target.value)}
                placeholder="Fines Legales"
                className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition`} />
            </div>

            {tipo === "banco" && (
              <div className="animate-slide-up">
                <label className="block text-sm font-medium text-white/70 mb-1.5">Nombre del Banco</label>
                <input type="text" value={entidad} onChange={(e) => setEntidad(e.target.value)}
                  placeholder="Ej: Banco de Venezuela"
                  className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition`} />
              </div>
            )}
          </div>

          {error && (
            <div className="animate-slide-up flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <button onClick={buscar} disabled={loading}
            className={`w-full bg-gradient-to-r ${t.btn} disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2`}>
            {loading ? (
              <>
                <svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                Buscando...
              </>
            ) : (
              <> <span>Buscar Empleado</span> <span className="opacity-70">→</span> </>
            )}
          </button>
        </div>

        {/* Resultado */}
        {empleado && config && pdfDoc && (
          <div className="animate-slide-up animate-glow-pulse bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">Empleado encontrado</p>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.badge}`}>
                {t.icon} {t.label}
              </span>
            </div>

            <div className="space-y-2 rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
              {[
                ["Nombre",     empleado.nombre],
                ["Cédula",     empleado.cedula],
                ["Cargo",      empleado.cargo],
                ["Institución",empleado.ubicacion],
                ["Ingreso",    fechaIngreso],
              ].map(([label, value], i) => (
                <div key={label} className="animate-fade-in-up flex gap-3 text-sm" style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="text-white/40 w-24 shrink-0">{label}</span>
                  <span className="text-white/90 font-medium">{value}</span>
                </div>
              ))}
            </div>

            <PDFDownloadLink document={pdfDoc} fileName={`Constancia_${tipo.toUpperCase()}_${empleado.cedula}.pdf`}>
              {({ loading: pl }) => (
                <button disabled={pl}
                  className={`w-full bg-gradient-to-r ${t.btn} disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2`}>
                  {pl ? (
                    <>
                      <svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                      </svg>
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Descargar Constancia PDF
                    </>
                  )}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        )}

        {/* Footer — easter egg */}
        <div className="animate-fade-in-up delay-300 text-center pt-2 pb-4">
          <p className="text-white/20 text-xs">
            hecho con{" "}
            <span title="✨ Made by Maga ✨" className="hover-wiggle inline-block cursor-default select-none">🧙‍♀️</span>
          </p>
        </div>

      </div>
    </main>
  );
}
