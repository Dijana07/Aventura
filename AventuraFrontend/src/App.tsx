import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/common/HomePage";
import UsersManagementPage from "./pages/auth/UsersManagementPage";
import TripsManagementPage from "./pages/auth/TripsManagementPage";
import MyTripsPage from "./pages/trip/MyTripsPage";
import TripDetailsPage from "./pages/trip/TripDetailsPage";
import MyProfilePage from "./pages/auth/MyProfilePage";
import NotFoundPage from "./pages/common/NotFoundPage";
import ProtectedRoute from "./pages/common/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} />
      <Route path="/management/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}> <UsersManagementPage /> </ProtectedRoute>} />
      <Route path="/management/trips" element={<ProtectedRoute allowedRoles={["ADMIN"]}> <TripsManagementPage /> </ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute> <MyTripsPage /> </ProtectedRoute>} />
      <Route path="/trip/:id" element={<ProtectedRoute> <TripDetailsPage /> </ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute> <MyProfilePage /> </ProtectedRoute>} />
      <Route path="/share/:token" element={<TripDetailsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;