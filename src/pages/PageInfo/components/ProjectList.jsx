import { useEffect, useRef, useState } from 'react';
import { FaEdit, FaTrash, FaSearch, FaShieldAlt, FaCode, FaHandshake, FaBoxOpen, FaChevronDown, FaChevronUp, FaImage, FaTimes, FaCalendar, FaTag } from 'react-icons/fa';

const ProjectList = ({ cat, project, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState('0px');
  const [imageError, setImageError] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isExpanded, project]);

  const handleImageError = () => {
    setImageError(true);
  };

  const openImageModal = () => {
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  // Get category color scheme
  const getCategoryColors = () => {
    switch(cat) {
      case 'upcoming':
        return {
          bg: 'from-blue-500 to-purple-600',
          text: 'text-blue-100',
          badge: 'bg-blue-100 text-blue-800',
          icon: 'text-blue-500'
        };
      case 'ongoing':
        return {
          bg: 'from-orange-500 to-red-600',
          text: 'text-orange-100',
          badge: 'bg-orange-100 text-orange-800',
          icon: 'text-orange-500'
        };
      case 'completed':
        return {
          bg: 'from-green-500 to-teal-600',
          text: 'text-green-100',
          badge: 'bg-green-100 text-green-800',
          icon: 'text-green-500'
        };
      default:
        return {
          bg: 'from-gray-500 to-gray-700',
          text: 'text-gray-100',
          badge: 'bg-gray-100 text-gray-800',
          icon: 'text-gray-500'
        };
    }
  };

  const colors = getCategoryColors();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date specified';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 mb-6">
        {/* Project Header */}
        <div className={`bg-gradient-to-r ${colors.bg} p-5 text-white`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {/* Project Image Thumbnail */}
              <div className="relative flex-shrink-0">
                {project.image?.url && !imageError ? (
                  <img 
                    src={project.image.url}
                    alt={project.title}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-lg cursor-pointer"
                    onError={handleImageError}
                    onClick={openImageModal}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-white bg-opacity-20 flex items-center justify-center border-2 border-white cursor-pointer" onClick={openImageModal}>
                    <FaImage className="text-white text-xl" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                  <div className={`w-3 h-3 rounded-full ${colors.badge.split(' ')[0]}`}></div>
                </div>
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.badge} capitalize`}>
                    {cat || 'project'}
                  </span>
                  {project.date && (
                    <span className="flex items-center text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      <FaCalendar className="mr-1 text-xs" />
                      {formatDate(project.date)}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold truncate">
                  {project.title}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <button 
                onClick={() => onEdit(project)}
                className="p-2 rounded-lg bg-white bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 group"
                aria-label="Edit project"
              >
                <FaEdit className="text-white group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={onDelete}
                className="p-2 rounded-lg bg-white bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 group"
                aria-label="Delete project"
              >
                <FaTrash className="text-white group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg bg-white bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 group"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <FaChevronUp className="text-white group-hover:scale-110 transition-transform" />
                ) : (
                  <FaChevronDown className="text-white group-hover:scale-110 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        <div 
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{ height: contentHeight }}
          ref={contentRef}
        >
          <div className="p-6 space-y-6">
            {/* Project Image (Full Size) */}
            {project.image?.url && !imageError && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <FaImage className={`text-lg mr-2 ${colors.icon}`} />
                  <h4 className="font-semibold text-gray-800">Project Image</h4>
                </div>
                <div className="relative group cursor-pointer" onClick={openImageModal}>
                  <img 
                    src={project.image.url}
                    alt={project.title}
                    className="w-full h-64 object-contain rounded-lg border border-gray-200 shadow-sm group-hover:shadow-md transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg flex items-center">
                      <FaSearch className="mr-2" />
                      Click to view full size
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Objective */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FaSearch className="text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Objective</h4>
                </div>
                <div 
                  className="text-gray-700 prose prose-sm max-w-none first-letter:capitalize bg-white p-3 rounded-lg border border-gray-200"
                  dangerouslySetInnerHTML={{ __html: project.objective }}
                />
              </div>

              {/* Importance */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <FaShieldAlt className="text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Importance</h4>
                </div>
                <div 
                  className="text-gray-700 prose prose-sm max-w-none first-letter:capitalize bg-white p-3 rounded-lg border border-gray-200"
                  dangerouslySetInnerHTML={{ __html: project.importance }}
                />
              </div>

              {/* Technology */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <FaCode className="text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Technology</h4>
                </div>
                <div 
                  className="text-gray-700 prose prose-sm max-w-none first-letter:capitalize bg-white pl-5 p-3 rounded-lg border border-gray-200"
                  dangerouslySetInnerHTML={{ __html: project.technology }}
                />
              </div>

              {/* Partners */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                    <FaHandshake className="text-yellow-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800">Partners</h4>
                </div>
                <div 
                  className="text-gray-700 prose prose-sm max-w-none first-letter:capitalize bg-white p-3 rounded-lg border border-gray-200"
                  dangerouslySetInnerHTML={{ __html: project.partners }}
                />
              </div>
            </div>

            {/* Output - Full Width */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="bg-red-100 p-2 rounded-lg mr-3">
                  <FaBoxOpen className="text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-800">Output</h4>
              </div>
              <div 
                className="text-gray-700 prose prose-sm max-w-none first-letter:capitalize bg-white p-4 rounded-lg border border-gray-200"
                dangerouslySetInnerHTML={{ __html: project.output }}
              />
            </div>

            {/* Additional metadata if available */}
            {(project.status || project.tags) && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Additional Information</h4>
                <div className="flex flex-wrap gap-2">
                  {project.status && (
                    <span className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      <FaTag className="mr-1 text-xs" />
                      Status: {project.status}
                    </span>
                  )}
                  {project.tags && project.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expand/Collapse Footer */}
        <div className="border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 px-4 flex items-center justify-center text-gray-600 hover:text-gray-800 font-medium transition-colors group"
          >
            {isExpanded ? (
              <>
                <span>Show Less</span>
                <FaChevronUp className="ml-2 group-hover:-translate-y-0.5 transition-transform" />
              </>
            ) : (
              <>
                <span>View Project Details</span>
                <FaChevronDown className="ml-2 group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeImageModal}
        >
          <div 
            className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white flex justify-between items-center p-4 border-b z-10">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaImage className="mr-2 text-blue-500" />
                {project.title}
              </h3>
              <button 
                onClick={closeImageModal}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6 flex justify-center max-h-[70vh] overflow-auto">
              <img 
                src={project.image?.url}
                alt={project.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-center">
              <button 
                onClick={closeImageModal}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectList;