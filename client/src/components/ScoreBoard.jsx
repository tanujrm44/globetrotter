import React from "react"
import { Award } from "lucide-react"
import { Card, CardContent } from "./ui/card"

const ScoreBoard = ({ score }) => {
  return (
    <Card className="bg-card shadow-sm">
      <CardContent className="p-3 flex items-center space-x-4">
        <div className="flex items-center">
          <Award className="text-yellow-500 mr-2" size={20} />
          <span className="font-bold">Score:</span>
        </div>
        <div className="flex space-x-3">
          <div className="text-center">
            <span className="block text-green-600 font-bold">
              {score.correct}
            </span>
            <span className="text-xs ">Correct</span>
          </div>
          <div className="text-center">
            <span className="block text-destructive font-bold">
              {score.incorrect}
            </span>
            <span className="text-xs ">Incorrect</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ScoreBoard
