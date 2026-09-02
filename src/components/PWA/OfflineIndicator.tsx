import { Alert } from "antd";

import { useEffect, useState } from "react";

const OfflineIndicator = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);

    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);

      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
      }}
    >
      <Alert
        message="Bạn đang offline"
        description="Tin nhắn mới sẽ được lưu và tự động gửi khi có kết nối."
        type="warning"
        showIcon
        banner
      />
    </div>
  );
};

export default OfflineIndicator;
