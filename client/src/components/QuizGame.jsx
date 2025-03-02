import React, { useState, useEffect } from "react"
import { MapPin, RefreshCw, Frown, PartyPopper } from "lucide-react"
import confetti from "canvas-confetti"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Button } from "./ui/button"
import axios from "axios"

const QuizGame = ({ username, onScoreUpdate }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [correctAnswer, setCorrectAnswer] = useState("")
  const [options, setOptions] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [funFact, setFunFact] = useState("")
  const [trivia, setTrivia] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNewQuestion = async () => {
    setLoading(true)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setFunFact("")
    setTrivia([])

    try {
      const res = await axios.get(
        "https://globetrotter-0mru.onrender.com/question"
      )
      setCurrentQuestion(res.data)
      setOptions(res.data.options)
    } catch (error) {
      console.error("Error fetching question:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNewQuestion()
  }, [])

  const checkAnswer = async answer => {
    try {
      const res = await axios.post(
        "https://globetrotter-0mru.onrender.com/answer",
        {
          answer,
        }
      )

      setIsCorrect(res.data.correct)
      setCorrectAnswer(res.data.correctAnswer)
      setFunFact(res.data.fun_fact || "No fun fact available.")
      setTrivia(res.data.trivia || [])

      onScoreUpdate(res.data.correct ? 1 : 0)

      if (res.data.correct) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }
    } catch (error) {
      console.error("Error checking answer:", error)
    }
  }

  const handleAnswerSelect = answer => {
    setSelectedAnswer(answer)
    checkAnswer(answer)
  }

  const handleNextQuestion = () => {
    fetchNewQuestion()
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Loading your next destination challenge...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Guess the Destination</CardTitle>
        <CardDescription>
          Read the clues and select the correct destination
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-secondary rounded-lg p-6 mb-6">
          {currentQuestion.clues.map((clue, index) => (
            <p key={index} className="text-secondary-foreground mb-3">
              {index + 1}. {clue}
            </p>
          ))}
        </div>

        {!selectedAnswer ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                variant="outline"
                className="h-auto py-3 justify-start font-normal text-left"
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <div>
            <div
              className={`rounded-lg p-6 mb-6 ${
                isCorrect
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="mb-4">
                {isCorrect ? (
                  <>
                    <PartyPopper className="text-green-500 mr-2" size={24} />
                    <h3 className="text-xl font-bold text-green-700">
                      Correct Answer!
                    </h3>
                  </>
                ) : (
                  <>
                    <Frown className="text-red-500 mr-2" size={24} />
                    <h3 className="text-xl font-bold text-red-700">
                      Oops! That's incorrect.
                    </h3>
                    <p
                      className={`text-lg font-medium ${
                        isCorrect ? "text-green-700" : "text-red-700"
                      } mb-4`}
                    >
                      The correct answer is:{" "}
                      <span className="font-bold">{correctAnswer}</span>
                    </p>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-gray-100">
                  <p className="text-gray-700">
                    <span className="font-bold">Fun Fact:</span> {funFact}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-100">
                  <p className="text-gray-700 font-bold">Trivia:</p>
                  <ul className="list-disc list-inside text-gray-700">
                    {trivia?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <Button onClick={handleNextQuestion} className="w-full">
              <RefreshCw className="mr-2" size={18} />
              Next Destination
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default QuizGame
