"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: { paddingTop: 0, paddingBottom: 0, paddingHorizontal: 0, fontSize: 10.5, fontFamily: "Helvetica", lineHeight: 1.55, color: "#111", backgroundColor: "#fff" },
  imgWrapper: { width: "100%", backgroundColor: "#ffffff" },
  headerImg: { width: "100%", height: 72, objectFit: "fill", backgroundColor: "#ffffff" },
  content: { paddingHorizontal: 50, paddingTop: 22, paddingBottom: 10, flexGrow: 1 },
  titulo: { textAlign: "center", fontSize: 13, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 18, marginTop: 4 },
  body: { textAlign: "justify", marginBottom: 10, fontSize: 10.5 },
  bold: { fontFamily: "Helvetica-Bold" },
  nota: { textAlign: "justify", marginBottom: 10, fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  // Tabla de datos
  tabla: { borderWidth: 0.5, borderColor: "#bbb", marginBottom: 12 },
  fila: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#ddd" },
  filaLast: { flexDirection: "row" },
  celLabel: { fontFamily: "Helvetica-Bold", width: 160, fontSize: 10, padding: 5, borderRightWidth: 0.5, borderRightColor: "#ddd", backgroundColor: "#f5f5f5" },
  celValue: { flex: 1, fontSize: 10, padding: 5 },
  signSection: { marginTop: 36, paddingHorizontal: 50 },
  signLabel: { fontSize: 10.5, marginBottom: 28 },
  signName: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  signTitle: { fontSize: 10, color: "#333" },
  validacion: { fontSize: 7.5, color: "#555", textAlign: "center", marginTop: 8, paddingHorizontal: 50, lineHeight: 1.4 },
  noSello: { fontFamily: "Helvetica-Bold", fontSize: 7.5, textAlign: "center", color: "#333" },
  validaHasta: { fontSize: 7.5, textAlign: "center", color: "#333" },
  footerImg: { width: "100%", height: 80, objectFit: "fill", backgroundColor: "#ffffff" },
});

interface Props {
  nombre: string; cedula: string; cargo: string; fechaIngreso: string;
  ubicacion: string; directorNombre: string; directorCargo: string;
  tramite: string; hoy: string; baseUrl: string; ciudad?: string;
}

export default function ConstanciaIVSS({ nombre, cedula, cargo, fechaIngreso, ubicacion, directorNombre, directorCargo, tramite, hoy, baseUrl, ciudad = "Tovar" }: Props) {
  const headerUrl = `${baseUrl}/logos/header.jpeg`;
  const footerUrl = `${baseUrl}/logos/footer-wave.jpeg`;
  const partes = hoy.split(" ");
  const diaNum = partes[0]; const mesNom = partes[2]; const anio = partes[4];

  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.imgWrapper}>
          <Image src={headerUrl} style={s.headerImg} />
        </View>
        <View style={s.content}>
          <Text style={s.titulo}>Constancia de Trabajo{"\n"}(Para Trámites ante el IVSS)</Text>

          <Text style={s.body}>
            {"        "}Quien suscribe, <Text style={s.bold}>{directorCargo}</Text>, hace constar que el(la) ciudadano(a) identificado(a) a continuación se encuentra activo(a) en nómina institucional, a los fines de trámites ante el <Text style={s.bold}>Instituto Venezolano de los Seguros Sociales (IVSS)</Text>:
          </Text>

          {/* Tabla de datos */}
          <View style={s.tabla}>
            {[
              ["Nombre y Apellido",  nombre],
              ["Cédula de Identidad", `V-${cedula}`],
              ["Cargo",              cargo],
              ["Dependencia",        ubicacion],
              ["Fecha de Ingreso",   fechaIngreso],
              ["Motivo del Trámite", tramite],
            ].map(([label, value], i, arr) => (
              <View key={label} style={i === arr.length - 1 ? s.filaLast : s.fila}>
                <Text style={s.celLabel}>{label}</Text>
                <Text style={s.celValue}>{value}</Text>
              </View>
            ))}
          </View>

          <Text style={s.nota}>
            {"        "}Nota: Percibe mensualmente los beneficios sin carácter salarial denominados cesta ticket socialista y bono de guerra económica, conforme los montos y condiciones establecidos en el Decreto que establece el aumento del Ingreso Mínimo mensual para la protección del Pueblo Venezolano.
          </Text>

          <Text style={s.body}>
            {"        "}Constancia que se expide a petición de la parte interesada, conforme a lo establecido en la normativa vigente del Seguro Social Obligatorio, en {ciudad}, a los <Text style={s.bold}>{diaNum}</Text> días del mes de <Text style={s.bold}>{mesNom}</Text> del año <Text style={s.bold}>{anio}</Text>.
          </Text>
        </View>

        <View style={s.signSection}>
          <Text style={s.signLabel}>Atentamente,</Text>
          <View style={{ height: 40 }} />
          <Text style={s.signName}>{directorNombre}</Text>
          <Text style={s.signTitle}>{directorCargo}</Text>
        </View>
        <View style={{ marginTop: 18, paddingHorizontal: 50 }}>
          <Text style={s.validacion}>Los datos reflejados están sujetos a confirmación a través del portal del Ministerio del Poder Popular para la Educación.</Text>
          <Text style={s.noSello}>No requiere sello húmedo</Text>
          <Text style={s.validaHasta}>Válida hasta: {anio}-12-31</Text>
        </View>
        <View style={{ marginTop: 20, width: "100%", backgroundColor: "#ffffff" }}>
          <Image src={footerUrl} style={s.footerImg} />
        </View>
      </Page>
    </Document>
  );
}
