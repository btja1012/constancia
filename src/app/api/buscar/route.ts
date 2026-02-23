import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const { cedula, nacimiento } = await req.json();

  if (!cedula || !nacimiento) {
    return NextResponse.json({ error: "Cédula y fecha de nacimiento son requeridos" }, { status: 400 });
  }

  const empleados = await sql`
    SELECT
      nombre,
      cedula,
      cargo,
      tipo_personal,
      codigo_rac,
      TO_CHAR(fecha_ingreso, 'DD/MM/YYYY') AS fecha_ingreso,
      ubicacion,
      codigo_dependencia,
      horas_academicas
    FROM empleados
    WHERE cedula        = ${cedula.trim()}
    AND   nacimiento::date = ${nacimiento}::date
  `;

  if (empleados.length === 0) {
    return NextResponse.json(
      { error: "Datos no coinciden. Verifica la cédula y fecha de nacimiento." },
      { status: 404 }
    );
  }

  const config = await sql`SELECT * FROM configuracion LIMIT 1`;

  return NextResponse.json({ empleado: empleados[0], config: config[0] });
}
