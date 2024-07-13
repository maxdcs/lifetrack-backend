const jwt = require("jsonwebtoken")

function authenticateToken(req, res, next) {
  console.log("attempting to get the token from headers....")
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  console.log(`logging token: ${token}`)

  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!decodedToken.id) {
      return res.status(401).json({ error: "Invalid token: user ID not found" })
    }

    req.userId = decodedToken.id
    next()
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" })
  }
}

module.exports = { authenticateToken }
