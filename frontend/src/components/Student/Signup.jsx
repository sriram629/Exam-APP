import { useForm } from "react-hook-form"
import { Link, useHistory } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useEffect, useState } from "react"
import { checkToken } from "../../utils/checkToken"

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [loading, setloading] = useState(false)
  const [institutes, setInstitutes] = useState([])
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

  useEffect(() => {
    const getInstitutes = async () => {
      try {
        const response = await fetch(
          "http://localhost:9004/api/institutes/all",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (response.ok) {
          const result = await response.json()
          setInstitutes(result.institutes)
        } else {
          const result = await response.json()
          toast.error(result.msg)
        }
      } catch (error) {
        console.log(error)
        toast.error("Something went wrong")
      }
    }

    getInstitutes()
  }, [])

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setloading(true)

    const { confirmPassword, ...rest } = data

    console.log(confirmPassword, rest)

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rest),
        credentials: "include",
      }

      const response = await fetch(
        "http://localhost:9001/api/student/signup",
        options
      )

      if (response.ok) {
        setloading(false)
        return history.push({
          pathname: "/student/email-verification",
          state: { email: rest.email, from: "signup" },
        })
      } else {
        const result = await response.json()
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
    <section className=" bg-slate-100 dark:bg-gray-900 md:py-10 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full bg-white rounded-lg shadow-lg dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                  placeholder="name@gmail.com"
                  {...register("email", {
                    required: true,
                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  })}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    *Please enter a valid email address
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                  placeholder="JohnDoe123"
                  {...register("username", {
                    required: true,
                    minLength: 6,
                  })}
                />
                {errors.username && (
                  <span className="text-red-500  text-sm">
                    *Please enter a valid username
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="institute"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Institute
                </label>
                <select
                  id="institute"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                  {...register("institute", {
                    required: true,
                  })}
                >
                  <option value="0">Select Institute</option>
                  {institutes ? (
                    institutes.map((institute, i) => (
                      <option key={i} value={institute}>
                        {institute}
                      </option>
                    ))
                  ) : (
                    <option value="0">No Institutes</option>
                  )}
                </select>
                {errors.institute && (
                  <span className="text-red-500  text-sm">
                    *Please select an institute
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
                    minLength: 6,
                  })}
                />
                {errors.password && (
                  <span className="text-red-500  text-sm">
                    {"*Please enter a valid password with minimum 6 characters"}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                  {...register("confirmPassword", {
                    required: true,
                    minLength: 6,
                  })}
                />
                {errors.confirmPassword && (
                  <span className="text-red-500  text-sm">
                    *Please enter a valid password
                  </span>
                )}
              </div>
              {/* <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                    required=""
                  />
                </div>
                 <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div> */}
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
                  "Create an account"
                )}
              </button>
              <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/student/login"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup
