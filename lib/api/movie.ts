import axios from 'axios';

const BASE_URL = 'https://bolt.21centurynews.com/api/movie';

export const getAllMovies = async (page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}?${params.toString()}`);
  return res.data;
};

export const getMoviesByGenre = async (genre: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/genre/${genre}?${params.toString()}`);
  return res.data;
};

export const getSingleMovie = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};