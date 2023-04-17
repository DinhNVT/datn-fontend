import React, { useEffect } from "react"
import { Route } from "react-router-dom"
// import ROUTES from "../constants/routes"
// import AuthenticationService from "../config/service/AuthenticationService"
// import { useNavigate  } from "react-router-dom"

const PrivateRoute = ({ ...rest }) => {
  // const navigate  = useNavigate ()

  useEffect(() => {

  }, [])

  return <Route {...rest} />
}

export default PrivateRoute