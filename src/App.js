import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { useSelector } from "react-redux";
import Dashboard from "./components/Dashboard/Dashboard";
import Students from "./components/Students/Students";
import Semesters from "./components/Semesters/Semesters";
import Courses from "./components/Courses/Courses";
import Enrollments from "./components/Enrollments/Enrollments";
import LandingPage from "./components/LandingPage/LandingPage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import { App as AntdApp } from "antd";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, 
    },
  },
});

function AppContent() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <AntdApp>
      <ConfigProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
              <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />

              {/* Protected Routes */}
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <Dashboard>
                      <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/semesters" element={<Semesters />} />
                        <Route path="/courses" element={<Courses />} />
                        <Route path="/enrollments" element={<Enrollments />} />
                      </Routes>
                    </Dashboard>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </QueryClientProvider>
      </ConfigProvider>
    </AntdApp>
  );
}


function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;
