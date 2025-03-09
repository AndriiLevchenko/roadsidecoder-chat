export function extractTimeOderDate(dateString) {
    let today = new Date(); // take the current time

    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0, 0);
    const todayMorning = today.getTime();      //time today at 00:00 in ms

    const date = new Date(dateString);
    const messageMoment = date.getTime();   //time today at this moment in ms
    if (messageMoment >= todayMorning) {
        const hours = padZero(date.getHours());
        const minutes = padZero(date.getMinutes());
        return `${hours}:${minutes}`;
    } else {
        return date.toJSON().slice(0, 10);
    }
}
export function extractTime(dateString) {
    let today = new Date(); // take the current time

    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0, 0);

    const date = new Date(dateString);
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${hours}:${minutes}`;
}
export function extractDate(dateString) {
    const date = new Date(dateString);
    return date.toJSON().slice(0, 10);
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
    return number.toString().padStart(2, "0");
}
