import { useState, useContext, useEffect } from "react"
import { ApiContext } from "../../context/apiContext"
import { useNavigate } from "react-router-dom"
import { Loader } from "../../components/Loader"
const DashboardMedia = () => {
  const navigate = useNavigate()
    const{storedAdmin, loading, news, getNews, getEvents, events} = useContext(ApiContext)
  

      // Extract all images from news
  const allImages = news?.flatMap(news => 
    news.media.filter(media => media.type === 'image')
  );

  // Statistics
    const totalNews = news?.length;
    const totalEvents = events?.length;
    const totalImages = allImages.length;
    const upcomingEvents = events?.filter(event => new Date(event.date) > new Date()).length;
  
    const [selectedImage, setSelectedImage] = useState(null)

    useEffect(()=>{
      if (storedAdmin?.role !== 'media') {
          navigate('/');
        }
    }, [navigate, storedAdmin?.role ])
        useEffect(()=>{
        getNews()
        getEvents()
      }, [getNews, getEvents])
  
      if(loading) return <Loader text={'...Loading'}/>

    return (
         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Media Dashboard</h1>
        <p className="text-gray-600 mt-2 text-center">Manage and view your media content</p>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-4 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{totalNews}</h2>
            <p className="text-gray-600">News Articles</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
          <div className="rounded-full bg-purple-100 p-4 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{totalEvents}</h2>
            <p className="text-gray-600">Total Events</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-4 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{totalImages}</h2>
            <p className="text-gray-600">Media Images</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center">
          <div className="rounded-full bg-yellow-100 p-4 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{upcomingEvents}</h2>
            <p className="text-gray-600">Upcoming Events</p>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Media Gallery</h2>
          <div className="text-sm text-gray-600">{allImages.length} images</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {allImages.map((image, index) => (
            <div 
              key={image._id} 
              className="relative group cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => setSelectedImage(image)}
            >
              <div className="rounded-xl overflow-hidden shadow-md">
                <div className="aspect-w-1 aspect-h-1">
                  <img 
                    src={image.thumbnail || image.url} 
                    alt={`Media ${index + 1}`}
                    className="object-cover w-full h-48 transition-all group-hover:brightness-75"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent News and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent News */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent News</h2>
          <div className="space-y-4">
            {news?.slice(0, 3).map(news => (
              <div key={news._id} className="flex items-start p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 mr-4">
                  {news.media.find(m => m.type === 'image') ? (
                    <img 
                      src={news.media.find(m => m.type === 'image').thumbnail} 
                      alt={news.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{news.title}</h3>
                  <p className="text-sm text-gray-600">{news.brief}</p>
                  <p className="text-xs text-gray-500 mt-1">{news.formattedDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {events?.filter(event => new Date(event.date) > new Date())
              .slice(0, 3).map(event => (
              <div key={event._id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <h3 className="font-semibold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
            <img 
              src={selectedImage.url} 
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              onClick={() => setSelectedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
    )
}

export default DashboardMedia
