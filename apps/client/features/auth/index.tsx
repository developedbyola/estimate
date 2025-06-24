import React from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import AuthModal from './components/shared/Modal';
import { Flow } from '@/components';

const Auth = {
  Login: ({ children }: { children: React.ReactNode }) => {
    return (
      <AuthModal
        trigger={children}
        flow={
          <Flow.Root count={2}>
            <Login />
          </Flow.Root>
        }
      />
    );
  },
  Register: ({ children }: { children: React.ReactNode }) => {
    return (
      <AuthModal
        trigger={children}
        flow={
          <Flow.Root count={3}>
            <Register />
          </Flow.Root>
        }
      />
    );
  },
};

export { Auth };
