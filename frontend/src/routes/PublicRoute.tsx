import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import type { JSX } from "react";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  children: JSX.Element;
}

const PublicRoute = ({ children }: Props) => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  if (loading) {
    return <Spinner />;
  }

  if (isAuthenticated) {
    return navigate("/", { replace: true });
  }

  return children;
};

export default PublicRoute;
