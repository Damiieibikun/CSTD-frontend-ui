import logo from '../assets/images/cstd logoogo.png'
import { useNavigate } from "react-router-dom";
import { changePasswordSchema } from "../validators/formValidation";
import { AppContext } from "../context/appContext";
import { useContext, useEffect } from "react";
import { ApiContext } from "../context/apiContext";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {Loader} from '../components/Loader';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';

const ChangePassword = () => {
const navigate = useNavigate()

const{ changePassword } = useContext(AppContext)  
const { loading, passwordChanged, passwordErr, storedAdmin, showSuccess, setShowSuccess} = useContext(ApiContext) 
         

const {
  register,
  handleSubmit,    
  formState: { errors }
} = useForm({ resolver: zodResolver(changePasswordSchema),
  defaultValues: {  // Add this
  id: storedAdmin?.id || '',
  currentPassword: '',
  newPassword: '',
  passwordConfirm: ''
  } });  
    
useEffect(() => {
  if (!storedAdmin || !storedAdmin?.role) {
    navigate('/');
    return;
  }

  if (passwordChanged) {
    setShowSuccess(true);

    const timer = setTimeout(() => {
      if (storedAdmin?.role === 'webmaster') {
        navigate('/dashboardwebmaster');
      } else if (storedAdmin?.role === 'admin') {
        navigate('/dashboardadmin');
      } else if (storedAdmin?.role === 'media') {
        navigate('/dashboardmedia');
      }
    }, 1500);

    return () => clearTimeout(timer); // cleanup
  }
}, [setShowSuccess, navigate, passwordChanged, storedAdmin]);



    if(loading) return (               
    <Loader
    text={'Please Wait...'}
    />
)
    
  return (
    <form onSubmit={handleSubmit(changePassword)}>
      {showSuccess && <Alert message="Password changed successfully!" type="success" />}
        <div className="min-h-screen py-6 flex flex-col justify-center items-center sm:py-12">
  <div className="relative py-3 flex justify-center items-center w-[600px]">
    <div className="absolute z-50 flex items-center w-28 h-28 left-1/2 transform -translate-x-1/2 top-[-50px]">
        <img src={logo} alt="cstdlogo" />
    </div>
    <div
      className="absolute inset-0 bg-gradient-to-r from-[#15447e] to-[#152E7E] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
    </div>
    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-full">

      <div className="max-w-md mx-auto">
        <div>
           {passwordErr  && <p className='text-sm text-red-600 font-bold text-center uppercase'>* {passwordErr}</p>}
          <h1 className="text-2xl font-semibold py-2">Change Password</h1>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
           
            <Input
              name={'currentPassword'}
              type={'password'}
              placeholder={'Enter Current Password'}
              label={'Enter Current Password'}
              register={register}
              error={errors.currentPassword}
            />

            <Input
              name={'newPassword'}
              type={'password'}
              placeholder={'Enter New Password'}
              label={'Enter New Password'}
              register={register}
              error={errors.newPassword}
            />
            <Input
              name={'passwordConfirm'}
              type={'password'}
              placeholder={'Confirm New Password'}
              label={'Confirm New Password'}
              register={register}
              error={errors.passwordConfirm}
            />
            <div className="relative">
                <Button
                caption={'Change Password'}
                styles={'bg-[#152E7E] text-white text-sm'}
                type={'submit'}
                />
              
            </div>
          </div>
        </div>
      </div>    

    </div>
  </div>
</div>
    </form>
   
  )
}

export default ChangePassword
