import React from 'react';
import { Auth } from '@/features/auth';
import { useThemeColors } from '@/hooks/useThemeColors';

const LoginPage = () => {
  return (
    <React.Fragment>
      <Auth.Login />
    </React.Fragment>
  );
};

export default LoginPage;
