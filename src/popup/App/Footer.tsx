import cn from '../../helpers/classnames';
import styles from './Footer.module.css';
import { sendMessage } from '../../helpers/chromeMessages';

const Footer = ({
  className = '',
  conversationModeActive,
}: {
  className?: string;
  conversationModeActive: boolean;
}) => {
  return (
    <footer className={cn(className, styles.root)}>
      <label className={styles.label}>
        <input
          type="checkbox"
          id="conversationMode"
          defaultChecked={conversationModeActive}
          onClick={(e) =>
            sendMessage(
              'conversationMode',
              (e.target as HTMLInputElement).checked
            )
          }
        />
        activate conversation mode
      </label>
    </footer>
  );
};
export default Footer;
