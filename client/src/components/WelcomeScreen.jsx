import React, { useState } from "react"
import { MapPin, Award } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

const WelcomeScreen = ({ onStartGame, inviterName, inviterScore }) => {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }
    onStartGame(username)
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <MapPin className="text-primary" size={48} />
        </div>
        <CardTitle className="text-3xl">Globetrotter</CardTitle>
        <CardDescription>
          Test your knowledge of famous places around the world!
        </CardDescription>
      </CardHeader>

      <CardContent>
        {inviterName && (
          <div className="bg-secondary rounded-lg p-4 mb-6 border border-border">
            <p className="text-primary font-medium mb-2">
              {inviterName} has challenged you to beat their score!
            </p>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <span className="block text-green-600 font-bold text-xl">
                  {inviterScore.correct}
                </span>
                <span className="text-sm text-muted-foreground">Correct</span>
              </div>
              <div className="text-center">
                <span className="block text-destructive font-bold text-xl">
                  {inviterScore.incorrect}
                </span>
                <span className="text-sm text-muted-foreground">Incorrect</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Enter your username to start</Label>
            <Input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Your username"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button type="submit" className="w-full">
            Start Playing
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default WelcomeScreen
