export function timestampToUtcString(timestamp: number, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  try {
    const utcDate = new Date(timestamp); // Convert seconds to milliseconds

    // Define the format placeholders and their corresponding values
    const formatPlaceholders: Record<string, number> = {
      'YYYY': utcDate.getUTCFullYear(),
      'MM': utcDate.getUTCMonth() + 1, // Months are zero-based, so add 1
      'DD': utcDate.getUTCDate(),
      'HH': utcDate.getUTCHours(),
      'mm': utcDate.getUTCMinutes(),
      'ss': utcDate.getUTCSeconds(),
    };

    // Replace format placeholders with their values
    const formattedString = format.replace(/(YYYY|MM|DD|HH|mm|ss)/g, (match: string) =>
      formatPlaceholders[match].toString().padStart(2, '0')
    );

    return formattedString;
  } catch (error) {
    return `Error: ${error}`;
  }
}

// // Example usage
// const timestamp = 1634462096; // Replace this with your timestamp
// const formattedUtcString = timestampToFormattedUtcString(timestamp, 'YYYY-MM-DD HH:mm:ss');
// console.log(formattedUtcString);
