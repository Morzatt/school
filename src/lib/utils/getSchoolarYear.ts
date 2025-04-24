export function getYear(dateString?: string | Date) {
    let date = new Date();

    let currentYear = date.getFullYear()
    let currentMonth = date.getMonth()+1

    if (currentMonth <= 8) {
        return `${currentYear-1} - ${currentYear}`
    } else {
        return `${currentYear} - ${currentYear+1}`
    }
}