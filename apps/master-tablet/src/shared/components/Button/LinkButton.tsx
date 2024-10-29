import { Link } from '@tanstack/react-router';
import { Button, ButtonProps } from './Button';

interface LinkButtonProps extends ButtonProps {
  link: string;
}
export const LinkButton = (props: LinkButtonProps) => {
  const { children, link, ...rest } = props;
  return (
    <Link to={link}>
      <Button {...rest}>{children}</Button>
    </Link>
  );
};
