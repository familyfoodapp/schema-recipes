export function extractString(value: any): string {
  let string: string = '';
  if (typeof value === 'string') {
    string = value;
  }
  return string;
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

export function extractNumber(string: any): number {
  if (typeof string === 'string') {
    const regExpMatchArray = string.match(/\d+/);
    if (regExpMatchArray) {
      return parseInt(regExpMatchArray[0]) ?? 0;
    }
  }
  return 0;
}
