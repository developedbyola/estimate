import { Login } from './components/Login';
import { Register } from './components/Register';
import { RefreshToken } from './components/RefreshToken';
import { Provider, useAuth } from './components/Provider';

const Auth = {
  Provider,
  useAuth,
  RefreshToken,
  Login,
  Register,
};

export { Auth };
