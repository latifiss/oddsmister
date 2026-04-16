import axios from 'axios';

const BASE_URL = 'https://oak.21centurynews.com/api/Ghanapolitan/article';

export interface CommentData {
  author: string;
  content: string;
  authorEmail?: string;
}

export interface ReplyData {
  author: string;
  content: string;
  authorEmail?: string;
}

export interface SectionData {
  sectionId: string;
  sectionSlug?: string;
}

export interface Article {
  _id: string;
  title: string;
  description: string;
  content: string | Array<{
    content_title: string;
    content_description: string;
    content_detail: string;
    isKey: boolean;
    content_published_at: string;
  }>;
  category: string;
  subcategory: string[];
  tags: string[];
  isLive: boolean;
  wasLive: boolean;
  isBreaking: boolean;
  isTopstory: boolean;
  hasLivescore: boolean;
  livescoreTag?: string;
  breakingExpiresAt?: string;
  topstoryExpiresAt?: string;
  isHeadline: boolean;
  source_name: string;
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

export interface Comment {
  _id: string;
  author: string;
  content: string;
  authorEmail?: string;
  upvotes: number;
  downvotes: number;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  _id: string;
  author: string;
  content: string;
  authorEmail?: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
}

export const getArticles = async (page?: number, limit?: number): Promise<ApiResponse<{ articles: Article[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}?${params.toString()}`);
  return res.data;
};

export const getHeadline = async (): Promise<ApiResponse<{ article: Article }>> => {
  const res = await axios.get(`${BASE_URL}/headline/current`);
  return res.data;
};

export const getBreakingNews = async (): Promise<ApiResponse<{ articles: Article[] }>> => {
  const res = await axios.get(`${BASE_URL}/breaking`);
  return res.data;
};

export const getLiveArticles = async (): Promise<ApiResponse<{ articles: Article[] }>> => {
  const res = await axios.get(`${BASE_URL}/live`);
  return res.data;
};

export const getTopStories = async (): Promise<ApiResponse<{ articles: Article[] }>> => {
  const res = await axios.get(`${BASE_URL}/top-stories`);
  return res.data;
};

export const getArticleFeed = async (page?: number, limit?: number): Promise<ApiResponse<{ articles: Article[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/feed?${params.toString()}`);
  return res.data;
};

export const getArticleFeedByCategory = async (category: string, page?: number, limit?: number): Promise<ApiResponse<{ articles: Article[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/feed/category/${category}?${params.toString()}`);
  return res.data;
};

export const getArticlesWithSections = async (): Promise<ApiResponse<{ articles: Article[] }>> => {
  const res = await axios.get(`${BASE_URL}/with-sections`);
  return res.data;
};

export const getArticlesWithoutSection = async (): Promise<ApiResponse<{ articles: Article[] }>> => {
  const res = await axios.get(`${BASE_URL}/without-section`);
  return res.data;
};

export const getArticlesWithoutSectionByCategory = async (category: string): Promise<ApiResponse<{ articles: Article[] }>> => {
  const res = await axios.get(`${BASE_URL}/without-section-by-category/${category}`);
  return res.data;
};

export const getArticlesWithoutSectionBySubcategory = async (subcategory: string): Promise<ApiResponse<{ articles: Article[] }>> => {
  const res = await axios.get(`${BASE_URL}/without-section-by-subcategory/${subcategory}`);
  return res.data;
};

export const getArticlesBySection = async (sectionSlug: string, page?: number, limit?: number): Promise<ApiResponse<{ articles: Article[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/section/${sectionSlug}?${params.toString()}`);
  return res.data;
};

export const getArticlesBySectionId = async (sectionId: string, page?: number, limit?: number): Promise<ApiResponse<{ articles: Article[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/section/id/${sectionId}?${params.toString()}`);
  return res.data;
};

export const getArticlesBySectionSlug = async (sectionSlug: string, page?: number, limit?: number): Promise<ApiResponse<{ articles: Article[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/section/slug/${sectionSlug}?${params.toString()}`);
  return res.data;
};

export const getArticlesByCategory = async (category: string, page?: number, limit?: number): Promise<ApiResponse<{ articles: Article[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/category/${category}?${params.toString()}`);
  return res.data;
};

export const getArticlesBySubcategory = async (subcategory: string, page?: number, limit?: number): Promise<ApiResponse<{ articles: Article[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/subcategory/${subcategory}?${params.toString()}`);
  return res.data;
};

export const getArticlesByStatus = async (status: string, page?: number, limit?: number): Promise<ApiResponse<{ articles: Article[] }>> => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/status/${status}?${params.toString()}`);
  return res.data;
};

export const getSimilarArticles = async (slug: string): Promise<ApiResponse<{ articles: Article[] }>> => {
  const res = await axios.get(`${BASE_URL}/similar/${slug}`);
  return res.data;
};

export const getArticleBySlug = async (slug: string): Promise<ApiResponse<{ article: Article }>> => {
  const res = await axios.get(`${BASE_URL}/slug/${slug}`);
  return res.data;
};

export const getArticleById = async (id: string): Promise<ApiResponse<{ article: Article }>> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const searchArticles = async (query: string, page?: number, limit?: number): Promise<ApiResponse<{ articles: Article[] }>> => {
  const params = new URLSearchParams();
  params.append('q', query);
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/search?${params.toString()}`);
  return res.data;
};

export const getComments = async (slug: string): Promise<ApiResponse<{ comments: Comment[] }>> => {
  const res = await axios.get(`${BASE_URL}/${slug}/comments`);
  return res.data;
};

export const addComment = async (slug: string, commentData: CommentData): Promise<ApiResponse<{ comment: Comment }>> => {
  const res = await axios.post(`${BASE_URL}/${slug}/comments`, commentData);
  return res.data;
};

export const editComment = async (slug: string, commentId: string, commentData: Partial<CommentData>): Promise<ApiResponse<{ comment: Comment }>> => {
  const res = await axios.put(`${BASE_URL}/${slug}/comments/${commentId}`, commentData);
  return res.data;
};

export const deleteComment = async (slug: string, commentId: string): Promise<ApiResponse<{ message: string }>> => {
  const res = await axios.delete(`${BASE_URL}/${slug}/comments/${commentId}`);
  return res.data;
};

export const addReply = async (slug: string, commentId: string, replyData: ReplyData): Promise<ApiResponse<{ reply: Reply }>> => {
  const res = await axios.post(`${BASE_URL}/${slug}/comments/${commentId}/replies`, replyData);
  return res.data;
};

export const editReply = async (slug: string, commentId: string, replyId: string, replyData: Partial<ReplyData>): Promise<ApiResponse<{ reply: Reply }>> => {
  const res = await axios.put(`${BASE_URL}/${slug}/comments/${commentId}/replies/${replyId}`, replyData);
  return res.data;
};

export const deleteReply = async (slug: string, commentId: string, replyId: string): Promise<ApiResponse<{ message: string }>> => {
  const res = await axios.delete(`${BASE_URL}/${slug}/comments/${commentId}/replies/${replyId}`);
  return res.data;
};

export const upvoteComment = async (slug: string, commentId: string): Promise<ApiResponse<{ comment: Comment }>> => {
  const res = await axios.post(`${BASE_URL}/${slug}/comments/${commentId}/upvote`);
  return res.data;
};

export const downvoteComment = async (slug: string, commentId: string): Promise<ApiResponse<{ comment: Comment }>> => {
  const res = await axios.post(`${BASE_URL}/${slug}/comments/${commentId}/downvote`);
  return res.data;
};

export const upvoteReply = async (slug: string, commentId: string, replyId: string): Promise<ApiResponse<{ reply: Reply }>> => {
  const res = await axios.post(`${BASE_URL}/${slug}/comments/${commentId}/replies/${replyId}/upvote`);
  return res.data;
};

export const downvoteReply = async (slug: string, commentId: string, replyId: string): Promise<ApiResponse<{ reply: Reply }>> => {
  const res = await axios.post(`${BASE_URL}/${slug}/comments/${commentId}/replies/${replyId}/downvote`);
  return res.data;
};

export const assignArticleToSection = async (id: string, sectionData: SectionData): Promise<ApiResponse<{ article: Article }>> => {
  const res = await axios.post(`${BASE_URL}/${id}/assign-section`, sectionData);
  return res.data;
};

export const removeArticleFromSection = async (id: string): Promise<ApiResponse<{ article: Article }>> => {
  const res = await axios.post(`${BASE_URL}/${id}/remove-section`);
  return res.data;
};

export const getArticlesByTag = async (
  tag: string, 
  page?: number, 
  limit?: number,
  filters?: {
    category?: string;
    has_section?: boolean;
    isLive?: boolean;
  }
): Promise<ApiResponse<{ 
  articles: Article[];
  tag: string;
  tagCount?: number;
  results?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
}>> => {
  const params = new URLSearchParams();
  
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  if (filters?.category) params.append('category', filters.category);
  if (filters?.has_section !== undefined) params.append('has_section', filters.has_section.toString());
  if (filters?.isLive !== undefined) params.append('isLive', filters.isLive.toString());
  
  const queryString = params.toString();
  const url = `${BASE_URL}/tag/${encodeURIComponent(tag)}${queryString ? `?${queryString}` : ''}`;
  
  const res = await axios.get(url);
  return res.data;
};