export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM'; 
  hours = hours % 12;
  hours = hours ? hours : 12; 
  const hoursStr = hours.toString().padStart(2, '0');
  return `${hoursStr}:${minutes} ${ampm}`;
};