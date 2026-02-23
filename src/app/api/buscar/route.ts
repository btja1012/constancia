import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const { cedula, nacimiento } = await req.json();

  if (!cedula || !nacimiento) {
    return NextResponse.json(
      { error: "Cédula y fecha de nacimiento son requeridos" },
      { status: 400 }
    );
  }

  // Cast explícito a date para evitar problemas de zona horaria con el driver HTTP de Neon
  const empleados = await sql`
    SELECT
      nombre,
      cedula,
      cargo,
      TO_CHAR(fecha_ingreso, 'YYYY-MM-DD') AS fecha_ingreso,
      ubicacion
    FROM empleados
    WHERE cedula = ${cedula.trim()}
    AND nacimiento::date = ${nacimiento}::date
  `;

  if (empleados.length === 0) {
    return NextResponse.json(
      { error: "Datos no coinciden. Verifica la cédula y fecha de nacimiento." },
      { status: 404 }
    );
  }

  const config = await sql`SELECT * FROM configuracion LIMIT 1`;

  return NextResponse.json({
    empleado: empleados[0],
    config: config[0],
  });
}
