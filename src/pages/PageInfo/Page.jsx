import { useContext, useEffect, useState } from 'react';
import SectionCard from '../../components/SectionCard';
import ImageUploadButton from '../../components/ImageUploadButton';
import Modals from '../../components/Modals';
import TextEditorButton from '../../components/TextEditorButton';
import Editor from '../../components/Editor';
import { ApiContext } from '../../context/apiContext';
import { SmallLoader } from '../../components/Loader';
import Button from '../../components/Button';
import { GrDocumentUpdate, GrDocument, GrFormTrash  } from "react-icons/gr";
import { MdCheckCircle , MdOutlineWarningAmber } from "react-icons/md"

const Page = ({pageId, pageName}) => {
  const [openModal, setOpenModal] = useState(false);
  const [addSectionModal, setAddSectionModal] = useState(false);
  const [deleteSectionModal, setdeleteSectionModal] = useState({open: false, id: '', sectionName: ''});
  const { getCurrentPage, updateCurrentPage, page, loading, deleteCurrentPageSection, pageResponse, setPageResponse } = useContext(ApiContext);
  const [activeModalSection, setActiveModalSection] = useState(null);

  const [activeSection, setActiveSection] = useState({
    name: '',
    isOpen: false
  });

  const [sectionName, setSectionName] = useState({
    value: '',
    error: ''
  });

  const [sections, setSections] = useState({});

  const toggleSection = (sectionName) => {
    setActiveSection((prev) => ({
      name: sectionName,
      isOpen: prev.name === sectionName ? !prev.isOpen : true
    }));
  };

  const handleTextChange = (section, field, value) => {
    setSections((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Multiple image upload + preview
  const handleImageChange = (section, files) => {
    const fileArray = Array.from(files);
    setSections((prev) => {
      const currentImages = prev[section]?.images || [];
      const newImages = fileArray.map((file) => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      return {
        ...prev,
        [section]: {
          ...prev[section],
          images: [...currentImages, ...newImages]
        }
      };
    });
  };

  const handleDeleteImage = (section, index) => {
    setSections((prev) => {
      const updatedImages = prev[section].images.filter((_, i) => i !== index);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          images: updatedImages
        }
      };
    });
  };

  // Add section names
  const addSectionName = () => {
      if (!sectionName.value.trim()) {
    setSectionName(prev => ({
      ...prev,
      error: '*Section name cannot be empty'
    }));
    return;
  }

  // Check if section name contains spaces
  if (sectionName.value.includes(' ')) {
    setSectionName(prev => ({
      ...prev,
      error: '*Section name cannot contain spaces. Use (e.g., HeroSection)'
    }));
    return;
  }

    const sectionObject = {
      content : {
        [sectionName.value.toLowerCase()]: {
          title: '',
          details: '',
          images: []
        }
      }
    };

    updateCurrentPage(pageId, sectionObject);

    // Reset form
    setSectionName({ value: '', error: '' });
    setAddSectionModal(false);
  };


  const addSectionContent = () => {
  const formData = new FormData();
  const content = {};

  // Check if sections exist and have data
  if (!sections || Object.keys(sections).length === 0) {
   
    return;
  }

  Object.entries(sections).forEach(([sectionKey, sectionData]) => {   

    // Get original images from page data (these have public_id from Cloudinary)
    const originalImages = page?.content?.[sectionKey]?.images || [];
    
    // Separate existing images (from database) and new images (from file input)
    const currentExistingImages = sectionData.images?.filter(img => img.url && !img.file && img.public_id) || [];
    const newImages = sectionData.images?.filter(img => img.file) || [];

    // Find deleted images by comparing original with current
    const currentImageUrls = currentExistingImages.map(img => img.url);
    const deletedImages = originalImages.filter(img => !currentImageUrls.includes(img.url));
    
    
    // Copy text fields and image management info
    content[sectionKey] = {
      title: sectionData.title || '',
      details: sectionData.details || '',
      // Helper fields for backend to understand image management
      keepExistingImages: currentExistingImages.length > 0,
      existingImages: currentExistingImages.map(img => img.url),
      // Send deleted images info so backend can remove them from Cloudinary
      deletedImages: deletedImages.map(img => ({
        url: img.url,
        public_id: img.public_id
      }))
    };

    // Handle new image files
    if (newImages.length > 0) {      
      newImages.forEach((imgObj, index) => {
        if (imgObj.file) {        
          formData.append(`${sectionKey}_images`, imgObj.file);
        }
      });
    } 
  });

  // Append content JSON
  const contentJSON = JSON.stringify(content);
  formData.append("content", contentJSON);
  updateCurrentPage(pageId, formData);
};

  useEffect(() => {
    getCurrentPage(pageId);
  }, [getCurrentPage, pageId]);

  useEffect(() => {
  if (page && page?.content) {
    // Ensure database images have the proper structure for deletion tracking
    const processedContent = {};
    
    Object.entries(page.content).forEach(([sectionKey, sectionData]) => {
      processedContent[sectionKey] = {
        ...sectionData,
        images: sectionData.images?.map(img => ({
          ...img,
          // Ensure we have both url and public_id for proper tracking
          url: img.url,
          public_id: img.public_id
        })) || []
      };
    });
    
    setSections(processedContent);
  }
}, [page]);

  return (
    <div className="w-[95%] mx-auto">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl capitalize">{pageName} CMS</h1>
            <p className="mt-3 text-lg text-gray-600">
              Manage your <span className='capitalize'>{pageId}</span>  content here
            </p>
          </div>

          {Object.entries(sections || {}).map(([sectionName, sectionData]) =>
          
          (            
            <SectionCard
  key={sectionName}
  title={sectionName}
  isOpen={activeSection.name === sectionName}
  onClick={() => toggleSection(sectionName)}
>
  {!sections || Object.keys(sections).length === 0 || loading ? (
    <div className="flex justify-center items-center py-10">
      <SmallLoader size="h-10 w-10" />
    </div>
  ) : (
    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
      {/* Render fields */}
      {Object.entries(sectionData).map(([fieldName, value]) => (
       fieldName !== 'images' && <div key={fieldName} className="mb-5 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
          <strong className="block text-sm font-medium text-gray-700 capitalize mb-2">{fieldName}:</strong>

          {Array.isArray(value) && fieldName !== 'images' ? (
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {value.map((item, idx) => (
                <li key={idx} className="py-1">{item}</li>
              ))}
            </ul>
          ) : typeof value === 'string' && value.startsWith('<') ? (
            <div
              className="prose prose-sm max-w-none border-l-4 border-blue-100 pl-6 py-1"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : fieldName !== 'images' ? (
            <p className="text-sm text-gray-700 py-1">{value}</p>
          ) : null}
        </div>
      ))}

      {/* Image previews */}
      {Array.isArray(sectionData.images) && sectionData.images.length > 0 && (
        <div className="mb-5 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
          <strong className="block text-sm font-medium text-gray-700 capitalize mb-3">Images:</strong>
          <div className="flex flex-wrap gap-3">
            {sectionData.images.map((img, idx) => (
              <div key={idx} className="relative group">
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-blue-300 transition-colors">
                  <img
                    src={img.url || img.preview}
                    alt={`Preview ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteImage(sectionName, idx)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <p className="m-0 text-gray-400 text-xs mb-6">Supports: PNG, JPG, GIF, WebP MP4• Max size: 5MB</p>
      <div className="flex flex-wrap gap-3 mt-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
        <TextEditorButton
          onClick={() => {
            setOpenModal(true);
            setActiveModalSection(sectionName);
          }}
          className="flex-1 min-w-[150px]"
        />
        <ImageUploadButton
          multiple
          onChange={(e) => handleImageChange(sectionName, e.target.files)}
          className="flex-1 min-w-[150px]"
        />
        <Button
          onclick={addSectionContent}
          reactIcon={<GrDocumentUpdate size={20}/>}
          caption={'Update Section'}
          type={'button'}
          captionStyles={'hidden lg:flex'}
          styles={`flex items-center justify-center px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 
      text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 
      shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none 
      focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 active:translate-y-0`}
          // styles={'bg-green-600 hover:bg-green-700 text-white flex-1 min-w-[150px]'}
        />
        <Button
          reactIcon={<GrFormTrash size={25} />}
          type={'button'}
          caption={'Delete Section'}
          styles={`flex items-center justify-center px-5 py-3 bg-gradient-to-r from-orange-600 to-red-600 
      text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 
      shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none 
      focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 active:translate-y-0`}
          captionStyles={'hidden lg:flex'}
          onclick={() => setdeleteSectionModal({open: true, id: pageId, sectionName: sectionName})}
        />
      </div>
    </div>
  )}
</SectionCard>
          )
          )}
        </div>

        <div className='flex gap-3 justify-self-end'>
         
            <Button
              onclick={() => setAddSectionModal(true)}
              reactIcon={<GrDocument />}
              caption={'Add Page Section'}
              type={'button'}
              styles={'bg-blue-700 text-white'}
            />            
        </div>
      </div>

      {/* Add Sections Modal */}
      {addSectionModal && <Modals
        closeModal={() => setAddSectionModal(false)}
        calltoaction={addSectionName}
        calltoactionCaption={'Add'}
        btnstyles={'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors'}
        form={
          <div>
            {sectionName.error && <p className='text-xs text-red-600'>{sectionName.error}</p>}
            <input 
              onChange={(e) => setSectionName({
                value: e.target.value,
                error: sectionName.error && e.target.value.trim() ? '' : sectionName.error
              })}
              placeholder='e.g. Banner, Hero, etc.'
              type='text'
              className='p-3 text-sm w-full'
            />
          </div>
        }
      />}

      {/* === Sections Modal === */}
      {openModal && activeModalSection && (
        <Modals
          closeModal={() => {
            setOpenModal(false);
            setActiveModalSection(null);
          }}
          form={
            <div className="p-2 space-y-4">
            {Object.entries(sections[activeModalSection] || {})
              .filter(([field]) => field !== 'images') // exclude images field
              .map(([field, value]) => (
                <div key={field} className="space-y-2">
                  <label className="block font-semibold capitalize">{field}</label>
                  
                  {field === 'details' ? (
                    <Editor
                      value={value}
                      handle_html={(html) => handleTextChange(activeModalSection, field, html)}
                    />
                  ) : typeof value === 'string' ? (
                    <input
                      className="w-full p-2 border border-gray-300 rounded"
                      type="text"
                      value={value}
                      onChange={(e) =>
                        handleTextChange(activeModalSection, field, e.target.value)
                      }
                    />
                  ) : null}
                </div>
              ))}
            </div>
          }
         cancel='Ok'
        />
      )}


      {/* Delete section Modal */}
      {deleteSectionModal?.open &&
        <Modals
          title={'Delete Selected Section'}
          caption={'Are you sure you want to delete the selected section?'}
          icon={<MdOutlineWarningAmber size={24} className="text-red-600" />}
          iconStyle={'bg-red-100'}
          calltoactionCaption={'Delete'}
          btnstyles={'bg-red-600 hover:bg-red-500'}
          closeModal={() => setdeleteSectionModal({open: false, id: '', sectionName: ''})}
          calltoaction={() => {
            deleteCurrentPageSection(deleteSectionModal?.id, {content: {
              [deleteSectionModal?.sectionName]: { delete: true }
            }});
            setdeleteSectionModal({open: false, id: '', sectionName: ''});
          }}    
        />
      }

      {/* Success message modal */}
      {pageResponse?.message && <Modals
        title={'Message'} 
        closeModal={() => setPageResponse({})}
        caption={pageResponse?.message}
        cancel={'Close'}
        iconStyle={pageResponse?.success ?  'bg-green-100' : 'bg-red-100'}
        icon={pageResponse?.success ? <MdCheckCircle size={24} className='text-green-600'/> : <MdOutlineWarningAmber size={24} className='text-red-600'/>}
      />}
    </div>
  );
}

export default Page;
