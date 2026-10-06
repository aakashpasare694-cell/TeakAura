// Core TypeScript interfaces for Teakwood Furniture Brand

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  product_count?: number;
  created_at?: string;
}

export interface ProductImage {
  id?: number;
  product_id?: number;
  image_url: string;
  alt_text?: string;
  display_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  description: string;
  dimensions: string;
  wood_type: string;
  finish_options: string;
  customization_options: string;
  starting_price: number | null; // null means "Price on request"
  delivery_time: string;
  cover_image_url: string;
  video_url?: string | null;
  is_featured: number | boolean;
  is_hidden: number | boolean;
  created_at?: string;
  updated_at?: string;
  images?: ProductImage[];
  similar?: Partial<Product>[];
  image_count?: number;
}

export type EnquiryType = 'product' | 'custom' | 'contact';
export type EnquiryStatus = 'New' | 'Contacted' | 'Quoted' | 'Won' | 'Lost';

export interface Enquiry {
  id: number;
  enquiry_type: EnquiryType;
  name: string;
  phone: string;
  city: string;
  product_id?: number | null;
  product_name?: string | null;
  message?: string | null;
  custom_item_type?: string | null;
  approximate_size?: string | null;
  budget_range?: string | null;
  reference_images?: string[];
  status: EnquiryStatus;
  admin_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface EnquirySubmissionPayload {
  enquiry_type: EnquiryType;
  name: string;
  phone: string;
  city: string;
  product_id?: number | null;
  product_name?: string | null;
  message?: string | null;
  custom_item_type?: string | null;
  approximate_size?: string | null;
  budget_range?: string | null;
  reference_images?: string[];
  hp_website?: string; // Honeypot spam defense
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_city: string;
  product_purchased?: string;
  rating: number;
  review_text: string;
  client_image_url?: string;
  is_featured: number | boolean;
  display_order: number;
  created_at?: string;
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
}
