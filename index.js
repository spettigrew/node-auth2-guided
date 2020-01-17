const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session) //variable being passed in.

const dbConfig = require("./database/dbConfig")
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
  cookie: {
    httpOnly: true, //cannot access the cookie through JS.
    maxAge: 1000 * 60 * 60 * 24 * 7, // expires session after 7 days.
    // 1000 - milliseconds, 60 secs, 60 mins, 24 hours, 7 days.
    secure: false, //in production, this should be true so the cookie heder is encrypted.
  },
  store: new KnexSessionStore({
    knex: dbConfig,
    createtable: true, //if the table does not exist in the db, it create this automatically. 
  }), //backend for our session storage
}))
// environment variable = .env. Put secret keys in there.

// import routers
server.use("/auth", authRouter)
server.use("/users", usersRouter)

server.get("/", (req, res, next) => {
  console.log(req.headers)
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