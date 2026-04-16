import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/news-feed';

export const getAllNews = async () => {
  const res = await axios.get(`${BASE_URL}/news`);
  return res.data;
};

export const getNewsByCategory = async (category: string) => {
  const res = await axios.get(`${BASE_URL}/news/category?category=${category}`);
  return res.data;
};

export const getNewsById = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/news/${id}`);
  return res.data;
};
