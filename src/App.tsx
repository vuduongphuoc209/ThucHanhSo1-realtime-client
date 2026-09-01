import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "./hooks/redux";

import { finishInitialization, getMe } from "./store/slices/authSlice";

import { connectSocket, disconnectSocket } from "./services/socket";

import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useAppDispatch();

  const { token, isAuthenticated, initialized } = useAppSelector(
    (state) => state.auth,
  );

  /**
   * Restore authentication
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");

    if (storedToken) {
      dispatch(getMe());
    } else {
      dispatch(finishInitialization());
    }
  }, [dispatch]);

  /**
   * Socket lifecycle
   */
  useEffect(() => {
    if (initialized && isAuthenticated && token) {
      connectSocket();

      return () => {
        disconnectSocket();
      };
    }
  }, [initialized, isAuthenticated, token]);

  return <AppRoutes />;
}

export default App;
