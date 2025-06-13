import mongoose, { Schema, model,models, Document, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

// 1. Define IUser interface (data shape only, no Mongoose methods here)
export interface IUser {
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Create the schema
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// 3. Pre-save middleware to hash password
userSchema.pre("save", async function (this: HydratedDocument<IUser>, next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 4. Create the model
const User = models?.user ||model<IUser>("User", userSchema);
export default User;
