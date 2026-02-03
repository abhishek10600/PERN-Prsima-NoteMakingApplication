import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./api/auth.api";
import { setAuthLoad, setUser } from "./store/slices/authSlice";
import { getFromLocalStorage } from "./utils/helpers";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getFromLocalStorage("accessToken");
        if (!token) {
          dispatch(setAuthLoad());
        } else {
          const userData = await getCurrentUser();
          dispatch(setUser(userData));
        }
      } catch (error) {
      } finally {
        dispatch(setAuthLoad());
      }
    };

    loadUser();
  }, [dispatch]);

  return (
    <div className="bg-[#0f58b61e] min-h-screen">
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
