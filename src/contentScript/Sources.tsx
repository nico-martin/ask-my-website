import styles from './Sources.module.css';
import cn from '../helpers/classnames';
import { Link2 } from 'lucide-react';
import highlightParagraph from '../helpers/highlightParagraph';

const Sources = ({
  className = '',
  sources = [],
}: {
  className?: string;
  sources: Array<{ content: string; id: string }>;
}) => {
  return (
    <div className={cn(className, styles.root)}>
      <p className={styles.heading}>
        <b>Sources:</b>
      </p>
      <ul className={styles.list}>
        {sources.map((source) => (
          <li className={styles.item}>
            <button
              onClick={() => {
                highlightParagraph(source.id);
              }}
              className={cn(styles.button, 'fs-small')}
            >
              <Link2 size="1em" className={styles.buttonIcon} />
              {source.content}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sources;
