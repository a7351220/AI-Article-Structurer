
import React from 'react';

const WandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.47 2.118 2.25 2.25 0 0 1-2.47-2.118c0-.62.28-1.22.755-1.622m13.313-6.11a3 3 0 0 0-5.78-1.128 2.25 2.25 0 0 1-2.47-2.118 2.25 2.25 0 0 1 2.47-2.118c.62 0 1.22.28 1.622.755m-6.11 13.313a3 3 0 0 0 1.128-5.78 2.25 2.25 0 0 1 2.118-2.47 2.25 2.25 0 0 1 2.118 2.47c0 .62-.28 1.22-.755 1.622m-6.11-13.313a3 3 0 0 0-1.128 5.78 2.25 2.25 0 0 1-2.118 2.47 2.25 2.25 0 0 1-2.118-2.47c-.001-.62.28-1.22.755-1.622m6.11 6.11 9.53-9.53" 
    />
  </svg>
);

export default WandIcon;
