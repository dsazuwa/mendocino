import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(number: number) {
  return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function getMapURL(lat: number, lng: number) {
  const apiKey = process.env.NEXT_PUBLIC_PLACES_API_KEY;

  const mapCenter = `center=${lat},${lng}`;
  const mapSize = 'size=1024x576';
  const mapZoom = 'zoom=17';
  const marker = `markers=color:red%7C${lat},${lng}`;
  const mapType = 'maptype=roadmap';

  return `https://maps.googleapis.com/maps/api/staticmap?${mapCenter}&${mapSize}&${mapZoom}&${marker}&${mapType}&key=${apiKey}&style=feature:poi|visibility:off`;
}
