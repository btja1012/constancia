"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Dimensiones calculadas al aspect-ratio exacto de cada imagen (page width = 612pt)
// header.jpeg:    1122×134  → 73pt
// firma.jpeg:     1280×512  → 245pt
// footer-wave.jpeg: 1241×342 → 169pt

const s = StyleSheet.create({
  page: {
    paddingTop: 0, paddingBottom: 0, paddingHorizontal: 0,
    fontSize: 10.5, fontFamily: "Helvetica", lineHeight: 1.55,
    color: "#111", backgroundColor: "#ffffff",
  },
  // Contenedor imagen — fondo blanco garantizado, sin padding
  imgBox: { width: "100%", backgroundColor: "#ffffff" },
  headerImg:    { width: "100%", height: 73,  objectFit: "fill" },
  firmaImg:     { width: "100%", height: 245, objectFit: "fill" },
  footerImg:    { width: "100%", height: 169, objectFit: "fill" },

  content: { paddingHorizontal: 48, paddingTop: 16, paddingBottom: 0 },
  titulo: {
    textAlign: "center", fontSize: 13, fontFamily: "Helvetica-Bold",
    textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14,
  },
  body: { textAlign: "justify", marginBottom: 10, fontSize: 10.5 },
  bold: { fontFamily: "Helvetica-Bold" },
  nota: { textAlign: "justify", marginBottom: 10, fontSize: 10.5, fontFamily: "Helvetica-Bold" },
});

interface Props {
  nombre: string; cedula: string; cargo: string; fechaIngreso: string;
  ubicacion: string; directorNombre: string; directorCargo: string;
  tramite: string; hoy: string; baseUrl: string; ciudad?: string;
}

export default function ConstanciaZonaEducativa({
  nombre, cedula, cargo, fechaIngreso, ubicacion,
  directorNombre, directorCargo, tramite, hoy, baseUrl, ciudad = "Tovar",
}: Props) {
  const partes = hoy.split(" ");
  const dia = partes[0], mes = partes[2], anio = partes[4];

  return (
    <Document>
      <Page size="LETTER" style={s.page}>

        {/* ── HEADER ── */}
        <View style={s.imgBox}>
          <Image src={`${baseUrl}/logos/header.jpeg`} style={s.headerImg} />
        </View>

        {/* ── CUERPO ── */}
        <View style={s.content}>
          <Text style={s.titulo}>Constancia de Trabajo</Text>

          <Text style={s.body}>
            {"        "}Quien suscribe, <Text style={s.bold}>{directorCargo}</Text>, hace constar que el(la) ciudadano(a):{" "}
            <Text style={s.bold}>{nombre}</Text>, titular de la Cédula de Identidad Número:{" "}
            <Text style={s.bold}>V-{cedula}</Text>, actualmente se desempeña como:{" "}
            <Text style={s.bold}>{cargo}</Text>, adscrito(a) a la dependencia:{" "}
            <Text style={s.bold}>{ubicacion}</Text>, con fecha de Ingreso:{" "}
            <Text style={s.bold}>{fechaIngreso}</Text>.
          </Text>

          <Text style={s.nota}>
            {"        "}Nota: Percibe mensualmente los beneficios sin carácter salarial denominados cesta ticket socialista y bono de guerra económica, conforme los montos y condiciones establecidos en el Decreto que establece el aumento del Ingreso Mínimo mensual para la protección del Pueblo Venezolano.
          </Text>

          <Text style={s.body}>
            {"        "}Constancia que se expide a petición de la parte interesada para{" "}
            <Text style={s.bold}>{tramite}</Text>, en {ciudad}, a los{" "}
            <Text style={s.bold}>{dia}</Text> días del mes de{" "}
            <Text style={s.bold}>{mes}</Text> del año <Text style={s.bold}>{anio}</Text>.
          </Text>
        </View>

        {/* ── FIRMA ── */}
        <View style={s.imgBox}>
          <Image src={`${baseUrl}/logos/firma.jpeg`} style={s.firmaImg} />
        </View>

        {/* ── FOOTER OLAS ── */}
        <View style={s.imgBox}>
          <Image src={`${baseUrl}/logos/footer-wave.jpeg`} style={s.footerImg} />
        </View>

      </Page>
    </Document>
  );
}
