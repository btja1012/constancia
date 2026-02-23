"use client";

import { useState } from "react";
import { fechaEnLetras } from "@/lib/fechaEnLetras";

type TipoConstancia = "zona" | "ivss" | "banco" | "otro";

interface Empleado {
  nombre: string; cedula: string; cargo: string; fecha_ingreso: string; ubicacion: string;
  tipo_personal: string; codigo_rac: string; codigo_dependencia: string; horas_academicas: number;
}
interface Config   { director_nombre: string; director_cargo: string; institucion: string; }

const TIPOS = [
  { id: "zona"  as TipoConstancia, label: "Zona Educativa N°14 — Mérida", icon: "🎓", tramite: "Zona Educativa N°14 Mérida", from: "from-blue-600",    to: "to-indigo-600",  ring: "focus:ring-blue-400",   btn: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",       badge: "bg-blue-100 text-blue-700"       },
  { id: "ivss"  as TipoConstancia, label: "IVSS — Mérida",                icon: "🏥", tramite: "IVSS Mérida",                from: "from-emerald-600", to: "to-teal-600",    ring: "focus:ring-emerald-400",btn: "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",   badge: "bg-emerald-100 text-emerald-700" },
  { id: "banco" as TipoConstancia, label: "Entidad Bancaria",              icon: "🏦", tramite: "",                           from: "from-violet-600", to: "to-purple-600",  ring: "focus:ring-violet-400", btn: "from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500", badge: "bg-violet-100 text-violet-700"   },
  { id: "otro"  as TipoConstancia, label: "Otro",                          icon: "✏️", tramite: "",                           from: "from-rose-600",   to: "to-pink-600",    ring: "focus:ring-rose-400",   btn: "from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500",         badge: "bg-rose-100 text-rose-700"       },
];


export default function Home() {
  const [tipo,       setTipo]       = useState<TipoConstancia>("zona");
  const [cedula,     setCedula]     = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [entidad,    setEntidad]    = useState("");
  const [otroMotivo, setOtroMotivo] = useState("");
  const [empleado,   setEmpleado]   = useState<Empleado | null>(null);
  const [config,     setConfig]     = useState<Config | null>(null);
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl,     setPdfUrl]     = useState<string | null>(null);

  const t = TIPOS.find((x) => x.id === tipo)!;
  const tramite =
    tipo === "banco" ? (entidad || "Entidad Bancaria") :
    tipo === "otro"  ? otroMotivo :
    t.tramite;

  const handleTipo = (val: string) => {
    setTipo(val as TipoConstancia);
    setEmpleado(null);
    setError("");
    setPdfUrl(null);
    setOtroMotivo("");
  };

  const buscar = async () => {
    setError(""); setEmpleado(null); setPdfUrl(null);
    if (!cedula || !nacimiento) { setError("Ingresa la cédula y fecha de nacimiento."); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula, nacimiento }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else { setEmpleado(data.empleado); setConfig(data.config); }
    } catch { setError("Error de conexión. Intenta de nuevo."); }
    finally  { setLoading(false); }
  };

  const generarPDF = async () => {
    if (!empleado || !config) return;
    setPdfLoading(true); setPdfUrl(null);
    try {
      const hoyIso = new Date().toISOString().split("T")[0];
      const { dia: diaPalabra, mes: mesPalabra, anio } = fechaEnLetras(hoyIso);
      const { pdf } = await import("@react-pdf/renderer");
      const baseUrl = window.location.origin;

      const { default: Comp } = await import("@/components/ConstanciaDoc");
      const docElement = (
        <Comp
          nombre={empleado.nombre}
          cedula={empleado.cedula}
          tipoPersonal={empleado.tipo_personal}
          codigoRac={empleado.codigo_rac}
          ubicacion={empleado.ubicacion}
          codigoDependencia={empleado.codigo_dependencia}
          fechaIngreso={empleado.fecha_ingreso}
          horasAcademicas={empleado.horas_academicas}
          diaPalabra={diaPalabra}
          mesPalabra={mesPalabra}
          anio={anio}
          tramite={tramite}
          baseUrl={baseUrl}
        />
      );

      const blob = await pdf(docElement).toBlob();
      setPdfUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error("Error generando PDF:", e);
      setError("No se pudo generar el PDF. Intenta de nuevo.");
    } finally { setPdfLoading(false); }
  };

  const descargar = () => {
    if (!pdfUrl || !empleado) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `Constancia_${tipo.toUpperCase()}_${empleado.cedula}.pdf`;
    a.click();
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0f0f1a] flex items-start justify-center px-4 py-10">

      {/* Orbs animados */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`orb-a absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br ${t.from} ${t.to} opacity-[0.12] blur-3xl transition-all duration-700`} />
        <div className={`orb-b absolute -bottom-48 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-tl ${t.from} ${t.to} opacity-[0.10] blur-3xl transition-all duration-700`} />
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

        {/* Formulario */}
        <div className="animate-fade-in-up delay-100 bg-white/[0.05] backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4">

          {/* Cédula */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Cédula de Identidad</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="Ej: 8707544"
              className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition`}
            />
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Fecha de Nacimiento</label>
            <input
              type="date"
              value={nacimiento}
              onChange={(e) => setNacimiento(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 text-white/80 focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition [color-scheme:dark]`}
            />
          </div>

          {/* Dropdown tipo / motivo */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Motivo del Trámite</label>
            <div className="relative">
              <select
                value={tipo}
                onChange={(e) => handleTipo(e.target.value)}
                className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-xl bg-white/[0.08] border border-white/10 text-white focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition cursor-pointer [color-scheme:dark]`}
              >
                {TIPOS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.icon}  {opt.label}
                  </option>
                ))}
              </select>
              {/* Chevron custom */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Campo banco */}
          {tipo === "banco" && (
            <div className="animate-slide-up">
              <label className="block text-sm font-medium text-white/70 mb-1.5">Nombre del Banco</label>
              <input
                type="text"
                value={entidad}
                onChange={(e) => setEntidad(e.target.value)}
                placeholder="Ej: Banco de Venezuela"
                className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition`}
              />
            </div>
          )}

          {/* Campo motivo libre — solo si es tipo otro */}
          {tipo === "otro" && (
            <div className="animate-slide-up">
              <label className="block text-sm font-medium text-white/70 mb-1.5">Motivo del Trámite</label>
              <input
                type="text"
                value={otroMotivo}
                onChange={(e) => setOtroMotivo(e.target.value)}
                placeholder="Ej: Trámites personales"
                className={`w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 ${t.ring} focus:border-transparent transition`}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="animate-slide-up flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Botón buscar */}
          <button
            onClick={buscar}
            disabled={loading}
            className={`w-full bg-gradient-to-r ${t.btn} disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2`}
          >
            {loading
              ? <><svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Buscando...</>
              : <><span>Buscar Empleado</span><span className="opacity-70">→</span></>
            }
          </button>
        </div>

        {/* Resultado */}
        {empleado && config && (
          <div className="animate-slide-up animate-glow-pulse bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">Empleado encontrado</p>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${t.badge}`}>{t.icon} {t.id === "banco" ? entidad || "Banco" : t.label.split("—")[0].trim()}</span>
            </div>

            <div className="space-y-2 rounded-xl bg-white/[0.04] border border-white/[0.07] p-4">
              {([
                ["Nombre",      empleado.nombre],
                ["Cédula",      `V-${empleado.cedula}`],
                ["Cargo",       empleado.cargo],
                ["Institución", empleado.ubicacion],
                ["Ingreso",     empleado.fecha_ingreso],
              ] as [string, string][]).map(([label, value], i) => (
                <div key={label} className="animate-fade-in-up flex gap-3 text-sm" style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="text-white/40 w-24 shrink-0">{label}</span>
                  <span className="text-white/90 font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* Paso 1: Generar */}
            {!pdfUrl && (
              <button onClick={generarPDF} disabled={pdfLoading}
                className={`w-full bg-gradient-to-r ${t.btn} disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2`}>
                {pdfLoading
                  ? <><svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>Generando constancia...</>
                  : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Generar Constancia PDF</>
                }
              </button>
            )}

            {/* Paso 2: Ver + Descargar */}
            {pdfUrl && (
              <div className="animate-slide-up space-y-2">
                <p className="text-xs text-center text-emerald-400/80 pb-1">✓ Constancia lista</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => window.open(pdfUrl, "_blank")}
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition border border-white/10 text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver PDF
                  </button>
                  <button onClick={descargar}
                    className={`flex items-center justify-center gap-2 bg-gradient-to-r ${t.btn} text-white font-semibold py-3 rounded-xl transition shadow-lg text-sm`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar
                  </button>
                </div>
                <button onClick={() => setPdfUrl(null)}
                  className="w-full text-white/30 hover:text-white/50 text-xs py-1 transition">
                  Regenerar constancia
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer easter egg */}
        <div className="animate-fade-in-up delay-300 text-center pt-2 pb-4">
          <p className="text-white/20 text-xs">
            hecho con <span title="✨ Made by Maga ✨" className="hover-wiggle inline-block cursor-default select-none">🧙‍♀️</span>
          </p>
        </div>

      </div>
    </main>
  );
}
