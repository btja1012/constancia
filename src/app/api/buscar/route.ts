import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const { cedula, nacimiento } = await req.json();

  if (!cedula || !nacimiento) {
    return NextResponse.json({ error: "Cédula y fecha de nacimiento son requeridos" }, { status: 400 });
  }

  const empleados = await sql`
    SELECT nombre, cedula, cargo, fecha_ingreso, ubicacion
    FROM empleados
    WHERE cedula = ${cedula}
    AND nacimiento = ${nacimiento}
  `;

  if (empleados.length === 0) {
    return NextResponse.json({ error: "Datos no coinciden. Verifique la cédula y fecha de nacimiento." }, { status: 404 });
  }

  const config = await sql`SELECT * FROM configuracion LIMIT 1`;

  return NextResponse.json({
    empleado: empleados[0],
    config: config[0],
  });
}
