import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';
import {
  createOpinionStart,
  createOpinionSuccess,
  createOpinionFailure,
  updateOpinionStart,
  updateOpinionSuccess,
  updateOpinionFailure,
  deleteOpinionStart,
  deleteOpinionSuccess,
  deleteOpinionFailure,
} from './opinionSlice';

interface Opinion {
  _id: string;
  title: string;
  description: string;
  content: string;
  meta_title: string;
  meta_description: string;
  tags: string[];
  creator: string;
  image_url?: string;
  published_at: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateOpinionPayload extends Omit<Opinion, '_id' | 'createdAt' | 'updatedAt'> {
  thumbnail?: File;
}

interface UpdateOpinionPayload extends Partial<Omit<Opinion, '_id' | 'createdAt' | 'updatedAt'>> {
  id: string;
  thumbnail?: File;
}

export const opinionApi = createApi({
  reducerPath: 'opinionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://ghweb.21centurynews.com/api/opinion/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Opinion'],
  endpoints: (builder) => ({
    createOpinion: builder.mutation<Opinion, FormData>({
      query: (payload) => ({
        url: '',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Opinion'],
      async onQueryStarted(payload, { dispatch, queryFulfilled }) {
        dispatch(createOpinionStart());
        try {
          const { data } = await queryFulfilled;
          dispatch(createOpinionSuccess());
        } catch (error: any) {
          const message =
            error?.error ||
            error?.data?.message ||
            error?.data?.messages?.[0] ||
            'Failed to create opinion.';
          dispatch(createOpinionFailure(message));
        }
      },
    }),

    updateOpinion: builder.mutation<Opinion, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Opinion'],
      async onQueryStarted({ id, formData }, { dispatch, queryFulfilled }) {
        dispatch(updateOpinionStart());
        try {
          const { data } = await queryFulfilled;
          dispatch(updateOpinionSuccess());
        } catch (error: any) {
          const message =
            error?.error ||
            error?.data?.message ||
            error?.data?.messages?.[0] ||
            'Failed to update opinion.';
          dispatch(updateOpinionFailure(message));
        }
      },
    }),

    getAllOpinions: builder.query<Opinion[], void>({
      query: () => '',
      providesTags: ['Opinion'],
    }),

    getSingleOpinion: builder.query<Opinion, string>({
      query: (id) => `${id}`,
      providesTags: (result, error, id) => [{ type: 'Opinion', id }],
    }),

    getOpinionsByTag: builder.query<Opinion[], string>({
      query: (tag) => `tag/${tag}`,
      providesTags: (result, error, tag) => [{ type: 'Opinion', tag }],
    }),

    deleteOpinion: builder.mutation<void, string>({
      query: (id) => ({
        url: `${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Opinion'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        dispatch(deleteOpinionStart());
        try {
          await queryFulfilled;
          dispatch(deleteOpinionSuccess());
        } catch (error: any) {
          const message =
            error?.error ||
            error?.data?.message ||
            error?.data?.messages?.[0] ||
            'Failed to delete opinion.';
          dispatch(deleteOpinionFailure(message));
        }
      },
    }),
  }),
});

export const {
  useCreateOpinionMutation,
  useUpdateOpinionMutation,
  useGetAllOpinionsQuery,
  useGetSingleOpinionQuery,
  useGetOpinionsByTagQuery,
  useDeleteOpinionMutation,
} = opinionApi;