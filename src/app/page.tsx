"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);
const ConstanciaZona = dynamic(() => import("@/components/ConstanciaZonaEducativa"), { ssr: false });
const ConstanciaIVSS = dynamic(() => import("@/components/ConstanciaIVSS"), { ssr: false });
const ConstanciaBanco = dynamic(() => import("@/components/ConstanciaBanco"), { ssr: false });

type TipoConstancia = "zona" | "ivss" | "banco";

interface Empleado {
  nombre: string;
  cedula: string;
  cargo: string;
  fecha_ingreso: string;
  ubicacion: string;
}
interface Config {
  director_nombre: string;
  director_cargo: string;
  institucion: string;
}

const TIPOS = [
  { id: "zona" as TipoConstancia, label: "Zona Educativa N°14", color: "blue", icon: "🎓" },
  { id: "ivss" as TipoConstancia, label: "IVSS Mérida", color: "green", icon: "🏥" },
  { id: "banco" as TipoConstancia, label: "Entidad Bancaria", color: "red", icon: "🏦" },
];

const COLORS: Record<string, string> = {
  blue: "bg-blue-700 hover:bg-blue-800 border-blue-700",
  green: "bg-emerald-700 hover:bg-emerald-800 border-emerald-700",
  red: "bg-red-800 hover:bg-red-900 border-red-800",
};
const RING: Record<string, string> = {
  blue: "ring-blue-500 border-blue-500",
  green: "ring-emerald-500 border-emerald-500",
  red: "ring-red-500 border-red-500",
};

function formatDate(dateStr: string) {
  const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const d = new Date(dateStr + "T12:00:00");
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

export default function Home() {
  const [tipo, setTipo] = useState<TipoConstancia>("zona");
  const [cedula, setCedula] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [tramite, setTramite] = useState("Fines Legales");
  const [entidad, setEntidad] = useState("");
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const tipoActual = TIPOS.find((t) => t.id === tipo)!;

  const buscar = async () => {
    setError("");
    setEmpleado(null);
    if (!cedula || !nacimiento) {
      setError("Ingresa la cédula y fecha de nacimiento.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/buscar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula, nacimiento }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else { setEmpleado(data.empleado); setConfig(data.config); }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const hoy = formatDate(new Date().toISOString().split("T")[0]);
  const fechaIngreso = empleado ? formatDate(empleado.fecha_ingreso) : "";
  const accentColor = COLORS[tipoActual.color];
  const ringColor = RING[tipoActual.color];

  const pdfDoc = empleado && config ? (
    tipo === "zona" ? (
      <ConstanciaZona nombre={empleado.nombre} cedula={empleado.cedula} cargo={empleado.cargo}
        fechaIngreso={fechaIngreso} ubicacion={empleado.ubicacion}
        directorNombre={config.director_nombre} directorCargo={config.director_cargo}
        tramite={tramite || "Fines Legales"} hoy={hoy} />
    ) : tipo === "ivss" ? (
      <ConstanciaIVSS nombre={empleado.nombre} cedula={empleado.cedula} cargo={empleado.cargo}
        fechaIngreso={fechaIngreso} ubicacion={empleado.ubicacion}
        directorNombre={config.director_nombre} directorCargo={config.director_cargo}
        tramite={tramite || "Trámite IVSS"} hoy={hoy} />
    ) : (
      <ConstanciaBanco nombre={empleado.nombre} cedula={empleado.cedula} cargo={empleado.cargo}
        fechaIngreso={fechaIngreso} ubicacion={empleado.ubicacion}
        directorNombre={config.director_nombre} directorCargo={config.director_cargo}
        entidadBancaria={entidad} tramite={tramite || "Trámite bancario"} hoy={hoy} />
    )
  ) : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-start justify-center p-4 pt-8 pb-12">
      <div className="w-full max-w-md space-y-4">

        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Constancias Laborales</h1>
          <p className="text-gray-500 text-sm mt-1">CDCE Tovar — Sistema de Generación de Constancias</p>
        </div>

        {/* Selector de tipo */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Tipo de constancia</p>
          <div className="space-y-2">
            {TIPOS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTipo(t.id); setEmpleado(null); setError(""); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition text-left font-medium text-sm ${
                  tipo === t.id
                    ? `${COLORS[t.color]} text-white border-transparent`
                    : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl">{t.icon}</span>
                <span>{t.label}</span>
                {tipo === t.id && <span className="ml-auto text-xs opacity-80">Seleccionado</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Datos del empleado</p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de Identidad</label>
            <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)}
              placeholder="Ej: 8707544"
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              className={`w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:ring-2 focus:${ringColor} focus:border-transparent outline-none transition text-gray-800`} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
            <input type="date" value={nacimiento} onChange={(e) => setNacimiento(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:ring-2 focus:${ringColor} focus:border-transparent outline-none transition text-gray-800`} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motivo del Trámite</label>
            <input type="text" value={tramite} onChange={(e) => setTramite(e.target.value)}
              placeholder="Fines Legales"
              className={`w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:ring-2 focus:${ringColor} focus:border-transparent outline-none transition text-gray-800`} />
          </div>

          {tipo === "banco" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Banco</label>
              <input type="text" value={entidad} onChange={(e) => setEntidad(e.target.value)}
                placeholder="Ej: Banco de Venezuela"
                className={`w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:ring-2 focus:${ringColor} focus:border-transparent outline-none transition text-gray-800`} />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <button onClick={buscar} disabled={loading}
            className={`w-full ${accentColor} disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition shadow-md`}>
            {loading ? "Buscando..." : "Buscar Empleado"}
          </button>
        </div>

        {/* Resultado */}
        {empleado && config && pdfDoc && (
          <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{tipoActual.icon}</span>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Empleado encontrado · {tipoActual.label}
              </p>
            </div>

            <div className="space-y-2 text-sm bg-slate-50 rounded-xl p-4">
              {[
                ["Nombre", empleado.nombre],
                ["Cédula", empleado.cedula],
                ["Cargo", empleado.cargo],
                ["Institución", empleado.ubicacion],
                ["Fecha Ingreso", fechaIngreso],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-2">
                  <span className="font-semibold text-gray-600 w-28 shrink-0">{label}:</span>
                  <span className="text-gray-800">{value}</span>
                </div>
              ))}
            </div>

            <PDFDownloadLink
              document={pdfDoc}
              fileName={`Constancia_${tipo.toUpperCase()}_${empleado.cedula}.pdf`}
            >
              {({ loading: pl }) => (
                <button disabled={pl}
                  className={`w-full ${accentColor} disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {pl ? "Generando PDF..." : `Descargar Constancia ${tipoActual.label}`}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        )}
      </div>
    </main>
  );
}
