import { FC } from 'react';
import styles from './Button.module.css';

interface ButtonsProps extends ElementProps<'button'> {
  // add custom props
}

const Base: FC<ButtonsProps> = ({ className, children, ...props }) => {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

const Primary: FC<ButtonsProps> = ({ children, ...props }) => {
  return (
    <Base className={styles.primary} {...props}>
      {children}
    </Base>
  );
};

export { Primary };
