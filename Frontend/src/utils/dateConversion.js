export const formatDateTime = (isoString) => {
  // Create a new Date object using the ISO 8601 date string
  const date = new Date(isoString);
  
  // Use Intl.DateTimeFormat to format the date
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);

  // Format the time without seconds
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);

  // Combine the date and time with 'at'
  return `${formattedDate} ${formattedTime}`;
  }
