"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: {
    paddingTop: 0, paddingBottom: 0, paddingHorizontal: 0,
    fontSize: 10.5, fontFamily: "Helvetica", lineHeight: 1.55,
    color: "#111", backgroundColor: "#ffffff",
  },
  imgBox: { width: 612, backgroundColor: "#ffffff" },
  headerImg: { width: 612, height: 87,  backgroundColor: "#ffffff" },
  firmaImg:  { width: 612, height: 160, backgroundColor: "#ffffff" },
  footerImg: { width: 612, height: 169, backgroundColor: "#ffffff" },

  content: { paddingHorizontal: 48, paddingTop: 16 },
  titulo: {
    textAlign: "center", fontSize: 13, fontFamily: "Helvetica-Bold",
    textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 14,
  },
  body: { textAlign: "justify", marginBottom: 10, fontSize: 10.5 },
  bold: { fontFamily: "Helvetica-Bold" },
  nota: { textAlign: "justify", marginBottom: 10, fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  tabla: { borderWidth: 0.5, borderColor: "#bbb", marginBottom: 10 },
  fila: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#ddd" },
  filaLast: { flexDirection: "row" },
  celLabel: { fontFamily: "Helvetica-Bold", width: 155, fontSize: 10, padding: 5, borderRightWidth: 0.5, borderRightColor: "#ddd", backgroundColor: "#f5f5f5" },
  celValue: { flex: 1, fontSize: 10, padding: 5 },
  aviso: { fontSize: 8, fontFamily: "Helvetica-Oblique", textAlign: "center", color: "#666", marginTop: 4 },
});

interface Props {
  nombre: string; cedula: string; cargo: string; fechaIngreso: string;
  ubicacion: string; directorNombre: string; directorCargo: string;
  entidadBancaria: string; tramite: string; hoy: string; baseUrl: string; ciudad?: string;
}

export default function ConstanciaBanco({
  nombre, cedula, cargo, fechaIngreso, ubicacion,
  directorCargo, entidadBancaria, tramite, hoy, baseUrl, ciudad = "Tovar",
}: Props) {
  const partes = hoy.split(" ");
  const dia = partes[0], mes = partes[2], anio = partes[4];
  const filas = [
    ["Nombre completo",     nombre],
    ["Cédula de Identidad", `V-${cedula}`],
    ["Cargo",               cargo],
    ["Dependencia",         ubicacion],
    ["Fecha de Ingreso",    fechaIngreso],
    ["Tipo de contrato",    "Personal Fijo de Nómina"],
    ["Motivo",              tramite],
  ];

  return (
    <Document>
      <Page size="LETTER" style={s.page}>

        <View style={s.imgBox}>
          <Image src={`${baseUrl}/logos/header.png`} style={s.headerImg} />
        </View>

        <View style={s.content}>
          <Text style={s.titulo}>Constancia de Trabajo{"\n"}(Para Entidad Bancaria)</Text>

          <Text style={s.body}>
            Señores{"\n"}
            <Text style={s.bold}>{entidadBancaria || "Entidad Bancaria"}</Text>{"\n"}
            Presente.
          </Text>

          <Text style={s.body}>
            {"        "}Quien suscribe, <Text style={s.bold}>{directorCargo}</Text>, se dirige a ustedes en la oportunidad de hacer constar que el(la) ciudadano(a) <Text style={s.bold}>{nombre}</Text>, titular de la Cédula de Identidad Número: <Text style={s.bold}>V-{cedula}</Text>, labora en esta institución con los siguientes datos:
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
            {"        "}Constancia que se expide a petición de la parte interesada en {ciudad}, a los <Text style={s.bold}>{dia}</Text> días del mes de <Text style={s.bold}>{mes}</Text> del año <Text style={s.bold}>{anio}</Text>.
          </Text>

          <Text style={s.aviso}>Este documento requiere sello húmedo de la institución para su validez.</Text>
        </View>

        <View style={s.imgBox}>
          <Image src={`${baseUrl}/logos/firma.png`} style={s.firmaImg} />
        </View>

        <View style={s.imgBox}>
          <Image src={`${baseUrl}/logos/footer-wave.png`} style={s.footerImg} />
        </View>

      </Page>
    </Document>
  );
}
