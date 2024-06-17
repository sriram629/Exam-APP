import { Link } from "react-router-dom"
import Navbar from "./Navbar"
import { useEffect, useState } from "react"
import Exams from "./Exams"

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const [latestExams, setLatestExams] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:9002/api/exams/latest", {
          method: "GET",
          credentials: "include",
        })
        if (response.ok) {
          const data = await response.json()
          setLatestExams(data)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <section className="bg-slate-100 dark:bg-gray-900 py-4 md:py-10 min-h-screen">
      <div className="container mx-auto px-4">
        <Navbar />
        <h1 className="text-2xl font-medium text-gray-800 dark:text-white md:text-3xl mt-10">
          Welcome back, {user?.username ?? "User"} 👋
        </h1>
        <div className="text-gray-800 dark:text-white">
          <h2 className="text-5xl text-center font-medium mt-5 ">{`Latest Exams`}</h2>
          {latestExams && latestExams.length ? (
            <Exams latestExams={latestExams} />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-96">
              <p className="text-lg font-medium mb-4">No exams today ☹️</p>
              <Link to="/exams">
                <button className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 mt-4">
                  View all exams
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Dashboard
