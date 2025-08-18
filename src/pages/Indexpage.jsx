import { useContext, useEffect } from 'react'
import logo from '../assets/images/cstd logoogo.png'
import Button from '../components/Button'
import Input from '../components/Input'
import { Link, useNavigate } from 'react-router-dom'
import {Loader} from '../components/Loader'
import { AppContext } from '../context/appContext'
import { ApiContext } from '../context/apiContext'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../validators/formValidation'
import Alert from '../components/Alert'
const Indexpage = () => {
    const {
      register,
      handleSubmit,    
      formState: { errors }
    } = useForm({ resolver: zodResolver(loginSchema),
      defaultValues: {  // Add this
      email: '',
      password: '',      
      } });
  
    const{ login } = useContext(AppContext)
 
     const { loading, loggedin, loginErr, currentAdmin, showSuccess, setShowSuccess} = useContext(ApiContext) 
     const navigate = useNavigate()
 
useEffect(() => {

  if (loggedin) {
    setShowSuccess(true);

    const timer = setTimeout(() => {
      if (currentAdmin?.role === 'webmaster') {
        navigate('/dashboardwebmaster');
      } else if (currentAdmin?.role === 'admin') {
        navigate('/dashboardadmin');
      } else if (currentAdmin?.role === 'media') {
        navigate('/dashboardmedia');
      }
    }, 1500);

    return () => clearTimeout(timer); // cleanup
  }
}, [setShowSuccess, navigate, loggedin, currentAdmin?.role]);



    if(loading) return (        
    <Loader
    text={'Logging in'}
    />
)
    
  return (
    <form onSubmit={handleSubmit(login)}>
      {showSuccess && <Alert message="Logged in successfully!" type="success" />}
        <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
  <div className="relative py-3 sm:max-w-xl sm:mx-auto">
    <div className='absolute z-50 flex items-center w-28 h-28 left-1/3 top-[-50px]'>
        <img src={logo} alt="cstdlogo" />
    </div>
    <div
      className="absolute inset-0 bg-gradient-to-r from-[#15447e] to-[#152E7E] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
    </div>
    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

      <div className="max-w-md mx-auto">
        <div>
           {loginErr  && <p className='text-sm text-red-600 font-bold text-center uppercase'>* {loginErr}</p>}
          <h1 className="text-2xl font-semibold py-2">Login</h1>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
           
            <Input
              name={'email'}
              type={'text'}
              placeholder={'Enter Email'}
              label={'Enter Email'}
              register={register}
              error={errors.email}
            />

            <Input
              name={'password'}
              type={'password'}
              placeholder={'Enter Password'}
              label={'Enter Password'}
              register={register}
              error={errors.password}
            />
            <div className="relative grid grid-cols-1">
                <Button
                caption={'Login'}
                styles={'bg-[#152E7E] text-white text-sm justify-self-center'}
                type={'submit'}
                />
              
            </div>           
          </div>          
        </div>
         <div className='text-right text-xs'>Not Registered? <Link to={'/register'} className='font-semibold text-[#152E7E] hover:underline'>Click here</Link></div>
      </div>    

    </div>
  </div>
</div>
    </form>
   
  )
}

export default Indexpage
