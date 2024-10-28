import type { BaseHTMLAttributes, ReactNode } from 'react';
import { Button } from '../Button';

export interface TabProps extends BaseHTMLAttributes<HTMLBaseElement> {
  children: ReactNode;
  index?: number;
  isActive?: boolean;
  onClick?: () => void;
}
export const Tab = (props: TabProps) => {
  const { children, isActive, onClick } = props;
  return (
    <Button
      color={isActive ? 'primary' : 'basic'}
      variant={'tonal'}
      ignoreBottomRounded={true}
      size={'large'}
      block={true}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
