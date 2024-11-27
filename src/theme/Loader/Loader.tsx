import styles from './Loader.module.css';
import cn from '../../helpers/classnames';
import { CSSProperties } from 'preact/compat';

const Loader = ({
  className = '',
  style = {},
}: {
  className?: string;
  style?: CSSProperties;
}) => (
  <svg
    className={cn(styles.root, className)}
    viewBox="0 0 40 40"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    <circle cx="20" cy="20" r="15" />
  </svg>
);

export default Loader;
