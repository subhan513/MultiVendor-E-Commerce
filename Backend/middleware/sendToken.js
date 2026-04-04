const ShopToken = (user, statusCode, res) => {
  const token = user.getJwTToken();

  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    path: "/",
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  };
  return res.status(statusCode).cookie("seller_token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = ShopToken;
