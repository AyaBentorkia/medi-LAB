import React from 'react'
import StaffProfile from './StaffProfile';

const Profile = () => {
    const role = localStorage.getItem("role");
  return (
    <div>
      <StaffProfile />
    </div>
  )
}

export default Profile
