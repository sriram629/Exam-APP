import { useEffect, useState } from "react"
import Navbar from "./Navbar"

const Results = () => {
  const [results, setResults] = useState([])
  const studentId = JSON.parse(localStorage.getItem("user")).id

  useEffect(() => {
    const getResult = async () => {
      const res = await fetch(
        `http://localhost:9003/api/results/${studentId}/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )
      const data = await res.json()
      setResults(data.results)
    }
    getResult()
  }, [studentId])

  const groupedResults = results
    .slice()
    .reverse()
    .reduce((acc, result) => {
      const submissionDate = new Date(
        result.submissionTime
      ).toLocaleDateString()
      if (!acc[submissionDate]) {
        acc[submissionDate] = []
      }
      acc[submissionDate].push(result)
      return acc
    }, {})

  const today = new Date().toLocaleDateString()

  return (
    <section className="bg-slate-100 dark:bg-gray-900 py-4 md:py-10 min-h-screen">
      <div className="container mx-auto px-4">
        <Navbar />
        {!results ? (
          <div className="bg-gray-100 dark:bg-slate-900 min-h-screen container flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              No Results
            </h1>
          </div>
        ) : (
          results && (
            <div className="">
              <h1 className="text-4xl font-medium text-center text-gray-800 dark:text-gray-100 mb-10">
                Results
              </h1>

              {Object.entries(groupedResults).map(([date, resultsArray]) => (
                <div key={date}>
                  {date === today && (
                    <h2 className="text-2xl dark:text-white mb-4">Today</h2>
                  )}
                  {date !== today &&
                    date ===
                      new Date(
                        new Date().setDate(new Date().getDate() - 1)
                      ).toLocaleDateString() && (
                      <h2 className="text-2xl dark:text-white mb-4">
                        Yesterday
                      </h2>
                    )}
                  {date !== today &&
                    date !==
                      new Date(
                        new Date().setDate(new Date().getDate() - 1)
                      ).toLocaleDateString() && (
                      <h2 className="text-2xl dark:text-white mb-4">
                        Previous
                      </h2>
                    )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resultsArray.map((result, index) => (
                      <div
                        className="bg-white text-dark dark:text-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-4 max-w-lg w-full flex flex-col items-center"
                        key={index}
                      >
                        <h1 className="text-xl font-medium mb-4  text-blue-500 dark:text-blue-300">
                          {result.title}
                        </h1>
                        <span className=" px-2.5 py-0.5 mb-2 rounded-full text-xs font-medium bg-blue-100 border-2 border-blue-300 text-blue-800">
                          {result.topic}
                        </span>
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex flex-col">
                            <h2 className="text-4xl font-medium self-center mb-6 mt-4 h-12 text-center  rounded-full">
                              {result.noOfCorrectAnswers} / {result.totalMarks}
                            </h2>
                            <div className="flex flex-col md:flex-row justify-between gap-6 mb-4">
                              <div className="flex flex-col gap-3 items-center">
                                <p className=" text-lg">Correct answers</p>
                                <p className="font-medium text-lg md:text-xl text-green-500">
                                  {result.noOfCorrectAnswers}
                                </p>
                              </div>
                              <div className="flex flex-col gap-3 items-center">
                                <p className="text-lg">Wrong answers</p>
                                <p className=" font-medium text-lg md:text-xl text-red-500">
                                  {result.noOfWrongAnswers}
                                </p>
                              </div>
                            </div>
                            <p className="text-center text-sm mt-4">
                              Submitted at:{" "}
                              {new Date(result.submissionTime).toLocaleString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "numeric",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default Results
