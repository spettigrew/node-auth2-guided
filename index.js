const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")

const authRouter = require("./auth/auth-router")
const usersRouter = require("./users/users-router")

const server = express()
const port = process.env.PORT || 5000

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(session({
  resave: false, //keep it false, won't re-create sessions that haven't changed
  saveUninitialized: false, //keep from setting cookies automatically
  secret: "unicorns are not real, sorry.", // to crypto the cookie
}))
// environment variable = .env. Put secret keys in there.

// import routers
server.use("/auth", authRouter)
server.use("/users", usersRouter)

server.get("/", (req, res, next) => {
  res.json({
    message: "Welcome to our API",
  })
})

server.use((err, req, res, next) => {
  console.log("Error:", err)

  res.status(500).json({
    message: "Something went wrong",
  })
})


server.listen(port, () => {
  console.log(`\n** Running on http://localhost:${port} **\n`)
})