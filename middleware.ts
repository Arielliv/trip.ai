import { auth } from './auth';

export default auth((req) => {
  console.log(req.auth);
  // req.auth
});
