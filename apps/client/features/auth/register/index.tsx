import React from 'react';
import { Flow } from '@/components';
import Forms from './components/Forms';
import AuthModal from '../shared/Modal';

type RegisterFeatureProps = {
  children: React.ReactNode;
};

const RegisterFeature = ({ children }: RegisterFeatureProps) => {
  return (
    <AuthModal
      trigger={children}
      flow={
        <Flow.Root
          count={3}
          initialData={{ email: '', password: '', name: '' }}
        >
          <Forms />
        </Flow.Root>
      }
    />
  );
};

export default RegisterFeature;
