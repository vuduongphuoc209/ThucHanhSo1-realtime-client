/// <reference types="vite/client" />

declare module "virtual:pwa-register/react" {
  export interface RegisterSWOptions {
    onRegisteredSW?: (swUrl: string, registration: ServiceWorkerRegistration) => void;
    onRegisterError?: (error: Error) => void;
  }

  export interface UseRegisterSWReturn {
    offlineReady: [boolean, (value: boolean) => void];
    needRefresh: [boolean, (value: boolean) => void];
    updateServiceWorker: (reloadPage?: boolean) => void;
  }

  export function useRegisterSW(options?: RegisterSWOptions): UseRegisterSWReturn;
}
