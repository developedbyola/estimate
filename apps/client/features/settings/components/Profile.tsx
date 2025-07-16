import { Box, Heading, Scroll } from '@/components';
import { User } from '@/features/users';
import { Stack } from 'expo-router';
import React from 'react';
import Avatar from 'boring-avatars';

export const Profile = () => {
  const { user } = User.useUser();

  return (
    <React.Fragment>
      <Stack.Screen />
      <Scroll>
        <Box>
          <Avatar
            name={user?.name || 'User'}
            size={128}
            variant='beam'
          />
        </Box>
      </Scroll>
    </React.Fragment>
  );
};
