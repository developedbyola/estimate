import React from 'react';
import { Space } from '@/constants';
import { Settings } from '@/features/settings';
import { Box, Heading, Safe, Scroll } from '@/components';

const SettingsPage = () => {
  return (
    <React.Fragment>
      <Safe
        bg='bg.subtle'
        style={{ flex: 1 }}
      >
        <Scroll
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Box
            mt='4xl'
            px='xl'
            style={{
              gap: Space.xl,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Heading size='4xl'>Settings</Heading>
          </Box>

          <Box
            pb='lg'
            px='xl'
            mt='2xl'
          >
            <Settings.List />
          </Box>
        </Scroll>
      </Safe>
    </React.Fragment>
  );
};

export default SettingsPage;
