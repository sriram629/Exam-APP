import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Confetti from "react-confetti"
import Loading from "./Loading"
import Navbar from "./Navbar"

const ExamResult = () => {
  const { studentId, examId } = useParams()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  useEffect(() => {
    const getResult = async () => {
      setLoading(true)
      const res = await fetch(
        `http://localhost:9003/api/results/${studentId}/${examId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const data = await res.json()
      setResults(data.results)
      setLoading(false)
    }
    getResult()
  }, [studentId, examId])

  return loading ? (
    <Loading />
  ) : (
    <section className="bg-slate-100 dark:bg-gray-900 py-4 md:py-10 min-h-screen">
      <div className="container mx-auto px-4">
        <Navbar />

        {results &&
          results[results.length - 1] &&
          results[results.length - 1].noOfCorrectAnswers /
            results[results.length - 1].totalMarks >=
            0.7 && (
            <Confetti
              recycle={false}
              numberOfPieces={600}
              gravity={0.3}
              initialVelocityY={10}
              initialVelocityX={10}
            />
          )}
        <div className=" min-h-screen container flex flex-col mt-4 items-center">
          {results ? (
            results
              .slice()
              .reverse()
              .map((result, index) => (
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
              ))
          ) : (
            <div className="bg-gray-100 dark:bg-slate-900 min-h-screen container flex flex-col justify-center items-center">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                No Results
              </h1>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ExamResult
