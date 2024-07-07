const loginRouter = require("express").Router()
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

loginRouter.post("/", async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email })
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)
  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "Incorrect login credentials" })
  }

  const userForToken = {
    email: user.email,
    name: user.name,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  })
  res.status(200).send({ token, email: user.email, name: user.name })
})

module.exports = loginRouter
