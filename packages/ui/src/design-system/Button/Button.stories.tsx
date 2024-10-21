import { fn } from '@storybook/test';
import * as Button from './';

export default {
  title: 'Design system/Button',
  component: Button.Primary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
};

export const Primary = {
  args: {
    children: 'Button',
  },
};
