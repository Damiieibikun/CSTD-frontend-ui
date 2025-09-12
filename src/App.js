import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
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
import Events from './pages/PageInfo/components/Events';
import { AuthProvider, useAuth } from './context/authContext';


const OnlyCustomRouter = ({ children, permission }) => {
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin, isMedia, isWebmaster } = useAuth();
    if (!['admin', 'media', 'webmaster'].includes(permission))
        throw new Error("Invalid Permission type");
    const pType = () => {
        if (permission === "admin") return isAdmin;
        if (permission === "media") return isMedia;
        if (permission === "webmaster") return isWebmaster;
    }
    return (isAuthenticated && pType()) ? <>{children}</> : navigate("/");
}

// The OnlyCustomRouter can be used as encompasing any of the routes using the following format.
// <Route path="/pathdirection"
//      element={
//          <OnlyCustomRouter permission={"admin"}>
//              <Indexpage />
//          </OnlyCustomRouter>
//      }
//  />
//  Observe line 75 to 80
// 

function App() {
    const { links, getPageLinks } = useContext(ApiContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            await getPageLinks();
            setLoading(false);
        })();
    }, [getPageLinks]);

    if (loading) return <Loader text={'...Loading'} />

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Indexpage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/changepassword" element={<ChangePassword />} />
                    <Route path="/webmaster" element={<WebMasterReg />} />

                    <Route
                        path="/dashboardwebmaster"
                        element={
                            <OnlyCustomRouter permission={"webmaster"}>
                                <DashboardLayout>
                                    <DashboardWebmaster />
                                </DashboardLayout>
                            </OnlyCustomRouter>
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
                                <Events />
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
                                <UpcomingProjects />
                            </DashboardLayout>
                        }
                    />
                    <Route
                        path="/publications"
                        element={
                            <DashboardLayout>
                                <PapersPublications />
                            </DashboardLayout>
                        }
                    />
                    <Route
                        path="/feedback"
                        element={
                            <DashboardLayout>
                                <FeedBack />
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
        </AuthProvider>
    );
}

export default App;
