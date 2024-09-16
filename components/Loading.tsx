import { View } from 'react-native';

import { ActivityIndicator } from './nativewindui/ActivityIndicator';

const Loading = () => {
   return (
      <View className="flex-1 items-center justify-center bg-background">
         <ActivityIndicator />
      </View>
   );
};

export default Loading;
