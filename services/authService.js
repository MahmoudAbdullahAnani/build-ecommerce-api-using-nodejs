const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const UserModel = require("../modules/userModule");
const { default: slugify } = require("slugify");
const apiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const signup = expressAsyncHandler(async (req, res, next) => {
  const user = await UserModel.create({
    slug: slugify(req.body.name),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = jwt.sign(
    { userId: user._id, userEmail: user.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    }
  );
  res.status(201).json({ token, data: user });
});

const signin = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    const isPasswordDone = await bcrypt.compare(password, user.password);
    if (isPasswordDone) {
      await UserModel.findByIdAndUpdate(user._id, { active: true });
      const token = jwt.sign(
        {
          userId: user._id,
          userEmail: user.email,
          role: user.role,
          active: true,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE_TIME }
      );
      return res.status(200).json({ token, data: user });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// desc Authantection [ getToken, verify Token, check is user exist, check if user change password ]
const protect = expressAsyncHandler(async (req, res, next) => {
  // 1) get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }
  // 2) verify token
  const encodede = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = await UserModel.findById(encodede.userId);
  if (!user || user.active === false) {
    throw next(
      new apiError("There is no user with this data or deactivet", 401)
    );
  }
  // 4) check if user chenge his password after login
  if (user.dateUpdatePasswordAt) {
    const dateUpdatePasswordAt = parseInt(
      user.dateUpdatePasswordAt.getTime() / 1000
    );
    if (dateUpdatePasswordAt > encodede.iat) {
      throw next(
        new apiError(
          "The password for this user has been changed, you must log in again",
          401
        )
      );
    }
  }
  req.user = user;
  next();
});
// @desc  Authraization
const allowedTo = (...roles) =>
  expressAsyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw next(new apiError("You do not have permission on this route", 403));
    }
    next();
  });

let emailUserForgotPass;
// @desc  Reset Password
// @Route POST api/v1/resetPassword
// @access  Public
const forgotPassword = expressAsyncHandler(async (req, res, next) => {
  // check is email exist
  const { email } = req.body || "";
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw next(new apiError("This user does not exist", 404));
  }
  // create random code and hashed this code in db
  const code = Math.floor(Math.random() * 100000);
  const hashedCode = await bcrypt.hash(code.toString(), 10);
  // update user
  await UserModel.findByIdAndUpdate(
    user._id,
    {
      resetPasswordCode: hashedCode,
      resetPasswordExpire: Date.now() + 3600000,
    },
    {
      new: true,
    }
  );
  // send email
  const messageHTML = `<div><h4>Hello Mr/<b> ${user.name}</b></h4> \n <h4>this your code <h1 style="color:red;background:#dadada;width="fit-content";padding="5px 10px";border-radius="8px">${code}</h1></h4> <h5>The duration of this code is <b>10 minutes</b></h5>.\n With regards, <b>Mahmoud Abdullah</b></div>`;
  try {
    await sendEmail({
      email: email,
      subject: "E-Shop Reset Password",
      messageHTML,
      userName: user.name,
    });
  } catch (err) {
    return next(
      new apiError(
        "An error occurred while sending the code details:\n" + err,
        500
      )
    );
  }
  req.forgotPassEmail = user.email;
  emailUserForgotPass = user.email;
  res.status(200).json({
    send: "successful",
    message: `The password reset code has been sent to ${user.email}`,
  });
});
const verifyCode = expressAsyncHandler(async (req, res, next) => {
  const { code } = req.body || "";
  const user = await UserModel.findOne({
    email: emailUserForgotPass,
    resetPasswordExpire: { $gt: Date.now() },
  });
  const isCodeVerify = await bcrypt.compare(code, user.resetPasswordCode);
  if (!isCodeVerify) {
    throw next(new apiError("error code", 501));
  }
  res.status(200).json({
    send: "successful",
    message: `Successful operation. Retype a new password`,
  });
  next();
});
const resetPassword = expressAsyncHandler(async (req, res, next) => {
  // get user
  const { password } = req.body || "";
  const user = await UserModel.findOne({
    email: emailUserForgotPass,
  });
  if (!user) {
    throw next(
      new apiError("An error occurred, please repeat the operation again", 404)
    );
  }
  // check is password changed or no
  const isChangedPass = await bcrypt.compare(password, user.password);
  if (isChangedPass) {
    throw next(new apiError("thiThe old password has not been changed!"));
  }
  // if password is changed ==> update password for user
  const hashedPassword = await bcrypt.hash(password, 10);
  const dataUserUpdated = await UserModel.findByIdAndUpdate(
    user._id,
    {
      password: hashedPassword,
      dateUpdatePasswordAt: Date.now(),
      resetPasswordCode: undefined,
      resetPasswordExpire: undefined,
    },
    {
      new: true,
    }
  );
  // Create a new token
  const token = jwt.sign(
    {
      userId: dataUserUpdated._id,
      userEmail: dataUserUpdated.email,
      role: dataUserUpdated.role,
      active: dataUserUpdated.active,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    }
  );
  req.token = token;
  res.status(200).json({
    send: "successful",
    message: `Your password has been changed`,
    data: dataUserUpdated,
    token,
  });
});
module.exports = {
  signup,
  signin,
  protect,
  allowedTo,
  forgotPassword,
  verifyCode,
  resetPassword,
};
