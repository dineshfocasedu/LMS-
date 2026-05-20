import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";

import FOCASLandingPage from "./components/FOCASLandingPage";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RegistrationSuccess = lazy(() => import("./components/RegistrationSuccess"));
const ExternalApp = lazy(() => import("./components/external/ExternalApp"));

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    {
      path: "/*",
      element: <ExternalApp />,
    },
    {
      path: "/focas",
      element: <Index />,
    },
    {
      path: "/success",
      element: <RegistrationSuccess />,
    },
    {
      path: "/course/:id",
      element: <FOCASLandingPage />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

const App = () => {
  useEffect(() => {
    const unsubscribe = router.subscribe((state) => {
      if (state.location && typeof window !== "undefined") {
        const fbq = window.fbq;

        if (fbq) {
          fbq("track", "PageView");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen text-lg">
            Loading...
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
};

export default App;