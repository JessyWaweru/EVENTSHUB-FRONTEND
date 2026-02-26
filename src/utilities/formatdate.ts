const formatDate = (newDate: string | number | Date): string => {
  const d = new Date(newDate);

  // Fallback just in case an invalid date is passed
  if (isNaN(d.getTime())) {
    return "TBD"; 
  }

  const dayName = d.toLocaleDateString("en-US", { weekday: "short" }); // e.g., "Thu"
  const date = d.getDate(); // e.g., 26
  const monthName = d.toLocaleDateString("en-US", { month: "long" }); // e.g., "February"
  const year = d.getFullYear(); // e.g., 2026

  return `${dayName}, ${date} ${monthName} ${year}`;
};

export default formatDate;