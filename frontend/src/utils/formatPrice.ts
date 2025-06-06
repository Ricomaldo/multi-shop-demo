/**
 * Formate un prix en euros avec 2 décimales
 * @param price Le prix à formater
 * @returns Le prix formaté avec le symbole €
 */
export function formatPrice(price: number): string {
  return `${price.toFixed(2)}€`;
}
