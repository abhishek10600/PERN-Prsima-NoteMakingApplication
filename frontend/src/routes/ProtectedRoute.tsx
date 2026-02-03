import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { JSX } from "react";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return navigate("/login", { replace: true });
  }

  return children;
};

export default ProtectedRoute;
