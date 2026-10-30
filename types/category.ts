export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  color?: string;        // hover color classes
  light_bg?: string;     // background classes
  light_text?: string;   // text color classes
  enabled?: boolean;
  count?: number;
}