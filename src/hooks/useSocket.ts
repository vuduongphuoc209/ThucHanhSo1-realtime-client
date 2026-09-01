import { useEffect } from "react";

import { connectSocket, disconnectSocket } from "../services/socket";

export const useSocket = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [enabled]);
};
