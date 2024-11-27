import { sendMessage } from '../../helpers/chromeMessages';
import showdown from 'showdown';

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
  return (
    <div>
      <div
        dangerouslySetInnerHTML={{
          __html: showdownConverter.makeHtml(answer),
        }}
      />
      <ul>
        {results.map((result) => (
          <li>
            <button
              onClick={async () => {
                await sendMessage('highlight', {
                  id: result.id,
                });
              }}
            >
              {result.content.substring(0, 10)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Result;
