import { IoClose } from "react-icons/io5";

const Modals = ({
  title,
  caption,
  form,
  icon,
  iconStyle,
  calltoactionCaption,
  btnstyles,
  closeModal,
  calltoaction,
  error, 
  cancel = 'Cancel',
  modalStyles = 'max-w-md',
  ref,
}) => {
  return (
    <div ref={ref} className={`fixed inset-0 z-50 flex justify-center p-4 items-center bg-black bg-opacity-50`} style={{marginLeft: '0', marginTop: '0'}}>
      <div className={`bg-white rounded-lg shadow-lg w-full ${modalStyles} overflow-hidden`}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-2 border-b">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="flex items-start space-x-4">
            <div className={`p-2 rounded-full ${iconStyle}`}>
              {icon}
            </div>
            <p className="text-gray-600">{caption}</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 text-sm text-red-600 font-semibold">
              * {error}
            </div>
          )}
        </div>
        <div className="p-2">
          {form}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
         {calltoaction && calltoactionCaption && <button
            onClick={calltoaction}
            className={`text-sm font-medium px-4 py-2 text-white rounded ${btnstyles}`}
          >
            {calltoactionCaption}
          </button>}
         
          <button
            onClick={closeModal}
            className="text-sm font-medium px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            {cancel}
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Modals;


