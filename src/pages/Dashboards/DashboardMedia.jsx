import { useContext, useEffect } from "react"
import { ApiContext } from "../../context/apiContext"
import { useNavigate } from "react-router-dom"
const DashboardMedia = () => {
  const navigate = useNavigate()
    const{storedAdmin} = useContext(ApiContext)
  
    useEffect(()=>{
      if (storedAdmin?.role !== 'media') {
          navigate('/');
        }
    }, [navigate, storedAdmin?.role ])
  
  
    return (
       <div className="w-[95%] mx-auto">
        
       Welcome to dashboard media
  
      </div>
    )
}

export default DashboardMedia
