import Navbar from '../component/navbar'
import Footer from '../component/Footer'
import {Outlet} from 'react-router-dom'



const Wrapper = () => {

  return (
    <>
    <Navbar />
    <Outlet />
    <Footer />
    </>
  )
}

export default Wrapper