"use client";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: { paddingTop: 55, paddingBottom: 55, paddingHorizontal: 65, fontSize: 11, fontFamily: "Helvetica", lineHeight: 1.65, color: "#111" },
  header: { textAlign: "center", marginBottom: 6 },
  rep: { fontSize: 8, letterSpacing: 0.5, color: "#555", textTransform: "uppercase", textAlign: "center", marginBottom: 4 },
  inst: { fontSize: 13, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.4 },
  dep: { fontSize: 10, marginTop: 2, color: "#333" },
  divider: { borderBottomWidth: 2, borderBottomColor: "#8B0000", marginVertical: 10 },
  thinLine: { borderBottomWidth: 0.5, borderBottomColor: "#888", marginBottom: 14 },
  titulo: { textAlign: "center", fontSize: 14, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 22, marginTop: 6 },
  fecha: { textAlign: "right", fontSize: 10, color: "#444", marginBottom: 18 },
  body: { textAlign: "justify", marginBottom: 14, fontSize: 11 },
  bold: { fontFamily: "Helvetica-Bold" },
  dataRow: { flexDirection: "row", marginBottom: 6 },
  dataLabel: { fontFamily: "Helvetica-Bold", width: 160, fontSize: 11 },
  dataValue: { flex: 1, fontSize: 11 },
  signArea: { marginTop: 65, alignItems: "center" },
  signLine: { borderBottomWidth: 1, borderBottomColor: "#111", width: 240, marginBottom: 5 },
  signName: { fontFamily: "Helvetica-Bold", fontSize: 11, textAlign: "center" },
  signTitle: { fontSize: 10, color: "#333", textAlign: "center" },
  note: { fontSize: 9, color: "#666", textAlign: "center", marginTop: 16, fontFamily: "Helvetica-Oblique" },
  sello: { fontSize: 8, color: "#999", textAlign: "center", marginTop: 10, letterSpacing: 0.3 },
});

interface Props {
  nombre: string; cedula: string; cargo: string; fechaIngreso: string;
  ubicacion: string; directorNombre: string; directorCargo: string;
  entidadBancaria: string; tramite: string; hoy: string;
}

export default function ConstanciaBanco({ nombre, cedula, cargo, fechaIngreso, ubicacion, directorNombre, directorCargo, entidadBancaria, tramite, hoy }: Props) {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          <Text style={s.rep}>República Bolivariana de Venezuela</Text>
          <Text style={s.rep}>Ministerio del Poder Popular para la Educación</Text>
          <Text style={s.inst}>Centro de Desarrollo de la Calidad Educativa</Text>
          <Text style={s.dep}>CDCE Tovar — Departamento de Personal</Text>
        </View>
        <View style={s.divider} />
        <Text style={s.titulo}>Constancia de Trabajo — Entidad Bancaria</Text>
        <Text style={s.fecha}>Tovar, {hoy}</Text>

        <Text style={s.body}>
          Señores{"\n"}
          <Text style={s.bold}>{entidadBancaria || "Entidad Bancaria"}</Text>{"\n"}
          Presente.
        </Text>

        <Text style={s.body}>
          Me dirijo a ustedes en la oportunidad de hacer constar que el/la ciudadano(a) <Text style={s.bold}>{nombre}</Text>, titular de la Cédula de Identidad N° <Text style={s.bold}>{cedula}</Text>, labora en esta institución con los siguientes datos:
        </Text>

        <View style={{ borderWidth: 0.5, borderColor: "#aaa", borderRadius: 4, padding: 12, marginBottom: 16 }}>
          <View style={s.dataRow}><Text style={s.dataLabel}>Nombre completo:</Text><Text style={s.dataValue}>{nombre}</Text></View>
          <View style={s.dataRow}><Text style={s.dataLabel}>Cédula de Identidad:</Text><Text style={s.dataValue}>{cedula}</Text></View>
          <View style={s.dataRow}><Text style={s.dataLabel}>Cargo:</Text><Text style={s.dataValue}>{cargo}</Text></View>
          <View style={s.dataRow}><Text style={s.dataLabel}>Institución:</Text><Text style={s.dataValue}>{ubicacion}</Text></View>
          <View style={s.dataRow}><Text style={s.dataLabel}>Fecha de Ingreso:</Text><Text style={s.dataValue}>{fechaIngreso}</Text></View>
          <View style={s.dataRow}><Text style={s.dataLabel}>Tipo de contrato:</Text><Text style={s.dataValue}>Personal Fijo de Nómina</Text></View>
        </View>

        <Text style={s.body}>
          La presente se expide a solicitud de parte interesada a los fines de <Text style={s.bold}>{tramite}</Text>, sin que ello implique ninguna responsabilidad adicional por parte de esta institución.
        </Text>
        <View style={s.thinLine} />
        <Text style={s.body}>Atentamente,</Text>
        <View style={s.signArea}>
          <View style={s.signLine} />
          <Text style={s.signName}>{directorNombre}</Text>
          <Text style={s.signTitle}>{directorCargo}</Text>
          <Text style={s.signTitle}>CDCE Tovar</Text>
        </View>
        <Text style={s.note}>Este documento es válido únicamente con sello húmedo de la institución.</Text>
        <Text style={s.sello}>Generado electrónicamente — {hoy}</Text>
      </Page>
    </Document>
  );
}
