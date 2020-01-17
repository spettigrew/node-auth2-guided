const bcrypt = require("bcryptjs")
const express = require("express")
const usersModel = require("../users/users-model")

const router = express.Router()

const tokens = {}//keep track of people logged in.

router.post("/register", async (req, res, next) => {
  try {
    const saved = await usersModel.add(req.body)
    
    res.status(201).json(saved)
  } catch (err) {
    next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await usersModel.findBy({ username }).first()
    // since bcrypt hashes generate different results due to the salting,
    // we rely on the magic internals to compare hashes (rather than doing
    // it manually by re-hashing and comparing)
    const passwordValid = await bcrypt.compare(password, user.password)

    if (user && passwordValid) {
      const token = Math.random()

      token[token] = user
      console.log(tokens)

      res.status(200).json({
        token: token, 
        message: `Welcome ${user.username}!`,
      })
    } else {
      res.status(401).json({
        message: "Invalid Credentials",
      })
    }
  } catch (err) {
    next(err)
  }
})

router.get("/protected", async (req, res, next) => {
  try {
    const { token } = req.headers
    if (!token || !tokens[token]) {
      return res.status(403).json({ message: "Not authorized.", })
    }
    res.json({
      message: "You are authorized",
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router