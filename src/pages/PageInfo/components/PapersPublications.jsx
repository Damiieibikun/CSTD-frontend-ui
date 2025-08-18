import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Editor from '../../../components/Editor';
import { FaTrash, FaExternalLinkAlt, FaUser, FaCalendarAlt, FaEdit, FaExclamationTriangle } from 'react-icons/fa';
import { publicationSchema } from '../../../validators/formValidation';
import { ApiContext } from '../../../context/apiContext';
import { IoIosClose } from 'react-icons/io';
import { Loader } from '../../../components/Loader';
import Modals from '../../../components/Modals';
import { MdCheckCircle, MdOutlineWarningAmber } from 'react-icons/md';

const PapersPublications = () => {
  const {loading, publications,
        getPublications,
        postPublication,
        editPublication,
        deletePublication, pageResponse,
        setPageResponse} = useContext(ApiContext)
  const [editingId, setEditingId] = useState(null);
  const[deleteModal, setDeleteModal] = useState ({open:false, id: ''})
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      title: '',
      summary: '',
      authors: '',
      link: '',
      date: ''
    }
  });

  const summaryValue = watch('summary');

  const onSubmit = (data) => {
    if (editingId) {
      editPublication(editingId, data)
    } else {      
      postPublication(data)
    
    }
    reset();
    setEditingId(null);
  };

  const handleEdit = (pub) => {
    setEditingId(pub._id);
    setValue('title', pub.title);
    setValue('summary', pub.summary);
    setValue('authors', pub.authors.join(', ')); 
    setValue('link', pub.link);
    setValue('date', pub.date);
  };

  const handleDelete = (id) => {
      setDeleteModal({open:true, id: id})
  };

  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPublications, setFilteredPublications] = useState(publications);
  


  useEffect(() => {
    getPublications();
  }, [getPublications]);

  
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const results = publications?.filter(publication => {
      if (!publication) return false;
      const titleMatch = publication.title?.toLowerCase().includes(lowercasedQuery);
      const summaryMatch = publication.summary?.toLowerCase().includes(lowercasedQuery);
      const authorsMatch = publication.authors?.some(author =>
        author?.toLowerCase().includes(lowercasedQuery)
      );
      return titleMatch || summaryMatch || authorsMatch;
    });
    setFilteredPublications(results || []);
  }, [searchQuery, publications]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

 
if(loading) return <Loader text={'...Loading'}/>
  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8">
            <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Research Publications
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage and showcase your academic publications with our intuitive platform
          </p>
        </div>
      {/* Form */}
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold">
          {editingId ? 'Edit Publication' : 'Add Publication'}
        </h2>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter publication title"
            {...register('title')}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Summary */}
        <div>
          <label className="block font-semibold mb-1">Summary/Abstract</label>
          <Editor
            handle_html={(val) => setValue('summary', val)}
            value={summaryValue}
          />
          {errors.summary && <p className="text-red-500 text-sm">{errors.summary.message}</p>}
        </div>

        {/* Authors */}
        <div>
          <label className="block font-semibold mb-1">Authors</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter authors, separated by commas"
            {...register('authors')}
          />
          {errors.authors && <p className="text-red-500 text-sm">{errors.authors.message}</p>}
        </div>

        {/* Link */}
        <div>
          <label className="block font-semibold mb-1">Link</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter publication link"
            {...register('link')}
          />
          {errors.link && <p className="text-red-500 text-sm">{errors.link.message}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block font-semibold mb-1">Date</label>
          <input
          max={new Date().toISOString().split('T')[0]}
            type="date"
            className="w-full p-2 border rounded"
            {...register('date')}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit(onSubmit)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? 'Save Changes' : 'Add Publication'}
          </button>
        </div>
      </div>

      {/* Publication List */}
       <div className="w-[85%] mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Your Publications
          </h2>
          <div className="flex items-center w-full md:w-auto">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search publications..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <div className="absolute left-3 top-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery !== '' && <div 
              onClick={()=> setSearchQuery('')}
              className="absolute right-3 top-3 text-gray-400">
               <IoIosClose className='text-[21px] hover:text-[22px] transition-all duration-200 hover:cursor-pointer hover:text-red-600'/>
              </div>}
            </div>           
          </div>
        </div>
        
        <div className="space-y-6">
          {filteredPublications.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-600">No matching publications found</h3>
              <p className="text-gray-500 mt-2">Try a different search query.</p>
            </div>
          ) : (
            filteredPublications.map((publication) => (
              <div 
                key={publication._id} 
                className="bg-white rounded-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-md relative"
              >
                <button
                  onClick={() => handleDelete(publication._id)}
                  className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-500 rounded-full transition-colors"
                  title="Delete publication"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() => handleEdit(publication)}
                  className="absolute top-4 right-12 p-2 text-indigo-400 hover:text-indigo-500 rounded-full transition-colors"
                  title="Edit publication"
                >
                  <FaEdit />
                </button>
                
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-gray-800 pr-6">
                    {publication.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
                    {/* <FaCalendarAlt className="mr-1" /> */}
                    <p className='font-semibold'>Publication Date: <span className='font-normal'> {publication.date}</span></p>
              
                   
                  </div>
                </div>
                
                <div 
                  className="prose prose-sm max-w-none mb-4 border-l-2 border-blue-200 pl-8 py-1 text-sm italic"
                  dangerouslySetInnerHTML={{ __html: publication.summary }}
                />
                
                <div className="flex flex-wrap items-center justify-between mt-4">
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-0">
                    {publication.authors.map((author, index) => (
                      <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        <FaUser className="mr-1 text-xs" />
                        <span>{author}</span>
                      </div>
                    ))}
                  </div>
                  
                  <a 
                    href={publication.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    View Publication
                    <FaExternalLinkAlt className="ml-2" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

  {/* Delete Modal */}
        {deleteModal.open &&        
        <Modals
          title={'Delete Publication'}
          caption={'Are you sure you want to delete this Publication?'}
          icon={<FaExclamationTriangle size={24} className="text-red-600" />}
          iconStyle={'bg-red-100'}
          calltoactionCaption={'Delete'}
          btnstyles={'bg-red-600 hover:bg-red-500'}
          closeModal={()=> setDeleteModal({open:false, id: ''})}
          calltoaction={()=> {
            setDeleteModal({open:false, id: ''})
            deletePublication(deleteModal?.id)}}    
        />}


       {pageResponse?.message && <Modals
        title={'Message'} 
        closeModal={()=> {                 
          setPageResponse({})}}
        caption={pageResponse?.message}
        cancel={'Close'}
        iconStyle={pageResponse?.success ?  'bg-green-100'
                : 'bg-red-100'}
        icon={pageResponse?.success ? <MdCheckCircle  size={24} className='text-green-600'/> : <MdOutlineWarningAmber size={24} className='text-red-600'/>}
        />}
    </div>
  );
};

export default PapersPublications;

