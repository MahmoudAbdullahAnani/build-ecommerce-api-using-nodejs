const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minlength: [3, "name must be at least 3 characters long"],
      unique: [true, "This name already exists"],
    },
    slug: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minlength: [3, "name must be at least 3 characters long"],
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: [true, "this email is alryde using by user more"],
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
      minlength: [6, "password must be at least 6 characters long"],
    },
    role: {
      type: String,
      required: [true, "role is required"],
      trim: true,
      minlength: [3, "role must be at least 3 characters long"],
      enum: ["user", "admin", "manger"],
    },
    userImg: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const editImageUserName = (doc) => {
  if (doc.userImg) {
    const fileName = doc.userImg;
    doc.userImg = `${process.env.DOMAN_NAME}user/images/${fileName}`;
  }
};
userSchema.post("init", (doc) => {
  editImageUserName(doc);
});
userSchema.post("save", (doc) => {
  editImageUserName(doc);
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
