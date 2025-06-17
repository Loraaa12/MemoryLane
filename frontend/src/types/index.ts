export type Category = 'film' | 'photo' | 'quote';

export interface SurpriseItem {
  id: number;
  category: Category;
  note: string;
  created_at: string;
  name?: string;
  year?: number;
  image_url?: string;
  text?: string;
  author?: string;
}

export type NewSurpriseItem = Omit<SurpriseItem, 'id' | 'created_at'>;

export interface FilmItem extends Omit<SurpriseItem, 'image_url' | 'text' | 'author'> {
  category: 'film';
  name: string;
  year: number;
}

export interface PhotoItem extends Omit<SurpriseItem, 'name' | 'year' | 'text' | 'author'> {
  category: 'photo';
  image_url: string;
}

export interface QuoteItem extends Omit<SurpriseItem, 'name' | 'year' | 'image_url'> {
  category: 'quote';
  text: string;
  author: string;
} 