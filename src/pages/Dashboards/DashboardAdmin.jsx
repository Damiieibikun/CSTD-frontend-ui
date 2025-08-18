import { useContext, useEffect } from "react"
import { ApiContext } from "../../context/apiContext"
import { useNavigate } from "react-router-dom"

const DashboardAdmin = () => {
  const navigate = useNavigate()
  const{storedAdmin} = useContext(ApiContext)

  useEffect(()=>{
    if (storedAdmin?.role !== 'admin') {
        navigate('/');
      }
  }, [navigate, storedAdmin?.role ])


  return (
     <div className="w-[95%] mx-auto">
      
     Welcome to dashboard admin

    </div>
  )
}

export default DashboardAdmin
