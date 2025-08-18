import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Indexpage from './pages/Indexpage';
import Register from './pages/Register';
import WebMasterReg from './pages/WebMasterReg';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import DashboardLayout from './components/DashBoardLayout';
import DashboardWebmaster from './pages/Dashboards/DashboardWebmaster';
import DashboardAdmin from './pages/Dashboards/DashboardAdmin';
import DashboardMedia from './pages/Dashboards/DashboardMedia';
import ChangePassword from './pages/ChangePassword';
import Navigation from './pages/Navigation/Navigation';
import UpcomingProjects from './pages/PageInfo/components/Upcomingprojects';
import PastProjects from './pages/PageInfo/components/PastProjects';
import PapersPublications from './pages/PageInfo/components/PapersPublications';
import { useContext, useEffect, useState } from 'react';
import { ApiContext } from './context/apiContext';
import Page from './pages/PageInfo/Page';
import { Loader } from './components/Loader';
import FeedBack from './pages/PageInfo/components/FeedBack';
import News from './pages/PageInfo/components/News';

function App() {
  const { links, getPageLinks } = useContext(ApiContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await getPageLinks();
      setLoading(false);
    })();
  }, [getPageLinks]);

 if (loading) return <Loader text={'...Loading'}/>

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Indexpage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/webmaster" element={<WebMasterReg />} />

        <Route
          path="/dashboardwebmaster"
          element={
            <DashboardLayout>
              <DashboardWebmaster />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboardadmin"
          element={
            <DashboardLayout>
              <DashboardAdmin />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboardmedia"
          element={
            <DashboardLayout>
              <DashboardMedia />
            </DashboardLayout>
          }
        />
        <Route
          path="/navigation"
          element={
            <DashboardLayout>
              <Navigation />
            </DashboardLayout>
          }
        />
        <Route
          path="/eventslist"
          element={
            <DashboardLayout>
              {/* < /> */}
            </DashboardLayout>
          }
        />
        <Route
          path="/newslist"
          element={
            <DashboardLayout>
              <News />
            </DashboardLayout>
          }
        />
        <Route
          path="/medialist"
          element={
            <DashboardLayout>
              {/* < /> */}
            </DashboardLayout>
          }
        />
        <Route
          path="/pastprojects"
          element={
            <DashboardLayout>
              <PastProjects />
            </DashboardLayout>
          }
        />
        <Route
          path="/upcomingprojects"
          element={
            <DashboardLayout>
              <UpcomingProjects/>
            </DashboardLayout>
          }
        />
        <Route
          path="/publications"
          element={
            <DashboardLayout>
              <PapersPublications/>
            </DashboardLayout>
          }
        />
        <Route
          path="/feedback"
          element={
            <DashboardLayout>
              <FeedBack/>
            </DashboardLayout>
          }
        />
        
        {[...(links || [])]
          .sort((a, b) => a?.pageName.localeCompare(b?.pageName)) // Alphabetical sort
          .map((link) => (
            <Route
              key={link._id || link.pageId}
              path={link.path}
              element={
                <DashboardLayout>
                  <Page pageId={link.pageId} pageName={link.pageName} />
                </DashboardLayout>
              }
            />
        ))}


        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
