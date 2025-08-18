import { useEffect, useRef, useState } from 'react';
import { FaEdit, FaTrash, FaSearch, FaShieldAlt, FaCode, FaHandshake, FaBoxOpen, FaChevronDown, FaChevronUp } from 'react-icons/fa';
 
const ProjectList = ({ cat, project, onEdit, onDelete }) => {
 const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState('100px');
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isExpanded ? `${contentRef.current.scrollHeight}px` : '100px');
    }
  }, [isExpanded]);
    return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 mt-5">
      {/* Project Header */}
      <div className={`bg-gradient-to-r ${cat === 'upcoming' ? 'from-emerald-600 to-indigo-700': 'from-orange-600 to-indigo-700'} capitalize p-4 text-white`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {project.title}
          </h3>
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
          {/* Objective */}
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <FaSearch className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Objective</h4>
              <div 
                className="text-gray-600 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: project.objective }}
              />
            </div>
          </div>

          {/* Importance */}
          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <FaShieldAlt className="text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Importance</h4>
              <div 
                className="text-gray-600 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: project.importance }}
              />
            </div>
          </div>

          {/* Technology */}
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <FaCode className="text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Technology</h4>
              <div 
                className="text-gray-600 prose prose-sm max-w-none px-3"
                dangerouslySetInnerHTML={{ __html: project.technology }}
              />
            </div>
          </div>

          {/* Partners */}
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <FaHandshake className="text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Partners</h4>
              <div 
                className="text-gray-600 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: project.partners }}
              />
            </div>
          </div>

          {/* Output */}
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <FaBoxOpen className="text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Output</h4>
              <div 
                className="text-gray-600 prose prose-sm max-w-none"
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
  );
};

export default ProjectList