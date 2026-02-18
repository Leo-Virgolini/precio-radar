import { AmazonProduct } from '../models/product.model';

const FALLBACK_IMAGE = '/sin_imagen.png';

export function getDiscountPercentage(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

export function formatPrice(price: number | null): string {
  return (price ?? 0).toFixed(2);
}

export function getCurrencySymbol(currency: string): string {
  return currency === 'EUR' ? '\u20AC' : '$';
}

export function getCurrencyCode(currency: string): string {
  return currency === 'EUR' ? 'EUR' : 'USD';
}

export function getRegionLabel(product: AmazonProduct): string {
  return product.region === 'ES' ? 'Amazon Espa\u00F1a' : 'Amazon USA';
}

export function getShippingPrice(product: AmazonProduct): number {
  return product.shippingPrice;
}

export function getProductImages(product: AmazonProduct): string[] {
  return product.imageUrls.length ? product.imageUrls : [FALLBACK_IMAGE];
}

export function formatNumber(num: string): string {
  return num;
}

export function handleImageError(event: Event): void {
  const imgElement = event.target as HTMLImageElement;
  if (imgElement) {
    imgElement.src = FALLBACK_IMAGE;
    imgElement.alt = 'Sin imagen';
  }
}
