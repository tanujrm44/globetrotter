import express from "express"
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"
import cors from "cors"
import { SYSTEM_PROMPT } from "./lib/systemPrompt.js"
import path from "path"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

let currentQuestion

app.get("/question", async (req, res) => {
  try {
    const result = await model.generateContent(SYSTEM_PROMPT)
    let responseText = result.response.text()

    responseText = responseText.replace(/```json|```/g, "").trim()

    const jsonResponse = JSON.parse(responseText)

    currentQuestion = jsonResponse

    res.json({
      clues: currentQuestion.clues,
      options: currentQuestion.options,
    })
  } catch (error) {
    console.error("Error generating question:", error)
    res.status(500).json({ error: "Failed to generate a trivia question." })
  }
})

app.post("/answer", async (req, res) => {
  try {
    const { answer } = req.body

    if (!currentQuestion) {
      return res.status(400).json({ error: "No question available." })
    }

    const correctAnswer = currentQuestion.country

    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      res.json({
        correct: true,
        correctAnswer,
        fun_fact: currentQuestion.fun_fact,
        trivia: currentQuestion.trivia,
      })
    } else {
      res.json({
        correct: false,
        correctAnswer,
        fun_fact: currentQuestion.fun_fact,
        trivia: currentQuestion.trivia,
      })
    }
  } catch (error) {
    console.error("Error checking answer:", error)
    res.status(500).json({ error: "Failed to check the answer." })
  }
})

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve()
  app.use(express.static(path.join(__dirname, "/client/dist")))
  app.use("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  )
} else {
  app.get("/", (req, res) => {
    res.send("Api is running...")
  })
}

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080")
})
