import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import PropertyDetail from "./pages/PropertyDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import OwnerLogin from "./pages/OwnerLogin";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import SavedProperties from "./pages/SavedProperties";
import OwnerDashboard from "./pages/OwnerDashboard";
import MyVisits from "./pages/MyVisits";
import InterestedPage from "./pages/InterestedPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/owner/login" element={<OwnerLogin />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/interested"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <InterestedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/property/:id"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <PropertyDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <SavedProperties />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["owner"]} redirectTo="/owner/login">
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visits"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <MyVisits />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
