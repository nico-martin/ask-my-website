import { Fragment } from 'preact';
import { sendMessage } from '../../helpers/chromeMessages';
import showdown from 'showdown';
import { Link2, ChevronDown } from 'lucide-react';
import styles from './Result.module.css';
import cn from '../../helpers/classnames';
import { useState } from 'preact/hooks';

const showdownConverter = new showdown.Converter();
const Result = ({
  className,
  answer,
  results,
}: {
  className?: string;
  answer: string;
  results: Array<{ content: string; id: string }>;
}) => {
  const [sourcesOpen, setSourcesOpen] = useState<boolean>(false);
  return (
    <div className={cn(styles.root, className)}>
      <div
        className={styles.answer}
        dangerouslySetInnerHTML={{
          __html: showdownConverter.makeHtml(answer),
        }}
      />
      {results.length !== 0 && (
        <Fragment>
          <button
            className={cn(styles.sources, {
              [styles.sourcesOpen]: sourcesOpen,
            })}
            onClick={() => setSourcesOpen(!sourcesOpen)}
          >
            Sources <ChevronDown size="1em" className={styles.sourcesIcon} />
          </button>
          {sourcesOpen && (
            <ul className={styles.resultList}>
              {results.map((result) => (
                <li className={styles.result}>
                  <button
                    className={styles.resultButton}
                    onClick={async () => {
                      await sendMessage('highlight', {
                        id: result.id,
                      });
                    }}
                  >
                    <Link2 size="1em" className={styles.resultButtonIcon} />
                    {result.content}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Result;
