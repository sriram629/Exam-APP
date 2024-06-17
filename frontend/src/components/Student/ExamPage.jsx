import { useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import Loading from "./Loading"

const options = ["a", "b", "c", "d"]

const ExamPage = () => {
  const { id } = useParams()
  const studentId = JSON.parse(localStorage.getItem("user")).id
  const [exam, setExam] = useState({})
  const [isExamFetched, setIsExamFetched] = useState(false)
  const [timer, setTimer] = useState(600)
  const [index, setIndex] = useState(1)
  const history = useHistory()
  const [answers, setAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const examStatus = JSON.parse(localStorage.getItem("examStatus"))

  if (examStatus?.access !== "granted") {
    history.replace("/exams")
  }

  function confirmSwitchTab() {
    var result = confirm("Are you sure you want to exit?")
    if (result) {
      return true
    } else {
      return false
    }
  }

  const onClick = (path) => {
    const userConfirmsSwith = confirmSwitchTab()
    if (userConfirmsSwith) {
      localStorage.setItem(
        "examStatus",
        JSON.stringify({
          examId: exam._id,
          access: "denied",
        })
      )
      history.replace(path)
    }
  }

  useEffect(() => {
    console.log("Fetching exam...")
    const fetchExam = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:9002/api/exams/${id}`)
        const result = await response.json()
        setLoading(false)
        if (response.ok) {
          console.log("Exam fetched successfully:", result)
          setExam(result[0])
          setTimer(result[0].duration * 60)
          setIsExamFetched(true)
          setAnswers((prevAnswers) =>
            prevAnswers.length === 0
              ? result[0].questions.map((question) => ({
                  question: question.question,
                  answer: "",
                }))
              : prevAnswers
          )
          localStorage.setItem(
            "examStatus",
            JSON.stringify({
              examId: result[0]._id,
              access: "granted",
            })
          )
        }
      } catch (error) {
        console.error("Error fetching exam:", error)
      }
    }

    if (!isExamFetched) {
      fetchExam()
    }
  }, [id, isExamFetched, exam])

  useEffect(() => {
    if (isExamFetched) {
      console.log("Starting countdown...")
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)

      return () => {
        console.log("Clearing countdown...")
        clearInterval(countdown)
      }
    }
  }, [isExamFetched])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`
  }

  const handleNextClick = () => {
    if (index < exam?.questions.length) {
      setIndex((prevIndex) => prevIndex + 1)
    }
  }

  const handlePrevClick = () => {
    if (index > 1) {
      setIndex((prevIndex) => prevIndex - 1)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      studentId,
      examId: exam._id,
      questions: answers,
    }

    const userConfirmsSubmit = confirm("Are you sure you want to submit?")
    if (userConfirmsSubmit) {
      localStorage.setItem(
        "examStatus",
        JSON.stringify({
          examId: exam._id,
          access: "denied",
        })
      )
      try {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
        setLoading(true)
        const response = await fetch(
          "http://localhost:9002/api/exams/submit",
          options
        )
        setLoading(false)
        if (response.ok) {
          history.replace(`/result/${studentId}/${exam._id}`)
        }
        const result = await response.json()
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    } else {
      return false
    }
  }

  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
      <Loading />
    </div>
  ) : (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-4 md:py-10 min-h-screen">
      {exam?._id ? (
        <form className="container mx-auto p-3" onSubmit={onSubmit}>
          <div className="md:hidden flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={() => onClick("/exams")}
              className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Exit
            </button>
            <button
              type="submit"
              /*  onClick={() => onClick("/results")} */
              className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Submit
            </button>
          </div>
          <header className="bg-gray-500 dark:bg-gray-800 text-white p-4 md:grid grid-cols-3 items-center rounded-md">
            <div className="hidden md:block">
              <h1 className="text-xl font-bold mb-1">{exam.title}</h1>
              <p className="text-sm">Topic: {exam.topic}</p>
            </div>
            <div className="text-center">
              <p className="text-sm">Time Remaining</p>
              <p className="text-xl font-bold">{formatTime(timer)}</p>
            </div>

            <div className="hidden md:flex gap-4 justify-end">
              <button
                onClick={() => onClick("/exams")}
                className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Exit
              </button>
              <button
                type="submit"
                /* onClick={() => onClick("/results")} */
                className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </header>
          <main className="my-5">
            <div className="flex flex-col items-center md:flex-row md:items-start gap-4">
              <div className="w-full md:w-5/6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 min-h-80 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Question {index}</h1>
                  </div>
                  <div className="mt-4">
                    <p className="text-lg">
                      {exam?.questions && exam.questions[index - 1]?.question}
                    </p>
                  </div>
                  <div className="mt-5">
                    <div className="flex flex-col gap-4">
                      {exam?.questions &&
                        exam.questions[index - 1]?.options.map((option, i) => (
                          <label
                            key={i}
                            className="inline-flex items-center mb-2"
                          >
                            <input
                              type="radio"
                              className="form-radio"
                              name={`question-${index}-option-${options[i]}`}
                              value={options[i]}
                              checked={
                                answers[index - 1]?.answer === options[i]
                                  ? true
                                  : false
                              }
                              onChange={() => {
                                setAnswers((prevAnswers) => {
                                  const newAnswers = [...prevAnswers]
                                  newAnswers[index - 1] = {
                                    question:
                                      exam.questions[index - 1]?.question,
                                    answer: options[i],
                                  }
                                  return newAnswers
                                })
                              }}
                            />
                            <span className="ml-2">{option}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/4 hidden md:block">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 max-h-96 overflow-y-scroll no-scrollbar">
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Questions</h1>
                    <p className="text-sm">
                      {exam.questions && exam.questions.length}
                    </p>
                  </div>
                  <div className="mt-4">
                    <ul className="flex flex-col gap-4">
                      {exam.questions &&
                        exam.questions.map((question, i) => (
                          <li
                            className="flex justify-between items-center px-5"
                            key={i}
                          >
                            <button
                              type="button"
                              onClick={() => setIndex(i + 1)}
                              className="bg-blue-400 rounded-full w-8 h-8 text-white dark:text-gray-800"
                            >
                              {i + 1}
                            </button>
                            {answers[i]?.answer === "" ? (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 border-2 border-red-300 text-red-800">
                                Not Answered
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 border-2 border-green-300 text-green-800">
                                Answered
                              </span>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex  gap-4 md:hidden">
                {index > 1 && (
                  <button
                    type="button"
                    className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    onClick={handlePrevClick}
                  >
                    Previous
                  </button>
                )}
                {exam.questions && index < exam?.questions.length && (
                  <button
                    type="button"
                    className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                    onClick={handleNextClick}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
            <div className="hidden mt-6 md:flex justify-center gap-4">
              {index > 1 && (
                <button
                  type="button"
                  className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={handlePrevClick}
                >
                  Previous
                </button>
              )}
              {exam.questions && index < exam?.questions.length && (
                <button
                  type="button"
                  className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={handleNextClick}
                >
                  Next
                </button>
              )}
            </div>
          </main>
        </form>
      ) : (
        <div className="flex justify-center items-center h-screen text-4xl font-medium">
          No Exam Found
        </div>
      )}
    </div>
  )
}

export default ExamPage
