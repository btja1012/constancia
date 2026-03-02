import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// LETTER = 612 × 792 pt. Heights = (imgH / imgW) × 612
// header.png:       1122×159 → 87pt
// footer-wave.png:  1241×342 → 169pt

const PW = 612; // page width in pt

const s = StyleSheet.create({
  page: {
    paddingTop: 0, paddingBottom: 0, paddingHorizontal: 0,
    fontSize: 11, fontFamily: "Helvetica", lineHeight: 1.6,
    color: "#000", backgroundColor: "#ffffff",
  },
  imgBox: { width: PW, backgroundColor: "#ffffff" },
  headerImg: { width: PW, height: 87,  backgroundColor: "#ffffff" },
  footerImg: { width: PW, height: 169, backgroundColor: "#ffffff" },

  body: { paddingHorizontal: 52, paddingTop: 18 },

  // Título
  titulo: {
    textAlign: "center", fontSize: 13, fontFamily: "Helvetica-Bold",
    textDecoration: "underline", textTransform: "uppercase",
    letterSpacing: 0.5, marginBottom: 14,
  },
  // Párrafos
  p: { textAlign: "justify", marginBottom: 10, fontSize: 11 },
  bold: { fontFamily: "Helvetica-Bold" },
  boldUnder: { fontFamily: "Helvetica-Bold", textDecoration: "underline" },
  // "HACE CONSTAR"
  haceConstar: {
    textAlign: "center", fontSize: 11, fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  // Firma como texto
  firmaBox: { paddingHorizontal: 52, paddingTop: 10, paddingBottom: 10 },
  firmaAtente: { fontSize: 11, textAlign: "center", marginBottom: 36 },
  firmaNombre: { fontSize: 11, fontFamily: "Helvetica-Bold", textAlign: "center" },
  firmaInfo:   { fontSize: 11, textAlign: "center" },
  firmaSello:  { fontSize: 11, fontFamily: "Helvetica-Bold", textAlign: "center", marginTop: 4 },
});

interface Props {
  // Empleado
  nombre: string;
  cedula: string;
  tipoPersonal: string;
  codigoRac: string;
  ubicacion: string;
  codigoDependencia: string;
  fechaIngreso: string;     // "DD/MM/YYYY"
  horasAcademicas: number;
  // Fecha constancia en letras
  diaPalabra: string;       // "ONCE"
  mesPalabra: string;       // "DICIEMBRE"
  anio: string;             // "2025"
  // Tramite
  tramite: string;
  // Imágenes
  baseUrl: string;
  // Config — director e institución (con fallbacks si no están en DB)
  directorNombre?: string;
  directorCargo?: string;
  directorCedula?: string;
  directorCredencial?: string;
  institucionNombre?: string;
  institucionUbicacion?: string;
  codigoAdministrativo?: string;
  codigoPlantel?: string;
  codigoEstadistico?: string;
}

function infoHoras(tipoPersonal: string, horas: number): { label: string; texto: string } {
  const esDocente = /^DOC|TSU/i.test(tipoPersonal.trim());
  const label = esDocente ? "académicas" : "administrativas";
  if (horas > 0) {
    return { label, texto: `cumpliendo una carga horaria de ${horas} horas ${label}` };
  }
  return { label, texto: `cumpliendo horario ${label}` };
}

export default function ConstanciaDoc({
  nombre, cedula, tipoPersonal, codigoRac,
  ubicacion, codigoDependencia, fechaIngreso, horasAcademicas,
  diaPalabra, mesPalabra, anio, tramite, baseUrl,
  directorNombre = "LCDA. MAYELA COROMOTO MÁRQUEZ ALARCÓN",
  directorCargo = "Directora (E)",
  directorCedula = "8.707.544",
  directorCredencial = "16/09/2024",
  institucionNombre = 'Escuela "María Yolanda Pernía"',
  institucionUbicacion = "Urb. San José Parroquia El Llano Tovar Estado Mérida",
  codigoAdministrativo = "006561453",
  codigoPlantel = "S2959D1421",
  codigoEstadistico = "140917",
}: Props) {
  const { texto: textoHoras } = infoHoras(tipoPersonal, horasAcademicas);
  return (
    <Document>
      <Page size="LETTER" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.imgBox}>
          <Image src={`${baseUrl}/logos/header.png`} style={s.headerImg} />
        </View>

        {/* ── CUERPO ── */}
        <View style={s.body}>
          <Text style={s.titulo}>Constancia de Prestación de Servicio</Text>

          {/* Párrafo 1 — director */}
          <Text style={s.p}>
            {"        "}Quien suscribe, <Text style={s.bold}>{directorNombre}</Text>, portadora de la Cédula de Identidad{" "}
            <Text style={s.bold}>N° V- {directorCedula}</Text>, {directorCargo}{" "}
            <Text style={s.bold}>SEGÚN CREDENCIAL DE FECHA: {directorCredencial}</Text>, Directora Encargada de la {institucionNombre}, con sede en la {institucionUbicacion}. Código Administrativo:{" "}
            <Text style={s.boldUnder}>{codigoAdministrativo}</Text>, Código Plantel:{" "}
            <Text style={s.boldUnder}>{codigoPlantel}</Text>, Código Estadístico{" "}
            <Text style={s.boldUnder}>{codigoEstadistico}</Text>.
          </Text>

          <Text style={s.haceConstar}>HACE CONSTAR</Text>

          {/* Párrafo 2 — empleado (dinámico) */}
          <Text style={s.p}>
            {"        "}Que el (la) ciudadano (a):{" "}
            <Text style={s.bold}>{nombre.toUpperCase()}</Text>, titular de la Cédula de Identidad Número:{" "}
            <Text style={s.bold}>V- {cedula}</Text>, actualmente se desempeña como:{" "}
            <Text style={s.bold}>{tipoPersonal}</Text>,{" "}
            <Text style={s.bold}>Código Número: {codigoRac}</Text>, adscrito(a) a la dependencia:{" "}
            <Text style={s.bold}>{ubicacion}</Text>,{" "}
            <Text style={s.bold}>Código Número: {codigoDependencia || codigoAdministrativo}</Text>, con fecha de Ingreso:{" "}
            <Text style={s.bold}>{fechaIngreso}</Text>, hasta la presente fecha,{" "}
            <Text style={s.bold}>{textoHoras}</Text>. Constancia emitida para {tramite}.
          </Text>

          {/* Fecha en letras */}
          <Text style={s.p}>
            {"        "}En <Text style={s.boldUnder}>TOVAR</Text> a los{" "}
            <Text style={s.boldUnder}>{diaPalabra}</Text> días del mes de{" "}
            <Text style={s.boldUnder}>{mesPalabra}</Text> de{" "}
            <Text style={s.boldUnder}>{anio}.</Text>
          </Text>
        </View>

        {/* ── FIRMA (texto) ── */}
        <View style={s.firmaBox}>
          <Text style={s.firmaAtente}>Atentamente:</Text>
          <Text style={s.firmaNombre}>{directorNombre}</Text>
          <Text style={s.firmaInfo}>{directorCargo} de la {institucionNombre}</Text>
          <Text style={s.firmaInfo}>Según credencial, emitida por la DZE.</Text>
          <Text style={s.firmaInfo}>De fecha {directorCredencial}.EMYP/AMSDE/mgc.</Text>
          <Text style={s.firmaSello}>SELLO</Text>
        </View>

        {/* ── FOOTER OLAS ── */}
        <View style={s.imgBox}>
          <Image src={`${baseUrl}/logos/footer-wave.png`} style={s.footerImg} />
        </View>

      </Page>
    </Document>
  );
}
