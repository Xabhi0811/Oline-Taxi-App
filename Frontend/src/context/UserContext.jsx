import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
export const userDataContext = createContext()

const UserContext = ({children}) => {
    const [user, setUser] =useState({
        fullName: {
            firstName: '',
            lastName: ''
        },
        email: ''
      
    })
  return (
    <div>
     <userDataContext.Provider>
        {children}
     </userDataContext.Provider>
    </div>
  )
}

export default UserContext
