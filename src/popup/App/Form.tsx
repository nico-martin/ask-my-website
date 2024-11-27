import { useRef, useState } from 'preact/hooks';
import cn from '../../helpers/classnames';
import { Search, Send } from 'lucide-react';
import { Loader } from '../../theme';
import styles from './Form.module.css';

const Form = ({
  className,
  onSubmit,
}: {
  className?: string;
  onSubmit: (query: string) => Promise<void>;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={cn(className, styles.root)}>
      <form
        className={styles.form}
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const query = textRef.current.value;
          if (!query) {
            setLoading(false);
            return;
          }
          await onSubmit(query);
          setLoading(false);
        }}
      >
        <label htmlFor="query" className={styles.label}>
          <Search size="1em" className={cn(styles.searchIcon, styles.icon)} />
          <textarea
            id="query"
            name="query"
            ref={textRef}
            className={styles.textarea}
            placeholder="Ask a question..."
          />
        </label>
        <button
          title="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? (
            <Loader className={styles.buttonLoader} />
          ) : (
            <Send size="1em" className={cn(styles.icon)} />
          )}
        </button>
      </form>
    </div>
  );
};

export default Form;
