import Button from './Button'
import { CiLogout } from 'react-icons/ci';
import { LiaEdit } from "react-icons/lia";
import { SmallLoader } from './Loader';
import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';
import Forms from './Forms'
import { zodResolver } from '@hookform/resolvers/zod';
import { editAdminSchema } from '../validators/formValidation';
import { ApiContext } from '../context/apiContext';


const Nav = ({ loggedAdmin }) => {
  const{editAdmin, loading, formErr, setFormErr} = useContext(ApiContext)

  const [openEdit, setOpenEdit] = useState(false);
  const [loggingout, setloggingout] = useState(false);

  const {
    register,
    handleSubmit,
    reset, 
    formState: { errors }
  } = useForm({
    resolver: zodResolver(editAdminSchema),
    defaultValues: {
      id: loggedAdmin?.id || '',
      firstname: loggedAdmin?.firstname || '',
      lastname: loggedAdmin?.lastname || '',
      email: loggedAdmin?.email || '',
      phone: loggedAdmin?.phone || '',
    },
  });

 
  const handleEditOpen = () => {
    reset({
      id: loggedAdmin?.id || '',
      firstname: loggedAdmin?.firstname || '',
      lastname: loggedAdmin?.lastname || '',
      email: loggedAdmin?.email || '',
      phone: loggedAdmin?.phone || '',
    });
    setOpenEdit(true);
    setFormErr({})
  };

  const editAdminDetails = async (data) => {    
   const editedSuccessfully = await editAdmin(data)
    if(!editedSuccessfully) return
    setTimeout(() => {
      setOpenEdit(false);    
    }, 1500); 
  };

  const logOut = () => {
    setloggingout(true);
    localStorage.removeItem('loggedCSTDAdmin');
    setTimeout(() => {
      setloggingout(false);
      window.location.href = '/';
    }, 1500);
  };

  const userDetails = {
    inputsInfo: [
      {
        title: 'firstname',
        type: 'text',
        placeholder: 'Enter First Name',
        label: 'First Name',
        registerFunction: register,
        errorMessage: errors.firstname
      },
      {
        title: 'lastname',
        type: 'text',
        placeholder: 'Enter Last Name',
        label: 'Last Name',
        registerFunction: register,
        errorMessage: errors.lastname
      },
      {
        title: 'email',
        type: 'email',
        placeholder: 'Enter Email',
        label: 'Email',
        registerFunction: register,
        errorMessage: errors.email
      },
      {
        title: 'phone',
        type: 'text',
        placeholder: 'Enter Phone Number',
        label: 'Phone Number',
        registerFunction: register,
        errorMessage: errors.phone
      }
    ],
    buttonInformation: {
      buttonCaption: loading ? <SmallLoader size={'w-4 h-4'} /> : `Save Changes`,
      buttonStyles: `${loggedAdmin?.role === 'media'
            ? 'bg-[#307342]'
            : loggedAdmin?.role === 'webmaster'
              ? 'bg-[#6f6f6f]'
              : 'bg-[#152E7E]'
            } text-white text-sm justify-self-end`,
      buttonType: 'submit'
    }
  };


  return (
    <div className="flex items-center justify-between py-5 px-4 bg-gray-50">
      <div></div>

      <div className="flex items-center gap-4">     
       <div onClick={handleEditOpen} className="relative flex-shrink-0 cursor-pointer">
          <div className={`${loggedAdmin?.role === 'media'
            ? 'bg-green-100 text-green-800'
            : loggedAdmin?.role === 'webmaster'
              ? 'bg-gray-200 text-gray-800'
              : 'bg-indigo-100 text-indigo-800'
            } uppercase rounded-full w-12 h-12 flex items-center justify-center font-bold`}>
            {loggedAdmin?.firstname[0]}{loggedAdmin?.lastname[0]}
           
          </div>
          <div className='absolute -bottom-1 right-0'>
            <LiaEdit size={20}
            className={`${loggedAdmin?.role === 'media'
            ? 'text-green-800'
            : loggedAdmin?.role === 'webmaster'
              ? 'text-gray-800'
              : 'text-indigo-800'
            }`}
            />
          </div>
        </div>
        

        <Button
          caption={'Logout'}
          styles={`text-white flex items-center gap-2 ${loggedAdmin?.role === 'media'
            ? 'bg-[#307342]'
            : loggedAdmin?.role === 'webmaster'
              ? 'bg-[#6f6f6f]'
              : 'bg-[#152E7E]'
            }`}
          reactIcon={loggingout ? <SmallLoader size={'w-4 h-4'} /> : <CiLogout size={20} />}
          onclick={logOut}
        />
      </div>

      {/* Edit Admin Modal */}
      {openEdit && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Edit Admin Details</h3>
        <button onClick={() => setOpenEdit(false)} className="text-gray-400 hover:text-gray-600">
          <IoClose size={24} />
        </button>
      </div>

      {/* Body */}
      
        <Forms
          api={formErr}       
          submitForm={handleSubmit(editAdminDetails)}
          inputs={userDetails?.inputsInfo}
          buttonInfo={userDetails?.buttonInformation}
        />
    

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-4 border-t mt-4">
       
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Nav;
