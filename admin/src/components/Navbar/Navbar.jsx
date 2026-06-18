import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
      <div className='logo-text'>Eat<span>Ec.</span></div>
      <img className='profile' src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar
