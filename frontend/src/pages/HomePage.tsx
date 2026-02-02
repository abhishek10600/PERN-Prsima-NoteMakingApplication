import { logoutUser } from "@/api/auth.api";
import { logout } from "@/store/slices/authSlice";
import type { RootState } from "@/store/store";
import { getFromLocalStorage, removeFromLocalStorage } from "@/utils/helpers";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [serverError, setServerError] = useState<string | null>(null);
  const handleLogout = async () => {
    try {
      const token = getFromLocalStorage("accessToken");
      if (!token) {
      } else {
        const response = await logoutUser();
        removeFromLocalStorage("accessToken");
        dispatch(logout());
        toast.success(response.message);
        navigate("/login");
      }
    } catch (error: any) {
      setServerError(error.message);
      toast.error(error.message);
    }
  };
  return (
    <div>
      {user ? (
        <>
          {`Welcome - ${user?.username}`}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-1 rounded-xl cursor-pointer"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <h1>You are not logged in</h1>
        </>
      )}
    </div>
  );
};

export default HomePage;
