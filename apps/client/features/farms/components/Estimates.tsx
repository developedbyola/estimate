import React from 'react';
import { trpc } from '@/lib/trpc';
import { Alert, TouchableOpacity } from 'react-native';
import { useFarms } from './Provider';
import { useEstimates } from '@/features/estimates';
import { ActivityIndicator, Box, Text, Heading } from '@/components';
import { useCurrency } from '@/features/currency';
import { Border } from '@/constants';
import { useRouter } from 'expo-router';

const Empty = () => {
  return (
    <Box>
      <Heading>No estimates found</Heading>
    </Box>
  );
};

const List = () => {
  const router = useRouter();
  const { currency } = useCurrency();
  const { estimates, setEstimates } = useEstimates();

  return estimates.map((estimate) => (
    <TouchableOpacity
      key={estimate.id}
      activeOpacity={0.6}
      onPress={() => {
        setEstimates({ type: 'SET_ESTIMATE', payload: { estimate } });
        router.push(`/add-estimate`);
      }}
    >
      <Box
        px='lg'
        py='sm'
        bg='bg.base'
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          borderRadius: Border.radius.lg,
          alignItems: 'center',
        }}
      >
        <Box>
          <Heading
            size='base'
            leading='sm'
            weight='medium'
          >
            {estimate.title}
          </Heading>
          <Text
            size='sm'
            leading='sm'
            color='text.subtle'
          >
            {estimate.calculations.length} items
          </Text>
        </Box>
        <Heading
          size='lg'
          leading='base'
          weight='medium'
        >
          {currency.symbol}5.00
        </Heading>
      </Box>
    </TouchableOpacity>
  ));
};

const Estimates = () => {
  const { farm } = useFarms();
  const { estimates, setEstimates } = useEstimates();
  const farmEstimates = trpc.userFarms.estimates.useQuery({
    farmId: farm?.id || '',
  });

  React.useEffect(() => {
    if (farmEstimates.status === 'success') {
      const data = farmEstimates.data as any;
      if (!data) return;

      setEstimates({
        type: 'SET_ESTIMATES',
        payload: {
          estimates: data.estimates,
        },
      });
    }
    if (farmEstimates.status === 'error') {
      Alert.alert('We couldn’t fetch estimates', farmEstimates.error.message, [
        { text: 'Cancel' },
        {
          text: 'Retry',
          onPress: () => farmEstimates.refetch().catch(console.error),
        },
      ]);
    }
  }, [farmEstimates.status]);

  if (farmEstimates.isLoading) return <ActivityIndicator />;

  return (
    <React.Fragment>
      {estimates.length === 0 ? <Empty /> : <List />}
    </React.Fragment>
  );
};

export default Estimates;
