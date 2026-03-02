import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCookie, COOKIE_NAME } from "@/lib/adminAuth";
import sql from "@/lib/db";

async function auth(req: NextRequest) {
  return verifyAdminCookie(req.cookies.get(COOKIE_NAME)?.value);
}

export async function GET(req: NextRequest) {
  if (!await auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const rows = await sql`SELECT * FROM configuracion LIMIT 1`;
  return NextResponse.json(rows[0] ?? {});
}

export async function PUT(req: NextRequest) {
  if (!await auth(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const b = await req.json();
  const {
    director_nombre, director_cargo, director_cedula, director_credencial,
    institucion, institucion_ubicacion,
    codigo_administrativo, codigo_plantel, codigo_estadistico,
  } = b;

  const existing = await sql`SELECT id FROM configuracion LIMIT 1`;

  if (existing.length === 0) {
    await sql`
      INSERT INTO configuracion
        (director_nombre, director_cargo, director_cedula, director_credencial,
         institucion, institucion_ubicacion,
         codigo_administrativo, codigo_plantel, codigo_estadistico)
      VALUES
        (${director_nombre}, ${director_cargo}, ${director_cedula}, ${director_credencial},
         ${institucion}, ${institucion_ubicacion},
         ${codigo_administrativo}, ${codigo_plantel}, ${codigo_estadistico})
    `;
  } else {
    await sql`
      UPDATE configuracion SET
        director_nombre       = ${director_nombre},
        director_cargo        = ${director_cargo},
        director_cedula       = ${director_cedula},
        director_credencial   = ${director_credencial},
        institucion           = ${institucion},
        institucion_ubicacion = ${institucion_ubicacion},
        codigo_administrativo = ${codigo_administrativo},
        codigo_plantel        = ${codigo_plantel},
        codigo_estadistico    = ${codigo_estadistico}
      WHERE id = ${existing[0].id}
    `;
  }
  return NextResponse.json({ ok: true });
}
