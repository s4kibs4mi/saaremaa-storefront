import { DigitalItem } from "@/core/models/digital_item";

export interface Course {
  id: string;
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
  attributes: CourseAttribute[];
}

export interface IsCoursePurchased {
  isPurchased: boolean;
  orderHash: string;
  purchaseDate: string;
}

export interface CourseAttribute {
  name: string;
  values: string[];
}
