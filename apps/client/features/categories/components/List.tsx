import React from 'react';
import { trpc } from '@/lib/trpc';
import { useCategories } from './Provider';
import { ActivityIndicator, Box, Heading } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import Icons from '../constants/Icons';
import { Border, Space } from '@/constants';
import { MotiView } from 'moti';
import { TouchableWithoutFeedback } from 'react-native';

const Empty = () => {
  return (
    <Box>
      <Ionicons
        name='add'
        size={24}
        color='text.subtle'
      />
      <Heading>Add a new category</Heading>
    </Box>
  );
};

const Loader = () => {
  return <ActivityIndicator />;
};

const Item = ({ category, index }: { category: any; index: number }) => {
  const INNER_HEIGHT = 48;
  const OUTER_HEIGHT = 120;
  const icon = Icons.find((icon) => icon.id === category.icon)!;

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <TouchableWithoutFeedback onPress={() => setIsHovered(!isHovered)}>
      <MotiView
        style={{
          width: '100%',
          height: OUTER_HEIGHT,
          paddingInline: Space.xl,
          backgroundColor: icon.lightColor,
          borderRadius: Border.radius['2xl'],
          boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.04)',
        }}
        from={{
          translateY: 12,
        }}
        animate={{
          translateY: isHovered
            ? 4 - index * OUTER_HEIGHT - 6
            : index * (INNER_HEIGHT - OUTER_HEIGHT),
        }}
        transition={{
          type: 'spring',
          stiffness: 112,
          delay: index * 100,
        }}
      >
        <Box
          style={{
            height: INNER_HEIGHT,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Heading
            size='2xl'
            leading='lg'
            weight='medium'
          >
            {category.name}
          </Heading>
          <Ionicons
            size={24}
            color={icon.normalColor}
            name={icon.icon! as any}
          />
        </Box>
      </MotiView>
    </TouchableWithoutFeedback>
  );
};

export const List = () => {
  const list = trpc.userCategories.list.useQuery();
  const { categories, setCategories } = useCategories();

  console.log(categories);

  React.useEffect(() => {
    if (list.data) {
      setCategories({
        type: 'SET_CATEGORIES',
        payload: { categories: (list.data as any)?.categories || [] },
      });
    }
  }, [list.data]);

  if (list.isLoading) return <Loader />;
  if (categories.length === 0) return <Empty />;

  return (
    <Box>
      {categories.map((category, index) => {
        return (
          <Item
            index={index}
            key={category.id}
            category={category}
          />
        );
      })}
    </Box>
  );
};
