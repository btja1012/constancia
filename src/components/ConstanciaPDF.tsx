"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Times-Roman",
  src: "https://fonts.gstatic.com/s/librebaskerville/v14/kmKnZrc3Hgbbcjq75U4uslyuy4kn0pNeYRI4CN2V.woff2",
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 70,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
    color: "#1a1a1a",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
  },
  institucion: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  subinstitucion: {
    fontSize: 10,
    marginTop: 3,
    color: "#444",
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "#003366",
    marginVertical: 12,
  },
  titulo: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 25,
    marginTop: 10,
  },
  cuerpo: {
    textAlign: "justify",
    marginBottom: 12,
    fontSize: 11,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  firmSection: {
    marginTop: 60,
    textAlign: "center",
    alignItems: "center",
  },
  lineaFirma: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: 220,
    marginBottom: 6,
    marginTop: 40,
  },
  firmaNombre: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  firmaCargo: {
    fontSize: 10,
    color: "#333",
  },
  fecha: {
    textAlign: "right",
    fontSize: 10,
    color: "#555",
    marginBottom: 20,
  },
});

interface Props {
  nombre: string;
  cedula: string;
  cargo: string;
  fechaIngreso: string;
  directorNombre: string;
  directorCargo: string;
  institucion: string;
  tramite: string;
  hoy: string;
}

export default function ConstanciaPDF({
  nombre,
  cedula,
  cargo,
  fechaIngreso,
  directorNombre,
  directorCargo,
  institucion,
  tramite,
  hoy,
}: Props) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.institucion}>{institucion}</Text>
          <Text style={styles.subinstitucion}>Dirección de Talento Humano</Text>
        </View>

        <View style={styles.divider} />

        {/* Título */}
        <Text style={styles.titulo}>Constancia de Trabajo</Text>

        {/* Fecha */}
        <Text style={styles.fecha}>{hoy}</Text>

        {/* Cuerpo */}
        <Text style={styles.cuerpo}>
          Quien suscribe,{" "}
          <Text style={styles.bold}>{directorNombre}</Text>, en su carácter de{" "}
          <Text style={styles.bold}>{directorCargo}</Text> del{" "}
          <Text style={styles.bold}>{institucion}</Text>, hace constar por
          medio de la presente que:
        </Text>

        <Text style={styles.cuerpo}>
          El/La ciudadano(a){" "}
          <Text style={styles.bold}>{nombre}</Text>, portador(a) de la Cédula de
          Identidad Nro.{" "}
          <Text style={styles.bold}>{cedula}</Text>, presta servicios en esta
          Institución en el cargo de{" "}
          <Text style={styles.bold}>{cargo}</Text>, desde el{" "}
          <Text style={styles.bold}>{fechaIngreso}</Text>, desempeñando sus
          funciones de manera eficiente y responsable hasta la presente fecha.
        </Text>

        <Text style={styles.cuerpo}>
          La presente constancia se expide a solicitud de la parte interesada, a
          los fines de{" "}
          <Text style={styles.bold}>{tramite}</Text>.
        </Text>

        {/* Firma */}
        <View style={styles.firmSection}>
          <View style={styles.lineaFirma} />
          <Text style={styles.firmaNombre}>{directorNombre}</Text>
          <Text style={styles.firmaCargo}>{directorCargo}</Text>
          <Text style={styles.firmaCargo}>{institucion}</Text>
        </View>
      </Page>
    </Document>
  );
}
