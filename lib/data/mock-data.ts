/**
 * Mock data for testing the cascading combobox component
 */

export interface MockBrand {
  id: string;
  name: string;
}

export interface MockModel {
  id: string;
  brandId: string;
  name: string;
}

export interface MockModelNumber {
  id: string;
  brandId: string;
  modelId: string;
  number: string;
}

export interface MockColor {
  id: string;
  name: string;
  code: string;
}

export const mockBrands: MockBrand[] = [
  { id: '1', name: 'Nike' },
  { id: '2', name: 'Adidas' },
  { id: '3', name: 'Puma' },
  { id: '4', name: 'Reebok' },
  { id: '5', name: 'New Balance' },
  { id: '6', name: 'Under Armour' },
  { id: '7', name: 'Asics' },
  { id: '8', name: 'Converse' },
  { id: '9', name: 'Vans' },
  { id: '10', name: 'Skechers' },
];

export const mockModels: MockModel[] = [
  // Nike models
  { id: '1', brandId: '1', name: 'Air Max' },
  { id: '2', brandId: '1', name: 'Air Force 1' },
  { id: '3', brandId: '1', name: 'React' },
  { id: '4', brandId: '1', name: 'Zoom' },
  { id: '5', brandId: '1', name: 'Pegasus' },
  
  // Adidas models
  { id: '6', brandId: '2', name: 'Ultraboost' },
  { id: '7', brandId: '2', name: 'Stan Smith' },
  { id: '8', brandId: '2', name: 'Superstar' },
  { id: '9', brandId: '2', name: 'NMD' },
  { id: '10', brandId: '2', name: 'Yeezy' },
  
  // Puma models
  { id: '11', brandId: '3', name: 'Suede' },
  { id: '12', brandId: '3', name: 'RS-X' },
  { id: '13', brandId: '3', name: 'Cali' },
  { id: '14', brandId: '3', name: 'Thunder' },
  
  // Reebok models
  { id: '15', brandId: '4', name: 'Classic Leather' },
  { id: '16', brandId: '4', name: 'Club C' },
  { id: '17', brandId: '4', name: 'Nano' },
  
  // New Balance models
  { id: '18', brandId: '5', name: '990' },
  { id: '19', brandId: '5', name: '574' },
  { id: '20', brandId: '5', name: '327' },
];

export const mockModelNumbers: MockModelNumber[] = [
  // Nike Air Max
  { id: '1', brandId: '1', modelId: '1', number: '90' },
  { id: '2', brandId: '1', modelId: '1', number: '95' },
  { id: '3', brandId: '1', modelId: '1', number: '97' },
  { id: '4', brandId: '1', modelId: '1', number: '270' },
  
  // Nike Air Force 1
  { id: '5', brandId: '1', modelId: '2', number: 'Low' },
  { id: '6', brandId: '1', modelId: '2', number: 'Mid' },
  { id: '7', brandId: '1', modelId: '2', number: 'High' },
  
  // Nike React
  { id: '8', brandId: '1', modelId: '3', number: 'Infinity Run' },
  { id: '9', brandId: '1', modelId: '3', number: 'Element 55' },
  
  // Adidas Ultraboost
  { id: '10', brandId: '2', modelId: '6', number: '21' },
  { id: '11', brandId: '2', modelId: '6', number: '22' },
  { id: '12', brandId: '2', modelId: '6', number: 'DNA' },
  
  // Adidas Stan Smith
  { id: '13', brandId: '2', modelId: '7', number: 'Original' },
  { id: '14', brandId: '2', modelId: '7', number: 'Vegan' },
  
  // Puma Suede
  { id: '15', brandId: '3', modelId: '11', number: 'Classic' },
  { id: '16', brandId: '3', modelId: '11', number: 'Platform' },
  
  // New Balance 990
  { id: '17', brandId: '5', modelId: '18', number: 'v5' },
  { id: '18', brandId: '5', modelId: '18', number: 'v6' },
];

export const mockColors: MockColor[] = [
  { id: '1', name: 'Black', code: 'BK' },
  { id: '2', name: 'White', code: 'WH' },
  { id: '3', name: 'Red', code: 'RD' },
  { id: '4', name: 'Blue', code: 'BL' },
  { id: '5', name: 'Green', code: 'GR' },
  { id: '6', name: 'Yellow', code: 'YL' },
  { id: '7', name: 'Orange', code: 'OR' },
  { id: '8', name: 'Purple', code: 'PR' },
  { id: '9', name: 'Pink', code: 'PK' },
  { id: '10', name: 'Gray', code: 'GY' },
  { id: '11', name: 'Brown', code: 'BR' },
  { id: '12', name: 'Navy', code: 'NV' },
  { id: '13', name: 'Beige', code: 'BG' },
  { id: '14', name: 'Maroon', code: 'MR' },
  { id: '15', name: 'Teal', code: 'TL' },
];

/**
 * Generate ETag from data
 */
export function generateETag(data: unknown): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `"${Math.abs(hash).toString(36)}"`;
}

/**
 * Simulate network delay
 */
export function simulateDelay(ms: number = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

