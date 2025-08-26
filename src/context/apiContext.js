import { createContext, useCallback, useState } from "react";
import axios from 'axios'
export const ApiContext = createContext()

const ApiProvider = ({children})=>{

const [registered, setRegistered] = useState(false) 
const [registerErr, setregisterErr] = useState('') 
const [loggedin, setloggedin] = useState(false) 
const [loginErr, setloginErr] = useState('')
const [passwordChanged, setPasswordChanged] = useState(false)
const [passwordErr, setPasswordErr] = useState('')

const [showSuccess, setShowSuccess] = useState(false);
const [currentAdmin, setCurrentAdmin] = useState({})

const [loading, setLoading] = useState(false);
const [formErr, setFormErr] = useState({}) 

// fetch all admins
const[allAdmins, setAllAdmins] = useState([])

// Pages
const[page, setPage] = useState({})
const[pageResponse, setPageResponse] = useState({})
const[links, setLinks] = useState([])

// Projects
const[projects, setProjects] = useState([])
//Publications
const[publications, setPublications] = useState([])
// Feedback
const [feedbackList, setFeedbackList] = useState([])

// News
const [news, setNews] = useState([])

// Events
const [events, setEvents] = useState([])

// Footer

const [footerData, setFooterData] = useState({})

const storedAdmin = JSON.parse(localStorage.getItem('loggedCSTDAdmin'));
const BASEURL = process.env.REACT_APP_ENDPOINT

const createWebmaster = async (data) => {
  console.log('loading')
    setLoading(true)
    setregisterErr('')
    try {
        const response = await axios.post(`${BASEURL}/admin/createwebmaster`, data)
        if(response.data.success){
            setRegistered(true)
            setLoading(false)
            
        }
    } catch (error) {
        console.log(error)
         setLoading(false)
        setregisterErr(error.response.data.message || 'Error in Registering Webmaster')
    }
}
const createAdmin = async (data) => {
    setLoading(true)
    setregisterErr('')
    try {
       
        const response = await axios.post(`${BASEURL}/admin/createadmin`, data)
        if(response.data.success){
            setRegistered(true)
            setLoading(false)
            
        }
    } catch (error) {
        console.log(error)       
        setLoading(false)
        setregisterErr(error.response.data.message || 'Error in Registering Admin')
    }
}
const editAdmin = async (data) => {
    setLoading(true)
    try {       
        const response = await axios.put(`${BASEURL}/admin/editAdmin`, data)
        if(response.data.success){       
            setLoading(false)
            setCurrentAdmin(response.data.data)
            localStorage.setItem('loggedCSTDAdmin', JSON.stringify(response.data.data))
            setFormErr(
                {
                    success: response.data.success,
                    message: response.data.message || 'Admin Editted Successfully'
                }
                )
            return (true)
            
        }
    } catch (error) {
        console.log(error)       
        setLoading(false)       
        setFormErr(
                {
                    success: false,
                    message: error.response.data.message || '*Error in Editing Admin'
                }
                )
        return (false)
    }
}
const loginAdmin = async (data) => {
    setLoading(true)
    setloginErr('')
    try {
        const response = await axios.post(`${BASEURL}/admin/login`, data)
        if(response.data.success){
            setloggedin(true)
            setLoading(false)
            setShowSuccess(true);
            setCurrentAdmin(response.data.data)
            localStorage.setItem('loggedCSTDAdmin', JSON.stringify(response.data.data))
        
        }
    } catch (error) {
        console.log(error)
         setLoading(false)
         setloginErr(error.response.data.message || 'Error in Logging in Admin')
    }
}

const changePasswordAdmin = async (data) => {
    setLoading(true)
    setPasswordErr('')
    try {
        const response = await axios.put(`${BASEURL}/admin/changePwdAdmin`, data)
        if(response.data.success){
            setPasswordChanged(true)
            setLoading(false)
            setShowSuccess(true);
            setCurrentAdmin(response.data.data)
            localStorage.setItem('loggedCSTDAdmin', JSON.stringify(response.data.data))
        }

        
    } catch (error) {
        console.log(error)
         setLoading(false)
         setPasswordErr(error.response.data.message)
    }
}


const getAllAdmins = useCallback(async () => { 
    setLoading(true)
  try {
    const response = await axios.get(`${BASEURL}/admin/alladmins`);
    if(response.data.success){

        setLoading(false)
        setAllAdmins(response.data.data)
    }

  } catch (err) {
    console.error(err);
    setLoading(true)
  }
}, [BASEURL]); 



const approveAdmin = async (id) => {
    setLoading(true)   
    try {
        const response = await axios.put(`${BASEURL}/admin/approve/${id}`)
        if(response.data.success){
             setLoading(false)         
            return ''            
        }
        
    } catch (error) {
        console.log(error)
        setLoading(false)
        return (error.response.data.message || 'Error in Approving Admin')
    }
}
const denyAdmin = async (id) => {
    setLoading(true)
    
    try {
        const response = await axios.put(`${BASEURL}/admin/deny/${id}`)
        if(response.data.success){
             setLoading(false)          
            return ''
        }
        
    } catch (error) {
        console.log(error)
        setLoading(false)
        return (error.response.data.message || 'Error in Denying Admin')
    }
}
const removeAdmin = async (id) => {
    setLoading(true)
    try {
        const response = await axios.delete(`${BASEURL}/admin/delete/${id}`)
        if(response.data.success){
             setLoading(false)          
            return ''
        }
        
    } catch (error) {
        console.log(error)
        setLoading(false)        
        return error.response.data.message || 'Error in Deleting Admin'
    }
}

// LINKS

const getPageLinks = useCallback(async () => { 
    setLoading(true)
  try {
    const response = await axios.get(`${BASEURL}/pages/links`);
    if(response.data.success){
        setLoading(false)
        setLinks(response.data.data)
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
  }
}, [BASEURL]);


const createPage = async (data) => { 
    setLoading(true)
  try {
    const response = await axios.post(`${BASEURL}/pages/create`, data);
    if(response.data.success){
        setLoading(false)
        getPageLinks()
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })
       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
    setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    
  }
}; 
const updatePage = async (id, data) => { 
    setLoading(true)
  try {
    const response = await axios.put(`${BASEURL}/pages/update/${id}`, data);
    if(response.data.success){
        setLoading(false)
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })
        
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
     setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    
  }

}; 
const deletePage = async (id) => { 
    setLoading(true)
  try {
    const response = await axios.delete(`${BASEURL}/pages/delete/${id}`);
    if(response.data.success){
        setLoading(false)
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })
       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
     setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
   
  }
}; 


// PAGES

const getCurrentPage = useCallback(async (page) => { 
    setLoading(true)
  try {
    const response = await axios.get(`${BASEURL}/pages/${page}`);
    if(response.data.success){
        setLoading(false)
        setPage(response.data.data)
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
  }
}, [BASEURL]); 


const updateCurrentPage = async (page, data) => {
    setLoading(true)
    try {
        const response = await axios.put(`${BASEURL}/pages/updatepage/${page}`, data)
        if(response.data.success){
            setPage(response.data.data)
            setLoading(false)
            getCurrentPage(page)
             setPageResponse({
            success: response.data.success,
            message: response.data.message
        })
        }
    } catch (err) {
        console.log(err)
        setLoading(false)
        setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    }
}

const deleteCurrentPageSection = async (page, data) => {
    setLoading(true)
    try {
         const response = await axios.put(`${BASEURL}/pages/updatepage/${page}`, data)
        if(response.data.success){
            setPage(response.data.data)
            setLoading(false)
            getCurrentPage(page)
             setPageResponse({
            success: response.data.success,
            message: response.data.message
        })
        }
    } catch (err) {
        console.log(err)
        setLoading(false)
        setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    }
}

// PROJECTS
const getProjects = useCallback(async (cat) => { 
    setLoading(true)
  try {
    const response = await axios.get(`${BASEURL}/project/getprojects?cat=${cat}`);
    if(response.data.success){
        setLoading(false)
        setProjects(response.data.data)
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
  }
}, [BASEURL]);

const submitUpcomingProjects =async(data)=>{  
      setLoading(true)
      const id = data.get('id')
 
      let response;
  try {
    if(id){
        response = await axios.put(`${BASEURL}/project/editproject/${id}`, data);
    }
    else{        
       response = await axios.post(`${BASEURL}/project/addupcomingproject`, data);
    }
    if(response.data.success){
        setLoading(false)
        getProjects('upcoming')
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
    setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    
  }
}

const submitPastProjects =async(data)=>{  
      setLoading(true)
      const id = data.get('id')
      let response;
  try {
    if(id){
        response = await axios.put(`${BASEURL}/project/editproject/${id}`, data);
    }
    else{        
       response = await axios.post(`${BASEURL}/project/addpastproject`, data);
    }
   
        if(response.data.success){
        setLoading(false)
        getProjects('past')
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })       
    }
    
  } catch (err) {
        console.error(err);
    setLoading(false)
    setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    
  }
}

const deleteProject = async (cat, id) => { 
    setLoading(true)
  try {
    const response = await axios.delete(`${BASEURL}/project/deleteproject/${id}`);
    if(response.data.success){
        setLoading(false)      
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })
        getProjects(cat)
       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
     setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
   
  }
    
}; 
 


// PUBLICATIONS
const getPublications = useCallback(async () => { 
    setLoading(true)
  try {
    const response = await axios.get(`${BASEURL}/pub/getpublications`);
    if(response.data.success){
        setLoading(false)
        setPublications(response.data.data)
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
  }
}, [BASEURL]);

const postPublication =async(data)=>{  
      setLoading(true)
  try {
    const response = await axios.post(`${BASEURL}/pub/addpublication`, data);
    if(response.data.success){
        setLoading(false)
        getPublications()
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
    setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    
  }
}
const editPublication =async(id, data)=>{  
      setLoading(true)
  try {
    const response = await axios.put(`${BASEURL}/pub/editpublication/${id}`, data);
    if(response.data.success){
        setLoading(false)
        getPublications()
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
    setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    
  }
}

const deletePublication = async (id) => { 
    setLoading(true)
  try {
    const response = await axios.delete(`${BASEURL}/pub/deletepublication/${id}`);
    if(response.data.success){
        setLoading(false)      
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })
        getPublications()
       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
     setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })   
  }
    
}; 

// NEWS

const getNews = useCallback(async () => { 
    setLoading(true)
  try {
    const response = await axios.get(`${BASEURL}/news/fetchnews`);
    if(response.data.success){
        setLoading(false)
        setNews(response.data.data)
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
  }
}, [BASEURL]);

const postNews = async (data) => {
    setLoading(true)
    try {
    const response = await axios.post(`${BASEURL}/news/createnews`, data);
    if(response.data.success){
        setLoading(false)
        getNews()
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
    setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    
  }
}
const editNews = async (id, data) => {
    setLoading(true)
  try {
    const response = await axios.put(`${BASEURL}/news/edit/${id}`, data);
    if(response.data.success){
        setLoading(false)
        getNews()
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
    setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    
  }
}
const deleteNews = async (id) => {
   setLoading(true)
  try {
    const response = await axios.delete(`${BASEURL}/news/delete/${id}`);
    if(response.data.success){
        setLoading(false)      
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })
        getNews()
       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
     setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })   
  }
}

    // EVENTS
const getEvents = useCallback(async () => { 
    setLoading(true)
  try {
    const response = await axios.get(`${BASEURL}/events/fetchevents`);
    if(response.data.success){
        setLoading(false)
        setEvents(response.data.data)
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
  }
}, [BASEURL]);

const postEvent = async (data) => {
    setLoading(true)
    try {
    const response = await axios.post(`${BASEURL}/events/createevent`, data);
    if(response.data.success){
        setLoading(false)
        getEvents()
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
    setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    
  }
}
const editEvent = async (id, data) => {
    setLoading(true)
  try {
    const response = await axios.put(`${BASEURL}/events/edit/${id}`, data);
    if(response.data.success){
        setLoading(false)
        getEvents()
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
    setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    
  }
}
const deleteEvent = async (id) => {
   setLoading(true)
  try {
    const response = await axios.delete(`${BASEURL}/events/delete/${id}`);
    if(response.data.success){
        setLoading(false)      
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })
        getEvents()
       
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
     setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })   
  }
}
 

// FEEDBACK
const getFeedback = useCallback(async () => { 
    setLoading(true)
  try {
    const response = await axios.get(`${BASEURL}/contact/feedback`);
    if(response.data.success){
        setLoading(false)
        setFeedbackList(response.data.data)
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
  }
}, [BASEURL]); 
    

const deleteMessage = async (id) => {
    setLoading(true)
    try {
         const response = await axios.delete(`${BASEURL}/contact/feedback/delete/${id}`)
        if(response.data.success){
            setPage(response.data.data)
            setLoading(false)
             setPageResponse({
            success: response.data.success,
            message: response.data.message
        })
        }
    } catch (err) {
        console.log(err)
        setLoading(false)
        setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
        getFeedback()
    }
}
const deleteMultiple = async (ids) => {
    if (ids.length === 0) return;
    setLoading(true)
    try {
         const response = await axios.delete(`${BASEURL}/contact/feedback/deletemany`, { data: { ids } })
        if(response.data.success){
            setPage(response.data.data)
            setLoading(false)
             setPageResponse({
            success: response.data.success,
            message: response.data.message
        })
        }
    } catch (err) {
        console.log(err)
        setLoading(false)
        setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
        getFeedback()
    }
}


// FOOTER
const getFooter = useCallback(async () => { 
    setLoading(true)
  try {
    const response = await axios.get(`${BASEURL}/footer/getfooter`);
    if(response.data.success){
        setLoading(false)
        setFooterData(response.data.data[0])
    }

  } catch (err) {
    console.error(err);
    setLoading(false)
  }
}, [BASEURL]);

const updateFooter = async (id, data) => {
    try {
    const response = await axios.put(`${BASEURL}/footer/updatefooter/${id}`, data);
    if(response.data.success){
        setLoading(false)
        setFooterData(response.data.data)
         setPageResponse({
            success: response.data.success,
            message: response.data.message
        })
    }
    } catch (err) {
        console.error(err);
        setLoading(false)
        setPageResponse({
            success: err.response.data.success,
            message: err.response.data.message
        })
    }
}
const values = {
        // URL
        BASEURL,

        //create webmaster
        createWebmaster,
        // create admin
        createAdmin,
        registered,
        setRegistered,

        // edit admin
        editAdmin,

        // login admin
        loginAdmin,
        loggedin,
        currentAdmin,
        storedAdmin,
        setCurrentAdmin,

        // change password
        changePasswordAdmin,
        passwordChanged,
        passwordErr,

        // success/error alerts
        showSuccess, 
        setShowSuccess,

        // check register and login errors        
        registerErr,
        loginErr,

        // loaders
        loading,

        // get all admins
        getAllAdmins,
        allAdmins,

        // approve and deny admins
        approveAdmin,
        denyAdmin,
        removeAdmin,

        // form errors
        formErr,
        setFormErr,


        // LINKS AND PAGES
        createPage,
        getPageLinks,
        setLinks,
        links,
        getCurrentPage,
        updateCurrentPage,
        deleteCurrentPageSection,
        updatePage,
        deletePage,
        page,
        pageResponse,
        setPageResponse,

        // PROJECTS AND PUBLICATIONS
        projects,
        getProjects,
        submitUpcomingProjects,
        submitPastProjects,
        deleteProject,

        publications,
        getPublications,
        postPublication,
        editPublication,
        deletePublication,

        // NEWS,
        news,
        getNews,
        postNews,
        editNews,
        deleteNews,

        // EVENTS
        events, 
        getEvents, 
        postEvent, 
        editEvent, 
        deleteEvent,

        // FEEDBACK
        getFeedback,
        feedbackList,
        setFeedbackList,
        deleteMessage,
        deleteMultiple,

        // FOOTER
        getFooter,
        footerData, 
        setFooterData,
        updateFooter,
    }
   return(
    <ApiContext.Provider value={values}>
   {children}
   </ApiContext.Provider>
   )
   
}

export {ApiProvider}