import { baseApi } from "@/services/api/baseApi";
import { configureStore } from "@reduxjs/toolkit";


export const store = configureStore({
    reducer:{
        [baseApi.reducerPath]:baseApi.reducer,
    },
    middleware:(getDefaultMiddleware) =>getDefaultMiddleware().concat(baseApi.middleware),
})