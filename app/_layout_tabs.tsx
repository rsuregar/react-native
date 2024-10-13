import { useQueryClient } from '@tanstack/react-query';
import { Redirect, router, Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useSession } from '@/context/session';
import { logout } from '@/features/auth/useAuthMutations';
import { useUserQuery } from '@/features/profile/useUserQuery';

const UserProfile = () => {
  const { data: user, isLoading } = useUserQuery();

  if (isLoading) return null;

  return (
    <View style={tw`flex flex-row items-center justify-between p-4`}>
      <Pressable
        onPress={() => router.push('/profile')}
        style={tw`flex flex-row items-center gap-2`}
      >
        <Avatar
          size="xs"
          source={{
            uri: `https://ui-avatars.com/api/?name=${user?.name.replace(' ', '+')}&size=64`,
          }}
        />
        <View style={tw`flex flex-col`}>
          <Text style={tw`text-sm font-medium`}>{user?.name}</Text>
          <Text style={tw`text-xs text-gray-500`}>View Profile</Text>
        </View>
      </Pressable>
      <Icon name="chevron-forward" size={20} />
    </View>
  );
};

export default function AppLayout() {
  const { session, setSession } = useSession();
  const queryClient = useQueryClient();
  const { bottom } = useSafeAreaInsets();

  if (!session?.token) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProfile />

      <Tabs
        screenOptions={{
          tabBarStyle: { paddingBottom: bottom },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: 'Dashboard',
            headerShown: false, // Hides the header
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: 'Profile',
            headerShown: false, // Hides the header
          }}
        />
      </Tabs>

      <Button
        onPress={async () => {
          const response = await logout({ token: session?.token });

          if (response) {
            setSession(null);
            queryClient.invalidateQueries();
          }
        }}
        variant="outline"
      >
        Logout
      </Button>
    </GestureHandlerRootView>
  );
}
