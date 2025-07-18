import { Stack } from 'expo-router';

const ProtectedLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='(tabs)'
        options={{
          title: 'Tabs',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='farm'
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name='estimate'
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name='add-category'
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name='add-farm'
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen name='onboard' />
    </Stack>
  );
};

export default ProtectedLayout;
