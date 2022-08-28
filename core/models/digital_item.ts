import { DigitalContent } from "@/core/models/digital_content";

export interface DigitalItem {
  id: string;
  title: string;
  description: string;
  contents: DigitalContent[];
  position: number;
}
