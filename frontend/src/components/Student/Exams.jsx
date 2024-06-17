import { useEffect, useState } from "react"
import Navbar from "./Navbar"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import Loading from "./Loading"

const Exams = ({ latestExams }) => {
  console.log(latestExams)
  const [exams, setexams] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true)
      const response = await fetch("http://localhost:9002/api/exams/all")
      const result = await response.json()
      setLoading(false)
      console.log(result)
      setexams(result.exams)
    }
    latestExams.length ? setexams(latestExams) : fetchExams()
  }, [])

  const handleStart = (id) => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-[350px] w-full bg-white  shadow-lg rounded-lg pointer-events-auto flex ring-1 p-2 ring-black ring-opacity-5`}
        >
          <div className="w-full flex flex-col items-center p-4">
            <h1 className="text-xl mb-2">Are you sure to start the exam?</h1>

            <div className="flex gap-4 mt-4">
              <Link
                to={`/exam/${id}`}
                onClick={() => {
                  localStorage.setItem(
                    "examStatus",
                    JSON.stringify({
                      examId: id,
                      access: "granted",
                    })
                  )
                  toast.remove(t.id)
                }}
                className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Yes
              </Link>
              <button
                onClick={() => toast.remove(t.id)}
                className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
              >
                No
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: 50000,
      }
    )
  }

  console.log(exams)

  return (
    <section className="bg-slate-100 dark:bg-gray-900 py-4 md:py-10 min-h-screen">
      <div className="container mx-auto px-4">
        {!latestExams.length && <Navbar />}

        {loading ? (
          <Loading />
        ) : exams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 md:mt-10">
            {exams?.map((exam, index) => (
              <div
                className="max-w-sm min-h-56 p-6 flex flex-col  items-start  gap-2 border dark:border-gray-600 bg-white  rounded-lg shadow dark:bg-gray-800 my-3"
                key={index}
              >
                <span className=" px-2.5 py-0.5 mb-2 rounded-full text-xs font-medium bg-blue-100 border-2 border-blue-300 text-blue-800">
                  {exam.topic}
                </span>
                <div>
                  <h5 className="mb-2 text-2xl font-medium tracking-tight text-gray-900 dark:text-white">
                    {exam.title}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {exam.description}
                  </p>
                  <p className="mb-3 font-normal text-gray-900 dark:text-white">
                    Duration:{" "}
                    <span className="font-bold">{exam.duration} min</span>
                  </p>
                </div>
                <button
                  onClick={() => handleStart(exam._id)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-auto"
                >
                  Start
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          "No exams found"
        )}
      </div>
    </section>
  )
}

Exams.propTypes = {
  latestExams: PropTypes.array.isRequired,
}

export default Exams
