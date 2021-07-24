const express = require('express')
const app = express()
require('dotenv/config')
const cors = require('cors')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const user = require('./userSchema')

app.use(express.json())
app.use(cors())

app.post('/app/user', async (req, res) => {
  try {
    const username = req.body.username
    const password = req.body.password
    // check lengh
    if (username.length == 0)
      return res.status(400).send({ message: 'Invalid username format' })
    if (password.length == 0)
      return res.status(400).send({ message: 'Invalid password format' })

    // check is username already exists
    const userInfo = await user.findOne({ username: username })
    if (userInfo != null)
      return res.status(409).send({ message: 'Username already exists' })

    // hash the password
    const hashedpwd = await bcrypt.hash(password, 10)
    const newUser = new user({
      username: username,
      hashedpwd: hashedpwd,
    })
    await newUser.save()
    res.send({
      status: 'account created',
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

app.post('/app/user/auth', async (req, res) => {
  try {
    const username = req.body.username
    const password = req.body.password
    // check lengh
    if (username.length == 0)
      return res.status(400).send({ message: 'Invalid username format' })
    if (password.length == 0)
      return res.status(400).send({ message: 'Invalid password format' })

    // check is username already exists
    const userInfo = await user.findOne({ username: username })
    if (userInfo == null)
      return res.status(409).send({ message: 'User does not exists' })

    // check is password is correct
    if (!(await bcrypt.compare(password, userInfo.hashedpwd))) {
      return res.status(401).send({ message: 'Incorrect Password' })
    }

    res.send({
      status: 'success',
      userId: userInfo._id,
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

mongoose.connect(
  process.env.MONGOURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Database Connected')
  }
)

app.listen(process.env.PORT, () => {
  console.log('Server running on ' + process.env.PORT)
})
