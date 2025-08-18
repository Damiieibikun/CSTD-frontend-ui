
const Select = ({name, arr, error, register}) => {

  return (
<div className="relative">
{error && <p className="absolute -top-1 text-red-600 text-xs"> {error}</p>}
        <div className="flex items-center justify-between">
        <select {...register(name)} name={name} className="text-sm p-1 mb-2 peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder='Select Role'>
        <option value="">Select One</option>
        {arr?.map(({id, name}, index)=>(<option key={index} value={id}>{name}</option>))}
       
        </select>
        
        </div>
                     
    <label htmlFor='role' className="absolute left-0 -top-5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Role</label>
</div>
  )
}

export default Select
