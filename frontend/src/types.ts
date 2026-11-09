export type ItemType = 'Недвижимость' | 'Авто' | 'Услуги';

interface BaseRawItem {
  id?: number;
  name: string;
  description: string;
  location: string;
  image?: string; 
}

export interface RealEstateRawItem extends BaseRawItem {
  type: 'Недвижимость';
  propertyType: string;
  area: number;
  rooms: number;
  price: number;
}

export interface AutoRawItem extends BaseRawItem {
  type: 'Авто';
  brand: string;
  model: string;
  year: number;
  mileage?: number; 
}

export interface ServiceRawItem extends BaseRawItem {
  type: 'Услуги';
  serviceType: string;
  experience: number;
  cost: number;
  workSchedule?: string; 
}

export type RawItem = RealEstateRawItem | AutoRawItem | ServiceRawItem;


export interface Listing {
  id: string;         
  type: ItemType;     
  title: string;      
  description: string;
  location: string;   
  price: number | null;
  imageSrc: string;   
  details: string[];  
}
