import { fn } from '@storybook/test';
import { Sample } from './index';

export default {
  title: 'Design system/Sample',
  component: Sample,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
};

export const Default = {};
