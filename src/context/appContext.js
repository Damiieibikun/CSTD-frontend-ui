import { createContext, useContext } from "react";
import { ApiContext } from "./apiContext";

export const AppContext = createContext()

const AppProvider = ({children})=>{

   
// Create Admin
  const{createWebmaster, createAdmin, loginAdmin, changePasswordAdmin} = useContext(ApiContext)

  // Register webmaster
  const registerWebmaster = (data)=>{  
  createWebmaster(data)

}
  // Register Admin
  const registerAdmin = (data)=>{    
    // console.log(data) 
    createAdmin(data) 
   
}


// Login Admin
  const login = (data)=>{   
  loginAdmin(data)            
}

// Login Admin
  const changePassword = (data)=>{    
  changePasswordAdmin(data)      
    
}

    
const values = {
    // register
    registerWebmaster,
    registerAdmin,

    // submit login
    login,
    // change password
    changePassword,      
}
   return(
    <AppContext.Provider value={values}>
   {children}
   </AppContext.Provider>
   )
   
}

export {AppProvider}