const DIAS: Record<number, string> = {
  1:"UNO",2:"DOS",3:"TRES",4:"CUATRO",5:"CINCO",6:"SEIS",7:"SIETE",8:"OCHO",9:"NUEVE",10:"DIEZ",
  11:"ONCE",12:"DOCE",13:"TRECE",14:"CATORCE",15:"QUINCE",16:"DIECISÉIS",17:"DIECISIETE",
  18:"DIECIOCHO",19:"DIECINUEVE",20:"VEINTE",21:"VEINTIUNO",22:"VEINTIDÓS",23:"VEINTITRÉS",
  24:"VEINTICUATRO",25:"VEINTICINCO",26:"VEINTISÉIS",27:"VEINTISIETE",28:"VEINTIOCHO",
  29:"VEINTINUEVE",30:"TREINTA",31:"TREINTA Y UNO",
};

const MESES: Record<number, string> = {
  1:"ENERO",2:"FEBRERO",3:"MARZO",4:"ABRIL",5:"MAYO",6:"JUNIO",
  7:"JULIO",8:"AGOSTO",9:"SEPTIEMBRE",10:"OCTUBRE",11:"NOVIEMBRE",12:"DICIEMBRE",
};

export function fechaEnLetras(dateStr: string) {
  // dateStr: "YYYY-MM-DD"
  const d = new Date(dateStr + "T12:00:00");
  return {
    dia:  DIAS[d.getDate()]  ?? String(d.getDate()),
    mes:  MESES[d.getMonth() + 1] ?? "",
    anio: String(d.getFullYear()),
  };
}
