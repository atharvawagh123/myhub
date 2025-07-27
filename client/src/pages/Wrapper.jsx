import Navbar from '../component/navbar'
import {Outlet} from 'react-router-dom'



const Wrapper = () => {

  return (
    <>
    <Navbar />
    <Outlet />
    </>
  )
}

export default Wrapper