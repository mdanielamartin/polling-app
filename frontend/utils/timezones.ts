export function getLocalISOWithOffset(date: Date): string {

  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  const offsetMinutes = date.getTimezoneOffset();
  const absOffset = Math.abs(offsetMinutes);
  const sign = offsetMinutes <= 0 ? '+' : '-';
  const offsetH = pad(Math.floor(absOffset / 60));
  const offsetM = pad(absOffset % 60);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetH}:${offsetM}`;
}

export function toLocalTime (date:string){
  const localDate = new Date(date)

  const formatter = new Intl.DateTimeFormat(undefined,{
year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  })

  return formatter.format(localDate)

}
