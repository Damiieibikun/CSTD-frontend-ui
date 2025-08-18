import React from 'react'

const Footer = () => {
   const currentYear = new Date().getFullYear();

  return (
    <footer className='py-7 mt-5 bg-gray-50 shadow-sm'>
      <p className='text-center text-gray-600'>&copy; {currentYear} CSTD. All rights reserved.</p>
      {/* Add information here if needed */}
      
    </footer>
  );
}

export default Footer
