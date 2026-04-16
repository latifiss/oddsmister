import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import {
  createMovieStart,
  createMovieSuccess,
  createMovieFailure,
  updateMovieStart,
  updateMovieSuccess,
  updateMovieFailure,
  deleteMovieStart,
  deleteMovieSuccess,
  deleteMovieFailure,
} from './movieSlice';

interface Movie {
  _id: string;
  title: string;
  label: string;
  description: string;
  content: string;
  genre: string;
  tags: string[];
  creator: string;
  rating: number;
  releaseYear: number;
  youtube: boolean;
  youtube_url?: string;
  netflix: boolean;
  netflix_url?: string;
  showmax: boolean;
  showmax_url?: string;
  primevideo: boolean;
  primevideo_url?: string;
  irokotv: boolean;
  irokotv_url?: string;
  image_url?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateMoviePayload extends Omit<Movie, '_id' | 'createdAt' | 'updatedAt'> {
  thumbnail?: File;
}

interface UpdateMoviePayload extends Partial<Omit<Movie, '_id' | 'createdAt' | 'updatedAt'>> {
  id: string;
  thumbnail?: File;
}

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://ghweb.21centurynews.com/api/movie/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Movie'],
  endpoints: (builder) => ({
    createMovie: builder.mutation<Movie, FormData>({
      query: (payload) => ({
        url: '',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Movie'],
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        dispatch(createMovieStart());
        try {
          const { data } = await queryFulfilled;
          dispatch(createMovieSuccess());
        } catch (error: any) {
          const message =
            error?.error ||
            error?.data?.message ||
            error?.data?.messages?.[0] ||
            'Failed to create movie.';
          dispatch(createMovieFailure(message));
        }
      },
    }),

    updateMovie: builder.mutation<Movie, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Movie'],
      async onQueryStarted({ id, formData }, { dispatch, queryFulfilled }) {
        dispatch(updateMovieStart());
        try {
          const { data } = await queryFulfilled;
          dispatch(updateMovieSuccess());
        } catch (error: any) {
          const message =
            error?.error ||
            error?.data?.message ||
            error?.data?.messages?.[0] ||
            'Failed to update movie.';
          dispatch(updateMovieFailure(message));
        }
      },
    }),

    getAllMovies: builder.query<Movie[], void>({
      query: () => '',
      providesTags: ['Movie'],
    }),

    getMovieById: builder.query<Movie, string>({
      query: (id) => `${id}`,
      providesTags: (result, error, id) => [{ type: 'Movie', id }],
    }),

    getMoviesByGenre: builder.query<Movie[], string>({
      query: (genre) => `genre/${genre}`,
      providesTags: (result, error, genre) => [{ type: 'Movie', genre }],
    }),

    deleteMovie: builder.mutation<void, string>({
      query: (id) => ({
        url: `${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Movie'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(deleteMovieStart());
        try {
          await queryFulfilled;
          dispatch(deleteMovieSuccess());
        } catch (error: any) {
          const message =
            error?.error ||
            error?.data?.message ||
            error?.data?.messages?.[0] ||
            'Failed to delete movie.';
          dispatch(deleteMovieFailure(message));
        }
      },
    }),
  }),
});

export const {
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useGetAllMoviesQuery,
  useGetMovieByIdQuery,
  useGetMoviesByGenreQuery,
  useDeleteMovieMutation,
} = movieApi;