const jwt = require("jsonwebtoken");
function sendToken(id) {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  return { token, options };
}
module.exports = sendToken;
