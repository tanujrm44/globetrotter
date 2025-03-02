import express from "express"
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"
import cors from "cors"
import path from "path"
import { COUNTRIES } from "./lib/countries.js"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

let currentQuestion

const getRandomCountry = () =>
  COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]

app.get("/question", async (req, res) => {
  const country = getRandomCountry()

  const SYSTEM_PROMPT = `Generate a question for the country: **${country}**. Options must have country names to guess. Format the output as valid JSON:
    
    {
      "city": "A major city in ${country}",
      "country": "${country}",
      "clues": [
        "Provide 1-2 interesting clues about this city."
       // example: "This city is home to a famous tower that sparkles every night.",
    "Known as the 'City of Love' and a hub for fashion and art."
      ],
      "fun_fact": [
        "Provide 1-2 fun facts about this country."
        // example: "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
    "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules."
      ],
      "trivia": [
        "Provide 1-2 trivia facts about this country."
        //example: "This city is famous for its croissants and macarons. Bon appétit!",
    "Paris was originally a Roman city called Lutetia."
      ],
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"]
      // example: ["France", "Germany", "Italy", "Spain"]
    }
    
    Only return the JSON data, without any additional text or formatting.`
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
