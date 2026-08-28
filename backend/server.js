const express = require("express")
const dotenv = require("dotenv")
const path = require("path")
const cors = require("cors")
const errorHandler = require("./middleware/errorMiddleware")
const dbConnection = require("./config/db")

const goalsRoute = require("./routes/goalsRoute")
const userRoute = require("./routes/userRoute")

dotenv.config({ path: path.resolve(__dirname, '../.env') })

dbConnection()

const port = process.env.PORT || 8000
const app = express()

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({ origin: "http://localhost:3000" }))

//Routes
app.use('/api/goals', goalsRoute())
app.use('/api/auth', userRoute())

app.get('/health', (req, res) => res.status(200).json({ message: "I'm Okay" }))

app.use(errorHandler)

app.listen(port, () => console.log(`Server running on port : ${port}`))