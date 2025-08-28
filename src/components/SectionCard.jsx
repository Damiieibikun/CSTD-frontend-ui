const SectionCard = ({ title, children, isOpen, onClick }) => (
  <div 
    className={`bg-white rounded-xl shadow-sm border transition-all duration-300 mb-6 overflow-hidden ${
      isOpen ? 'shadow-lg border-blue-400 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
    }`}
  >
    <div 
      className="flex justify-between items-center p-6 cursor-pointer transition-colors duration-200 hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
        <h2 className="capitalize text-xl font-semibold text-gray-800 tracking-tight">{title}</h2>
      </div>
      <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
    
    {isOpen && (
      <div className="px-6 pb-6 animate-fadeIn">
        {children}
      </div>
    )}
  </div>
);
export default SectionCard