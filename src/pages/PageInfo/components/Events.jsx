import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema } from "../../../validators/formValidation";
import { ApiContext } from "../../../context/apiContext";
import { Loader } from "../../../components/Loader";
import { useLocation } from "react-router-dom";
import Modals from "../../../components/Modals";
import { FaExclamationTriangle, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUpload, FaTimes, FaImage } from "react-icons/fa";
import { MdCheckCircle, MdOutlineWarningAmber, MdEvent } from "react-icons/md";

const Events = () => {
  const { 
    loading, 
    events, 
    getEvents, 
    postEvent, 
    editEvent, 
    deleteEvent, 
    pageResponse,
    setPageResponse 
  } = useContext(ApiContext);

  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: '' });
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    flyer: "",
    title: ""
  });

  // File upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Filter states
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [eventItems, setFilteredEvents] = useState([]);

  const toggleEvent = (index) => {
    setExpandedEvent(expandedEvent === index ? null : index);
  };

  const openModal = (flyer, title) => {
    setModalContent({ flyer, title });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent({ flyer: "", title: "" });
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      flyer: ""
    }
  });

  // Handle file selection with validation
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Set the file in the form
    setValue("flyer", file);
  };

  // Remove selected file and cleanup
  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setValue("flyer", "");
    setUploadProgress(0);
  };

  // Handle form submission with file processing
  const onSubmit = async (data) => {
    try {
      // Handle file upload if a file is selected
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('date', data.date);
      formData.append('time', data.time);
      formData.append('location', data.location);

      if (selectedFile) {
        setUploadProgress(25);
       
        formData.append('flyer', selectedFile);
        setUploadProgress(75);       
        
      }

      setUploadProgress(90);

      // Submit the event data
      if (editingId) {
        
        await editEvent(editingId, formData);
        
      } else {
         
        await postEvent(formData);
        
      }

      setUploadProgress(100);
      
  
      reset();
      removeFile();
      setEditingId(null);
     
      setTimeout(() => setUploadProgress(0), 1000);
      
    } catch (error) {
      console.error('Error processing event:', error);
      alert('Error processing event. Please try again.');
      setUploadProgress(0);
    }
  };

  const handleEdit = (item) => {
     window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingId(item._id);
    setValue("title", item.title);
    setValue("description", item.description);
    setValue("date", new Date(item.date).toISOString().split("T")[0]);
    setValue("time", item.time);
    setValue("location", item.location);
    
    // Handle existing flyer
    if (item.flyer) {
      setValue("flyer", item.flyer);
      // Set preview if it's a URL or base64 string
      if (typeof item.flyer === 'string' && 
          (item.flyer.startsWith('http') || item.flyer.startsWith('data:'))) {
        setPreviewUrl(item.flyer);
      }
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ open: true, id: id });
  };

  const getEventStatus = (eventDate, eventTime) => {
    const now = new Date();
    const eventDateTime = new Date(`${eventDate} ${eventTime}`);
    
    if (eventDateTime < now) {
      return 'past';
    } else if (eventDateTime.toDateString() === now.toDateString()) {
      return 'today';
    } else {
      return 'upcoming';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'past':
        return 'bg-gray-100 text-gray-600';
      case 'today':
        return 'bg-green-100 text-green-700';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Filter and sort events
  useEffect(() => {
    if (!events || !Array.isArray(events)) {
      setFilteredEvents([]);
      return;
    }
    
    let result = [...events];

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      result = result.filter(
        (item) => new Date(item.date).toDateString() === filterDate
      );
    }

    // Filter by status
    if (statusFilter) {
      result = result.filter((item) => {
        const status = getEventStatus(item.date, item.time);
        return status === statusFilter;
      });
    }

    // Sort events
    if (sortOrder === "oldest") {
      result = result.sort((a, b) => {
        const aDateTime = new Date(`${a.date} ${a.time}`);
        const bDateTime = new Date(`${b.date} ${b.time}`);
        return aDateTime - bDateTime;
      });
    } else if (sortOrder === "latest") {
      result = result.sort((a, b) => {
        const aDateTime = new Date(`${a.date} ${a.time}`);
        const bDateTime = new Date(`${b.date} ${b.time}`);
        return bDateTime - aDateTime;
      });
    }

    setFilteredEvents(result);
  }, [dateFilter, statusFilter, sortOrder, events]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (loading) return <Loader text="...Loading" />;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8 overflow-hidden">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
         
          Events Management
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Create, edit and manage events with flyers and details
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-4">
        <h2 className="text-xl font-bold">
          {editingId ? "Edit Event" : "Add Event"}
        </h2>

        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Event Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter event title"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
            placeholder="Enter event description"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Date and Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block font-medium mb-1">Event Date</label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("date")}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block font-medium mb-1">Event Time</label>
            <input
              type="time"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register("time")}
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter event location"
            {...register("location")}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        {/* Event Flyer Upload */}
        <div>
          <label className="block font-medium mb-1">Event Flyer/Poster</label>
          
          {/* File Upload Area */}
          <div className="space-y-4">
            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-gray-50/50">
                <FaUpload className="mx-auto text-gray-400 text-4xl mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Upload Event Flyer</h3>
                <p className="text-gray-500 mb-2">Choose an image file for your event</p>
                <p className="text-gray-400 text-sm mb-6">Supports: PNG, JPG, GIF, WebP • Max size: 5MB</p>
                
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors shadow-sm">
                  <FaImage />
                  Choose Image File
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-4">
                  {/* Preview Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={previewUrl}
                      alt="Flyer preview"
                      className="w-32 h-32 object-cover rounded-lg shadow-sm border"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-sm"
                      aria-label="Remove file"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 mb-1">Selected File</h4>
                    <p className="text-gray-600 text-sm truncate mb-2">
                      {selectedFile ? selectedFile.name : 'Current flyer'}
                    </p>
                    <p className="text-gray-500 text-xs mb-4">
                      {selectedFile && `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                    </p>
                    
                    {/* Upload Progress */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Change File Button */}
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded cursor-pointer hover:bg-gray-50 transition-colors text-sm">
                      <FaUpload size={14} />
                      Change File
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {errors.flyer && (
            <p className="text-red-500 text-sm mt-1">{errors.flyer.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                reset();
                removeFile();
                setEditingId(null);
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={uploadProgress > 0 && uploadProgress < 100}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadProgress > 0 && uploadProgress < 100 ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </span>
            ) : (
              editingId ? "Save Changes" : "Add Event"
            )}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-medium text-gray-700">Filter Events</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <select
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
              className="w-full sm:w-40 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sort By</option>
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            <select
              onChange={(e) => setStatusFilter(e.target.value)}
              value={statusFilter}
              className="w-full sm:w-40 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="past">Past</option>
            </select>
            
            <div className="flex gap-3 w-full">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => {
                  setDateFilter("");
                  setStatusFilter("");
                  setSortOrder("");
                }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {eventItems && Array.isArray(eventItems) && eventItems.length > 0 ? (
          eventItems.map((event, index) => {
            const status = getEventStatus(event.date, event.time);
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Event Flyer */}
                  <div className="md:w-1/3 relative">
                    <img
                      src={event.flyer}
                      alt={event.title}
                      className="w-full h-48 md:h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openModal(event.flyer, event.title)}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(status)} shadow-sm`}>
                        {status}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                      <div className="flex items-center gap-2 text-sm">
                        <FaCalendarAlt />
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:w-2/3 p-4 md:p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-bold text-gray-800 capitalize">
                        {event.title}
                      </h2>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                          aria-label="Edit event"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          aria-label="Delete event"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaClock className="text-green-600" />
                        <span className="font-medium">{formatTime(event.time)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaMapMarkerAlt className="text-red-600" />
                        <span className="font-medium capitalize">{event.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => toggleEvent(index)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        {expandedEvent === index ? "Close Details" : "View Details"}
                      </button>
                      
                      <button
                        onClick={() => openModal(event.flyer, event.title)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <FaImage />
                        View Flyer
                      </button>
                    </div>

                    {/* Expanded Content */}
                    {expandedEvent === index && (
                      <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-3">Event Description</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap first-letter:capitalize">
                          {event.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <MdEvent className="mx-auto text-gray-400 text-6xl mb-4" />
            <p className="text-gray-500 text-lg mb-2">No events found</p>
            <p className="text-gray-400">Start by creating your first event</p>
            {(dateFilter || statusFilter || sortOrder) && (
              <button
                onClick={() => {
                  setDateFilter("");
                  setStatusFilter("");
                  setSortOrder("");
                }}
                className="mt-3 text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Flyer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" style={{marginTop: '0'}}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold truncate capitalize">Event Flyer - {modalContent.title}</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <img
                src={modalContent.flyer}
                alt="Event Flyer"
                className="w-full h-auto rounded-lg shadow-sm"
                onError={(e) => {
                  e.target.src = '/api/placeholder/400/600';
                  e.target.alt = 'Flyer could not be loaded';
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <Modals
          title="Delete Event"
          caption="Are you sure you want to delete this event? This action cannot be undone."
          icon={<FaExclamationTriangle size={24} className="text-red-600" />}
          iconStyle="bg-red-100"
          calltoactionCaption="Delete"
          btnstyles="bg-red-600 hover:bg-red-500"
          closeModal={() => setDeleteModal({ open: false, id: '' })}
          calltoaction={() => {
            setDeleteModal({ open: false, id: '' });
            deleteEvent(deleteModal?.id);
          }}
        />
      )}

      {/* Response Modal */}
      {pageResponse?.message && (
        <Modals
          title="Message"
          closeModal={() => {
            setPageResponse({});
          }}
          caption={pageResponse?.message}
          cancel="Close"
          iconStyle={pageResponse?.success ? 'bg-green-100' : 'bg-red-100'}
          icon={
            pageResponse?.success ? (
              <MdCheckCircle size={24} className="text-green-600" />
            ) : (
              <MdOutlineWarningAmber size={24} className="text-red-600" />
            )
          }
        />
      )}
    </div>
  );
};

export default Events;