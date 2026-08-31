import { baseApi } from "@/services/api/baseApi";
export const authApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    login: b.mutation({
      query: (body) => ({ url: "/api/admin/login", method: "POST", body }),
      invalidatesTags: ["Auth"],
    }),
    getMe: b.query({ query: () => "/api/admin/me", providesTags: ["Auth"] }),
    logout: b.mutation({
      query: () => ({ url: "/api/admin/logout", method: "POST" }),
      invalidatesTags: ["Auth"],
    }),
    forgotPassword: b.mutation({
      query: (body) => ({
        url: "/api/admin/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: b.mutation({
      query: (body) => ({
        url: "/api/admin/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});
export const {
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
