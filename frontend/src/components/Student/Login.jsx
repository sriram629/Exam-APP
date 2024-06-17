import { useForm } from "react-hook-form"
import { Link, useHistory } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useEffect, useState } from "react"
import { checkToken } from "../../utils/checkToken"

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [loading, setloading] = useState(false)
  const history = useHistory()

  useEffect(() => {
    const checkUserLogin = async () => {
      const isAuthenticated = await checkToken()
      if (isAuthenticated) {
        history.replace("/dashboard")
      }
    }

    checkUserLogin()
  }, [history])

  const onSubmit = async (data) => {
    setloading(true)

    try {
      const identifierKey = data.email ? "email" : "username"

      const payload = {
        identifier: data[identifierKey],
        password: data.password,
      }

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      }

      const response = await fetch(
        "http://localhost:9001/api/student/login",
        options
      )

      const result = await response.json()

      if (response.ok) {
        setloading(false)
        toast.success("Login successful")
        localStorage.setItem("user", JSON.stringify(result.user))
        history.replace("/dashboard")
      } else {
        console.log(result)
        toast.error(result.msg)
        setloading(false)
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong")
      setloading(false)
    }
  }

  return (
    <section className="bg-slate-100 dark:bg-gray-900 md:py-10 min-h-screen">
      <div className="h-screen flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full bg-white rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="identifier"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email / Username
                </label>
                <input
                  type="text"
                  id="identifier"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                  placeholder="Enter your email or username"
                  {...register("email", { required: true })}
                  defaultValue={""}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    *Please enter a valid email or username
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                  {...register("password", {
                    required: true,
                  })}
                  defaultValue={""}
                />
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">
                  *Please enter a valid password
                </span>
              )}
              <div className="flex justify-end">
                <Link
                  to="/student/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full mt-3 px-4 py-2.5 tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-400 dark:focus:bg-blue-400"
              >
                {loading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
              <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                {"Don't have an account? "}
                <Link
                  to="/student/signup"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Sign up here
                </Link>
              </p>
              <p
                className="text-sm text-center font-light text-gray-500 dark:text-gray-400"
                style={{ marginTop: "5px" }}
              >
                {"Account not activated? "}
                <Link
                  to={{
                    pathname: "/student/email-verification",
                    state: {
                      from: "signup",
                    },
                  }}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Activate Here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
