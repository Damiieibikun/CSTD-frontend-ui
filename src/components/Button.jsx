const Button = ({disabled_button, caption, captionStyles, styles, type, onclick, reactIcon}) => {
  return (
     <button 
     disabled ={disabled_button}
     onClick={onclick} 
     type={type} 
     className={`${styles} rounded-md px-2 py-1 flex items-center gap-3`}>
     <p className={`${captionStyles}`}>{caption}</p>
      
       {reactIcon}
      </button>
  )
}

export default Button
