import { useContext, useEffect, useState } from 'react';
import { FaPlus, FaTrash, FaPhotoVideo, FaSave } from 'react-icons/fa';
import { ApiContext } from '../../../context/apiContext';
import { Loader } from '../../../components/Loader';

const FooterSection = () => {
  const { getFooter, updateFooter, footerData, setFooterData, loading } = useContext(ApiContext);
  const [newSocial, setNewSocial] = useState({ platform: '', url: '' });
  const [newColumn, setNewColumn] = useState({ title: '', links: [] });
  
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFooterData({ ...footerData, logo: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addSocialLink = () => {
    if (!newSocial.platform || !newSocial.url) return;
    
    setFooterData({
      ...footerData,
      socialLinks: [
        ...footerData?.socialLinks,
        {
          id: Date.now(),
          platform: newSocial.platform,
          url: newSocial.url
        }
      ]
    });
    
    setNewSocial({ platform: '', url: '' });
  };
  
  const addNewColumn = () => {
    if (!newColumn.title) return;
    
    setFooterData({
      ...footerData,
      columns: [
        ...footerData?.columns,
        {
          id: Date.now(),
          title: newColumn.title,
          links: []
        }
      ]
    });
    
    setNewColumn({ title: '', links: [] });
  };
  
  const deleteSocialLink = (id) => {
    setFooterData({
      ...footerData,
      socialLinks: footerData?.socialLinks?.filter(link => link.id !== id)
    });
  };
  
  const deleteColumn = (id) => {
    setFooterData({
      ...footerData,
      columns: footerData?.columns?.filter(col => col.id !== id)
    });
  };
  
  const addLinkToColumn = (colId) => {
    setFooterData({
      ...footerData,
      columns: footerData?.columns?.map(col => {
        if (col.id === colId) {
          return {
            ...col,
            links: [
              ...col.links,
              { id: Date.now(), text: '', url: '' }
            ]
          };
        }
        return col;
      })
    });
  };
  
  const deleteLinkFromColumn = (colId, linkId) => {
    setFooterData({
      ...footerData,
      columns: footerData?.columns?.map(col => {
        if (col.id === colId) {
          return {
            ...col,
            links: col.links.filter(link => link.id !== linkId)
          };
        }
        return col;
      })
    });
  };

  const updateText = (field, value) => {
    setFooterData({ ...footerData, [field]: value });
  };
  
  const updateColumnTitle = (id, title) => {
    setFooterData({
      ...footerData,
      columns: footerData?.columns?.map(col => 
        col.id === id ? { ...col, title } : col
      )
    });
  };
  
  const updateColumnLink = (colId, linkId, field, value) => {
    setFooterData({
      ...footerData,
      columns: footerData?.columns?.map(col => {
        if (col.id === colId) {
          return {
            ...col,
            links: col.links?.map(link => 
              link.id === linkId ? { ...link, [field]: value } : link
            )
          };
        }
        return col;
      })
    });
  };

  useEffect(() => {
    getFooter();
  }, [getFooter]);

  if (loading) return <Loader text={'...Loading'} />;
  
  return (
    <div className="p-4 md:p-6 transition-all">
      <div className="mb-6 transition-all">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 transition-all">Footer Settings</h2>
        <p className="text-gray-600 mt-1 transition-all">Customize your website footer</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 transition-all">
        {/* Logo Section */}
        <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 transition-all duration-300 hover:shadow-sm">
          <h3 className="font-medium text-gray-900 mb-3 md:mb-4 transition-all">Website Logo</h3>
          
          <div className="flex flex-col items-center transition-all">
            {footerData?.logo ? (
              <div className="relative transition-all">
                <img 
                  src={footerData?.logo} 
                  alt="Website logo" 
                  className="h-24 md:h-32 object-contain transition-all"
                />
                <button 
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2 transition-all duration-300 transform hover:scale-110"
                  onClick={() => setFooterData({ ...footerData, logo: null })}
                >
                  <FaTrash className="w-3 h-3 md:w-4 md:h-4 transition-all" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg md:rounded-xl w-full h-24 md:h-32 transition-all duration-300 hover:border-indigo-400">
                <FaPhotoVideo className="w-8 h-8 md:w-10 md:h-10 text-gray-400 mb-2 transition-all" />
                <p className="text-gray-500 text-xs md:text-sm transition-all">No logo uploaded</p>
              </div>
            )}
            
            <label className="mt-3 md:mt-4 inline-flex items-center justify-center px-3 py-1 md:px-4 md:py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-all duration-300">
              <input 
                type="file" 
                className="sr-only"
                onChange={handleLogoUpload}
                accept="image/*"
              />
              Upload Logo
            </label>
          </div>
        </div>
        
        {/* Footer Text */}
        <div className="space-y-4 md:space-y-6 transition-all">
          <div className="transition-all">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 transition-all">
              Footer Description
            </label>
            <textarea
              value={footerData?.description}
              onChange={(e) => updateText('description', e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] md:min-h-[100px] transition-all"
            />
          </div>
          
          <div className="transition-all">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 transition-all">
              Copyright Text
            </label>
            <input
              type="text"
              value={footerData?.copyright}
              onChange={(e) => updateText('copyright', e.target.value)}
              className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => updateFooter(footerData?._id, footerData)}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm transition-all duration-300"
            >
              <FaSave className="w-4 h-4 md:w-5 md:h-5 transition-all"/>
              Save changes
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer Columns */}
   <div className="mt-6 md:mt-8 transition-all">
  <div className="flex justify-between items-center mb-4 transition-all">
    <h3 className="text-lg font-semibold text-gray-800 transition-all">Footer Columns</h3>

  </div>
  
  {/* Columns List */}
  <div className="space-y-4 transition-all">
    {footerData?.columns?.map((column, colIndex) => (
      <div 
        key={column.id} 
        className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-sm transition-all duration-300"
      >
        {/* Column Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-medium">
              {colIndex + 1}
            </span>
            <input
              type="text"
              value={column.title}
              onChange={(e) => updateColumnTitle(column.id, e.target.value)}
              className="font-medium text-gray-800 bg-transparent border-b border-transparent focus:border-indigo-300 focus:outline-none transition-all"
              placeholder="Column title"
            />
          </div>
          <button
            onClick={() => deleteColumn(column.id)}
            className="p-1 text-red-500 hover:text-red-600 rounded-full transition-colors"
            aria-label="Delete column"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
        
        {/* Links List */}
        <div className="p-4 space-y-3">
          {column.links?.map((link) => (
            <div key={link.id} className="flex items-start space-x-3 group">
              <span className="mt-2.5 w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></span>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={link.text}
                  onChange={(e) => updateColumnLink(column.id, link.id, 'text', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Link text"
                />
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateColumnLink(column.id, link.id, 'url', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="URL"
                  />
                  <button
                    onClick={() => deleteLinkFromColumn(column.id, link.id)}
                    className="p-2 text-red-500 hover:text-red-600 rounded-lg transition-colors"
                    aria-label="Delete link"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => addLinkToColumn(column.id)}
            className="justify-self-end flex items-center justify-center w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200"
          >
            <FaPlus className="mr-2 w-3 h-3" />
            Add New Link
          </button>
        </div>
      </div>
    ))}
  </div>
  
  {/* Add New Column */}
  <div className="mt-6 bg-white rounded-xl border border-dashed border-gray-300 transition-all duration-300 hover:border-indigo-400">
    <div className="p-4 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
      <div className="flex-1 w-full">
        <input
          type="text"
          value={newColumn.title}
          onChange={(e) => setNewColumn({ ...newColumn, title: e.target.value })}
          className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          placeholder="Enter new column title"
        />
      </div>
      <button
        onClick={addNewColumn}
        className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-300"
      >
        <FaPlus className="mr-2 w-4 h-4" />
        Add Column
      </button>
    </div>
  </div>
  
  {/* Save Button */}
  <div className="mt-6 flex justify-end">
    <button
      onClick={() => updateFooter(footerData?._id, footerData)}
      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-300 flex items-center"
    >
      <FaSave className="mr-2 w-4 h-4" />
      Save Columns
    </button>
  </div>
</div>
      
      {/* Social Media Links */}
      <div className="mt-6 md:mt-8 transition-all">
        <div className="flex justify-between items-center mb-3 md:mb-4 transition-all">
          <h3 className="font-medium text-gray-900 transition-all">Social Media Links</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg md:rounded-xl p-4 md:p-6 transition-all duration-300 hover:shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 transition-all">
            {/* Existing Social Links */}
            <div className="transition-all">
              <div className="space-y-2 md:space-y-3 transition-all">
                {footerData?.socialLinks?.map(link => (
                  <div 
                    key={link.id}
                    className="flex items-center justify-between bg-white p-2 md:p-3 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2 md:gap-3 transition-all">
                      <div className="bg-indigo-100 text-indigo-800 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm transition-all">
                        {link.platform.charAt(0).toUpperCase()}
                      </div>
                      <div className="transition-all">
                        <div className="font-medium text-xs md:text-sm capitalize transition-all">{link.platform}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-[200px] transition-all">{link.url}</div>
                      </div>
                    </div>
                    <button 
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                      onClick={() => deleteSocialLink(link.id)}
                    >
                      <FaTrash className="w-4 h-4 md:w-5 md:h-5 transition-all" />
                    </button>
                  </div>
                ))}
              </div>
              
              {(!footerData?.socialLinks || footerData?.socialLinks?.length === 0) && (
                <div className="text-center py-3 md:py-4 text-gray-500 text-xs md:text-sm transition-all">
                  No social links added yet
                </div>
              )}
            </div>
            
            {/* Add New Social Link */}
            <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2 md:mb-3 transition-all">Add New Social Link</h4>
              
              <div className="space-y-3 md:space-y-4 transition-all">
                <div className="transition-all">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 transition-all">
                    Platform
                  </label>
                  <input
                    type="text"
                    value={newSocial.platform}
                    onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                    className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="e.g. Facebook"
                  />
                </div>
                
                <div className="transition-all">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 transition-all">
                    URL
                  </label>
                  <input
                    type="text"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                    className="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="e.g. https://facebook.com/yourpage"
                  />
                </div>
                
                <button
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs md:text-sm transition-all duration-300 transform hover:scale-[1.02]"
                  onClick={addSocialLink}
                >
                  <FaPlus className="w-4 h-4 md:w-5 md:h-5 transition-all" />
                  <span className="transition-all">Add Social Link</span>
                </button>
              </div>      
            </div>            
          </div>         
        </div>
        
        <div className="flex justify-center mt-3 md:mt-4">
          <button
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm transition-all duration-300"
            onClick={() => updateFooter(footerData?._id, footerData)}
          >
            <FaSave className="w-4 h-4 md:w-5 md:h-5 transition-all"/>
            Save Social links
          </button>
        </div>
      </div>
      
      {/* Preview Section */}
      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200 transition-all">
        <h3 className="font-medium text-gray-900 mb-3 md:mb-4 transition-all">Footer Preview</h3>
        
        <div className="bg-gray-900 text-gray-300 rounded-lg md:rounded-xl overflow-hidden transition-all duration-500 hover:shadow-lg md:hover:shadow-2xl">
          <div className="p-4 md:p-6 lg:p-8 transition-all">
            <div className="max-w-6xl mx-auto transition-all">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 transition-all">
                {/* Logo and Description */}
                <div className="sm:col-span-2 lg:col-span-1 transition-all">
                  <div className="mb-3 md:mb-4 transition-all">
                    {footerData?.logo ? (
                      <img 
                        src={footerData?.logo} 
                        alt="Logo" 
                        className="h-10 md:h-12 object-contain transition-all"
                      />
                    ) : (
                      <div className="bg-gray-800 border border-gray-700 rounded-lg w-24 md:w-32 h-10 md:h-12 flex items-center justify-center transition-all">
                        <span className="text-gray-500 text-xs md:text-sm transition-all">Logo</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm transition-all">
                    {footerData?.description}
                  </p>
                </div>
                
                {/* Columns */}
                {footerData?.columns?.map(column => (
                  <div key={column.id} className="transition-all">
                    <h4 className="text-white font-medium mb-2 md:mb-3 text-sm md:text-base transition-all">{column.title}</h4>
                    <ul className="space-y-1 md:space-y-2 transition-all">
                      {column.links?.map(link => (
                        <li key={link.id} className="transition-all">
                          <a 
                            href={link.url} 
                            className="text-gray-400 hover:text-white transition-colors duration-300 text-xs md:text-sm"
                          >
                            {link.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              {/* Social Links */}
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center transition-all">
                <div className="text-gray-500 text-xs md:text-sm transition-all">
                  {footerData?.copyright}
                </div>
                
                <div className="flex gap-2 md:gap-3 mt-3 md:mt-0 transition-all">
                  {footerData?.socialLinks?.map(link => (
                    <a 
                      key={link.id}
                      href={link.url}
                      className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-all duration-300 text-xs md:text-sm"
                      title={link.platform}
                    >
                      <span className="font-medium transition-all">
                        {link.platform.charAt(0).toUpperCase()}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;