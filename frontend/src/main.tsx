import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import HowItWorks from './components/HowItWorks';
import Landing from './components/Landing';
import Hero from './components/Hero';
import Wallet from './components/Wallet';
import Layout from './components/Layout';
import { TrustedInspectors } from './components/TrustedInspectors';
import InspectorDashboard from './components/InspectorDashboard';
import SellerDashboard from './components/SellerDashboard';

import './index.css';


const router = createBrowserRouter([
  // Landing page with clear value proposition
  {
    path: '/',
    element: <Layout showHeader><Landing /></Layout>,
  },
  // Core marketplace functionality
  {
    path: '/marketplace',
    element: <Layout showHeader><Hero /></Layout>,
  },
  {
    path: '/sell-land',
    element: <Layout showHeader><SellerDashboard /></Layout>,
  },
  {
    path: '/inspectors',
    element: <Layout showHeader><TrustedInspectors /></Layout>,
  },
  {
    path: '/inspector-dashboard',
    element: <Layout showHeader><InspectorDashboard /></Layout>,
  },
  // How it works
  {
    path: '/how-it-works',
    element: <Layout showHeader><HowItWorks /></Layout>,
  },
  // Legacy routes for backward compatibility
  {
    path: '/trusted',
    element: <Navigate to="/inspectors" replace />,
  },
  {
    path: '/hero',
    element: <Navigate to="/marketplace" replace />,
  },
  {
    path: '/wallet',
    element: <Navigate to="/sell-land" replace />,
  },
  {
    path: '/discover',
    element: <Navigate to="/how-it-works" replace />,
  },
  {
    path: '/chatbot',
    element: <Navigate to="/how-it-works" replace />,
  },
  // Wildcard: redirect unknown paths to root
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </React.StrictMode>
);