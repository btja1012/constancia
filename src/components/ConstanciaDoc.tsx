import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PW = 612;
const PH = 792;

const s = StyleSheet.create({
  page: {
    paddingTop: 0, paddingBottom: 0, paddingHorizontal: 0,
    fontSize: 11, fontFamily: "Helvetica", lineHeight: 1.6,
    color: "#000", backgroundColor: "#ffffff",
  },
  // 1. Fondo — primero en JSX = pintado debajo
  bgImg: {
    position: "absolute", top: 0, left: 0,
    width: PW, height: PH,
  },
  // 2. Contenedor de todo el contenido — segundo en JSX = pintado encima
  overlay: {
    position: "absolute", top: 0, left: 0,
    width: PW, height: PH,
    paddingTop: 97, paddingHorizontal: 52,
  },

  titulo: {
    textAlign: "center", fontSize: 13, fontFamily: "Helvetica-Bold",
    textDecoration: "underline", textTransform: "uppercase",
    letterSpacing: 0.5, marginBottom: 14,
  },
  p: { textAlign: "justify", marginBottom: 10, fontSize: 11 },
  bold: { fontFamily: "Helvetica-Bold" },
  boldUnder: { fontFamily: "Helvetica-Bold", textDecoration: "underline" },
  haceConstar: {
    textAlign: "center", fontSize: 11, fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  firmaAtente: { fontSize: 11, textAlign: "center", marginBottom: 36, marginTop: 10 },
  firmaNombre: { fontSize: 11, fontFamily: "Helvetica-Bold", textAlign: "center" },
  firmaInfo:   { fontSize: 11, textAlign: "center" },
  firmaSello:  { fontSize: 11, fontFamily: "Helvetica-Bold", textAlign: "center", marginTop: 4 },
  footerBox: { position: "absolute", bottom: 52, left: 0, width: PW },
  footerTxt: { fontSize: 7.5, fontFamily: "Helvetica-Oblique", textAlign: "center", color: "#222", lineHeight: 1.5 },
  footerTxtBold: { fontSize: 7.5, fontFamily: "Helvetica-BoldOblique", textAlign: "center", color: "#222", lineHeight: 1.5 },
});

interface Props {
  nombre: string;
  cedula: string;
  tipoPersonal: string;
  codigoRac: string;
  ubicacion: string;
  codigoDependencia: string;
  fechaIngreso: string;
  horasAcademicas: number;
  diaPalabra: string;
  mesPalabra: string;
  anio: string;
  tramite: string;
  baseUrl: string;
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

function infoHoras(tipoPersonal: string, horas: number) {
  const esDocente = /^DOC|TSU/i.test(tipoPersonal.trim());
  const label = esDocente ? "académicas" : "administrativas";
  if (horas > 0) return `cumpliendo una carga horaria de ${horas} horas ${label}`;
  return `cumpliendo horario ${label}`;
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
  const textoHoras = infoHoras(tipoPersonal, horasAcademicas);
  return (
    <Document>
      <Page size="LETTER" style={s.page}>

        {/* 1 — Fondo (se pinta primero = detrás) */}
        <Image src={`${baseUrl}/logos/template.png`} style={s.bgImg} />

        {/* 2 — Contenido (se pinta después = encima) */}
        <View style={s.overlay}>
          <Text style={s.titulo}>Constancia de Prestación de Servicio</Text>

          <Text style={s.p}>
            {"        "}Quien suscribe, <Text style={s.bold}>{directorNombre}</Text>, portadora de la Cédula de Identidad{" "}
            <Text style={s.bold}>N° V- {directorCedula}</Text>, {directorCargo}{" "}
            <Text style={s.bold}>SEGÚN CREDENCIAL DE FECHA: {directorCredencial}</Text>, Directora Encargada de la {institucionNombre}, con sede en la {institucionUbicacion}. Código Administrativo:{" "}
            <Text style={s.boldUnder}>{codigoAdministrativo}</Text>, Código Plantel:{" "}
            <Text style={s.boldUnder}>{codigoPlantel}</Text>, Código Estadístico{" "}
            <Text style={s.boldUnder}>{codigoEstadistico}</Text>.
          </Text>

          <Text style={s.haceConstar}>HACE CONSTAR</Text>

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

          <Text style={s.p}>
            {"        "}En <Text style={s.boldUnder}>TOVAR</Text> a los{" "}
            <Text style={s.boldUnder}>{diaPalabra}</Text> días del mes de{" "}
            <Text style={s.boldUnder}>{mesPalabra}</Text> de{" "}
            <Text style={s.boldUnder}>{anio}.</Text>
          </Text>

          <Text style={s.firmaAtente}>Atentamente:</Text>
          <Text style={s.firmaNombre}>{directorNombre}</Text>
          <Text style={s.firmaInfo}>{directorCargo} de la {institucionNombre}</Text>
          <Text style={s.firmaInfo}>Según credencial, emitida por la DZE.</Text>
          <Text style={s.firmaInfo}>De fecha {directorCredencial}.EMYP/AMSDE/mgc.</Text>
          <Text style={s.firmaSello}>SELLO</Text>

          {/* ── FOOTER TEXTO ── */}
          <View style={s.footerBox}>
            <Text style={s.footerTxtBold}>"230 Años de Natalicio del Gran Mariscal de Ayacucho Antonio José de Sucre"</Text>
            <Text style={s.footerTxt}>Escuela Básica "María Yolanda Pernía"  Teléfono 0275-8733459</Text>
            <Text style={s.footerTxt}>Correo: eb.mariayolandapernia@gmail.com</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
