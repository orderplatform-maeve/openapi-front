import { fn } from '@storybook/test';
import * as Sample from './';

export default {
  title: 'Design system/Sample',
  component: Sample.Primary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
};

export const Primary = {
  args: {
    children: 'Sample Components for storybook',
  },
};
