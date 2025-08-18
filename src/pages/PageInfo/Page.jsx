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

  useEffect(() => {
    getCurrentPage(pageId);
  }, [getCurrentPage, pageId]);

  useEffect(() => {
    if (page && page?.content) {
      setSections(page.content);
    }
  }, [page]);

  return (
    <div className="w-[95%] mx-auto">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl capitalize">{pageName} CMS</h1>
            <p className="mt-3 text-lg text-gray-600">
              Manage your {pageId} content here
            </p>
          </div>

          {Object.entries(sections || {}).map(([sectionName, sectionData]) => (
            <SectionCard
              key={sectionName}
              title={sectionName}
              isOpen={activeSection.name === sectionName}
              onClick={() => toggleSection(sectionName)}
            >
              {!sections || Object.keys(sections).length === 0 || loading ? (
                <SmallLoader size="h-10 w-10" />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  {/* Render fields */}
                  {Object.entries(sectionData).map(([fieldName, value]) => (
                    <div key={fieldName} className="mb-3">
                      <strong className="block text-sm text-gray-600 capitalize">{fieldName}:</strong>

                      {Array.isArray(value) && fieldName !== 'images' ? (
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {value.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : typeof value === 'string' && value.startsWith('<') ? (
                        <div
                          className="prose text-sm"
                          dangerouslySetInnerHTML={{ __html: value }}
                        />
                      ) : fieldName !== 'images' ? (
                        <p className="text-sm text-gray-700">{value}</p>
                      ) : null}
                    </div>
                  ))}

                  {/* Image previews */}
                  {Array.isArray(sectionData.images) && sectionData.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {sectionData.images.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24">
                          <img
                            src={img.preview || img}
                            alt={`Preview ${idx}`}
                            className="w-full h-full object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(sectionName, idx)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex space-x-3 mt-4">
                    <TextEditorButton
                      onClick={() => {
                        setOpenModal(true);
                        setActiveModalSection(sectionName);
                      }}
                    />
                    <ImageUploadButton
                      multiple
                      onChange={(e) => handleImageChange(sectionName, e.target.files)}
                    />
                    <Button
                    reactIcon={<GrFormTrash size={25} />}
                      type={'button'}
                      caption={'Delete Section'}
                      styles={'text-white bg-red-600'}
                      captionStyles={'hidden lg:flex'}
                      onclick={() => setdeleteSectionModal({open: true, id: pageId, sectionName: sectionName})}
                    />
                     <Button
                        onclick={() => updateCurrentPage(pageId, {content: sections})}
                        reactIcon={<GrDocumentUpdate />}
                        caption={'Update Page Section'}
                        type={'button'}
                         captionStyles={'hidden lg:flex'}
                        styles={'bg-green-700 text-white'}
                      />
                  </div>
                </div>
              )}
            </SectionCard>
          ))}
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
