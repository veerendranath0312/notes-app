const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const login = async (req, res) => {
  // Destructure username and password from the request body
  const { username, password } = req.body

  // Attempt to find a user in the database with the provided username
  const user = await User.findOne({ username })

  // Check if the user exists and if the provided password matches the stored password hash
  const isCorrectPassword =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  // If the user doesn't exist or the password is incorrect, return a 401 status with an error message
  if (!(user && isCorrectPassword)) {
    return res.status(401).json({
      error: 'invalid username or password',
    })
  }

  // If authentication is successful, generate a JWT
  const token = jwt.sign(
    { username: user.username, id: user._id }, // Payload containing username and user ID
    process.env.SECRET, // Secret key for signing the token
    { expiresIn: 60 * 60 } // token expires in 60*60 seconds, that is, in one hour
  )

  // Return a 200 status with the token, username, and user's name
  return res
    .status(200)
    .json({ token, username: user.username, name: user.name })
}

module.exports = login
