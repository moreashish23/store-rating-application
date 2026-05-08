import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import UserDashboard from "./pages/user/UserDashboard";
import StoreOwnerDashboard from "./pages/storeOwner/StoreOwnerDashboard";
import ChangePassword from "./pages/ChangePassword";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
    <div className="text-center max-w-sm">
      <div className="text-6xl font-extrabold text-slate-200 mb-2">403</div>
      <h1 className="text-xl font-bold text-slate-700 mb-2">Access Denied</h1>
      <p className="text-slate-500 text-sm mb-6">
        You don't have permission to view this page.
      </p>
      <a
        href="/login"
        className="inline-flex items-center px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors"
      >
        Back to Login
      </a>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "500",
              },
            }}
          />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/change-password" element={<ChangePassword />} />

              {/* Admin routes */}
              <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/stores" element={<AdminStores />} />
              </Route>

              {/* User routes */}
              <Route element={<RoleRoute allowedRoles={["USER"]} />}>
                <Route path="/user" element={<UserDashboard />} />
              </Route>

              {/* Store Owner routes */}
              <Route element={<RoleRoute allowedRoles={["STORE_OWNER"]} />}>
                <Route path="/store-owner" element={<StoreOwnerDashboard />} />
              </Route>
            </Route>

            {/* Fallbacks */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;