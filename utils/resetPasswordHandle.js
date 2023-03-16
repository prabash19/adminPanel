const crypto = require("crypto");
function resetPasswordHandle() {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetPasswordToken = hashResetToken(resetToken);
  const resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return { resetToken, resetPasswordToken, resetPasswordExpire };
}

function hashResetToken(resetToken) {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  return resetPasswordToken;
}
module.exports = { resetPasswordHandle, hashResetToken };
