import { Cart } from "@/core/models/cart";

export interface Order {
  id: string;
  hash: string;
  cart: Cart;
}
