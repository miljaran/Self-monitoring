import { addUser, searchUsers, checkPassword, checkRegistration } from "../../services/authService.js";
import { hash, validate, required, minLength, isEmail } from "../../deps.js";

const validationRules = {
    password: [required, minLength(4)],
    email: [required, isEmail],
    verification: [required]
};

const validationMessages = {
  "password.required": "The password is required.",
  "password.minLength": "The password has to be at least 4 charachers long.",
  "email.required": "The email is required.",
  "email.isEmail": "The email is not a valid email address.",
  "verification.required": "The email verification is required.",
}

const getRegistrationForm = async (request, session) => {
    const data = {
      email: "",
      password: "",
      verification:"",
      errors: {},
      user: await session.get('user'),
    };

    if (request) {
      const body = request.body();
      const params = await body.value;

      data.email = params.get("email");
      data.password = params.get("password");
      data.verification = params.get("verification");
    }

    return data;
  };

const showRegistrationForm = async({render, session}) => {
  const data = await getRegistrationForm(null, session);
  render('register.ejs', data);
}

const postRegistrationForm = async({render, request, response, session}) => {
  const data = await getRegistrationForm(request, session);
  let [passes, errors] = await validate(data, validationRules, {messages: validationMessages});

  if (data.password !== data.verification) {
    errors.mismatchPwd= {passwordMismatch: 'The entered passwords did not match.'};
    passes = false;
  }

  const existingUsers = await searchUsers(data.email);
  if (existingUsers) {
    errors.DupEmail= {duplicateEmail: 'The email is already reserved.'} ;
    passes = false;
  }

  if (!passes) {
    data.errors = errors;
    render('register.ejs', data);
  } else {
    const hashed = await hash(data.password);
    addUser(data.email, hashed);
    response.body = 'Registered successfully';
    response.redirect('/auth/login');
  }
};

const getLoginData = async(request, session) => {
    const data = {
      email: "",
      password: "",
      errors: [],
      user: await session.get('user')
    };

    if (request) {
      const body = request.body();
      const params = await body.value;
      data.email = params.get("email");
      data.password = params.get("password");
    }

    return data;
  };

const showLoginForm = async({render, session}) => {
  const data = await getLoginData(null, session);
  render('login.ejs', data);
}

const postLoginForm = async({render, request, response, session}) => {
  const data = await getLoginData(request, session);
  const res = await checkPassword(data.email, data.password);

  if (res.length === 1) {
    data.errors = res;
    render('login.ejs', data)

  } else {
    await session.set('authenticated', true);
    await session.set('user', {
        id: res[0],
        email: res[1]
    });
    response.body = 'Authentication successful!';
    response.redirect('/behavior/summary');
  }
}

const logout = async({session, response}) => {
  await session.set('authenticated', undefined);
  await session.set('user', null);
  response.redirect('/auth/login');
}

export { showLoginForm, postLoginForm, logout, showRegistrationForm, postRegistrationForm };
