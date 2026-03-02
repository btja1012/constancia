"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Empleado {
  cedula: string; nombre: string; cargo: string; tipo_personal: string;
  codigo_rac: string; fecha_ingreso: string; ubicacion: string;
  codigo_dependencia: string; horas_academicas: number; nacimiento: string;
}

const EMPTY: Empleado = {
  cedula: "", nombre: "", cargo: "", tipo_personal: "", codigo_rac: "",
  fecha_ingreso: "", ubicacion: "", codigo_dependencia: "", horas_academicas: 0, nacimiento: "",
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

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [search, setSearch]       = useState("");
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState<"add" | "edit" | null>(null);
  const [form, setForm]           = useState<Empleado>(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/empleados");
    if (res.ok) setEmpleados(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm(EMPTY); setError(""); setModal("add"); };
  const openEdit = (e: Empleado) => { setForm({ ...e, nacimiento: e.nacimiento?.slice(0, 10) ?? "" }); setError(""); setModal("edit"); };
  const closeModal = () => { setModal(null); setError(""); };

  const save = async () => {
    setError("");
    if (!form.cedula || !form.nombre || !form.nacimiento) {
      setError("Cédula, nombre y fecha de nacimiento son obligatorios.");
      return;
    }
    setSaving(true);
    try {
      const url = modal === "edit" ? `/api/admin/empleados/${form.cedula}` : "/api/admin/empleados";
      const method = modal === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Error al guardar."); return; }
      closeModal();
      load();
    } catch { setError("Error de conexión."); }
    finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/empleados/${deleteTarget}`, { method: "DELETE" });
    setDeleteTarget(null);
    load();
  };

  const field = (key: keyof Empleado, label: string, type = "text", opts?: { placeholder?: string }) => (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1">{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
        placeholder={opts?.placeholder}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.07] border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-400 transition [color-scheme:dark]"
      />
    </div>
  );

  const filtered = empleados.filter(e =>
    e.nombre.toLowerCase().includes(search.toLowerCase()) ||
    e.cedula.includes(search)
  );

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <AdminNav active="empleados" />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Empleados</h1>
            <p className="text-white/40 text-sm">{empleados.length} registrados</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition shadow-lg">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nuevo Empleado
          </button>
        </div>

        <div className="bg-white/[0.05] border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o cédula..."
              className="w-full sm:w-72 px-3 py-2 rounded-lg bg-white/[0.07] border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
            />
          </div>

          {loading ? (
            <div className="p-8 text-center text-white/30 text-sm">Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-white/30 text-sm">No se encontraron empleados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-3">Nombre</th>
                    <th className="text-left px-4 py-3">Cédula</th>
                    <th className="text-left px-4 py-3 hidden sm:table-cell">Cargo</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Ingreso</th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">Dependencia</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e, i) => (
                    <tr key={e.cedula} className={`border-b border-white/[0.05] hover:bg-white/[0.03] transition ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                      <td className="px-4 py-3 font-medium text-white/90">{e.nombre}</td>
                      <td className="px-4 py-3 text-white/60">V-{e.cedula}</td>
                      <td className="px-4 py-3 text-white/60 hidden sm:table-cell">{e.cargo}</td>
                      <td className="px-4 py-3 text-white/60 hidden md:table-cell">{e.fecha_ingreso}</td>
                      <td className="px-4 py-3 text-white/60 hidden lg:table-cell">{e.ubicacion}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition" title="Editar">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button onClick={() => setDeleteTarget(e.cedula)} className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition" title="Eliminar">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h2 className="font-bold text-white">{modal === "add" ? "Nuevo Empleado" : "Editar Empleado"}</h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {field("cedula", "Cédula *", "text", { placeholder: "12345678" })}
                {field("nacimiento", "Fecha de Nacimiento *", "date")}
              </div>
              {field("nombre", "Nombre completo *", "text", { placeholder: "Juan Pérez" })}
              <div className="grid grid-cols-2 gap-3">
                {field("cargo", "Cargo", "text", { placeholder: "Docente" })}
                {field("tipo_personal", "Tipo de Personal", "text", { placeholder: "DOCENTE" })}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {field("codigo_rac", "Código RAC", "text")}
                {field("fecha_ingreso", "Fecha de Ingreso", "text", { placeholder: "DD/MM/YYYY" })}
              </div>
              {field("ubicacion", "Dependencia / Ubicación", "text")}
              <div className="grid grid-cols-2 gap-3">
                {field("codigo_dependencia", "Código Dependencia", "text")}
                {field("horas_academicas", "Horas Académicas", "number")}
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="flex gap-3 p-5 pt-0">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-sm transition">
                Cancelar
              </button>
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-40 text-white font-semibold text-sm transition">
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl">⚠️</div>
              <h2 className="font-bold text-white">¿Eliminar empleado?</h2>
              <p className="text-white/50 text-sm">Esta acción no se puede deshacer.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-sm transition">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
