import { executeQuery } from "../database/database.js";
import { compare } from "../deps.js"

const searchUsers = async(email) => {
  const res = await executeQuery("SELECT * FROM users WHERE email = $1", email);
  if (res.rowCount === 0) {
    return null;
  }
  return res.rows[0];
}

const addUser = async(email, hash) => {
  await executeQuery("INSERT INTO users (email, password) VALUES ($1, $2)", email, hash);
}

const checkPassword = async(email, password) => {
  if (!email || !password) {
    return ['Email and password are necessary.'];
  }

  const userObj = await searchUsers(email);

  if (!userObj) {
    return ["An account with this email does not exist"];
  }

  const hash = userObj.password;

  const passwordCorrect = await compare(password, hash);
  if (!passwordCorrect) {
    return ['Incorrect password'];
  }
  return [userObj.id, userObj.email];
}

const getRegistrationForm = async(request) => {
  const data = {
    email: '',
    password: '',
    verification: '',
    errors: []
  };
  if (request) {
    const body = request.body();
    const params = await body.value;
    data.email = params.get('email');
    data.password = params.get('password');
    data.verification = params.get('verification')
  }
  return data;
}

const checkRegistration = async(email, password, verification) => {
  const errors = [];

  const exists = await searchUsers(email);
  if (exists) {
    errors.push('An account with given email already exists')
  }

  if (!email) {
    errors.push('Invalid email')
  }

  if (!password || password.length < 4) {
    errors.push('Invalid password. Password must contain at least 4 characters')
  }

  if (password !== verification) {
    errors.push('Password and password verification do not match')
  }
  return errors;
}

export { searchUsers, addUser, checkPassword, getRegistrationForm, checkRegistration }
