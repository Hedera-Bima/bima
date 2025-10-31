import React from 'react';
import Header from './Header';
import { Footer } from './Footer';
import Chatbot from '../Pages/Chatbot';

interface LayoutProps {
  children: React.ReactNode;
  /**
   * When true, renders the Header after the page content instead of before.
   */
  headerAfter?: boolean;
  /**
   * When true, shows the Header. Defaults to false so Header is not shown by default.
   */
  showHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, headerAfter = false, showHeader = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && !headerAfter && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {showHeader && headerAfter && <Header />}
      <Footer />
      {/* Global Chatbot visible on all pages */}
      <Chatbot />
    </div>
  );
};

export default Layout;
