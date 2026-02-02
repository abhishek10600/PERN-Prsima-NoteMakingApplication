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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
