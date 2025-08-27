import { useContext, useEffect, useState } from 'react'
import Forms from '../../../components/Forms'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectsSchema } from '../../../validators/formValidation';
import { IoIosAddCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { ApiContext } from '../../../context/apiContext';
import { FaExclamationTriangle, FaPencilRuler } from 'react-icons/fa';
import Button from '../../../components/Button';
import Modals from '../../../components/Modals';
import ProjectList from './ProjectList';
import { MdCheckCircle, MdModeEditOutline, MdOutlineWarningAmber } from 'react-icons/md';
import { Loader } from '../../../components/Loader';

const Upcomingprojects = () => {
  const [showProject, setShowProject] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [deleteModal, setDeleteModal] = useState({open:false, cat: '', id: ''})
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeImage, setRemoveImage] = useState('');
  
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
      output: '',
      image: ''
    } 
  });

  // Watch for image file changes
  const watchedImage = watch('image');

  // Handle image preview
  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (typeof watchedImage === 'string' && watchedImage) {
      // For editing existing projects with Cloudinary URLs
      setImagePreview(watchedImage);
    } else {
      setImagePreview(null);
    }
  }, [watchedImage]);

  const handleEditorChange = (field, value) => {
    setValue(field, value, { shouldValidate: true });
  };

  const toggleProjectForm = () => {
    if (showProject) {
      // If form is showing, slide up and then hide
      setIsAnimating(true);
      setTimeout(() => {
        setShowProject(false);
        setIsAnimating(false);
        reset();
        setEditing(false);
        setImagePreview(null);
      }, 300);
    } else {
      // If form is hidden, show and then slide down
      setShowProject(true);
      setTimeout(() => setIsAnimating(true), 10);
    }
  };

  const handleEdit = (project) => {
    setRemoveImage('')
    setImagePreview(project?.image?.url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
     
    // If form is hidden, show it first
    if (!showProject) {
      setShowProject(true);
      setTimeout(() => {
        setIsAnimating(true);
        setEditing(true);
        setValue('id', project._id);
        setValue('title', project.title);
        setValue('objective', project.objective);
        setValue('importance', project.importance); 
        setValue('technology', project.technology);
        setValue('partners', project.partners);
        setValue('output', project.output);
        
        setImagePreview(project.image?.url); // Set preview for existing image
      }, 10);
    } else {
      
      // If form is already showing, just set edit values
      setEditing(true);
      setValue('id', project._id);
      setValue('title', project.title);
      setValue('objective', project.objective);
      setValue('importance', project.importance); 
      setValue('technology', project.technology);
      setValue('partners', project.partners);
      setValue('output', project.output);
     
      setImagePreview(project.image?.url); // Set preview for existing image
    }
  };

  const submit = (data) => {   

    const formData = new FormData();    
    // Append all text fields
    formData.append('title', data.title);
    formData.append('objective', data.objective);
    formData.append('importance', data.importance);
    formData.append('technology', data.technology);
    formData.append('partners', data.partners);
    formData.append('output', data.output);
    
    // Handle image upload
    if (data.image && data.image[0]) {
      
        formData.append('image', data.image[0]);
    }
       
    // Add ID for editing
    if (editing && data.id) {
      formData.append('id', data.id);
      formData.append('removeImage', removeImage);
    }
    
    submitUpcomingProjects(formData);
    
    // Slide up the form after submission
    setIsAnimating(false);
    setTimeout(() => {
      setShowProject(false);
      setEditing(false);
      setImagePreview(null);
    }, 300);
  };

  const upcomingProjectsDetails = { 
    formWidth: 'md:w-[80%]',
    title: `${editing ? 'Edit Project': 'Add Project'}`,
    inputsInfo: [
      {
        title: 'title',
        type: 'text',
        placeholder: 'Project Title',
        label: 'Project Title:',
        registerFunction: register,         
        errorMessage: errors.title
      },
      {
        title: 'image',
        type: 'file',
        accept: 'image/*',
        placeholder: 'Project Image',
        label: 'Project Image:',
        registerFunction: register,         
        errorMessage: errors.image
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
       buttonCaption: `${editing ? 'Update Project': 'Add Project'}`,
      buttonStyles: 'bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white px-3 py-2 rounded-lg font-medium shadow-md transition-all duration-300 justify-self-center text-sm',
      buttonType: 'submit',
      icon: editing ? <MdModeEditOutline size={25}/> : <IoIosAddCircleOutline size={25}/>
    },
    imagePreview: imagePreview
  }

  useEffect(() => { 
    register('objective');
    getProjects('upcoming')
  }, [register, getProjects]);

  // Close form when modal appears
  useEffect(() => {
    if (pageResponse?.message) {
      setIsAnimating(false);
      setTimeout(() => {
        setShowProject(false);
        setImagePreview(null);
      }, 300);
    }
  }, [pageResponse]);

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
          onclick={toggleProjectForm}
          reactIcon={showProject ? <IoIosCloseCircleOutline /> : <FaPencilRuler />}
          caption={showProject ? 'Close Form' : 'Add Project'}
          type={'button'}
          styles={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            showProject 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-700 hover:bg-blue-800 text-white'
          }`}
        />            
      </div>
      
      {/* Animated Form Container */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        showProject 
          ? (isAnimating ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0') 
          : 'max-h-0 opacity-0'
      }`}>
        {showProject && (
          <Forms      
            submitForm={handleSubmit(submit)}            
            formTitle={upcomingProjectsDetails.title}
            formWidth={upcomingProjectsDetails.formWidth}
            inputs={upcomingProjectsDetails.inputsInfo}
            editors={upcomingProjectsDetails.editorInfo}
            buttonInfo={upcomingProjectsDetails.buttonInformation}
            handleEditorFunction={upcomingProjectsDetails.handleEditorFunction}
            imagePreview={upcomingProjectsDetails.imagePreview}
            removeImage={()=>{setImagePreview(null); setRemoveImage("true")}}
            watch={watch}
          />
        )}
      </div>

      {/* Existing projects placeholder */}
      <div className="mb-8 w-[85%] mx-auto">
        {projects.length > 0 ? projects.map((project, index) => (
          <ProjectList 
            key={index}
            project={project}
            onEdit={handleEdit}
            onDelete={()=>setDeleteModal({open: true, cat:'upcoming', id:project._id})}
            cat={'upcoming'}
          />
        )):
        <div className="mt-4 bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No Projects</p>
        </div>
        }
      </div>
      
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
            deleteProject(deleteModal?.cat, deleteModal?.id)}
          }    
        />
      }

      {pageResponse?.message && 
        <Modals
          title={'Message'} 
          closeModal={()=> {
            reset() 
            setShowProject(false)
            setPageResponse({})
            setImagePreview(null)
          }}
          caption={pageResponse?.message}
          cancel={'Close'}
          iconStyle={pageResponse?.success ?  'bg-green-100' : 'bg-red-100'}
          icon={pageResponse?.success ? 
            <MdCheckCircle  size={24} className='text-green-600'/> : 
            <MdOutlineWarningAmber size={24} className='text-red-600'/>
          }
        />
      }
    </>
  )
}

export default Upcomingprojects