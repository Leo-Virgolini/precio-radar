import { AmazonProduct } from '../models/product.model';

export function getDiscountPercentage(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

export function formatPrice(price: number): string {
  return price.toFixed(2);
}

export function getCurrencySymbol(region: string): string {
  return region === 'ES' ? '\u20AC' : '$';
}

export function getCurrencyCode(region: string): string {
  return region === 'ES' ? 'EUR' : 'USD';
}

export function getRegionLabel(product: AmazonProduct): string {
  return product.region === 'ES' ? 'Amazon Espa\u00F1a' : 'Amazon USA';
}

export function getShippingPrice(product: AmazonProduct): number {
  return product.shipping.price;
}

export function getProductImage(product: AmazonProduct): string {
  return product.image || '/sin_imagen.png';
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

export function handleImageError(event: Event): void {
  const imgElement = event.target as HTMLImageElement;
  if (imgElement) {
    imgElement.src = '/sin_imagen.png';
    imgElement.alt = 'Sin imagen';
  }
}
