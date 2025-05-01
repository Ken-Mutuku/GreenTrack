const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = {
      userId: user._id,
      role: user.role,
      walletAddress: user.walletAddress
    };
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = auth;