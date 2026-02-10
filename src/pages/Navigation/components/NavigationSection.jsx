
import { useContext, useEffect, useRef, useState } from 'react';
import { FaPlus, FaPencilAlt, FaTrash, FaChevronDown, FaWindowClose, FaTimes, FaBars } from "react-icons/fa";
import { ApiContext } from '../../../context/apiContext';
import { Loader } from '../../../components/Loader';
import { childLinkSchema, pageSchema } from '../../../validators/formValidation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

const NavigationSection = () => {
  const {
    createPage,
    links,
    setLinks,
    getPageLinks,
    updatePage,
    deletePage,
    loading
  } = useContext(ApiContext);

  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState({ open: false, id: '' });
  const [isDeletingChild, setIsDeletingChild] = useState({ open: false, childId: '', id: '' });
  const [editingLink, setEditingLink] = useState(null);
  const [expandedLinks, setExpandedLinks] = useState({});
  const [currentParentId, setCurrentParentId] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isOrderDirty, setIsOrderDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  
  // Refs for delete confirmation elements
  const deleteRef = useRef(null);
  const deleteChildRef = useRef(null);

  const sectionRef = useRef(null);
  const schema = currentParentId ? childLinkSchema : pageSchema;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pageId: "",
      pageName: "",
      pageType: "",
      icon: "",
      path: "",
      children: [],
      content: {}
    }
  });

  // Close delete confirmation when clicking outside
  useClickOutside(deleteRef, () => {
    if (isDeleting.open) setIsDeleting({ open: false, id: '' });
  });

  // Close child delete confirmation when clicking outside
  useClickOutside(deleteChildRef, () => {
    if (isDeletingChild.open) setIsDeletingChild({ open: false, childId: '', id: '' });
  });

  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleDropdown = (id) => {
    setExpandedLinks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;

    setLinks(prevLinks => {
      const updated = [...prevLinks];
      const [movedItem] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, movedItem);
      // mark order as changed; save happens explicitly via "Save Order" button
      setIsOrderDirty(true);
      return updated;
    });

    setDraggedIndex(null);
  };

  const handleSaveOrder = async () => {
    if (!isOrderDirty || savingOrder) return;

    try {
      setSavingOrder(true);
      // Persist the current order; optionally store an explicit "order" index
      for (let i = 0; i < links.length; i += 1) {
        const link = links[i];
        await updatePage(link._id, { ...link, order: i });
      }
      setIsOrderDirty(false);
    } finally {
      setSavingOrder(false);
    }
  };

  const onSubmit = (data) => {   
    const newLinkObj = {
      ...data,
      pageId: data.pageId || data.pageName.toLowerCase().replace(/\s+/g, "-"),
      pageType: data.pageType || "custom",
      children: [],
      content: {}
    };

    if (editingLink && currentParentId) {
      // Editing child
      const updatedLinks = links.map(link =>
        link._id === currentParentId
          ? { ...link, children: link.children.map(child => child._id === editingLink ? newLinkObj : child) }
          : link
      );
      setLinks(updatedLinks);
      const updatedParent = updatedLinks.find(l => l._id === currentParentId);
      updatePage(currentParentId, updatedParent);
    }
    else if (editingLink) {
      // Editing top-level
      setLinks(prev => prev.map(link => link._id === editingLink ? newLinkObj : link));
      updatePage(editingLink, newLinkObj);
    }
    else if (currentParentId) {
      // Adding child
      const updatedLinks = links.map(link =>
        link._id === currentParentId
          ? { ...link, children: [...(link.children || []), newLinkObj] }
          : link
      );
      setLinks(updatedLinks);
      const updatedParent = updatedLinks.find(l => l._id === currentParentId);
      updatePage(currentParentId, updatedParent);
    }
    else {
      // Adding top-level
      setLinks(prev => [...prev, newLinkObj]);
      createPage(newLinkObj);
    }

    reset();
    setIsAdding(false);
    setEditingLink(null);
    setCurrentParentId(null);
  };

  const startEditLink = (linkId, isChild = false, parentId = null) => {
    const linkToEdit = isChild
      ? links.find(l => l._id === parentId)?.children?.find(c => c._id === linkId)
      : links.find(l => l._id === linkId);

    if (linkToEdit) {
      reset({
        pageId: linkToEdit.pageId,
        pageName: linkToEdit.pageName,
        pageType: linkToEdit.pageType,
        path: linkToEdit.path,
        icon: linkToEdit.icon || "",
        children: [],
        content: {}
      });
      setIsAdding(true);
      setEditingLink(linkId);
      setCurrentParentId(isChild ? parentId : null);
    }
  };

  const deleteLink = (linkId, isChild = false, parentId = null) => {
    scrollToSection();
    if (isChild) {
      const updatedLinks = links.map(link =>
        link._id === parentId
          ? { ...link, children: (link.children || []).filter(c => c._id !== linkId) }
          : link
      );
      setLinks(updatedLinks);
      const parentLink = updatedLinks.find(l => l._id === parentId);
      updatePage(parentId, parentLink);
      setIsDeletingChild({ open: false, childId: '', id: '' });
    } else {
      setLinks(prev => prev.filter(link => link._id !== linkId));
      deletePage(linkId);
      setIsDeleting({ open: false, id: '' });
    }
  };

  useEffect(() => {
    getPageLinks();
  }, [getPageLinks]);

  if (loading) return <Loader text={'...Processing'} />;

  return (
    <div className="p-6 transition-all duration-300" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 transition-all">
        <div className="mb-4 md:mb-0 transition-all">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 transition-all">Navigation Links</h2>
          <p className="text-gray-600 mt-1 transition-all">Manage your website navigation menu</p>
        </div>
        <div className="flex space-x-2">
          {!isAdding && (
            <button
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg"
              onClick={() => {
                scrollToSection();
                setIsAdding(true);
                setEditingLink(null);
                setCurrentParentId(null);
                reset();
              }}
            >
              <FaPlus className="w-5 h-5 transition-all" />
              Add Link
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveOrder}
            disabled={!isOrderDirty || savingOrder}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md ${
              !isOrderDirty || savingOrder
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-0.5'
            }`}
          >
            {savingOrder ? 'Saving...' : 'Save Order'}
          </button>
        </div>
      </div>

      {isAdding && (
        <form
          ref={sectionRef}
          onSubmit={handleSubmit(onSubmit)}
          className="mb-6 bg-indigo-50 rounded-xl p-4 border border-indigo-100 transition-all duration-500 ease-in-out"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-indigo-800 transition-all">
              {editingLink ? 'Edit Link' : currentParentId ? 'Add Child Link' : 'Add New Link'}
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <FaWindowClose className="w-5 h-5 transition-all" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all">
            {!currentParentId && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page ID</label>
                  <input {...register('pageId')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. home" />
                  {errors.pageId && <p className="text-xs text-red-600">{errors.pageId.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Type</label>
                  <input {...register('pageType')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. home" />
                  {errors.pageType && <p className="text-xs text-red-600">{errors.pageType.message}</p>}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Name</label>
              <input {...register('pageName')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. Home Page" />
              {errors.pageName && <p className="text-xs text-red-600">{errors.pageName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Path</label>
              <input {...register('path')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder={currentParentId ? "e.g. /home#section or /section" : "e.g. /home"} />
              {errors.path && <p className="text-xs text-red-600">{errors.path.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon <span className='text-gray-500 text-xs'>(optional)</span></label>
              <input {...register('icon')} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g. fa:FaHome" />
              {errors.icon && <p className="text-xs text-red-600">{errors.icon.message}</p>}
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2 transition-all">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200">
              {editingLink ? 'Update Link' : 'Add Link'}
            </button>
          </div>
        </form>
      )}

      {/* List with drag-and-drop reordering */}
      <div className="space-y-3 transition-all">
        {links.map((link, index) => (
          <div
            key={link._id}
            draggable={isDragMode}
            onDragStart={isDragMode ? () => handleDragStart(index) : undefined}
            onDragOver={isDragMode ? handleDragOver : undefined}
            onDrop={isDragMode ? () => handleDrop(index) : undefined}
            className={`border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 ${isDragMode ? 'cursor-grab bg-amber-50' : 'cursor-default'}`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                {link.children && link.children.length > 0 && (
                  <button onClick={() => toggleDropdown(link._id)} className="text-gray-500 hover:text-gray-700 transition-colors">
                    <FaChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedLinks[link._id] ? 'rotate-180' : ''}`} />
                  </button>
                )}
                <div>
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    {link.icon && <span className={link.icon} />}
                    {link.pageName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {link.path} | {link.pageId} ({link.pageType})
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-2 md:mt-0">
                {!isDeleting.open || isDeleting.id !== link._id ? (
                  <div className="flex gap-2 transition-all duration-300">
                    <button 
                      onClick={() => {  window.scrollTo({ top: 0, behavior: 'smooth' }); startEditLink(link._id); }} 
                      className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                      title="Edit"
                    >
                      <FaPencilAlt />
                    </button>
                    <button 
                      onClick={() => setIsDeleting({ open: true, id: link._id })} 
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    <button 
                      onClick={() => { scrollToSection(); setCurrentParentId(link._id); setIsAdding(true); setEditingLink(null); reset(); }} 
                      className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors duration-200"
                      title="Add Child"
                    >
                      <FaPlus className="w-4 h-4" /> Add Child
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDragMode(prev => !prev)}
                      className={`flex items-center gap-1 text-xs px-3 py-1 rounded-lg border transition-colors duration-200 ${
                        isDragMode
                          ? 'bg-amber-100 border-amber-500 text-amber-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                      title={isDragMode ? 'Drag mode on - drag cards to reorder' : 'Enable drag-and-drop reordering'}
                    >
                      <FaBars className="w-3 h-3" />
                      <span className="hidden sm:inline">{isDragMode ? 'Reordering' : 'Reorder'}</span>
                    </button>
                  </div>
                ) : (
                  <div 
                    ref={deleteRef}
                    className="flex gap-2 items-center text-sm bg-gray-600 text-white p-2 rounded-sm transition-all duration-300 transform translate-x-0"
                  >
                    <span className="font-medium">Delete this link?</span>
                    <button  
                      onClick={() => {
                        deleteLink(link._id);
                        setIsDeleting({ open: false, id: '' });
                      }}
                      className="p-1 hover:bg-red-700 rounded transition-colors"
                      title="Confirm Delete"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setIsDeleting({ open: false, id: '' })} 
                      className="p-1 hover:bg-indigo-700 rounded transition-colors"
                      title="Cancel"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {expandedLinks[link._id] && link.children && link.children.length > 0 && (
              <div className="bg-gray-50 border-t border-gray-200 transition-all duration-300">
                <div className="pl-4 md:pl-14 pr-4 py-3 space-y-3">
                  {link.children.map(child => (
                    <div key={child._id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 transition-colors hover:bg-gray-50">
                      <div>
                        <div className="font-medium text-gray-900">{child.pageName}</div>
                        <div className="text-sm text-gray-500">{child.path} ({child.pageType})</div>
                      </div>

                      <div className="flex gap-2">
                        {!isDeletingChild.open || isDeletingChild.childId !== child._id ? (
                          <div className="flex gap-2 transition-all duration-300">
                            <button 
                              onClick={() => { scrollToSection(); startEditLink(child._id, true, link._id); }} 
                              className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                              title="Edit"
                            >
                              <FaPencilAlt />
                            </button>
                            <button 
                              onClick={() => setIsDeletingChild({ open: true, childId: child._id, id: link._id })} 
                              className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ) : (
                          <div 
                            ref={deleteChildRef}
                            className="flex gap-2 items-center text-sm bg-gray-600 text-white p-1 px-2 rounded-sm transition-all duration-300"
                          >
                            <span className="font-medium">Delete child link?</span>
                            <button 
                              onClick={() => {
                                deleteLink(child._id, true, link._id);
                                setIsDeletingChild({ open: false, childId: '', id: '' });
                              }}
                              className="p-1 hover:bg-red-700 rounded transition-colors"
                              title="Confirm Delete"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => setIsDeletingChild({ open: false, childId: '', id: '' })} 
                              className="p-1 hover:bg-indigo-700 rounded transition-colors"
                              title="Cancel"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-12 text-gray-500 transition-all">
          No navigation links added yet. Click "Add Link" to get started.
        </div>
      )}     
    </div>
  );
};

export default NavigationSection;














