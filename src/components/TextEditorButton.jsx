const TextEditorButton = ({ onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center justify-center px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 
      text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 
      shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none 
      focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:translate-y-0 ${className}
    `}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
    <span className="hidden lg:block font-medium">Edit Content</span>
    <span className="lg:hidden font-medium">Edit</span>
  </button>
);

export default TextEditorButton;