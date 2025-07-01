export function timeToSeconds(time) {
    const [h, m, s] = time.split(':').map(Number)
    return h * 3600 + m * 60 + s
}

export function secondsToTime(seconds) {
    const horas = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutos = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const segundosRestantes = String(seconds % 60).padStart(2, "0");

    return `${horas}:${minutos}:${segundosRestantes}`
}
