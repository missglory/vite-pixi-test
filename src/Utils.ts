import * as PIXI from 'pixi.js';
import { format } from 'date-fns';

export function timestampToUtcString(timestamp: number, format: string = 'd.M:H:m'): string {
  const utcDate = new Date(timestamp); // Convert seconds to milliseconds
  return dateToUTCString(utcDate, format);
}

export function dateToUTCString(utcDate: Date, fmt: string = 'd.M:H:m') {
  try {
    // Define the format placeholders and their corresponding values
    // const formatPlaceholders: Record<string, string> = {
    //   'YYYY': '',//utcDate.getUTCFullYear(),
    //   'MM': (utcDate.getUTCMonth() + 1).toString(), // Months are zero-based, so add 1
    //   'DD': utcDate.getUTCDate().toString(),
    //   'HH': utcDate.getUTCHours().toString(),
    //   'mm': utcDate.getUTCMinutes().toString(),
    //   'ss': utcDate.getUTCSeconds().toString(),
    // };

    // // Replace format placeholders with their values
    // const formattedString = format.replace(/(YYYY|MM|DD|HH|mm|ss)/g, (match: string) =>
    //   formatPlaceholders[match]//.padStart(2, '0')
    // );
    const formattedString = format(utcDate, fmt);

    return formattedString;
  } catch (error) {
    return `Error: ${error}`;
  }

}

export function objectToStringWithSeparator(
  obj: Record<string, any>, 
  separator = "|",
  keys: string[] = []): string {
  const values: string[] = [];

  for (const key of keys) {
    if (key.length === 0 || obj.hasOwnProperty(key)) {
      let value = obj[key];

      // Check if the value is a Date and format it properly
      if (value instanceof Date) {
        value = dateToUTCString(value); // Adjust the format as needed
      }

      values.push(value.toString());
    } else {
      values.push(''); // Handle missing keys as empty strings
    }
  }

  return values.filter(value => value !== '').join(separator);
}

// export function objectToStringWithSeparator(obj, 
//   separator="|",
//   ignoredKeys = []
//   ) {
//   const formattedValues = Object.keys(obj).map(key => {
//     if (ignoredKeys.includes(key)) {
//       return ''; // Ignore this key
//     }
//     const value = obj[key];

//     if (value instanceof Date) {
//       return dateToUTCString(value); // Use the desired formatting
//     }

//     return value;
//   });

//   // Join the formatted values using the specified separator
//   return formattedValues.filter(value => value !== '').join(separator);
// }

export function createRect(x: number, y: number, width: number, height: number, color: number): PIXI.Graphics {
  const rect = new PIXI.Graphics();
  rect.beginFill(color);
  rect.drawRect(x, y, width, height);
  rect.endFill();
  return rect;
}

export function addBoundingRect(b: PIXI.Container, border = 5, color = 0xcc6666, parent = true) {
  // const b: PIXI.Rectangle = target.parent.getVisibleBounds();
  const child = new PIXI.Graphics();
  // child.beginHole()
  child.beginFill(color);
  child.drawRect(b.x, b.y, b.width, b.height);
  child.endFill();
  child.beginHole();
  child.drawRect(
    b.x + border, 
    b.y + border, 
    Math.max(0, b.width - border * 2), 
    Math.max(0, b.height - border * 2));
  child.endHole();
  if (b.parent && parent) {
  // if (false) {
    b.parent.addChild(child);
  } else {
    b.addChild(child);
  }
}

export function createLine(x1: number, y1: number, x2: number, y2: number, color: number): PIXI.Graphics {
  const line = new PIXI.Graphics();
  line.lineStyle(1, color);
  line.moveTo(x1, y1);
  line.lineTo(x2, y2);
  return line;
}

// // Example usage
// const timestamp = 1634462096; // Replace this with your timestamp
// const formattedUtcString = timestampToFormattedUtcString(timestamp, 'YYYY-MM-DD HH:mm:ss');
// console.log(formattedUtcString);


export function calculateMinMax<T>(data: T[]): Map<string, { min: number; max: number }> {
  const minMaxMap = new Map<string, { min: number; max: number }>();

  if (data.length === 0) return minMaxMap; // Return an empty map if data is empty.

  const fields = Object.keys(data[0]);

  for (const field of fields) {
    // Check if the first item's field value is numeric by attempting to parse it
    if (!isNaN(parseFloat(data[0][field])) && isFinite(data[0][field])) {
      // Get all numeric values for the current field
      const numericValues = data
        .map(item => item[field])
        .filter(value => !isNaN(parseFloat(value)) && isFinite(value))
        .map(Number);

      if (numericValues.length > 0) {
        const minValue = Math.min(...numericValues);
        const maxValue = Math.max(...numericValues);

        minMaxMap.set(field, { min: minValue, max: maxValue });
      }
    }
  }

  console.log("min max", minMaxMap);
  return minMaxMap;
}