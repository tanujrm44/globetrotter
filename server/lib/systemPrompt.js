import { COUNTRIES } from "./countries.js"
const getRandomCountry = () =>
  COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
const country = getRandomCountry()

export const SYSTEM_PROMPT = `Generate a question for the country: **${country}**. Options must have country names to guess. Format the output as valid JSON:

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
