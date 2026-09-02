import { Button, Space, Typography } from "antd";

import { useRegisterSW } from "virtual:pwa-register/react";

const ReloadPrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],

    needRefresh: [needRefresh, setNeedRefresh],

    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl: string, registration: ServiceWorkerRegistration | undefined) {
      console.log("Service Worker registered:", swUrl);

      console.log("Registration:", registration);
    },

    onRegisterError(error: Error) {
      console.error("Service Worker registration error:", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        zIndex: 9999,
        width: 340,
        padding: 16,
        borderRadius: 12,
        background: "#fff",
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        border: "1px solid #eee",
      }}
    >
      <Typography.Text
        strong
        style={{
          display: "block",
          marginBottom: 8,
        }}
      >
        {offlineReady ? "Ứng dụng đã sẵn sàng offline" : "Có phiên bản mới"}
      </Typography.Text>

      <Typography.Text
        type="secondary"
        style={{
          display: "block",
          marginBottom: 12,
        }}
      >
        {offlineReady
          ? "Bạn có thể sử dụng ứng dụng khi mất kết nối."
          : "Tải phiên bản mới để sử dụng phiên bản cập nhật."}
      </Typography.Text>

      <Space>
        {needRefresh && (
          <Button type="primary" onClick={() => updateServiceWorker(true)}>
            Cập nhật
          </Button>
        )}

        <Button onClick={close}>Đóng</Button>
      </Space>
    </div>
  );
};

export default ReloadPrompt;
