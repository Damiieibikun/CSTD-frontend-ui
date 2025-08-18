import {
  FaTachometerAlt,
  FaCode,
  FaFolder,
  FaChevronDown,
  FaChevronRight,
  FaTasks,
  FaPencilRuler,
  FaFilePdf,
  FaRegCommentDots,
  FaRegNewspaper,
  FaCalendarAlt,
  FaFileImage 
} from 'react-icons/fa';
import * as FaIcons from 'react-icons/fa';
import { RiLockPasswordLine } from "react-icons/ri";
import cstdlog from '../assets/images/cstd logoogo.png';
import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../context/apiContext';

const Sidenav = ({ loggedAdmin }) => {
  const { links, getPageLinks, feedbackList, getFeedback } = useContext(ApiContext);
  const [expandedSections, setExpandedSections] = useState({
    pages: false,
    mediaPages: false
  });
  
  // Track hover state with delay for better UX
  const [hoverState, setHoverState] = useState({
    active: false,
    item: '',
    timeout: null
  });

  const handleMouseEnter = (itemName) => {
    // Clear any pending hide operations
    if (hoverState.timeout) {
      clearTimeout(hoverState.timeout);
    }
    setHoverState({
      active: true,
      item: itemName,
      timeout: null
    });
  };

  const handleMouseLeave = () => {
    // Set timeout before hiding to prevent flickering
    const timeout = setTimeout(() => {
      setHoverState(prev => ({ ...prev, active: false, item: '' }));
    }, 200);
    setHoverState(prev => ({ ...prev, timeout }));
  };

  const DynamicIcon = ({ icon }) => {
    if (typeof icon !== 'string' || !icon.includes(':')) return null;
    const [lib, name] = icon.split(':');
    const IconComponent = lib === 'fa' ? FaIcons[name] : null;
    return IconComponent ? <IconComponent /> : null;
  };

  // Common items for all roles
  const commonItems = [
    { pageName: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' + (loggedAdmin?.role || '') },
    { pageName: 'Upcoming Projects', icon: <FaPencilRuler />, path: '/upcomingprojects' + (loggedAdmin?.role || '') },
    { pageName: 'Past Projects', icon: <FaTasks />, path: '/pastprojects' + (loggedAdmin?.role || '') },
    { pageName: 'Papers and publications', icon: <FaFilePdf />, path: '/publications' + (loggedAdmin?.role || '') },
    { pageName: 'Client feedback', icon: <FaRegCommentDots />, path: '/feedback' + (loggedAdmin?.role || '') },
    { pageName: 'Change Password', icon: <RiLockPasswordLine />, path: '/changepassword' }
  ];

  // Filter links based on role
  const excludedPages = ['news', 'gallery', 'events'];
  const includedPages = ['news', 'gallery', 'events'];
  
  const navAdminLinks = links?.filter(link => !excludedPages.includes(link.pageId));
  const navMediaLinks = links?.filter(link => includedPages.includes(link.pageId));

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Role-specific navigation
  const getNavItems = () => {
    switch (loggedAdmin?.role) {
      case 'webmaster':
        return [
          { pageName: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboardwebmaster' },
          { pageName: 'Nav & Footer', icon: <FaCode />, path: '/navigation' },
          { 
            section: 'pages',
            title: 'Pages', 
            icon: <FaFolder />,
            items: [...links]
          },
          { pageName: 'Upcoming Projects', icon: <FaPencilRuler />, path: '/upcomingprojects'},
          { pageName: 'Past Projects', icon: <FaTasks />, path: '/pastprojects'},
          { pageName: 'Papers and publications', icon: <FaFilePdf />, path: '/publications'},          
          { pageName: 'News', icon: <FaRegNewspaper />, path: '/newslist'},          
          { pageName: 'Events', icon: <FaCalendarAlt />, path: '/eventslist'},          
          { pageName: 'Gallery', icon: <FaFileImage />, path: '/gallerylist'},          
          { pageName: 'Client feedback', icon: <FaRegCommentDots />, path: '/feedback' },
          { pageName: 'Change Password', icon: <RiLockPasswordLine />, path: '/changepassword' }
        ];
      case 'admin':
        return [
          { pageName: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboardadmin' },
          { 
            section: 'pages',
            title: 'Pages',
            icon: <FaFolder />,
            items: [...navAdminLinks]
          }, 
          { pageName: 'Upcoming Projects', icon: <FaPencilRuler />, path: '/upcomingprojects'},
          { pageName: 'Past Projects', icon: <FaTasks />, path: '/pastprojects'},
          { pageName: 'Papers and publications', icon: <FaFilePdf />, path: '/publications'},
          { pageName: 'Change Password', icon: <RiLockPasswordLine />, path: '/changepassword' }
        ];
      case 'media':
        return [
          { pageName: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboardmedia' },
          { 
            section: 'mediaPages',
            title: 'Media Pages',
            icon: <FaFolder />,
            items: [...navMediaLinks]
          },
          { pageName: 'News', icon: <FaRegNewspaper />, path: '/newslist'},          
          { pageName: 'Events', icon: <FaCalendarAlt />, path: '/eventslist'},          
          { pageName: 'Gallery', icon: <FaFileImage />, path: '/gallerylist'}, 
          { pageName: 'Change Password', icon: <RiLockPasswordLine />, path: '/changepassword' }
        ];
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  useEffect(() => {
    getPageLinks();
    getFeedback();
  }, [getPageLinks, getFeedback]);

  const getRoleStyles = () => {
    switch (loggedAdmin?.role) {
      case 'media': return { bg: 'bg-[#307342]', hover: 'hover:text-[#307342]' };
      case 'admin': return { bg: 'bg-[#152E7E]', hover: 'hover:text-[#152E7E]' };
      default: return { bg: 'bg-[#6f6f6f]', hover: 'hover:text-[#6f6f6f]' };
    }
  };

  const { bg, hover } = getRoleStyles();

  return (
    <aside className={`${bg} h-screen md:w-64 text-white shadow-lg fixed top-0 left-0 overflow-y-auto z-50`}>
      <div className="flex items-center justify-center p-4 border-b border-white/20">
        <div className="hidden md:flex flex-col p-6 border-b border-white/20">
          <p className='text-[18px] font-bold'>
            {loggedAdmin?.role === 'media' ? 'Media Panel' : 
             loggedAdmin?.role === 'admin' ? 'Admin Panel' : 'WebMaster'}
          </p>
          {loggedAdmin && <p className='capitalize'>{loggedAdmin.firstname} {loggedAdmin.lastname}</p>}
        </div>
        <img src={cstdlog} alt="CSTD Logo" className="h-12 object-contain" />
      </div>

      <nav className="mt-6 space-y-1">
        {navItems.map((item) => {
          if (item.section) {
            return (
              <div key={item.section} className="px-2">
                <button
                  onMouseEnter={() => handleMouseEnter(item.title)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => toggleSection(item.section)}
                  className={`relative flex items-center justify-between w-full px-4 py-3 text-left rounded-md hover:bg-white/10 transition-all duration-300 ease-in-out`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm transition-transform duration-300 ease-in-out">
                      {item.icon}
                    </span>
                    <span className="text-sm hidden md:flex">{item.title}</span>
                  </div>
                  <span className="text-xs transition-transform duration-300 ease-in-out">
                    {expandedSections[item.section] ? 
                      <FaChevronDown className="transform rotate-180" /> : 
                      <FaChevronRight />}
                  </span>
                  
                  {/* Popover for section title */}
                 <div
                className={`absolute md:hidden text-center bottom-full left-1/2 -translate-x-1/2 mb-2 
                            w-auto min-w-[80px] bg-white text-gray-800 text-[10px] 
                            px-2 py-1 rounded shadow-lg transition-opacity duration-200
                            ${hoverState.active && hoverState.item === item.title ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                {item.title}
              
                <div className="absolute md:hidden top-full left-1/2 -translate-x-1/2 w-0 h-0 
                                border-l-4 border-l-transparent border-r-4 border-r-transparent 
                                border-t-4 border-t-white" />
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedSections[item.section] ? 'max-h-96' : 'max-h-0'
                }`}>
                  <div className="overflow-y-auto py-1">
                    {item.items.map((page) => (
                      <a
                        onMouseEnter={() => handleMouseEnter(page.pageName)}
                        onMouseLeave={handleMouseLeave}
                        key={page.pageName}
                        href={page.path}
                        className={`relative flex items-center gap-3 px-6 py-2 pl-10 hover:bg-white ${hover} transition-all duration-200 ease-in-out transform`}
                      >
                        <span className="text-lg transition-transform duration-200 ease-in-out">
                          {typeof page.icon === 'string' ? <DynamicIcon icon={page.icon} /> : page.icon}
                        </span>
                        <span className="text-sm hidden md:flex capitalize">{page.pageName}</span>
                        
                        {/* Popover for page name */}
                        <div
                className={`absolute z-100 md:hidden text-center bottom-full left-1/2 -translate-x-1/2 mb-2 
                            w-auto min-w-[80px] bg-white text-gray-800 text-[10px] 
                            px-2 py-1 rounded shadow-lg transition-opacity duration-200
                            ${hoverState.active && hoverState.item === page.pageName ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                {page.pageName}
              
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 
                                border-l-4 border-l-transparent border-r-4 border-r-transparent 
                                border-t-4 border-t-white" />
                  </div>
                        
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={item.pageName} className="relative">
              <a
                onMouseEnter={() => handleMouseEnter(item.pageName)}
                onMouseLeave={handleMouseLeave}
                href={item.path}
                className={`relative flex items-center gap-3 px-6 py-3 hover:bg-white ${hover} transition-all duration-200 ease-in-out`}
              >
                <span className="text-lg">
                  {typeof item.icon === 'string' ? <DynamicIcon icon={item.icon} /> : item.icon}
                </span>
                <p className="text-sm hidden md:flex gap-2 items-center">
                  {item.pageName}
                </p>
                {item.pageName === 'Client feedback' && feedbackList?.length > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full transition-all duration-300 ease-in-out transform scale-100 hover:scale-110">
                    {feedbackList.length}
                  </span>
                )}
                                
                <div
                className={`absolute md:hidden text-center bottom-full left-1/2 -translate-x-1/2 mb-2 
                            w-auto min-w-[80px] bg-white text-gray-800 text-[10px] 
                            px-2 py-1 rounded shadow-lg transition-opacity duration-200
                            ${hoverState.active && hoverState.item === item.pageName ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                {item.pageName}
              
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 
                                border-l-4 border-l-transparent border-r-4 border-r-transparent 
                                border-t-4 border-t-white" />
                  </div>

              </a>
            </div>
          );
        })}          
      </nav>
    </aside>
  );
};

export default Sidenav;