import InfoPage from "../components/InfoPage"

const NotFound = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
      <InfoPage
      message={'Page not Found!'}
    redirect={'/'}
    fontstyles = {'text-3xl py-3'}
    buttoncaption = {'Return to Login'}
      />
    </div>
  )
}

export default NotFound
