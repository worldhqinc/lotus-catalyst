function formatFractionalInches(inches: number): string {
  if (inches === 0) return '0';

  // Common fractions with denominator 8 (standard for measurements)
  const fractions = [
    { decimal: 0, fraction: '0' },
    { decimal: 1 / 8, fraction: '1/8' },
    { decimal: 1 / 4, fraction: '1/4' },
    { decimal: 3 / 8, fraction: '3/8' },
    { decimal: 1 / 2, fraction: '1/2' },
    { decimal: 5 / 8, fraction: '5/8' },
    { decimal: 3 / 4, fraction: '3/4' },
    { decimal: 7 / 8, fraction: '7/8' },
  ];

  // Get the whole number part
  const wholeNumber = Math.floor(inches);

  // Get the decimal part
  const decimalPart = inches - wholeNumber;

  // Find the closest fraction
  let closestFraction = '';
  let minDiff = 1;

  fractions.forEach((fraction) => {
    const diff = Math.abs(decimalPart - fraction.decimal);

    if (diff < minDiff) {
      minDiff = diff;
      closestFraction = fraction.fraction;
    }
  });

  // Return the formatted result
  if (wholeNumber === 0) {
    return closestFraction;
  } else if (closestFraction === '0' || minDiff > 0.06) {
    return `${wholeNumber}`;
  }

  return `${wholeNumber} ${closestFraction}`;
}

export function formatDimension(value: string | null | undefined, unit: string) {
  if (!value || value === '0') return '';

  if (unit === 'IN') {
    // Check if we need to add the inch symbol
    if (value.endsWith('"')) {
      return value;
    }

    // Data already has fractional format like "22 3/8"
    if (value.includes('/')) {
      return `${value}"`;
    }

    // Decimal format (e.g., "22.375")
    // First try to convert to fraction directly
    try {
      const decimalValue = parseFloat(value);

      if (!Number.isNaN(decimalValue)) {
        // For values like 22.375, output should be "22 3/8"
        const wholeNumber = Math.floor(decimalValue);
        const fraction = value.includes('.')
          ? formatFractionalInches(decimalValue - wholeNumber)
          : '0';

        if (fraction === '0') {
          return `${wholeNumber}"`;
        }

        return `${wholeNumber} ${fraction}"`;
      }
    } catch {
      // fail silently
    }

    return `${value}"`;
  }

  return `${value}${unit.toLowerCase()}`;
}

export function formatWeight(value: string | null | undefined, unit: string) {
  if (!value || value === '0') return '';

  return `${value} ${unit}`;
}
