import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PaperProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="device/[id]"
              options={{ headerShown: true, title: 'Device Detail', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="service-request/create"
              options={{ headerShown: true, title: 'New Service Request', headerBackTitle: 'Back' }}
            />
            <Stack.Screen
              name="service-request/[id]"
              options={{ headerShown: true, title: 'Service Request', headerBackTitle: 'Back' }}
            />
          </Stack>
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
