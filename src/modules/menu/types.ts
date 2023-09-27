/* eslint-disable @typescript-eslint/no-unused-vars */

type PriceType = { size: string; price: number };

type MenuItem = {
  itemId: number;
  name: string;
  description: string;
  category: string;
  tags: string[] | null;
  prices: PriceType[];
  status: string;
  photoUrl: string;
};

type PublicMenuItem = {
  name: string;
  description: string;
  tags: string[];
  photoUrl: string;
  notes: string | undefined;
};

type CategoryItems = {
  category: string;
  notes: string;
  items: PublicMenuItem[];
};
