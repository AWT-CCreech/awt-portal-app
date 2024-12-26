// This function convert a camelCase String to PascalCase String and add space to it
export function toPascalCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word) {
      return word.toUpperCase();
    });
}

// lowercase the first letter of a string
export function toLowerFirstLetter(string: string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

// convert a Date to date string MM/dd/yyyy
export function getDateString(date: Date) {
  return (
    (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
    '/' +
    (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
    '/' +
    date.getFullYear()
  );
}

export function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

// Formats a phone number string into a standard format
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const sPhone = phone.replace(/\D/g, '');

  if (sPhone.length < 7) {
    return sPhone;
  } else if (sPhone.length === 7) {
    return `${sPhone.slice(0, 3)}-${sPhone.slice(3)}`;
  } else if (sPhone.length === 10) {
    return `(${sPhone.slice(0, 3)}) ${sPhone.slice(3, 6)}-${sPhone.slice(6)}`;
  } else if (sPhone.length > 10) {
    const countryCode = sPhone.slice(0, sPhone.length - 10);
    const areaCode = sPhone.slice(-10, -7);
    const centralOfficeCode = sPhone.slice(-7, -4);
    const lineNumber = sPhone.slice(-4);
    return `+${countryCode} (${areaCode}) ${centralOfficeCode}-${lineNumber}`;
  } else {
    return sPhone;
  }
}
