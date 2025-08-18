import { useContext, useEffect, useState } from 'react';
import {FaEye, FaEyeSlash, FaTrash, FaEnvelope, FaUser, FaPhone, FaComment, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import Modals from '../../../components/Modals';
import { ApiContext } from '../../../context/apiContext';
import { Loader } from '../../../components/Loader';
const FeedBack = () => {
  const{feedbackList, setFeedbackList, getFeedback, pageResponse,
        setPageResponse, deleteMessage, deleteMultiple, loading} = useContext(ApiContext) 

  const [expandedFeedback, setExpandedFeedback] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState([]);
  const [deleteModal, setDeleteModal] = useState({open:false, id: ''});
  const [deleteMultipleModal, setDeleteMultipleModal] = useState(false);
  // Toggle feedback details expansion
  const toggleExpand = (id) => {
    setExpandedFeedback(expandedFeedback === id ? null : id);
  };

  // Delete single feedback
  const deleteFeedback = (id) => {
    setFeedbackList(feedbackList.filter(feedback => feedback._id !== id));
    setDeleteModal({open:false, id: ''})
    deleteMessage(id)
  };

  // Delete selected feedback
  const deleteSelected = () => {
    setFeedbackList(feedbackList.filter(feedback => !selectedFeedback.includes(feedback._id)));
    setSelectedFeedback([]);
    setDeleteMultipleModal(false)  
    deleteMultiple(selectedFeedback)
  };

  // Toggle selection of feedback
  const toggleSelect = (id) => {
    setSelectedFeedback(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  useEffect(()=>{
    getFeedback()
  }, [getFeedback])
 if(loading) return <Loader text={'...Please Wait'}/>
  return (
  <div className="p-4 sm:p-6 transition-all duration-300">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 transition-all">
    <div className="mb-3 sm:mb-0 transition-all">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 transition-all">Feedback</h2>
      <p className="text-gray-600 mt-1 text-sm sm:text-base transition-all">Manage and review feedback submissions</p>
    </div>
    
    {selectedFeedback.length > 0 && (
      <button
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
        onClick={()=>setDeleteMultipleModal(true)}
      >
        <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Delete ({selectedFeedback.length})</span>
      </button>
    )}
  </div>

  <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden transition-all duration-300">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input 
                type="checkbox" 
                className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={selectedFeedback.length === feedbackList.length && feedbackList.length > 0}
                onChange={() => {
                  if (selectedFeedback.length === feedbackList.length) {
                    setSelectedFeedback([]);
                  } else {
                    setSelectedFeedback(feedbackList.map(f => f._id));
                  }
                }}
              />
            </th>
            <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {feedbackList.map((feedback) => 
           (
            <tr key={feedback._id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                <input 
                  type="checkbox" 
                  className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={selectedFeedback.includes(feedback._id)}
                  onChange={() => toggleSelect(feedback._id)}
                />
              </td>
              <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FaUser className="text-indigo-600 text-sm sm:text-base" />
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">{feedback.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{feedback.phone}</div>
                  </div>
                </div>
              </td>
              <td className="hidden sm:table-cell px-6 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <FaEnvelope className="hidden sm:block text-gray-400 mr-2 text-sm" />
                  <div className="text-xs sm:text-sm text-gray-900 truncate max-w-[120px] md:max-w-[200px]">
                    {feedback.email}
                  </div>
                </div>
              </td>
              <td className="hidden sm:table-cell px-6 py-3 whitespace-nowrap">
                <div className="text-xs sm:text-sm text-gray-500">
                  {new Date(feedback.createdAt).toLocaleDateString()}
                  
                </div>
              </td>
              <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-1 sm:space-x-2">
                  <button
                    onClick={() => toggleExpand(feedback._id)}
                    className="text-indigo-600 hover:text-indigo-900 transition-colors p-1"
                  >
                    {expandedFeedback === feedback._id ? (
                      <FaEyeSlash className="text-gray-500 transition-all duration-300 text-sm sm:text-base" />
                    ) : (
                      <FaEye className="text-indigo-600 transition-all duration-300 text-sm sm:text-base" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setDeleteModal({open: true, id: feedback._id})
                    
                    }}
                    
                    className="text-red-600 hover:text-red-900 transition-colors p-1"
                  >
                    <FaTrash className="text-sm sm:text-base" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {expandedFeedback && (
      feedbackList
        .filter(f => f._id === expandedFeedback)
        .map(feedback => (
          <Modals 
            key={feedback._id}
            modalStyles={'max-w-[65%]'}                
            cancel='Close'
            form={
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Feedback Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FaUser className="text-gray-400 mr-2 text-sm" />
                        <span className="text-gray-700 text-sm sm:text-base">{feedback.name}</span>
                      </div>
                      <div className="flex items-center">
                        <FaEnvelope className="text-gray-400 mr-2 text-sm" />
                        <span className="text-gray-700 text-sm sm:text-base">{feedback.email}</span>
                      </div>
                      <div className="flex items-center">
                        <FaPhone className="text-gray-400 mr-2 text-sm" />
                        <span className="text-gray-700 text-sm sm:text-base">{feedback.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Message</h4>
                    <div className="flex">
                      <FaComment className="text-gray-400 mr-2 mt-1 flex-shrink-0 text-sm" />
                      <p className="text-gray-700 text-sm sm:text-base">{feedback.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            }
            closeModal={() => setExpandedFeedback(null)}
          />
        ))
    )}
    
    {feedbackList.length === 0 && (
      <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
        No feedback submissions found.
      </div>
    )}
  </div>

  {/* Delete Modal */}
  {deleteModal.open &&
  <Modals
    title={'Delete Feedback'}
    caption={'Are you sure you want to delete this feedback?'}
    icon={<FaExclamationTriangle size={24} className="text-red-600" />}
    iconStyle={'bg-red-100'}
    calltoactionCaption={'Delete'}
    btnstyles={'bg-red-600 hover:bg-red-500'}
    closeModal={()=> setDeleteModal({open:false, id: ''})}
    calltoaction={()=> deleteFeedback(deleteModal?.id)}    
  />}
  {/* Delete multiple Modal */}
  {deleteMultipleModal &&
  <Modals
    title={'Delete Selected Feedback'}
    caption={'Are you sure you want to delete the selected feedback?'}
    icon={<FaExclamationTriangle size={24} className="text-red-600" />}
    iconStyle={'bg-red-100'}
    calltoactionCaption={'Delete'}
    btnstyles={'bg-red-600 hover:bg-red-500'}
    closeModal={()=> setDeleteMultipleModal(false)}
    calltoaction={deleteSelected}    
  />}

  {/* Success delete modals */}
      {pageResponse?.message && <Modals 
      title={'Message'}     
      closeModal={()=> setPageResponse({})}
      caption={pageResponse?.message}
      cancel={'Close'}
      iconStyle={pageResponse?.success ?  'bg-green-100'
              : 'bg-red-100'}
      icon={pageResponse?.success ? <FaCheckCircle  size={24} className='text-green-600'/> : <FaExclamationTriangle size={24} className='text-red-600'/>}
      />}
</div>
  );
}

export default FeedBack
