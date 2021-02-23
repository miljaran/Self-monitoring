import { send } from '../deps.js';

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const authMiddleware = async({request, response, session}, next) => {
  if (request.url.pathname !== '/' && !request.url.pathname.startsWith('/auth') && !request.url.pathname.startsWith('/api') && !(await session.get('authenticated'))) {
    response.redirect('/auth/login');
  } else {
    await next();
  }
};

const logMiddleware = async({request, session}, next) => {
  const method = request.method;
  const url = request.url;
  const time = new Date().toLocaleTimeString();
  //const user = await session.get('authenticated');
  let id = "anonymous";

  /*if (await session.get('authenticated')) {
    id = (await session.get('user')).id
  }*/
  console.log(`${method} to ${url} at ${time} by ${id}`);
  await next();
};

export { errorMiddleware, authMiddleware, logMiddleware };
