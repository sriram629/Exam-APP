import { Route, Switch } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Dashboard from "./components/Student/Dashboard"
import Login from "./components/Student/Login"
import Signup from "./components/Student/Signup"
import AuthRedirect from "./components/Student/AuthRedirect"
import Exams from "./components/Student/Exams"
import OtpVerification from "./components/Student/OtpVerification"
import ResetPassword from "./components/Student/ResetPassword"
import ProtectedRoute from "./components/Student/protectedroute"
import EmailVerification from "./components/Student/EmailVerification"
import Results from "./components/Student/Results"
import Profile from "./components/Student/Profile"
import ExamPage from "./components/Student/ExamPage"
import ExamResult from "./components/Student/ExamResult"

function App() {
  return (
    <>
      <Toaster />
      <Switch>
        <Switch>
          <ProtectedRoute exact path="/" component={AuthRedirect} />
          <Route path="/student/login" component={Login} />
          <Route path="/student/signup" component={Signup} />
          <Route
            path="/student/forgot-password"
            render={(props) => (
              <EmailVerification
                {...props}
                title="Forgot-password"
                footer="Remember your password? "
                link="/student/login"
              />
            )}
          />
          <Route path="/student/otp-verification" component={OtpVerification} />
          <Route
            path="/student/email-verification"
            render={(props) => (
              <EmailVerification
                {...props}
                title="Email Verification"
                footer=""
                link=""
              />
            )}
          />
          <Route path="/student/reset-password" component={ResetPassword} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/exams" component={Exams} />
          <ProtectedRoute path="/exam/:id" component={ExamPage} />
          <ProtectedRoute path="/results" component={Results} />
          <ProtectedRoute path="/result/:studentId/:examId" component={ExamResult} />
          <Route path="*" component={() => <h1>404 Not Found</h1>} />
        </Switch>
      </Switch>
    </>
  )
}

export default App
