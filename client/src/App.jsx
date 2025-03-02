import { useState, useEffect } from "react"
import { MapPin, Share2 } from "lucide-react"
import WelcomeScreen from "./components/WelcomeScreen"
import QuizGame from "./components/QuizGame"
import ScoreBoard from "./components/ScoreBoard"
import ShareModal from "./components/ShareModal"
import { Button } from "./components/ui/button"

function App() {
  const [username, setUsername] = useState("")
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [score, setScore] = useState({ correct: 0, incorrect: 0 })
  const [showShareModal, setShowShareModal] = useState(false)
  const [inviterName, setInviterName] = useState("")
  const [inviterScore, setInviterScore] = useState({ correct: 0, incorrect: 0 })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const inviter = urlParams.get("inviter")
    const correctScore = urlParams.get("correct")
    const incorrectScore = urlParams.get("incorrect")

    if (inviter) {
      setInviterName(inviter)
      if (correctScore && incorrectScore) {
        setInviterScore({
          correct: parseInt(correctScore),
          incorrect: parseInt(incorrectScore),
        })
      }
    }
  }, [])

  const handleStartGame = name => {
    setUsername(name)
    setIsGameStarted(true)
  }

  const handleScoreUpdate = isCorrect => {
    setScore(prevScore => ({
      correct: isCorrect ? prevScore.correct + 1 : prevScore.correct,
      incorrect: !isCorrect ? prevScore.incorrect + 1 : prevScore.incorrect,
    }))
  }

  const handleShareClick = () => {
    setShowShareModal(true)
  }

  const handleCloseShareModal = () => {
    setShowShareModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col">
      <header className="bg-background shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin className="text-primary" size={24} />
            <h1 className="text-2xl font-bold text-foreground">
              Globetrotter{" "}
            </h1>
          </div>
          {isGameStarted && (
            <div className="flex items-center space-x-4">
              <ScoreBoard score={score} />
              <Button
                onClick={handleShareClick}
                className="bg-green-500 hover:bg-green-600 text-white flex items-center space-x-2"
              >
                <Share2 size={18} />
                <span>Challenge a Friend</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
        {!isGameStarted ? (
          <WelcomeScreen
            onStartGame={handleStartGame}
            inviterName={inviterName}
            inviterScore={inviterScore}
          />
        ) : (
          <QuizGame username={username} onScoreUpdate={handleScoreUpdate} />
        )}
      </main>

      {showShareModal && (
        <ShareModal
          username={username}
          score={score}
          onClose={handleCloseShareModal}
          open={showShareModal}
        />
      )}
    </div>
  )
}

export default App
