import MyError from "../helpers/MyError";
import { User } from "../entities/User";
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

export const signup = async (name: string, email: string, password: string, password2: string) => {
  // all fields required
  if (!name || !email || !password || !password2) {
    throw new MyError("All fields must be filled: name, email, password, password2", 400);
  }

  // validate pw
  if (password.length < 6) {
    throw new MyError("Password must be at least 6 characters", 400);
  }
  if (password != password2) {
    throw new MyError("Passwords must match", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  let user = new User();
  user.name = name;
  user.email = email;
  user.password = hashedPassword;

  await User.save(user);
}

export const login = async (email: string, password: string) => {
  if (!email || !password) {
    throw new MyError("Email and password are both required", 400);
  }

  const res = await User.createQueryBuilder("user")
    .select("user.password", "password")
    .addSelect("user.id", "id")
    .addSelect("user.name", "name")
    .where("user.email=:email", { email: email })
    .getRawOne();
  if (!res || !(await bcrypt.compare(password, res.password))) {
    throw new MyError("Invalid login", 400);
  }

  return {
    name: res.name,
    token: jwt.sign({ uid: res.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
  };
}
