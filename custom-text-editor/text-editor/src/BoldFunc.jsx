import React, { useRef, useState, useEffect } from 'react';
import { Button, Layout, Menu, Typography } from 'antd';
import { BoldOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { TextArea } = Typography;

const BoldFunc = () => {
    const editorRef = useRef(null);
    const [editorHtml, setEditorHtml] = useState('');
    const [dataBoxes, setDataBoxes] = useState([{ id: 1, content: '', isActive: false }]);

    const executeCommand = (command) => {
        document.execCommand(command, false, null);
        setEditorHtml(editorRef.current.innerHTML);
    };

    const handleInput = (e, id) => {
        const newDataBoxes = dataBoxes.map(dataBox => {
            if (dataBox.id === id) {
                return { ...dataBox, content: e.target.innerHTML };
            }
            return dataBox;
        });
        setEditorHtml(editorRef.current.innerHTML);
        setDataBoxes(newDataBoxes);
    };

    const handleActiveBlock = (e, boxId) => {
        e.preventDefault();
        const newDataBoxes = dataBoxes.map(dataBox => {
            if (dataBox.id === boxId) {
                return { ...dataBox, isActive: true };
            } else {
                return { ...dataBox, isActive: false };
            }
        });
        setDataBoxes(newDataBoxes);
    };

    useEffect(() => {
        const firstDataBox = document.querySelector('.data-box');
        if (firstDataBox) {
            firstDataBox.focus();
        }
    }, []);

    return (
        <Layout>
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">Home</Menu.Item>
                    <Menu.Item key="2">Editor</Menu.Item>
                </Menu>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
                        <Menu.Item key="1" onClick={() => executeCommand('bold')}>
                            <BoldOutlined /> Bold
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        <div
                            id="custom-editor"
                            style={{ border: '1px solid silver', width: '800px', padding: '10px', marginTop: "20px" }}
                            ref={editorRef}
                        >
                            {dataBoxes.map(dataBox => (
                                <div
                                    id={dataBox.id}
                                    className='data-box'
                                    contentEditable
                                    onInput={(e) => handleInput(e, dataBox.id)}
                                    dangerouslySetInnerHTML={{ __html: dataBox.content }}
                                    onClick={(e) => handleActiveBlock(e, dataBox.id)}
                                />
                            ))}
                        </div>
                        <div style={{ width: '100%', minHeight: '100px', marginTop: '20px' }}>
                            <h3>Editor HTML Content:</h3>
                            <TextArea value={editorHtml} readOnly autoSize={{ minRows: 4, maxRows: 8 }} />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default BoldFunc;
