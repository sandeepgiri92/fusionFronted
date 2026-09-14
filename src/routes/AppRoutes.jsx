import Layout from "@/layout/Layout";
import ErrorPage from "@/loadingScreen/ErrorPage";
import AdminLogin from "@/pages/AdminLogin";
import Dashboard from "@/pages/Dashboard";
import EntryPage from "@/pages/EntryPage";
import ExpensePage from "@/pages/ExpensePage";
import ForgotPassword from "@/pages/ForgotPassword";
import MobileApkDownloadPage from "@/pages/MobileApkDownloadPage";
import PaymentsStatus from "@/pages/PaymentsStatus";
import Stock from "@/pages/Stock";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/mobile-screen" element={<MobileApkDownloadPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="sale" element={<EntryPage type="Sale" />} />
            <Route path="purchase" element={<EntryPage type="Purchase" />} />
            <Route path="service" element={<EntryPage type="Service" />} />
            <Route path="stock" element={<Stock />} />
            <Route
              path="petrol-expense"
              element={<ExpensePage type="petrol" title="Petrol Expense" />}
            />
            <Route
              path="smc-expense"
              element={<ExpensePage type="smc" title="SMC Expense" />}
            />
            <Route
              path="other-expense"
              element={<ExpensePage type="other" title="Other Expense" />}
            />
            <Route path="payment-status" element={<PaymentsStatus />} />
          </Route>
        </Route>
        <Route path="/404" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
