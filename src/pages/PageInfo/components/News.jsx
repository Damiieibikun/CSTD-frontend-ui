import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Editor from "../../../components/Editor";
import { newsSchema } from "../../../validators/formValidation";
import { ApiContext } from "../../../context/apiContext";
import { Loader } from "../../../components/Loader";
import { useLocation } from "react-router-dom";
import Modals from "../../../components/Modals";
import { FaExclamationTriangle } from "react-icons/fa";
import { MdCheckCircle, MdOutlineWarningAmber } from "react-icons/md";

const News = () => {
  const { loading, news, getNews, postNews, editNews, deleteNews, pageResponse,
        setPageResponse } =
    useContext(ApiContext);

  const [editingId, setEditingId] = useState(null);
  const[deleteModal, setDeleteModal] = useState ({open:false, id: ''})
  const [mediaFiles, setMediaFiles] = useState([]);
  const [expandedNews, setExpandedNews] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    thumbnail: "",
    mediaArr: []
  });

  const toggleNews = (index) => {
    setExpandedNews(expandedNews === index ? null : index);
  };

  const openModal = (thumbnail, mediaArr) => {
    setModalContent({ thumbnail, mediaArr });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent({ thumbnail: "", mediaArr: [] });
  };

  const [date, setDate] = useState("");
  const [asc, setAsc] = useState("");
  const [newsItems, setFilteredNews] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: "",
      brief: "",
      content: "",    
      date: "",
      media: []
    }
  });

  const contentValue = watch("content");

  const onSubmit = (data) => {

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("date", data.date);
    formData.append("brief", data.brief);
    formData.append("content", data.content);

    mediaFiles.forEach((mediaItem) => {
      if(mediaItem.file){
         formData.append("media", mediaItem.file); 
      }
    });

    
for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
    if (editingId) {
      formData.append('media', JSON.stringify(mediaFiles))      
        editNews(editingId, formData);
    } else {    
        postNews(formData);
    }

    reset();
    setEditingId(null);
    setMediaFiles([]);
};

  const handleEdit = (item) => {

    setEditingId(item._id);
    setValue("title", item.title);
    setValue("brief", item.brief);
    setValue("content", item.content);
    setValue("date", new Date(item.date).toISOString().split("T")[0]);
    setMediaFiles(item?.media || []);
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setDeleteModal({open:true, id: id})
  };

  const handleMediaUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

 
    const previewUrl = URL.createObjectURL(file);   

    setMediaFiles((prev) => [
      ...prev,
      {
        file: file, 
        type,
        previewUrl, 
        thumbnail: type === "video" ? "" : previewUrl
      }
    ]);
};

  useEffect(() => {
    let result = [...news];

    if (date) {
      const filterDate = new Date(date).toDateString();
      result = result.filter(
        (item) => new Date(item.date).toDateString() === filterDate
      );
    }

    if (asc === "oldest") {
      result = result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (asc === "latest") {
      result = result.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    setFilteredNews(result);
  }, [date, asc, news]);

  useEffect(() => {
    getNews();
  }, [getNews]);

  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  if (loading) return <Loader text="...Loading" />;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8 overflow-hidden">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          News Management
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Create, edit and manage news articles
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-4">
        <h2 className="text-xl font-bold">
          {editingId ? "Edit News" : "Add News"}
        </h2>

        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter news title"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Brief */}
        <div>
          <label className="block font-medium mb-1">Brief</label>
          <textarea
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            placeholder="Enter short news summary"
            {...register("brief")}
          />
          {errors.brief && (
            <p className="text-red-500 text-sm mt-1">{errors.brief.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block font-medium mb-1">Content</label>
          <div className="border rounded overflow-hidden">
            <Editor
              handle_html={(val) => setValue("content", val)}
              value={contentValue}
            />
          </div>
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register("date")}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Media Upload */}
        <div>
          <label className="block font-medium mb-1">Upload Media</label>
          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            <label className="flex-1 cursor-pointer border rounded p-2 text-center hover:bg-gray-50 transition-colors">
              <span className="block mb-1">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleMediaUpload(e, "image")}
                className="hidden"
              />
            </label>
            <label className="flex-1 cursor-pointer border rounded p-2 text-center hover:bg-gray-50 transition-colors">
              <span className="block mb-1">Upload Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleMediaUpload(e, "video")}
                className="hidden"
              />
            </label>
          </div>
              {/* Media Preview */}
             <div className="flex flex-wrap gap-2">
        {mediaFiles.map((m, i) => (
            <div key={i} className="relative w-24 h-20 border rounded overflow-hidden">
                {/* Show existing or new media */}
                {m.type === "image" ? (
                    <img
                        src={m.thumbnail} // This works for both new (blob URL) and existing (server URL)
                        alt="media preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <video 
                        src={m.previewUrl || m.url}
                        className="w-full h-full object-cover" 
                    />
                )}
                
                {/* Show indicator for existing vs new files */}
                {m.isExisting && (
                    <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                        Existing
                    </div>
                )}
                
                <button
                    onClick={() => setMediaFiles(mediaFiles.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    title={m.isExisting ? "Remove existing media" : "Remove new media"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        ))}
    </div>

        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-4">
          {editingId && (
            <button
              onClick={() => {
                reset(); 
                setValue("content", " ")              
                setEditingId(null);
                setMediaFiles([]);
              }}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {editingId ? "Save Changes" : "Add News"}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-medium text-gray-700">Filter News</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              onChange={(e) => setAsc(e.target.value)}
              value={asc}
              className="w-full sm:w-40 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sort By</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
            
            <div className="flex gap-3 w-full">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => {
                  setDate("");
                  setAsc("");
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* News list */}
      <div className="space-y-6">
        {newsItems && newsItems.length > 0 ? (
          newsItems.map((news, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Thumbnail */}
                <div className="md:w-1/3 relative">
                  <img
                    src={news.media[0]?.thumbnail}
                    alt={news.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                    {new Date(news.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-2/3 p-4 md:p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="capitalize text-xl font-bold text-gray-800 mb-2">
                      {news.title}
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(news)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                        aria-label="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(news._id)}                        
                        className="p-2 text-red-600 hover:text-red-800"
                        aria-label="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                
                  <p className="text-gray-600 mb-4 first-letter:capitalize">{news.brief}</p>                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => toggleNews(index)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      {expandedNews === index ? "Close" : "Read More"}
                    </button>
                    
                    {news.media && news.media.length > 0 && (
                      <button
                        onClick={() => openModal(news.thumbnail, news.media)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        View Media
                      </button>
                    )}
                  </div>

                  {/* Expanded Content */}
                  {expandedNews === index && (
                    <div className="mt-6 border-t pt-6">
                      <div
                        className="prose max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No news articles found</p>
            {date || asc ? (
              <button
                onClick={() => {
                  setDate("");
                  setAsc("");
                }}
                className="mt-3 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Modal Preview */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" style={{marginTop: '0'}}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Media Preview</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              {modalContent.mediaArr.map((m, idx) => (
                <div key={idx} className="space-y-2">
                  {m.type === "image" ? (
                    <img
                      src={m.url || modalContent.thumbnail}
                      alt="Preview"
                      className="w-full h-auto rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="relative pt-[56.25%]">
                      <video
                        src={m.url}
                        controls
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
              {deleteModal.open && 
                     
              <Modals
                title={'Delete News'}
                caption={'Are you sure you want to delete this news?'}
                icon={<FaExclamationTriangle size={24} className="text-red-600" />}
                iconStyle={'bg-red-100'}
                calltoactionCaption={'Delete'}
                btnstyles={'bg-red-600 hover:bg-red-500'}
                closeModal={()=> setDeleteModal({open:false, id: ''})}
                calltoaction={()=> {
                  setDeleteModal({open:false, id: ''})
                  deleteNews(deleteModal?.id)}}    
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

export default News;