export function extractString(value: any): string | null {
  if (typeof value === 'string') return value;
  return null;
}

export function extractStringArray(value: any): string[] {
  let stringArray: string[] = [];
  if (Array.isArray(value)) {
    value.forEach((element) => {
      if (typeof element === 'string') stringArray.push(element);
    });
  }
  if (typeof value === 'string') {
    stringArray = value.split(',').map(string => string.trim());
  }
  return stringArray;
}

export function extractNumber(string: any): number | null {
  if (typeof string === 'string') {
    const regExpMatchArray = string.match(/\d+/);
    if (regExpMatchArray) {
      return parseInt(regExpMatchArray[0]) ?? null;
    }
  }
  return null;
}
