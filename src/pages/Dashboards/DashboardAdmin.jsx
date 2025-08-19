import { useState, useContext, useEffect } from "react";
import { ApiContext } from "../../context/apiContext";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/Loader";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const { 
    storedAdmin, 
    loading, 
    getPageLinks,        
    links, 
    projects,
    getProjects, 
    publications,
    getPublications 
  } = useContext(ApiContext);

  const excludedPages = ['news', 'gallery', 'events'];  
  const navAdminLinks = links?.filter(link => !excludedPages.includes(link.pageId)) || [];

  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // Statistics
  const totalProjects = projects?.length || 0;
  const totalPublications = publications?.length || 0;
  const totalPages = navAdminLinks.length;
  

  useEffect(() => {
    if (storedAdmin?.role !== 'admin') {
      navigate('/');
    }
  }, [navigate, storedAdmin?.role]);

  useEffect(() => {
    getPageLinks();
    getProjects('');
    getPublications();
  }, [getPageLinks, getProjects, getPublications]);

  if (loading) return <Loader text={'Loading Dashboard...'}/>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {storedAdmin?.firstname || 'Admin'}</p>
      </header>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          {['overview', 'projects', 'publications', 'pages'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
              <div className="rounded-full bg-blue-100 p-4 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{totalProjects}</h2>
                <p className="text-gray-600">Total Projects</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
              <div className="rounded-full bg-purple-100 p-4 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{totalPublications}</h2>
                <p className="text-gray-600">Publications</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
              <div className="rounded-full bg-green-100 p-4 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{totalPages}</h2>
                <p className="text-gray-600">Managed Pages</p>
              </div>
            </div>            
          </div>

          
          <div className="grid grid-cols-1 mb-10">           

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {projects?.slice(0, 3).map(project => (
                  <div key={project._id} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 capitalize">{project.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Updated on {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Projects ({totalProjects})</h2>
            
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                 
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects?.map(project => (
                  <tr key={project._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 capitalize">{project.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        project.category === 'past' 
                          ? 'bg-green-100 text-green-800'
                          : project.category === 'upcoming'
                          ? 'bg-yellow-100 text-yellow-800'
                          : null
                      }`}>
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Publications Tab */}
      {activeTab === 'publications' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Publications ({totalPublications})</h2>
           
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications?.map(publication => (
              <div key={publication._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-gray-800 mb-2 capitalize">{publication.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2" dangerouslySetInnerHTML={{ __html: publication.summary }}></p>
                <div className="text-xs text-gray-500 mb-3">
                  Published on {new Date(publication.date).toLocaleDateString()}
                </div>
                <div className="flex justify-between items-center">
                  <a href={publication.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                    View Publication
                  </a>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Managed Pages ({totalPages})</h2>
           
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navAdminLinks.map(page => (
              <div key={page._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 capitalize">{page.pageName}</h3>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Path:</span> {page.path}
                </div>
                <div className="flex justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    page.pageType === 'home' 
                      ? 'bg-orange-100 text-orange-800'
                      : page.pageType === 'about' 
                      ? 'bg-purple-100 text-purple-800'
                      : page.pageType === 'contact'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {page.pageType}
                  </span>                  
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
