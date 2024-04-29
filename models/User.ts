import mongoose from "mongoose";
const Schema = mongoose.Schema;
// const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    // password: { type: String },//err
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    isAdmin: { type: Boolean, default: false },
  },
  { collection: "User" }
);

// UserSchema.pre("save", async function save(next) {
//   //if (!this.isModified("password")) return next();
//   try {
//     const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
//     this.password = await bcrypt.hash(this.password, salt);
//     return next();
//   } catch (err: any) {
//     return next(err);
//   }
// });

// UserSchema.methods.comparePassword = async function comparePassword(
//   candidatePassword: string
// ) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

UserSchema.virtual("url").get(function () {
  return "/api/user/" + this._id;
});
export default mongoose.models.User ||
  mongoose.model("User", UserSchema, "User");
