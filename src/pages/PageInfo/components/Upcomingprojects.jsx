import { useContext, useEffect, useState } from 'react'
import Forms from '../../../components/Forms'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectsSchema } from '../../../validators/formValidation';
import { IoIosAddCircleOutline } from "react-icons/io";
import { ApiContext } from '../../../context/apiContext';
import { FaExclamationTriangle, FaPencilRuler } from 'react-icons/fa';
import Button from '../../../components/Button';
import Modals from '../../../components/Modals';
import ProjectList from './ProjectList';
import { MdCheckCircle, MdModeEditOutline, MdOutlineWarningAmber } from 'react-icons/md';
import { Loader } from '../../../components/Loader';

const Upcomingprojects = () => {
  const [showProject, setShowProject] = useState(false)
    const[deleteModal, setDeleteModal] = useState({open:false, cat: '', id: ''})
    const [editing, setEditing] = useState(false);
  const { loading, submitUpcomingProjects,  projects,
        getProjects, deleteProject, pageResponse,
        setPageResponse } = useContext(ApiContext)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({ 
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      title: "",
      objective: "",
      importance: '',
      technology: '',
      partners: '',
      output: ''
    } 
  });

  const handleEditorChange = (field, value) => {
    setValue(field, value, { shouldValidate: true });
  };

  const upcomingProjectsDetails = { 
    formWidth: 'md:w-[80%]',
    title: 'Upcoming Project',
    inputsInfo: [
      {
        title: 'title',
        type: 'text',
        placeholder: 'Project Title',
        label: 'Project Title:',
        registerFunction: register,         
        errorMessage: errors.title
      }
    ],
    handleEditorFunction: handleEditorChange,
    editorInfo: [
      {
        heading: 'Project Objectives',
        errorMessage: errors.objective?.message,
        field: 'objective',
      },
      {
        heading: 'Why It Matters',          
        field: 'importance',
      },
      {
        heading: 'Technologies',          
        field: 'technology',
      },
      {
        heading: 'Project Partners',          
        field: 'partners',
      },
      {
        heading: 'Project Output',          
        field: 'output',
      },
    ],
    buttonInformation: {
       buttonCaption: `${editing ? 'Edit Project': 'Add Project'}`,
      buttonStyles: 'bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white px-3 py-2 rounded-lg font-medium shadow-md transition-all duration-300 justify-self-center text-sm',
      buttonType: 'submit',
      icon: editing ? <MdModeEditOutline size={25}/> : <IoIosAddCircleOutline size={25}/>
    }
  }

  
  const handleEdit = (project) => {
    console.log("Edit project:", project);
    // Implement your edit logic here
     setShowProject(true)    
    setEditing(true)
    setValue('id', project._id);
    setValue('title', project.title);
    setValue('objective', project.objective);
    setValue('importance', project.importance); 
    setValue('technology', project.technology);
    setValue('partners', project.partners);
    setValue('output', project.output);
  };

   const submit = (data)=>{   
    submitUpcomingProjects(data)
    setShowProject(false)
  }


  useEffect(() => { 
    register('objective');
    getProjects('upcoming')
  }, [register, getProjects]);

   if(loading) return <Loader text={'...Loading'}/>
 
  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl capitalize">Upcoming projects</h1>
        <p className="mt-3 text-lg text-gray-600">
          Manage your Upcoming project content here
        </p>
      </div>

      <div className='flex gap-3 justify-self-end mb-4'>
        <Button
          onclick={() => setShowProject(!showProject)}
          reactIcon={<FaPencilRuler />}
          caption={'Add Project'}
          type={'button'}
          styles={`px-4 py-2 rounded-lg font-medium transition-all duration-300 bg-blue-700 hover:bg-blue-800 text-white`}
        />            
      </div>

      {/* Existing projects placeholder */}
      <div className="mb-8 w-[85%] mx-auto">
        
      {projects.map((project, index) => (
        <ProjectList 
          key={index}
          project={project}
          onEdit={handleEdit}
          onDelete={()=>setDeleteModal({open: true, cat:'past', id:project._id})}
          cat={'upcoming'}
        />
      ))}
      </div>

       {showProject &&  <Modals
        closeModal={()=>{setShowProject(false); reset()}}    
          modalStyles='w-[90%] mx-auto h-[500px] overflow-y-scroll'
          cancel='Close'
          form={<div>        
          <Forms      
            submitForm={handleSubmit(submit)}            
            formTitle={upcomingProjectsDetails.title}
            formWidth={upcomingProjectsDetails.formWidth}
            inputs={upcomingProjectsDetails.inputsInfo}
            editors={upcomingProjectsDetails.editorInfo}
            buttonInfo={upcomingProjectsDetails.buttonInformation}
            handleEditorFunction={upcomingProjectsDetails.handleEditorFunction}
            watch={watch}
          />
       
      </div>}
      />}
       {/* Delete Modal */}
        {deleteModal.open &&
        <Modals
          title={'Delete Project'}
          caption={'Are you sure you want to delete this Project?'}
          icon={<FaExclamationTriangle size={24} className="text-red-600" />}
          iconStyle={'bg-red-100'}
          calltoactionCaption={'Delete'}
          btnstyles={'bg-red-600 hover:bg-red-500'}
          closeModal={()=> setDeleteModal({open:false, cat:'', id: ''})}
          calltoaction={()=> {
            setDeleteModal({open:false, cat:'', id: ''})
            deleteProject(deleteModal?.cat, deleteModal?.id)}}    
        />}

       {pageResponse?.message && <Modals
        title={'Message'} 
        closeModal={()=> {
          reset() 
          setShowProject(false)
          setPageResponse({})}}
        caption={pageResponse?.message}
        cancel={'Close'}
        iconStyle={pageResponse?.success ?  'bg-green-100'
                : 'bg-red-100'}
        icon={pageResponse?.success ? <MdCheckCircle  size={24} className='text-green-600'/> : <MdOutlineWarningAmber size={24} className='text-red-600'/>}
        />}
    </>
  )
}

export default Upcomingprojects