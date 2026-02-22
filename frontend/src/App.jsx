import { ErrorBoundary } from "react-error-boundary";
import { AppRoutes } from "./routes/AppRoutes";
import { useThemeStore } from "./store/themeStore";
import { useAuthStore } from "./store/authStore";
import { Toaster } from "react-hot-toast";
import { Suspense, useEffect } from "react"; // Add useEffect here
import Loader from "./components/common/Loader";

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const { darkMode } = useThemeStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="text-center max-w-2xl">
        <div className="text-6xl mb-6">😵</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We're sorry for the inconvenience. Our team has been notified.
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-left overflow-auto">
            {error.message}
          </pre>
        )}
        <button onClick={resetErrorBoundary} className="btn-primary px-8 py-3">
          Try Again
        </button>
      </div>
    </div>
  );
};

function App() {
  const { darkMode } = useThemeStore();
  const { checkAuth } = useAuthStore();

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Check if user is already authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
        window.location.reload();
      }}
    >
      <Suspense fallback={<Loader />}>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: darkMode ? "#1F2937" : "#FFFFFF",
              color: darkMode ? "#F9FAFB" : "#111827",
              borderRadius: "1rem",
              border: `1px solid ${darkMode ? "#374151" : "#E5E7EB"}`,
            },
            success: {
              icon: "🎉",
              style: {
                background: "#10B981",
                color: "#FFFFFF",
              },
            },
            error: {
              icon: "❌",
              style: {
                background: "#EF4444",
                color: "#FFFFFF",
              },
            },
          }}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
