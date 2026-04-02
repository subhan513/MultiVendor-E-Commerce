const ShopToken = (user,statusCode,res)=>{
  const token = user.getJwTToken();

  // options for cookies
  const options = {
    expires : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly : true
  };
  return res.status(statusCode).cookie("seller_token",token,options).json({
    success : true,
    user,
    token
  });
}

module.exports = ShopToken;