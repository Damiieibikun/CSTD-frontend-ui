import { useEffect, useRef, useState } from 'react';
import { FaEdit, FaTrash, FaSearch, FaShieldAlt, FaCode, FaHandshake, FaBoxOpen, FaChevronDown, FaChevronUp, FaImage, FaTimes } from 'react-icons/fa';

const ProjectList = ({ cat, project, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState('100px');
  const [imageError, setImageError] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? `${contentRef.current.scrollHeight}px` : '100px');
    }
  }, [isExpanded]);

  const handleImageError = () => {
    setImageError(true);
  };

  const openImageModal = () => {
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 mt-5">
        {/* Project Header */}
        <div className={`bg-gradient-to-r ${cat === 'upcoming' ? 'from-emerald-600 to-indigo-700' : 'from-orange-600 to-indigo-700'} capitalize p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Project Image Thumbnail */}
              {project.image.url && !imageError ? (
                <img 
                  src={project.image?.url}
                  alt={project.title}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-2 border-white">
                  <FaImage className="text-white text-lg" />
                </div>
              )}
              <h3 className="text-xl font-bold">
                {project.title}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onEdit(project)}
                className="p-2 rounded-full hover:bg-blue-500 transition-colors"
                aria-label="Edit project"
              >
                <FaEdit className="text-white" />
              </button>
              <button 
                onClick={onDelete}
                className="p-2 rounded-full hover:bg-red-500 transition-colors"
                aria-label="Delete project"
              >
                <FaTrash className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        <div 
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ height: contentHeight }}
          ref={contentRef}
        >
          <div className="p-6 space-y-4">
            {/* Project Image (Full Size) */}
            {project.image.url && !imageError && (
              <div className="flex items-start">
                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                  <FaImage className="text-indigo-600" />
                </div>

              <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-2">Project Image</h4>
                  <div className="relative flex justify-center">
                    <div className="cursor-pointer group" onClick={openImageModal}>
                      <img 
                        src={project.image?.url}
                        alt={project.title}
                        className="max-w-full h-48 object-contain rounded-lg border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-200 mx-auto"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white text-sm bg-black bg-opacity-70 px-3 py-2 rounded-md flex items-center">
                          <FaSearch className="mr-2" />
                          Click to view full size
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Objective */}
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <FaSearch className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Objective</h4>
                <div 
                  className="text-gray-600 prose prose-sm max-w-none first-letter:capitalize"
                  dangerouslySetInnerHTML={{ __html: project.objective }}
                />
              </div>
            </div>

            {/* Importance */}
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <FaShieldAlt className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Importance</h4>
                <div 
                  className="first-letter:capitalize text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.importance }}
                />
              </div>
            </div>

            {/* Technology */}
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-lg mr-3">
                <FaCode className="text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Technology</h4>
                <div 
                  className="first-letter:capitalize text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.technology }}
                />
              </div>
            </div>

            {/* Partners */}
            <div className="flex items-start">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <FaHandshake className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Partners</h4>
                <div 
                  className="first-letter:capitalize text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.partners }}
                />
              </div>
            </div>

            {/* Output */}
            <div className="flex items-start">
              <div className="bg-red-100 p-2 rounded-lg mr-3">
                <FaBoxOpen className="text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Output</h4>
                <div 
                  className="first-letter:capitalize text-gray-600 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.output }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <div className="flex justify-center p-4 border-t border-gray-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            {isExpanded ? (
              <>
                <span>Show Less</span>
                <FaChevronUp className="ml-2" />
              </>
            ) : (
              <>
                <span>Read More</span>
                <FaChevronDown className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div 
            className="relative bg-white rounded-lg max-w-4xl max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <button 
                onClick={closeImageModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6 flex justify-center">
              <img 
                src={project.image?.url}
                alt={project.title}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            <div className="p-4 border-t text-center">
              <button 
                onClick={closeImageModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectList;