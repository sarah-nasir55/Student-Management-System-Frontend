import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './components/Dashboard/Dashboard';
import Students from './components/Students/Students';
import Semesters from './components/Semesters/Semesters';
import Courses from './components/Courses/Courses';
import Enrollments from './components/Enrollments/Enrollments';
import { Toaster } from './components/ui/toaster';
import './App.css';
// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Dashboard>
          <Routes>
            <Route path="/" element={<Students />} />
            <Route path="/semesters" element={<Semesters />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/enrollments" element={<Enrollments />} />
          </Routes>
        </Dashboard>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
