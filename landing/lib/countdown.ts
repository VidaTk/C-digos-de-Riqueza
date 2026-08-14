export interface TiempoRestante {
  total: number;
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  terminado: boolean;
}

/**
 * Calcula el tiempo restante hasta `fechaISO`. El offset (-06:00) va
 * embebido en el ISO string, así que Date lo interpreta en UTC real sin
 * importar la zona horaria del navegador del visitante.
 */
export function calcularTiempoRestante(fechaISO: string): TiempoRestante {
  const total = new Date(fechaISO).getTime() - Date.now();

  if (total <= 0) {
    return { total: 0, dias: 0, horas: 0, minutos: 0, segundos: 0, terminado: true };
  }

  const dias = Math.floor(total / (1000 * 60 * 60 * 24));
  const horas = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((total / (1000 * 60)) % 60);
  const segundos = Math.floor((total / 1000) % 60);

  return { total, dias, horas, minutos, segundos, terminado: false };
}
