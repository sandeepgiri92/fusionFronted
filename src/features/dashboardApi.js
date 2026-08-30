import {baseApi} from "@/services/api/baseApi";
export const dashboardApi=baseApi.injectEndpoints({endpoints:b=>({getDashboard:b.query({query:()=>"/api/dashboard",providesTags:["Dashboard"]})})});
export const {useGetDashboardQuery}=dashboardApi;
