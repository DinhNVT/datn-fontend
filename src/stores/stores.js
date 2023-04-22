import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import authReducer from "./authSlice";
import storage from "redux-persist/lib/storage";
import authNotSaveSlice from "./authNotSaveSlice";
const persistConfig = {
  key: "root",
  version: 4,
  storage,
  blacklist: ["auth_not_save"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  auth_not_save: authNotSaveSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
