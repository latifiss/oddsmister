import axios from 'axios';

const BASE_URL = 'https://oak.21centurynews.com/api/Ghanapolitan/graphic';

export interface Graphic {
  _id: string;
  title: string;
  description: string;
  content: any;
  category: string;
  subcategory: string[];
  tags: string[];
  meta_title: string;
  meta_description: string;
  creator: string;
  slug: string;
  image_url?: string;
  published_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse<T> {
  status: string;
  cached: boolean;
  results?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
  data: T;
  message?: string;
}

export const getGraphics = async (page?: number, limit?: number, category?: string): Promise<ApiResponse<{ graphics: Graphic[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (category) params.append('category', category);
  
  const res = await axios.get(`${BASE_URL}?${params.toString()}`);
  return res.data;
};

export const getGraphicById = async (id: string): Promise<ApiResponse<{ graphic: Graphic }>> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const getGraphicBySlug = async (slug: string): Promise<ApiResponse<{ graphic: Graphic }>> => {
  const res = await axios.get(`${BASE_URL}/slug/${slug}`);
  return res.data;
};

export const getGraphicsByCategory = async (category: string, page?: number, limit?: number): Promise<ApiResponse<{ graphics: Graphic[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/category/${category}?${params.toString()}`);
  return res.data;
};

export const getGraphicsBySubcategory = async (subcategory: string, page?: number, limit?: number): Promise<ApiResponse<{ graphics: Graphic[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/subcategory/${subcategory}?${params.toString()}`);
  return res.data;
};

export const getSimilarGraphics = async (slug: string, page?: number, limit?: number): Promise<ApiResponse<{ graphics: Graphic[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/similar/${slug}?${params.toString()}`);
  return res.data;
};

export const searchGraphics = async (query: string, page?: number, limit?: number): Promise<ApiResponse<{ graphics: Graphic[] }>> => {
  const params = new URLSearchParams();
  params.append('q', query);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/search?${params.toString()}`);
  return res.data;
};

export const getRecentGraphics = async (limit?: number): Promise<ApiResponse<{ graphics: Graphic[] }>> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/recent?${params.toString()}`);
  return res.data;
};

export const getFeaturedGraphics = async (limit?: number): Promise<ApiResponse<{ graphics: Graphic[] }>> => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/featured?${params.toString()}`);
  return res.data;
};

export const createGraphic = async (formData: FormData): Promise<ApiResponse<{ graphic: Graphic }>> => {
  const res = await axios.post(`${BASE_URL}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const updateGraphic = async (id: string, formData: FormData): Promise<ApiResponse<{ graphic: Graphic }>> => {
  const res = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return res.data;
};

export const deleteGraphic = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};