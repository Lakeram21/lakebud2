export const formatDate = (dateObject) =>{
  // Extract seconds from the date object
  const seconds = dateObject.seconds;

  // Create a new Date object using the extracted seconds
  const date = new Date(seconds * 1000); // Multiply by 1000 to convert seconds to milliseconds

  // Function to add suffix to day
  const addSuffix = (day) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  };

  // Array of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get day, month, and year components
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Add suffix to day
  const formattedDay = addSuffix(day);

  // Concatenate components into desired format
  const formattedDate = `${formattedDay} ${month} ${year}`;

  return formattedDate;
}

