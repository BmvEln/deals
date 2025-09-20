/**
 * Генерирует новый ID, который на 1 больше максимального ID в массиве.
 * Работает с любым массивом объектов, у которых есть свойство 'id: number'.
 * @param items Массив объектов (например, сделок или комментариев).
 * @returns Новый ID (число).
 */
export function generateNewId<T extends { id: number }>(items: T[]): number {
  const maxId = items.reduce((max, item) => Math.max(max, item.id), 0);
  return maxId + 1;
}

export const formatPhoneNumber = (value: string) => {
  // Очищаем все, кроме цифр
  const digits = value.replace(/\D/g, "");

  let cleanDigits = digits;
  if (digits.startsWith("7") || digits.startsWith("8")) {
    cleanDigits = "7" + digits.substring(1);
  }

  const finalDigits = cleanDigits.substring(0, 11);

  let formatted = "";
  if (finalDigits.length > 0) formatted = "+" + finalDigits.substring(0, 1);
  if (finalDigits.length > 1) formatted += " (" + finalDigits.substring(1, 4);
  if (finalDigits.length > 4) formatted += ") " + finalDigits.substring(4, 7);
  if (finalDigits.length > 7) formatted += "-" + finalDigits.substring(7, 9);
  if (finalDigits.length > 9) formatted += "-" + finalDigits.substring(9, 11);

  return formatted;
};
