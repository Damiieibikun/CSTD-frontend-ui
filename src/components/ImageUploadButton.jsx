const ImageUploadButton = ({ onChange, className = "" }) => (
  <label className={`
    flex items-center justify-center px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 
    text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 
    cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none 
    focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 active:translate-y-0 ${className}
  `}>
    <input 
      type="file" 
      className="hidden" 
      accept="image/*,video/*"
      onChange={onChange}
      multiple
    />
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
    <span className="hidden lg:block font-medium">Upload Media</span>
    <span className="lg:hidden font-medium">Upload</span>
  </label>
);

export default ImageUploadButton
