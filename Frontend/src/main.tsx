import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Chatbot from './Pages/Chatbot';
import Discover from './Pages/Discover';
import Landing from './components/Landing';
import Hero from './components/Hero';
import Wallet from './components/Wallet';
import Layout from './components/Layout';
import { Footer } from './components/Footer'
import { TrustedInspectors } from './components/TrustedInspectors';

import './index.css';


const router = createBrowserRouter([
  // Root landing page: no header by default
  {
    path: '/',
    element: <Layout showHeader headerAfter><Landing /></Layout>,
  },
  // Pages that should show the header (before content)
  {
    path: '/trusted',
    element: <Layout><TrustedInspectors /></Layout>,
  },
  {
    path: '/footer',
    element: <Layout><Footer /></Layout>,
  },
  {
    path: '/chatbot',
    element: <Layout><Chatbot /></Layout>,
  },
  {
    path: '/discover',
    element: <Layout><Discover /></Layout>,
  },
  {
    path: '/hero',
    element: <Layout><Hero /></Layout>,
  },
  {
    path: '/wallet',
    element: <Layout><Wallet /></Layout>,
  },
  // Wildcard: redirect unknown paths to root
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </React.StrictMode>
);