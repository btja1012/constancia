"use client";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: { paddingTop: 55, paddingBottom: 55, paddingHorizontal: 65, fontSize: 11, fontFamily: "Helvetica", lineHeight: 1.65, color: "#111" },
  header: { textAlign: "center", marginBottom: 6 },
  rep: { fontSize: 8, letterSpacing: 0.5, color: "#555", textTransform: "uppercase", textAlign: "center", marginBottom: 4 },
  inst: { fontSize: 13, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.4 },
  dep: { fontSize: 10, marginTop: 2, color: "#333" },
  divider: { borderBottomWidth: 2, borderBottomColor: "#006633", marginVertical: 10 },
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
  sello: { fontSize: 8, color: "#999", textAlign: "center", marginTop: 30, letterSpacing: 0.3 },
});

interface Props {
  nombre: string; cedula: string; cargo: string; fechaIngreso: string;
  ubicacion: string; directorNombre: string; directorCargo: string;
  tramite: string; hoy: string;
}

export default function ConstanciaIVSS({ nombre, cedula, cargo, fechaIngreso, ubicacion, directorNombre, directorCargo, tramite, hoy }: Props) {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          <Text style={s.rep}>República Bolivariana de Venezuela</Text>
          <Text style={s.rep}>Instituto Venezolano de los Seguros Sociales</Text>
          <Text style={s.inst}>IVSS — Mérida</Text>
          <Text style={s.dep}>Departamento de Asegurado</Text>
        </View>
        <View style={s.divider} />
        <Text style={s.titulo}>Constancia de Trabajo para el IVSS</Text>
        <Text style={s.fecha}>Mérida, {hoy}</Text>
        <Text style={s.body}>
          Por medio de la presente, el suscrito <Text style={s.bold}>{directorNombre}</Text>, en su carácter de <Text style={s.bold}>{directorCargo}</Text>, hace constar que el/la ciudadano(a) identificado(a) a continuación se encuentra activo(a) en nómina institucional a los fines de trámites ante el <Text style={s.bold}>Instituto Venezolano de los Seguros Sociales (IVSS)</Text>:
        </Text>

        <View style={{ borderWidth: 0.5, borderColor: "#aaa", borderRadius: 4, padding: 12, marginBottom: 16 }}>
          <View style={s.dataRow}><Text style={s.dataLabel}>Nombre y Apellido:</Text><Text style={s.dataValue}>{nombre}</Text></View>
          <View style={s.dataRow}><Text style={s.dataLabel}>Cédula de Identidad:</Text><Text style={s.dataValue}>{cedula}</Text></View>
          <View style={s.dataRow}><Text style={s.dataLabel}>Cargo:</Text><Text style={s.dataValue}>{cargo}</Text></View>
          <View style={s.dataRow}><Text style={s.dataLabel}>Institución:</Text><Text style={s.dataValue}>{ubicacion}</Text></View>
          <View style={s.dataRow}><Text style={s.dataLabel}>Fecha de Ingreso:</Text><Text style={s.dataValue}>{fechaIngreso}</Text></View>
          <View style={s.dataRow}><Text style={s.dataLabel}>Motivo del Trámite:</Text><Text style={s.dataValue}>{tramite}</Text></View>
        </View>

        <Text style={s.body}>
          La presente constancia se expide a solicitud de parte interesada, conforme a lo establecido en la normativa vigente del Seguro Social Obligatorio.
        </Text>
        <View style={s.thinLine} />
        <Text style={s.body}>Sin más a que hacer referencia. Atentamente,</Text>
        <View style={s.signArea}>
          <View style={s.signLine} />
          <Text style={s.signName}>{directorNombre}</Text>
          <Text style={s.signTitle}>{directorCargo}</Text>
        </View>
        <Text style={s.sello}>Documento generado electrónicamente — {hoy}</Text>
      </Page>
    </Document>
  );
}
