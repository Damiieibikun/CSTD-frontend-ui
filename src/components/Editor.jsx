
import { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

const Editor = ({ handle_html, value = '' }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  };

  const { quill, quillRef } = useQuill({ modules });

  // Set initial content only once when editor loads and is empty
  useEffect(() => {
    if (quill && value && quill.getLength() === 1) {
      quill.clipboard.dangerouslyPasteHTML(0, value);
      quill.setSelection(quill.getLength(), 0);
    }
  }, [quill, value]);

  // Listen for editor changes
  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        const html = quill.root.innerHTML;
        handle_html(html);
      });
    }
  }, [quill, handle_html]);

  return (
    <div className="w-full max-w-4xl mx-auto p-2">
      <div
        ref={quillRef}
        className="rounded-md border border-gray-300 overflow-y-auto max-h-56 bg-white"
      />
    </div>
  );
};

export default Editor;
