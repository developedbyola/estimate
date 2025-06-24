import { Categories } from '@/features/categories';
import React from 'react';

export default [
  {
    icon: 'barcode',
    title: 'Estimate',
    subTitle: 'Generate a new cost estimate for your farm',
    feature: React.Fragment,
  },
  {
    icon: 'sparkles',
    title: 'Category',
    subTitle: 'Organize all your farm estimates by category',
    feature: Categories.Add,
  },
  {
    icon: 'sunny',
    title: 'Farm',
    subTitle: 'Set up a new farm profile with location and crop info',
    feature: React.Fragment,
  },
] as const;
