import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCookie, COOKIE_NAME } from "@/lib/adminAuth";
import sql from "@/lib/db";

async function auth(req: NextRequest) {
  return verifyAdminCookie(req.cookies.get(COOKIE_NAME)?.value);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ cedula: string }> }) {
  if (!await auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { cedula } = await params;
  const b = await req.json();
  const { nombre, cargo, tipo_personal, codigo_rac, fecha_ingreso,
          ubicacion, codigo_dependencia, horas_academicas, nacimiento,
          cedula: nuevaCedula } = b;

  await sql`
    UPDATE empleados SET
      cedula            = ${nuevaCedula?.trim() ?? cedula},
      nombre            = ${nombre},
      cargo             = ${cargo ?? ""},
      tipo_personal     = ${tipo_personal ?? ""},
      codigo_rac        = ${codigo_rac ?? ""},
      fecha_ingreso     = ${fecha_ingreso ?? ""},
      ubicacion         = ${ubicacion ?? ""},
      codigo_dependencia= ${codigo_dependencia ?? ""},
      horas_academicas  = ${horas_academicas ?? 0},
      nacimiento        = ${nacimiento}
    WHERE cedula = ${cedula}
  `;
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ cedula: string }> }) {
  if (!await auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { cedula } = await params;
  await sql`DELETE FROM empleados WHERE cedula = ${cedula}`;
  return NextResponse.json({ ok: true });
}
