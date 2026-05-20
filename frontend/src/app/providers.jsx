import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";
import { setupApiLayer } from "@/lib/setup-api";
import { AuthBootstrap } from "@/features/auth/components/AuthBootstrap";
import { Toaster } from "@/components/feedback";
import { useUiStore } from "@/store";

let apiLayerInitialized = false;

function ThemeSync({ children }) {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }, [theme]);

  return children;
}

function AppRuntimeSetup({ children }) {
  useEffect(() => {
    if (!apiLayerInitialized) {
      setupApiLayer();
      apiLayerInitialized = true;
    }
  }, []);

  return (
    <AuthBootstrap>
      {children}
      <Toaster />
    </AuthBootstrap>
  );
}

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync>
        <AppRuntimeSetup>{children}</AppRuntimeSetup>
      </ThemeSync>
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-start" />
      )}
    </QueryClientProvider>
  );
}
