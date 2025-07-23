import React from 'react';
import { Farms } from '@/features/farms';
import { Safe } from '@/components';
import { Space } from '@/constants';

const FarmsViewPage = () => {
  return (
    <React.Fragment>
      <Safe style={{ flex: 1, marginTop: Space['5xl'] }}>
        <Farms.View />
      </Safe>
    </React.Fragment>
  );
};

export default FarmsViewPage;
