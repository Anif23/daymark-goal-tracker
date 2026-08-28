import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Layout from "./Layout";

const AuthLayout = () => {
  const { useGetMe } = useAuth();
  const { data: user, isLoading } = useGetMe();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading session...</p>
      </div>
    );
  }

  const isPublicAuthPage = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ].includes(location.pathname);

  if (!user && !isPublicAuthPage) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && isPublicAuthPage && location.pathname !== "/verify-email") {
    return <Navigate to="/" replace />;
  }

  return <Layout />;
};

export default AuthLayout;
