import React from 'react';
import { Layout, Menu, Row, Col, Input } from 'antd';
import './App.css'
import { useState } from 'react';

const { Header, Content } = Layout;
const { TextArea } = Input;

const App = () => {

  const [editorContent, setEditorContent] = useState('Hello World')

  function makeBold() {
    document.execCommand('bold', false, null);
    updateHtmlOutput();
  }

  function makeItalic() {
    document.execCommand('italic', false, null);
    updateHtmlOutput();
  }

  function makeUnderline() {
    document.execCommand('underline', false, null);
    updateHtmlOutput();
  }

  function updateHtmlOutput() {
    const editor = document.getElementById('editor');
    const htmlOutput = document.getElementById('htmlOutput');
    htmlOutput.value = formatHtml(editor.innerHTML);
  }

  function formatHtml(html) {
    return `<p>\n  ${html.split('\n').map(line => `<span>${line}</span>`).join('\n  ')}\n</p>`;
  }

  return (
    <Layout className='container' style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '20px', height: '100%' }}>
        <Row gutter={16} style={{ height: '100%' }}>
          <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
            <Menu style={{fontSize: '16px'}} mode="horizontal">
              <Menu.Item key="bold">
                <b>B</b>
              </Menu.Item>
              <Menu.Item key="italic">
                <i>i</i>
              </Menu.Item>
              <Menu.Item key="underline">
                <u>U</u>
              </Menu.Item>
            </Menu>
            <TextArea
              rows={20}
              id='editor'
              value={editorContent}
              style={{ resize: 'none', flex: 1, marginTop: '8px' }}
            />
          </Col>
          <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
            <TextArea
              rows={20}
              id='htmlOutput'
              value="HTML output will appear here..."
              style={{ resize: 'none', flex: 1, backgroundColor: '#f0f0f0' }}
              readOnly
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default App;
