import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
  const pageRef = useRef();
  const location = useLocation();

  useEffect(() => {
    // Ensure we start from the top of the page on route changes
    window.scrollTo(0, 0);
    
    // Add animation class
    const page = pageRef.current;
    if (page) {
      page.classList.add('animate-fadeIn');
      
      // Clean up animation class
      return () => {
        page.classList.remove('animate-fadeIn');
      };
    }
  }, [location.pathname]);

  return (
    <div 
      ref={pageRef} 
      className="page-transition w-full"
    >
      {children}
    </div>
  );
} 