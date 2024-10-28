import { fn } from '@storybook/test';
import { Button } from './';

export default {
  title: 'Master design system/MButton',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
};

export const MButton = {
  args: {
    children: 'Button',
  },
};
