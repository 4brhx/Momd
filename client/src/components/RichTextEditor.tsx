import { lazy, Suspense, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import 'quill/dist/quill.snow.css';

const ReactQuill = lazy(() => import('react-quill'));

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'اكتب محتوى المقالة هنا...',
}: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ],
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'align',
    'link',
    'image',
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Suspense fallback={<Skeleton className="h-96" />}>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="h-96"
        />
      </Suspense>
    </div>
  );
}
