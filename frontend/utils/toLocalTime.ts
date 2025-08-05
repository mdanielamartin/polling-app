
export const toLocalTime = (utcDate)=>{
    const localDate = new Date(utcDate)
    const formatted = localDate.toLocaleDateString()

    return formatted

}
