export type PriceType = { size: string; price: number };

export type MenuItem = {
  itemId: number;
  name: string;
  description: string;
  category: string;
  tags: string[] | null;
  prices: PriceType[];
  status: string;
  photoUrl: string;
};
