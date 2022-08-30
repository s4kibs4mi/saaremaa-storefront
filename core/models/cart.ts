import { Course } from "@/core/models/course";

export interface Cart {
  id: string;
  cartItems: CartItem[];
}

export interface CartItem {
  product: Course;
  purchasePrice: number;
}
