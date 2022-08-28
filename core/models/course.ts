import { DigitalItem } from "@/core/models/digital_item";

export interface Course {
  name: string;
  slug: string;
  description: string;
  price: number;
  productSpecificDiscount: number;
  images: string[];
  fullImages: string[];
  isDigitalProduct: boolean;
  views: number;
  createdAt: string;
  digitalItems: DigitalItem[];
}
