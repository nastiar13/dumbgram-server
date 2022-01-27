const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
  const token = await req.headers.token;

  if (!token) {
    return res.status(401).send({
      status: 'Failed',
      message: 'Access denied!',
    });
  }

  try {
    const isVerified = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = isVerified;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: 'Failed',
      message: 'Invalid api key',
    });
  }
};
