"use client";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const s = StyleSheet.create({
  page: { paddingTop: 55, paddingBottom: 55, paddingHorizontal: 65, fontSize: 11, fontFamily: "Helvetica", lineHeight: 1.65, color: "#111" },
  header: { textAlign: "center", marginBottom: 6 },
  rep: { fontSize: 8, letterSpacing: 0.5, color: "#555", textTransform: "uppercase", textAlign: "center", marginBottom: 4 },
  inst: { fontSize: 13, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.4 },
  dep: { fontSize: 10, marginTop: 2, color: "#333" },
  divider: { borderBottomWidth: 2, borderBottomColor: "#1a4a8a", marginVertical: 10 },
  thinLine: { borderBottomWidth: 0.5, borderBottomColor: "#888", marginBottom: 14 },
  titulo: { textAlign: "center", fontSize: 14, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 22, marginTop: 6 },
  fecha: { textAlign: "right", fontSize: 10, color: "#444", marginBottom: 18 },
  body: { textAlign: "justify", marginBottom: 14, fontSize: 11 },
  bold: { fontFamily: "Helvetica-Bold" },
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

export default function ConstanciaZonaEducativa({ nombre, cedula, cargo, fechaIngreso, ubicacion, directorNombre, directorCargo, tramite, hoy }: Props) {
  return (
    <Document>
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          <Text style={s.rep}>República Bolivariana de Venezuela</Text>
          <Text style={s.rep}>Ministerio del Poder Popular para la Educación</Text>
          <Text style={s.inst}>Zona Educativa N° 14 — Mérida</Text>
          <Text style={s.dep}>Departamento de Personal y Talento Humano</Text>
        </View>
        <View style={s.divider} />
        <Text style={s.titulo}>Constancia de Trabajo</Text>
        <Text style={s.fecha}>Mérida, {hoy}</Text>
        <Text style={s.body}>
          Quien suscribe, <Text style={s.bold}>{directorNombre}</Text>, {directorCargo} de la <Text style={s.bold}>Zona Educativa N° 14 del Estado Mérida</Text>, hace constar mediante la presente que:
        </Text>
        <Text style={s.body}>
          El/La ciudadano(a) <Text style={s.bold}>{nombre}</Text>, titular de la Cédula de Identidad N° <Text style={s.bold}>{cedula}</Text>, presta servicios en la institución <Text style={s.bold}>{ubicacion}</Text> desempeñando el cargo de <Text style={s.bold}>{cargo}</Text>, desde el <Text style={s.bold}>{fechaIngreso}</Text>, hasta la presente fecha, con dedicación y responsabilidad en el ejercicio de sus funciones.
        </Text>
        <Text style={s.body}>
          La presente constancia se expide a solicitud de parte interesada, a los efectos de <Text style={s.bold}>{tramite}</Text>.
        </Text>
        <View style={s.thinLine} />
        <Text style={s.body}>Sin más a que hacer referencia. Atentamente,</Text>
        <View style={s.signArea}>
          <View style={s.signLine} />
          <Text style={s.signName}>{directorNombre}</Text>
          <Text style={s.signTitle}>{directorCargo}</Text>
          <Text style={s.signTitle}>Zona Educativa N° 14 — Mérida</Text>
        </View>
        <Text style={s.sello}>Documento generado electrónicamente — {hoy}</Text>
      </Page>
    </Document>
  );
}
