import React from 'react';
import { Route, Routes, Outlet } from "react-router-dom";
import AuthProvider from './hooks/AuthProvider';
import LoggedHome from './pages/LoggedHome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import * as Sentry from "@sentry/react";
import FallbackComponent from './pages/ErrorFallBack';


const myFallback = <FallbackComponent />;

const App = () => {

  return (
    <Sentry.ErrorBoundary fallback={myFallback}>
      <div className="App section" id='App'>
        <Routes>
          <Route path="/" element={
            <AuthProvider>
              <Outlet />
            </AuthProvider>
          }>
            <Route index element={<LoggedHome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Sentry.ErrorBoundary>

  );
}

export default App;
