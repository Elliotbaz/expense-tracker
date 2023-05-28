import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useSigninCheck } from 'reactfire';

function ProtectedRoute({ children }) {
    const { status, data: signInCheckResult } = useSigninCheck();

    if (status === 'loading') {
        return <div>Loading...</div>; // Adjust this to your app's loading component
    }

    console.log(signInCheckResult)

    if (signInCheckResult.signedIn === true) {
        return children;
    }

    return <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
    const { status, data: signInCheckResult } = useSigninCheck();

    if (status === 'loading') {
        return <div>Loading...</div>; // Adjust this to your app's loading component
    }

    if (signInCheckResult.signedIn === false) {
        return children;
    }

    return <Navigate to="/" replace />;
}

function Routing() {
    return (
        <Routes>
            <Route
                path="sign-up"
                element={
                    <PublicRoute>
                        <Signup />
                    </PublicRoute>
                }
            />

            <Route
                path="login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default Routing;
