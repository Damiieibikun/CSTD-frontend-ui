import { useContext } from 'react'
import logo from '../assets/images/cstd logoogo.png'
import Button from '../components/Button'
import Input from '../components/Input'
import {Loader} from '../components/Loader'
import { AppContext } from '../context/appContext'
import { ApiContext } from '../context/apiContext'
import Select from '../components/Select'
import InfoPage from '../components/InfoPage'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerAdminSchema } from '../validators/formValidation'
import { Link } from 'react-router-dom'

const Register = () => {
  const {
    register,
    handleSubmit,    
    formState: { errors }
  } = useForm({ resolver: zodResolver(registerAdminSchema),
    defaultValues: {  // Add this
    firstname: "",
    lastname: "",
    role: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: ''
    } });


    const{ 
        registerAdmin
    } = useContext(AppContext)

    const { loading, registered, setRegistered, registerErr} = useContext(ApiContext)


if(loading) return (
    <Loader
    text={'Please wait'}
    />
)


if (registered) return( 
    <div className='h-screen flex justify-center items-center'>
   <InfoPage
    message={'Registered Successfully!'}
    redirect={'/'}
    redirectAction={()=> setRegistered(false)}
    fontstyles = {'text-3xl py-3'}
    buttoncaption = {'Proceed to Login'}
    />
    </div>
 
)


  return (
    <form onSubmit={handleSubmit(registerAdmin)}>
      <div className="min-h-screen py-6 flex flex-col items-center justify-center sm:py-12">
      
        <div className="relative py-3 flex justify-center items-center w-[600px]">         
          <div className="absolute z-50 flex items-center w-28 h-28 left-1/2 transform -translate-x-1/2 top-[-50px]">
            <img src={logo} alt="cstdlogo" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#15447e] to-[#152E7E] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-full">
            <div className="max-w-md mx-auto">
              <div>
                {registerErr  && <p className='text-sm text-red-600 font-bold uppercase text-center'>* {registerErr}</p>}
                <h1 className="text-3xl font-semibold text-center py-2">Register Admin</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                   <Input
                    name={'firstname'}
                    type={'text'}
                    placeholder={'Enter Firstname'}
                    label={'Enter Firstname'}
                    register={register}
                    id={'firstname'}
                    error={errors.firstname}
                    
                  />
                  <Input                  
                    name={'lastname'}
                    type={'text'}
                    placeholder={'Enter Lastname'}
                    label={'Enter Lastname'}
                    register={register}
                    error={errors.lastname}
                  />
                  <Input
                    name={'phone'}
                    type={'text'}
                    placeholder={'Enter valid Phone Number'}
                    label={'Enter valid Phone Number'}
                    register={register}
                    error={errors.phone}
                  />
                  <Input
                    name={'email'}
                    type={'email'}
                    placeholder={'Enter valid Email Address'}
                    label={'Enter valid Email Address'}
                   register={register}
                    error={errors.email}
                  />                 

                <Select
                arr = {[
                      {
                          id: 'media',
                          name: 'Media'
                      },
                      {
                          id: 'admin',
                          name: 'Admin'
                      },
                  ]}

                  register={register}
                  name={'role'}
                  />

                  <Input
                    name={'password'}
                    type={'password'}
                    placeholder={'Create Password'}
                    label={'Create Password'}
                    register={register}
                    error={errors.password}
                  />
                  <Input
                    name={'passwordConfirm'}
                    type={'password'}
                    placeholder={'Confirm Password'}
                    label={'Confirm Password'}
                    register={register}
                    error={errors.passwordConfirm}
                  />
                  <div className="relative grid grid-cols-1">
                    <Button
                      caption={'Register'}
                      styles={'bg-[#152E7E] text-white justify-self-center'}
                      type={'submit'}
                    />
                  </div>
                </div>
                <div className='text-right text-xs'>Already Registered? <Link to={'/'} className='font-semibold text-[#152E7E] hover:underline'>Click here </Link></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default Register

