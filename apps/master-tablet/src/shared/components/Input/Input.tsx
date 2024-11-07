import styles from './Input.module.css';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  name?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export const Input = (props: InputProps) => {
  const { label, type = 'text', placeholder = '', value, name, disabled = false, onChange } = props;
  return (
    <div className={styles.container}>
      {label && <label>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name={name}
        disabled={disabled}
      />
    </div>
  );
};
