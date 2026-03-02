"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Config {
  director_nombre: string; director_cargo: string;
  director_cedula: string; director_credencial: string;
  institucion: string; institucion_ubicacion: string;
  codigo_administrativo: string; codigo_plantel: string; codigo_estadistico: string;
}

const EMPTY: Config = {
  director_nombre: "", director_cargo: "", director_cedula: "", director_credencial: "",
  institucion: "", institucion_ubicacion: "",
  codigo_administrativo: "", codigo_plantel: "", codigo_estadistico: "",
};

function AdminNav({ active }: { active: "empleados" | "config" }) {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };
  const link = "px-3 py-1.5 rounded-lg text-sm font-medium transition";
  return (
    <nav className="bg-white/[0.04] border-b border-white/10 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="text-white font-bold text-sm tracking-tight">🏫 Admin</span>
          <a href="/admin/empleados" className={`${link} ${active === "empleados" ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"}`}>Empleados</a>
          <a href="/admin/config"    className={`${link} ${active === "config"    ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"}`}>Configuración</a>
        </div>
        <button onClick={logout} className="text-white/40 hover:text-white/70 text-sm transition">Salir →</button>
      </div>
    </nav>
  );
}

export default function ConfigPage() {
  const [form, setForm]       = useState<Config>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    fetch("/api/admin/config")
      .then(r => r.json())
      .then(data => { setForm({ ...EMPTY, ...data }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const set = (key: keyof Config) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setError(""); setSuccess(false); setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Error al guardar."); }
      else setSuccess(true);
    } catch { setError("Error de conexión."); }
    finally { setSaving(false); }
  };

  const field = (key: keyof Config, label: string, placeholder?: string) => (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1">{label}</label>
      <input
        type="text"
        value={form[key]}
        onChange={set(key)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl bg-white/[0.07] border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <AdminNav active="config" />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white">Configuración</h1>
          <p className="text-white/40 text-sm">Datos del director e institución usados en las constancias</p>
        </div>

        {loading ? (
          <div className="text-center text-white/30 text-sm py-12">Cargando...</div>
        ) : (
          <div className="space-y-4">
            {/* Director */}
            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Director / Directora</h2>
              {field("director_nombre", "Nombre completo", "LCDA. MAYELA COROMOTO MÁRQUEZ ALARCÓN")}
              <div className="grid grid-cols-2 gap-4">
                {field("director_cedula", "Cédula", "8.707.544")}
                {field("director_cargo", "Cargo", "Directora (E)")}
              </div>
              {field("director_credencial", "Fecha de Credencial", "16/09/2024")}
            </div>

            {/* Institución */}
            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Institución</h2>
              {field("institucion", "Nombre de la institución", 'Escuela "María Yolanda Pernía"')}
              {field("institucion_ubicacion", "Ubicación", "Urb. San José Parroquia El Llano Tovar Estado Mérida")}
              <div className="grid grid-cols-3 gap-4">
                {field("codigo_administrativo", "Cód. Administrativo", "006561453")}
                {field("codigo_plantel", "Cód. Plantel", "S2959D1421")}
                {field("codigo_estadistico", "Cód. Estadístico", "140917")}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-4 py-3 text-sm">
                ✓ Configuración guardada correctamente.
              </div>
            )}

            <button
              onClick={save}
              disabled={saving}
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
