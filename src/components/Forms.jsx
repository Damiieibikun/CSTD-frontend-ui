import Input from './Input'
import Editor from './Editor'
import Button from './Button'
import { IoClose } from "react-icons/io5";
import { FaTrash } from 'react-icons/fa';

const Forms = ({
  submitForm, 
  api, 
  formTitle, 
  formTitleAlignment, 
  formWidth, 
  inputs, 
  editors, 
  buttonInfo, 
  handleEditorFunction, 
  exitForm, 
  watch,
  imagePreview,
  removeImage
}) => {
  return (
    <form onSubmit={submitForm} className={`${formWidth} flex flex-col mx-auto`}>
      <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl w-full">
        <div className="max-w-lg mx-auto">         
          <div>
            {api?.message && (
              <div
                className={`mb-4 px-4 py-2 rounded text-sm font-medium ${
                  api?.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {api?.message}
              </div>
            )}
            <div className='flex items-center justify-between'>
              {formTitle && (
                <h1 className={`${formTitleAlignment} text-2xl font-semibold py-2`}>
                  {formTitle}
                </h1>
              )}
              {exitForm && (
                <div onClick={exitForm}>
                  <IoClose size={25} className='cursor-pointer'/>
                </div>
              )}
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              
              {inputs?.map((input, index) => (
                <Input 
                  key={index}
                  name={input.title}
                  type={input.type}
                  accept={input.accept}
                  placeholder={input.placeholder}
                  register={input.registerFunction}
                  label={input.label}         
                  error={input.errorMessage}
                />
              ))}

              {/* Image Preview Section */}
              {imagePreview && (
                <div className="mb-4">
                  <label className='text-gray-600 text-sm mb-2 block'>Image Preview:</label>
                  <div className="relative w-full max-w-xs mx-auto">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        Preview
                      </div>
                    </div>
                    <div
                    onClick={removeImage}
                    className="absolute -top-2 -right-2">
                     <FaTrash size={25} className='text-red-600 hover:cursor-pointer'/>
                    </div>
                  </div>
                </div>
              )}
       
              {editors?.map((editor, index) => (
                <div key={index}>
                  <label className='text-gray-600 text-sm'>
                    {editor.heading}:
                    {editor.errorMessage && (
                      <p className='text-xs text-red-600'>{editor.errorMessage}</p>
                    )}
                  </label>
                  <Editor
                    value={watch(editor.field)}
                    handle_html={(val) => handleEditorFunction(editor.field, val)}
                  />
                </div>
              ))}    
              
              <div className='grid grid-cols-1'>
                <Button
                  caption={buttonInfo?.buttonCaption}
                  styles={buttonInfo?.buttonStyles}
                  type={buttonInfo?.buttonType}
                  reactIcon={buttonInfo?.icon}        
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Forms