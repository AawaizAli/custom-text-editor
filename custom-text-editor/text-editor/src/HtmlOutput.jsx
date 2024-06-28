import React from 'react';

function HtmlOutput({ content }) {
  const formatHtml = (html) => {
    return `<p>\n${html.split('\n').map(line => `<span>${line}</span>`).join('\n  ')}\n</p>`;
  };

  return (
    <textarea
      value={formatHtml(content)}
      readOnly
      style={{ border: '1px solid #ccc', padding: '10px', width: '45%', height: '300px', whiteSpace: 'pre-wrap' }}
    />
  );
}

export default HtmlOutput;
