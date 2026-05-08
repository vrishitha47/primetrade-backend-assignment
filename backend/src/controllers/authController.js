const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

const sendAuthResponse = (res, statusCode, user) => {
  const token = generateToken(user);

  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = 'user' } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  sendAuthResponse(res, 201, user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  sendAuthResponse(res, 200, user);
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

module.exports = {
  register,
  login,
  getMe
};
