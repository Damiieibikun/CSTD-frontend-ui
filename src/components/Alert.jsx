const Alert = ({ message, type = 'success' }) => {
  const bgColor = type === 'success' ? 'bg-green-700' : 'bg-red-600';
  return (
    <div className={`${bgColor} text-white px-4 py-2 rounded mb-4 text-center font-bold`}>
      {message}
    </div>
  );
};

export default Alert;
