export function formatDateTime(dateTimeString: string): string {
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('pt-BR');
  } catch (error) {
    return dateTimeString;
  }
}