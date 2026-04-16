export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // If date is in the future
    if (diffInSeconds < 0) {
      return formatFutureDate(date);
    }
  
    // Within the last minute
    if (diffInSeconds < 60) {
      return 'Just now';
    }
  
    // Within the last hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }
  
    // Within the last 24 hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }
  
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.getDate() === yesterday.getDate() && 
        date.getMonth() === yesterday.getMonth() && 
        date.getFullYear() === yesterday.getFullYear()) {
      return `Yesterday ${formatTime(date)}`;
    }
  
    // Current year but not yesterday
    if (date.getFullYear() === now.getFullYear()) {
      return `${formatDayMonth(date)} ${formatTime(date)}`;
    }
  
    // Different year
    return `${formatDayMonth(date)} ${date.getFullYear()} ${formatTime(date)}`;
  };
  
  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}.${minutes}${ampm}`;
  };
  
  const formatDayMonth = (date: Date): string => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day}${getOrdinalSuffix(day)} ${month}`;
  };
  
  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  const formatFutureDate = (date: Date): string => {
    return `Scheduled for ${formatDayMonth(date)} ${date.getFullYear()} ${formatTime(date)}`;
  };