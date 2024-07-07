const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.post('/', async (req, res) => {
  const {name, email, password} = req.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    name: name,
    email: email,
    passwordHash: passwordHash
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)

})

userRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  const user = await User.findById(id)
  res.status(200).json(user)
})

module.exports = userRouter