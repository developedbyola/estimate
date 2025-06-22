import React from 'react';
import Forms from './components/Forms';
import AuthModal from '../shared/Modal';
import { Flow } from '@/components';

type LoginFeatureProps = { children: React.ReactNode };

const LoginFeature = ({ children }: LoginFeatureProps) => {
  return (
    <AuthModal
      trigger={children}
      flow={
        <Flow.Root
          count={2}
          initialData={{ email: '', password: '' }}
        >
          <Forms />
        </Flow.Root>
      }
    />
  );
};

export default LoginFeature;
