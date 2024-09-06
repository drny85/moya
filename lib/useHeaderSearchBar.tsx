import { useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { SearchBarProps } from 'react-native-screens';

import { useColorScheme } from './useColorScheme';

import { COLORS } from '~/theme/colors';

export function useHeaderSearchBar(props: SearchBarProps = {}) {
   const { colorScheme, colors } = useColorScheme();
   const navigation = useNavigation();
   const [search, setSearch] = useState('');

   useLayoutEffect(() => {
      navigation.setOptions({
         headerSearchBarOptions: {
            placeholder: 'Search...',
            barTintColor: colorScheme === 'dark' ? COLORS.black : COLORS.white,
            textColor: colors.foreground,
            tintColor: colors.primary,
            headerIconColor: colors.foreground,
            hintTextColor: colors.grey,
            hideWhenScrolling: false,
            onChangeText(ev) {
               setSearch(ev.nativeEvent.text);
            },
            ...props,
         } satisfies SearchBarProps,
      });
   }, [navigation, colorScheme]);

   return search;
}
