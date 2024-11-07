import { forwardRef, type FormEvent, type MouseEvent, type CSSProperties, type PropsWithChildren } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends PropsWithChildren {
  color?: 'primary' | 'secondary' | 'basic';
  variant?: 'filled' | 'tonal' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  type?: 'button' | 'submit' | 'reset';
  block?: boolean;
  rounded?: boolean;
  ignoreBottomRounded?: boolean;
  disabled?: boolean;
  loading?: boolean;
  stopPropagation?: boolean;
  preventDefault?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement> | FormEvent<HTMLButtonElement>) => void;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    color = 'basic',
    variant = 'filled',
    size = 'medium',
    rounded = true,
    ignoreBottomRounded = false,
    block = false,
    loading = false,
    disabled = false,
    onClick,
  } = props;
  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const containerStyle = [
    styles.container,
    styles[variant],
    styles[size],
    styles[color],
    rounded ? styles.rounded : null,
    ignoreBottomRounded ? styles.ignoreBottomRounded : null,
    block ? styles.block : null,
    loading ? styles.loading : null,
    disabled ? styles.disabled : null,
    touchSupport ? styles.touch : null,
  ];

  const customStyle: CSSProperties = {};

  const handleClick = (e: MouseEvent<HTMLButtonElement> | FormEvent<HTMLButtonElement>) => {
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      className={containerStyle.join(' ').trim()}
      style={customStyle}
      disabled={disabled}
      onClick={handleClick}
    >
      {loading && <div>Loading...</div>}
      {children}
    </button>
  );
});
Button.displayName = 'Button';
