export function getYear(dateString?: string | Date) {
    let date = dateString ? new Date(dateString) : new Date();
    let currentYear = date.getFullYear()
    let currentMonth = date.getMonth()+1

    if (currentMonth <= 7) {
        return `${currentYear-1} - ${currentYear}`
    } else {
        return `${currentYear} - ${currentYear+1}`
    }
}