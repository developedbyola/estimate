import React from 'react';
import { Box } from '@/components';
import { Estimate } from '../types';
import { useListEstimates } from '../hooks/useListEstimates';

const DefaultError = () => {
  return <Box></Box>;
};

const DefaultEmpty = () => {
  return <Box></Box>;
};

const Loader = () => {
  return <Box></Box>;
};

const Item = ({ estimate }: { estimate: Estimate }) => {
  return <Box></Box>;
};

type ListProps = {
  Empty?: React.ReactNode;
  Error?: React.ReactNode;
};

export const List = ({ Empty, Error }: ListProps) => {
  const { status, estimates } = useListEstimates();

  if (status === 'pending') return <Loader />;
  if (status === 'error') return Error || <DefaultError />;
  if (estimates?.length === 0) return Empty || <DefaultEmpty />;

  return (
    <Box>
      {estimates?.map((estimate) => (
        <Item
          key={estimate.id}
          estimate={estimate}
        />
      ))}
    </Box>
  );
};
