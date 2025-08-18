import  { useContext, useState } from 'react';
import NavigationSection from './components/NavigationSection';
import FooterSection from './components/FooterSection';
import { ApiContext } from '../../context/apiContext';
import { MdCheckCircle , MdOutlineWarningAmber } from "react-icons/md"
import Modals from '../../components/Modals';

const Navigation = () => {
 const [activeSection, setActiveSection] = useState('navigation');
 const{pageResponse, setPageResponse} = useContext(ApiContext)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 transition-all duration-300">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12 text-center transition-all">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 transition-all">
            CMS Configuration
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto transition-all">
            Manage your website navigation and footer settings
          </p>
          
          <div className="flex justify-center mt-6 transition-all">
            <div className="inline-flex p-1 bg-gray-100 rounded-lg shadow-sm transition-all">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  activeSection === 'navigation'
                    ? 'bg-white text-indigo-600 shadow-sm transform -translate-y-0.5'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveSection('navigation')}
              >
                Navigation
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                  activeSection === 'footer'
                    ? 'bg-white text-indigo-600 shadow-sm transform -translate-y-0.5'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveSection('footer')}
              >
                Footer
              </button>
            </div>
          </div>
        </header>

        <main className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 transform hover:shadow-xl">
          <div className="transition-all duration-500">
            {activeSection === 'navigation' ? <NavigationSection /> : <FooterSection />}
          </div>
        </main>
      </div>
      
      {/* Success delete modals */}
      {pageResponse?.message && <Modals
      title={'Message'} 
      closeModal={()=> setPageResponse({})}
      caption={pageResponse?.message}
      cancel={'Close'}
      iconStyle={pageResponse?.success ?  'bg-green-100'
              : 'bg-red-100'}
      icon={pageResponse?.success ? <MdCheckCircle  size={24} className='text-green-600'/> : <MdOutlineWarningAmber size={24} className='text-red-600'/>}
      />}
    </div>
  );
}

export default Navigation


