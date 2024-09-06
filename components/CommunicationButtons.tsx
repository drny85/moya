import { AntDesign, Feather } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

import { handlePhoneAction } from '~/utils/handlePhoneAction';

type Props = {
   phone: string;
   color?: string;
};
const CommunicationButtons = ({ phone, color }: Props) => {
   if (!phone) return null;
   return (
      <View className="flex-1 flex-row items-center justify-evenly">
         <TouchableOpacity onPress={() => handlePhoneAction('text', phone)}>
            <Feather name="message-circle" size={30} color={color ? color : 'blue'} />
         </TouchableOpacity>
         <TouchableOpacity onPress={() => handlePhoneAction('call', phone)}>
            <AntDesign name="phone" size={30} color={color ? color : 'red'} />
         </TouchableOpacity>
      </View>
   );
};

export default CommunicationButtons;
// book
