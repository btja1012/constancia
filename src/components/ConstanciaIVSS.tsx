import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PW = 612;
const PH = 792;

const s = StyleSheet.create({
  page: {
    paddingTop: 0, paddingBottom: 0, paddingHorizontal: 0,
    fontSize: 10.5, fontFamily: "Helvetica", lineHeight: 1.55,
    color: "#111", backgroundColor: "#ffffff",
  },
  bgImg: {
    position: "absolute", top: 0, left: 0,
    width: PW, height: PH,
  },
  overlay: {
    position: "absolute", top: 0, left: 0,
    width: PW, height: PH,
    paddingTop: 97, paddingHorizontal: 48,
  },
  titulo: {
    textAlign: "center", fontSize: 13, fontFamily: "Helvetica-Bold",
    textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8,
  },
  body: { textAlign: "justify", marginBottom: 7, fontSize: 10.5 },
  bold: { fontFamily: "Helvetica-Bold" },
  nota: { textAlign: "justify", marginBottom: 7, fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  tabla: { borderWidth: 0.5, borderColor: "#bbb", marginBottom: 7 },
  fila: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#ddd" },
  filaLast: { flexDirection: "row" },
  celLabel: { fontFamily: "Helvetica-Bold", width: 155, fontSize: 10, padding: 4, borderRightWidth: 0.5, borderRightColor: "#ddd", backgroundColor: "#f5f5f5" },
  celValue: { flex: 1, fontSize: 10, padding: 4 },
  firmaAtente: { fontSize: 10.5, textAlign: "center", marginBottom: 36, marginTop: 10 },
  firmaNombre: { fontSize: 10.5, fontFamily: "Helvetica-Bold", textAlign: "center" },
  firmaInfo:   { fontSize: 10.5, textAlign: "center" },
  firmaSello:  { fontSize: 10.5, fontFamily: "Helvetica-Bold", textAlign: "center", marginTop: 4 },
  footerBox: { position: "absolute", bottom: 52, left: 0, width: PW },
  footerTxt: { fontSize: 7.5, fontFamily: "Helvetica-Oblique", textAlign: "center", color: "#222", lineHeight: 1.5 },
  footerTxtBold: { fontSize: 7.5, fontFamily: "Helvetica-BoldOblique", textAlign: "center", color: "#222", lineHeight: 1.5 },
});

interface Props {
  nombre: string; cedula: string; cargo: string; fechaIngreso: string;
  ubicacion: string; directorNombre: string; directorCargo: string;
  tramite: string; hoy: string; baseUrl: string; ciudad?: string;
}

export default function ConstanciaIVSS({
  nombre, cedula, cargo, fechaIngreso, ubicacion,
  directorNombre, directorCargo, tramite, hoy, baseUrl, ciudad = "Tovar",
}: Props) {
  const partes = hoy.split(" ");
  const dia = partes[0], mes = partes[2], anio = partes[4];
  const filas = [
    ["Nombre y Apellido",   nombre],
    ["Cédula de Identidad", `V-${cedula}`],
    ["Cargo",               cargo],
    ["Dependencia",         ubicacion],
    ["Fecha de Ingreso",    fechaIngreso],
    ["Motivo del Trámite",  tramite],
  ];

  return (
    <Document>
      <Page size="LETTER" style={s.page}>

        {/* 1 — Fondo */}
        <Image src={`${baseUrl}/logos/template.png`} style={s.bgImg} />

        {/* 2 — Contenido encima */}
        <View style={s.overlay}>
          <Text style={s.titulo}>Constancia de Trabajo{"\n"}(Para Trámites ante el IVSS)</Text>

          <Text style={s.body}>
            {"        "}Quien suscribe, <Text style={s.bold}>{directorNombre}</Text>, en calidad de <Text style={s.bold}>{directorCargo}</Text>, hace constar que el(la) ciudadano(a) identificado(a) a continuación se encuentra activo(a) en nómina institucional, a los fines de trámites ante el <Text style={s.bold}>Instituto Venezolano de los Seguros Sociales (IVSS)</Text>:
          </Text>

          <View style={s.tabla}>
            {filas.map(([label, value], i) => (
              <View key={label} style={i === filas.length - 1 ? s.filaLast : s.fila}>
                <Text style={s.celLabel}>{label}</Text>
                <Text style={s.celValue}>{value}</Text>
              </View>
            ))}
          </View>

          <Text style={s.nota}>
            {"        "}Nota: Percibe mensualmente los beneficios sin carácter salarial denominados cesta ticket socialista y bono de guerra económica, conforme los montos y condiciones establecidos en el Decreto que establece el aumento del Ingreso Mínimo mensual para la protección del Pueblo Venezolano.
          </Text>

          <Text style={s.body}>
            {"        "}Constancia que se expide a petición de la parte interesada, conforme a lo establecido en la normativa vigente del Seguro Social Obligatorio, en {ciudad}, a los <Text style={s.bold}>{dia}</Text> días del mes de <Text style={s.bold}>{mes}</Text> del año <Text style={s.bold}>{anio}</Text>.
          </Text>

          <Text style={s.firmaAtente}>Atentamente:</Text>
          <Text style={s.firmaNombre}>{directorNombre}</Text>
          <Text style={s.firmaInfo}>{directorCargo}</Text>
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
