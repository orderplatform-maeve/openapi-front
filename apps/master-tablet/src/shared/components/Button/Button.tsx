import type { MouseEvent, CSSProperties, PropsWithChildren } from 'react';
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
  onClick?: () => void;
}
export const Button = (props: ButtonProps) => {
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
    stopPropagation = false,
    preventDefault = false,
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

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (preventDefault) {
      e.preventDefault();
    }
    if (stopPropagation) {
      e.stopPropagation();
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <button className={containerStyle.join(' ').trim()} style={customStyle} onClick={handleClick}>
      {loading && <div>Loading...</div>}
      {children}
    </button>
  );
};
