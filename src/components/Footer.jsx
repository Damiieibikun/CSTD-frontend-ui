const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-5 bg-gradient-to-r from-gray-100 to-white shadow-inner">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
         
          <p className="text-gray-700 text-sm font-light">
            &copy; {currentYear} CSTD. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
