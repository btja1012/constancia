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
  cargo: string;
  tipoPersonal: string;
  codigoRac: string;
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
}

export default function ConstanciaDoc({
  nombre, cedula, cargo, tipoPersonal, codigoRac,
  codigoDependencia, fechaIngreso, horasAcademicas,
  diaPalabra, mesPalabra, anio, tramite, baseUrl,
  directorNombre = "LCDA. MAYELA COROMOTO MÁRQUEZ ALARCÓN",
  directorCargo = "Directora (E)",
  directorCedula = "8.707.544",
  directorCredencial = "16/09/2024",
  institucionNombre = 'Escuela "María Yolanda Pernía"',
  institucionUbicacion = "Urb. San José Parroquia El Llano del Municipio Tovar del estado Bolivariano de Mérida",
}: Props) {
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
            <Text style={s.bold}>SEGÚN CREDENCIAL DE FECHA: {directorCredencial}</Text>, Directora Encargada de la {institucionNombre}, con sede en la {institucionUbicacion} del Ministerio del Poder Popular para la Educación.
          </Text>

          <Text style={s.haceConstar}>HACE CONSTAR QUE:</Text>

          <Text style={s.p}>
            {"        "}Que el (la) ciudadano (a):{" "}
            <Text style={s.bold}>{nombre.toUpperCase()}</Text>, portador (a) de la cédula de identidad{" "}
            <Text style={s.bold}>N° {cedula}</Text>, Cargo:{" "}
            <Text style={s.bold}>{tipoPersonal}</Text> Código:{" "}
            <Text style={s.bold}>{codigoRac}</Text>, Código de Dependencia{" "}
            <Text style={s.bold}>{codigoDependencia}</Text>, Ingreso al Ministerio del Poder Popular para la Educación el:{" "}
            <Text style={s.bold}>{fechaIngreso}</Text>, con una Carga Horaria de:{" "}
            <Text style={s.bold}>{horasAcademicas} Horas</Text>, cumpliendo Funciones en esta Institución como:{" "}
            <Text style={s.bold}>{cargo.toUpperCase()}</Text>. La misma se encuentra: <Text style={s.bold}>ACTIVA</Text>.
          </Text>

          <Text style={s.p}>
            {"        "}Constancia que se expide para Trámites:{" "}
            <Text style={s.bold}>{tramite.toUpperCase()}</Text>, en Tovar a los{" "}
            <Text style={s.boldUnder}>{diaPalabra}</Text> del mes de{" "}
            <Text style={s.boldUnder}>{mesPalabra}</Text> de{" "}
            <Text style={s.boldUnder}>{anio}.</Text>
          </Text>

          <Text style={s.firmaNombre}>{directorNombre}</Text>
          <Text style={s.firmaInfo}>{directorCargo}</Text>
          <Text style={s.firmaInfo}>Según credencial, De fecha {directorCredencial}.</Text>
          <Text style={s.firmaInfo}>EMYP/AMSDE/mgc.</Text>
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
