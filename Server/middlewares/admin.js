const jwt = require("jsonwebtokens");

const authenticateAdmin = (req, res, next) => {
  // getting tokens from headers
  const token = req.headers["authorisation"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    //  verifying the user usig jwt
    const user = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = authenticateAdmin;
