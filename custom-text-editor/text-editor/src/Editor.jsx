import React, { useEffect, useRef } from 'react';

function Editor({ content, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const handleInput = () => {
      const editorContent = editorRef.current.innerHTML;
      onChange(editorContent);
    };

    const editorElement = editorRef.current;
    editorElement.addEventListener('input', handleInput);

    return () => {
      editorElement.removeEventListener('input', handleInput);
    };
  }, [onChange]);

  useEffect(() => {
    editorRef.current.innerHTML = content;
  }, [content]);

  return (
    <div
      ref={editorRef}
      id="editor"
      contentEditable="true"
      style={{ border: '1px solid #ccc', padding: '10px', width: '45%', height: '300px' }}
    ></div>
  );
}

export default Editor;
