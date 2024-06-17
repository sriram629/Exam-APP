import { useEffect, useState } from "react"
import { Route, useLocation, Redirect } from "react-router-dom"
import Loading from "./Loading"
import { checkToken } from "../../utils/checkToken"

const ProtectedRoute = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const fetchToken = async () => {
      const isAuthenticated = await checkToken()
      setIsAuthenticated(isAuthenticated)
      setLoading(false)
    }

    fetchToken()
  }, [])

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      window.location.href = `/student/login`
    }
  }, [isAuthenticated, loading, location.pathname])

  if (loading) {
    return <Loading />
  }

  if (isAuthenticated && location.pathname === "/") {
    return <Redirect to="/dashboard" />
  } else if (!isAuthenticated && location.pathname !== "/") {
    return <Redirect to="/student/login" />
  } else {
    return <Route {...props} />
  }
}

export default ProtectedRoute
