import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useGetMeQuery } from "@/features/auth/authApi";

import PageLoader from "@/loadingScreen/PageLoader";

export default function ProtectedRoute() {
  const location = useLocation();

  const { isLoading, isError, isSuccess } = useGetMeQuery();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !isSuccess) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}
