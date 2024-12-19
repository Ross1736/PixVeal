export function tiempoTranscurrido(desdeFecha) {
  const fechaDesde = new Date(desdeFecha); // Convertir desdeFecha a Date
  const fechaHasta = new Date(); // Fecha actual como objeto Date

  const diferenciaMs = fechaHasta - fechaDesde; // Diferencia en milisegundos

  // Cálculos básicos
  const segundos = Math.floor(diferenciaMs / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const días = Math.floor(horas / 24);

  // Usar métodos nativos para calcular meses y años reales
  const años = fechaHasta.getFullYear() - fechaDesde.getFullYear();
  const meses =
    años * 12 +
    (fechaHasta.getMonth() - fechaDesde.getMonth()) -
    (fechaHasta.getDate() < fechaDesde.getDate() ? 1 : 0);

  if (segundos < 60) {
    return segundos === 1 ? "hace 1 segundo" : `hace ${segundos} segundos`;
  } else if (minutos < 60) {
    return minutos === 1 ? "hace 1 minuto" : `hace ${minutos} minutos`;
  } else if (horas < 24) {
    return horas === 1 ? "hace 1 hora" : `hace ${horas} horas`;
  } else if (días < 7) {
    return días === 1 ? "hace 1 día" : `hace ${días} días`;
  } else if (días < 30) {
    const semanas = Math.floor(días / 7);
    return semanas === 1 ? "hace 1 semana" : `hace ${semanas} semanas`;
  } else if (meses < 12) {
    return meses === 1 ? "hace 1 mes" : `hace ${meses} meses`;
  } else {
    return años === 1 ? "hace 1 año" : `hace ${años} años`;
  }
}

export function validarContraseña(valor) {
  let errores = [];

  // Verificar si tiene al menos una letra minúscula
  if (!/(?=.*[a-z])/.test(valor)) {
    errores.push("Falta una minúscula");
  }

  // Verificar si tiene al menos una letra mayúscula
  if (!/(?=.*[A-Z])/.test(valor)) {
    errores.push("Falta una mayúscula");
  }

  // Verificar si tiene al menos un número
  if (!/(?=.*\d)/.test(valor)) {
    errores.push("Falta un número");
  }

  // Verificar si tiene al menos un carácter especial
  if (!/(?=.*[!@#$%^&*])/.test(valor)) {
    errores.push("Falta un carácter especial (!@#$%^&*)");
  }

  // Verificar longitud entre 6 y 50 caracteres
  if (valor.length < 6 || valor.length > 50) {
    errores.push("Minimo 6 caracteres");
  }

  return errores;
}

export function cantidadNumeros(numero) {
  if (numero < 1000) {
    return numero.toString();
  } else if (numero < 1_000_000) {
    return (numero / 1000).toFixed(numero % 1000 >= 100 ? 1 : 0) + "k";
  } else if (numero < 1_000_000_000) {
    return (
      (numero / 1_000_000).toFixed(numero % 1_000_000 >= 100_000 ? 1 : 0) + "M"
    );
  } else {
    return (
      (numero / 1_000_000_000).toFixed(
        numero % 1_000_000_000 >= 100_000_000 ? 1 : 0
      ) + "B"
    );
  }
}

export function generarNombreFoto() {
  const randomNumeros = Math.floor(10000000 + Math.random() * 90000000);
  return `foto-${randomNumeros}`;
}
