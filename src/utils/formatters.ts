// Utility formatters for currency, dates, and text

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) {
    return 'Price on request';
  }
  return `Starting from ₹${Number(price).toLocaleString('en-IN')}`;
}

export function formatRawPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || price === 0) {
    return 'Price on request';
  }
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}
