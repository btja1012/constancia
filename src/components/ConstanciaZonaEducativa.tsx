"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    lineHeight: 1.55,
    color: "#111",
    backgroundColor: "#fff",
  },
  // Header image
  headerImg: { width: "100%", height: 72 },
  // Content area with horizontal padding
  content: { paddingHorizontal: 50, paddingTop: 22, paddingBottom: 10, flexGrow: 1 },
  titulo: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 18,
    marginTop: 4,
  },
  body: { textAlign: "justify", marginBottom: 10, fontSize: 10.5 },
  bold: { fontFamily: "Helvetica-Bold" },
  nota: {
    textAlign: "justify",
    marginBottom: 10,
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
  },
  // Firma
  signSection: { marginTop: 36, paddingHorizontal: 50 },
  signLabel: { fontSize: 10.5, marginBottom: 28 },
  signName: { fontFamily: "Helvetica-Bold", fontSize: 11 },
  signTitle: { fontSize: 10, color: "#333" },
  // Validación pequeña
  validacion: {
    fontSize: 7.5,
    color: "#555",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 50,
    lineHeight: 1.4,
  },
  noSello: { fontFamily: "Helvetica-Bold", fontSize: 7.5, textAlign: "center", color: "#333" },
  validaHasta: { fontSize: 7.5, textAlign: "center", color: "#333" },
  // Footer wave image
  footerImg: { width: "100%", height: 80, marginTop: "auto" },
  footerText: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 7.5,
    color: "#222",
    lineHeight: 1.5,
  },
});

interface Props {
  nombre: string; cedula: string; cargo: string; fechaIngreso: string;
  ubicacion: string; codigoUbicacion?: string;
  directorNombre: string; directorCargo: string;
  tramite: string; hoy: string; baseUrl: string;
  ciudad?: string;
}

export default function ConstanciaZonaEducativa({
  nombre, cedula, cargo, fechaIngreso, ubicacion,
  directorNombre, directorCargo, tramite, hoy, baseUrl, ciudad = "Tovar",
}: Props) {
  const headerUrl = `${baseUrl}/logos/header.jpeg`;
  const footerUrl = `${baseUrl}/logos/footer-wave.jpeg`;

  // Extraer día, mes y año del texto de hoy (ej: "22 de febrero de 2026")
  const partes = hoy.split(" ");
  const diaNum = partes[0];
  const mesNom = partes[2];
  const anio   = partes[4];

  return (
    <Document>
      <Page size="LETTER" style={s.page}>

        {/* Header imagen institucional */}
        <Image src={headerUrl} style={s.headerImg} />

        {/* Cuerpo del documento */}
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
            <Text style={s.bold}>{diaNum}</Text> días del mes de{" "}
            <Text style={s.bold}>{mesNom}</Text> del año <Text style={s.bold}>{anio}</Text>.
          </Text>
        </View>

        {/* Firma */}
        <View style={s.signSection}>
          <Text style={s.signLabel}>Atentamente,</Text>
          <View style={{ height: 40 }} />
          <Text style={s.signName}>{directorNombre}</Text>
          <Text style={s.signTitle}>{directorCargo}</Text>
          <Text style={s.signTitle}>Zona Educativa N° 14 — Estado Mérida</Text>
        </View>

        {/* Info validación */}
        <View style={{ marginTop: 18, paddingHorizontal: 50 }}>
          <Text style={s.validacion}>
            Los datos reflejados están sujetos a confirmación a través del portal del Ministerio del Poder Popular para la Educación.
          </Text>
          <Text style={s.noSello}>No requiere sello húmedo</Text>
          <Text style={s.validaHasta}>Válida hasta: {anio}-12-31</Text>
        </View>

        {/* Footer olas bandera */}
        <View style={{ marginTop: 20, position: "relative" }}>
          <Image src={footerUrl} style={s.footerImg} />
        </View>

      </Page>
    </Document>
  );
}
