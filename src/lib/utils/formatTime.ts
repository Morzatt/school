export function formatTime(time: string): string {
    let n = parseInt(time.slice(0, time.lastIndexOf(":")).replace(':', ""))
    return n <= 1200 ? `${time.slice(0, time.lastIndexOf(":"))} AM` :
        `${parseInt(time.slice(0, 2)) - 12 < 10 ? "0" : ""}${parseInt(time.slice(0, 2)) - 12}:${time.slice(3, 5)} PM`
}