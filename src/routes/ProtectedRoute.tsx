import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../hooks/redux";

const ProtectedRoute = () => {
  const { isAuthenticated, initialized } = useAppSelector(
    (state) => state.auth,
  );

  if (!initialized && isAuthenticated) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
