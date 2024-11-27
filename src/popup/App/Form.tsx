import { useRef, useState } from 'preact/hooks';
import cn from '../../helpers/classnames';
import { Search, Send } from 'lucide-react';
import { Loader } from '../../theme';

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
    <form
      className={cn(className)}
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const query = textRef.current.value;
        await onSubmit(query);
        setLoading(false);
      }}
    >
      <Search />
      <textarea ref={textRef} />
      <button disabled={loading}>{loading ? <Loader /> : <Send />}</button>
    </form>
  );
};

export default Form;
