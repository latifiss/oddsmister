import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import articleReducer from '../features/article/articleSlice';
import reviewReducer from '../features/review/reviewSlice';
import featureReducer from '../features/feature/featureSlice';
import movieReducer from '../features/movie/movieSlice';
import musicReducer from '../features/music/musicSlice';
import opinionReducer from '../features/opinion/opinionSlice';
import { authApi } from '../features/auth/authAPI';
import { articleApi } from '../features/article/articleAPI';
import { reviewApi } from '../features/review/reviewAPI';
import { featureApi } from '../features/feature/featureAPI';
import { movieApi } from '../features/movie/movieAPI';
import { musicApi } from '../features/music/musicAPI';
import { opinionApi } from '../features/opinion/opinionAPI';

const rootReducer = combineReducers({
  auth: authReducer,
  article: articleReducer,
  review: reviewReducer,
  feature: featureReducer,
  movie: movieReducer,
  music: musicReducer,
  opinion: opinionReducer,
   [authApi.reducerPath]: authApi.reducer,
  [articleApi.reducerPath]: articleApi.reducer,
  [reviewApi.reducerPath]: reviewApi.reducer,
  [featureApi.reducerPath]: featureApi.reducer,
  [movieApi.reducerPath]: movieApi.reducer,
  [musicApi.reducerPath]: musicApi.reducer,
  [opinionApi.reducerPath]: opinionApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;