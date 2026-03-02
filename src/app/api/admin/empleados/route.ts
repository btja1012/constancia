import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCookie, COOKIE_NAME } from "@/lib/adminAuth";
import sql from "@/lib/db";

async function auth(req: NextRequest) {
  return verifyAdminCookie(req.cookies.get(COOKIE_NAME)?.value);
}

export async function GET(req: NextRequest) {
  if (!await auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const rows = await sql`
    SELECT cedula, nombre, cargo, tipo_personal, codigo_rac,
           fecha_ingreso, ubicacion, codigo_dependencia,
           horas_academicas, nacimiento::text
    FROM empleados
    ORDER BY nombre ASC
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!await auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const b = await req.json();
  const { cedula, nombre, cargo, tipo_personal, codigo_rac, fecha_ingreso,
          ubicacion, codigo_dependencia, horas_academicas, nacimiento } = b;

  if (!cedula || !nombre || !nacimiento) {
    return NextResponse.json({ error: "Cédula, nombre y nacimiento son obligatorios." }, { status: 400 });
  }

  await sql`
    INSERT INTO empleados
      (cedula, nombre, cargo, tipo_personal, codigo_rac, fecha_ingreso,
       ubicacion, codigo_dependencia, horas_academicas, nacimiento)
    VALUES
      (${cedula.trim()}, ${nombre}, ${cargo ?? ""}, ${tipo_personal ?? ""},
       ${codigo_rac ?? ""}, ${fecha_ingreso ?? ""}, ${ubicacion ?? ""},
       ${codigo_dependencia ?? ""}, ${horas_academicas ?? 0}, ${nacimiento})
  `;
  return NextResponse.json({ ok: true }, { status: 201 });
}
