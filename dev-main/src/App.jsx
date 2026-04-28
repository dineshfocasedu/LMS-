import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FOCASLandingPage from "./components/FOCASLandingPage";
import { useEffect, lazy, Suspense } from "react";
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RegistrationSuccess = lazy(() => import("./components/RegistrationSuccess"));
const ExternalApp = lazy(() => import("./components/external/ExternalApp"));
//import FOCASLandingPage from "./components/FOCASLandingPage";
const queryClient = new QueryClient();
const router = createBrowserRouter([
    { path: "/*", element: <ExternalApp /> },
    { path: "/focas", element: <Index /> },
    { path: "/success", element: <RegistrationSuccess /> },
    {path:"/course/:id",element:<FOCASLandingPage />}, 
], {
    future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
    },
});
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
    return (<QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Suspense fallback={null}>
          <RouterProvider router={router}/>
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>);
};
export default App;
