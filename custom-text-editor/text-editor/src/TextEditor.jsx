import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const CustomEditor = () => {
    const editorRef = useRef(null);
    const [editorHtml, setEditorHtml] = useState('');
    const [fontSize, setFontSize] = useState('12');
    const [dataBoxes, setDataBoxes] = useState([{ id: uuidv4(), content: '', isActive: false }]);

    const executeCommand = (command, value = null) => {
        if (command === 'headers') {
            applyHeaderStyle(value);
        } else {
            document.execCommand(command, false, value);
        }
    };


    const applyHeaderStyle = (headerType) => {
        const selectedText = window.getSelection();
        if (!selectedText.rangeCount) return;

        const range = selectedText.getRangeAt(0);
        const selectedContents = range.extractContents();


        // Check if the selected content is already within a header or paragraph
        const existingHeader = Array.from(selectedContents.childNodes).find(
            (node) => node.nodeName.startsWith('H') || node.nodeName === 'P'
        );
        console.log('okkkkk existingHeader', existingHeader, selectedContents.childNodes, selectedText);

        // Create the new header element
        const newHeader = document.createElement(headerType);

        if (existingHeader) {
            // If there's an existing header or paragraph, move its contents to the new header
            // This includes handling nested elements like <b>, <i>, etc.
            Array.from(existingHeader.childNodes).forEach(child => {
                newHeader.appendChild(child);
            });
        } else {

            newHeader.appendChild(selectedContents);
        }

        // Insert the new header into the range
        range.insertNode(newHeader);

        // Clean up: Remove any empty headers or paragraphs that might have been left behind
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach(element => {
            if (element.innerHTML.trim() === '') {
                element.parentNode.removeChild(element);
            }
        });
        // Update editor state
        setEditorHtml(editorRef.current.innerHTML);
    };


    const handleFontSizeChange = (e) => {
        const newSize = e.target.value;
        setFontSize(newSize);
        executeCommand('fontSize', newSize);
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
        const activeDataBox = dataBoxes.find(dataBox => dataBox.isActive);
        if (activeDataBox) {
            const escapedId = CSS.escape(activeDataBox.id);
            const activeDataBoxElement = document.querySelector(`#${escapedId}`);
            if (activeDataBoxElement) {
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(activeDataBoxElement);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
                // activeDataBoxElement.focus();
            }
        }
    };

    useLayoutEffect(() => {
        const activeDataBox = dataBoxes.find(dataBox => dataBox.isActive);
        if (activeDataBox) {
            const escapedId = CSS.escape(activeDataBox.id);
            const activeDataBoxElement = document.querySelector(`#${escapedId}`);
            if (activeDataBoxElement) {
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(activeDataBoxElement);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
                // activeDataBoxElement.focus();
            }
        }
    }, [dataBoxes]);

    const addDataBox = () => {
        const newDataBox = { id: uuidv4(), content: '', isActive: true };
        const updatedDataBoxes = dataBoxes.map(dataBox => ({
            ...dataBox,
            isActive: false
        }));
        setDataBoxes([...updatedDataBoxes, newDataBox]);
    };

    useEffect(() => {
        // Focus the first data box initially
        const firstDataBox = document.querySelector('.data-box');
        if (firstDataBox) {
            firstDataBox.focus();
        }
    }, []);

    const handelKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addDataBox();
        }
    };

    const handelActiveBlock = (e, boxId) => {
        // e.stopPropogation();
        e.preventDefault();
        const newDataBoxes = dataBoxes.map(dataBox => {
            if (dataBox.id === boxId) {
                return { ...dataBox, isActive: true };
            }
            else {
                return { ...dataBox, isActive: false };
            }
        });
        setDataBoxes(newDataBoxes);
    };

    return (
        <div>
            <div className='custom-toolbar-style' style={{ display: 'flex' }}>
                <select onChange={(e) => executeCommand('headers', e.target.value)}>
                    <option value="p">Normal</option>
                    <option value="h1">H1</option>
                    <option value="h2">H2</option>
                    <option value="h3">H3</option>
                    <option value="h4">H4</option>
                    <option value="h5">H5</option>
                    <option value="h6">H6</option>
                </select>
                <select onChange={(e) => executeCommand('fontName', e.target.value)}>
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Verdana">Verdana</option>
                </select>
                <select value={fontSize} onChange={handleFontSizeChange}>
                    <option value="1">8px</option>
                    <option value="2">10px</option>
                    <option value="3">12px</option>
                    <option value="4">14px</option>
                    <option value="5">18px</option>
                    <option value="6">24px</option>
                    <option value="7">36px</option>
                </select>
                <button onClick={() => executeCommand('bold')}>Bold</button>
                <button onClick={() => executeCommand('italic')}>Italic</button>
                <button onClick={() => executeCommand('underline')}>Underline</button>
                <button onClick={() => executeCommand('strikeThrough')}>Strikethrough</button>
                <button onClick={() => executeCommand('justifyLeft')}>Left</button>
                <button onClick={() => executeCommand('justifyCenter')}>Center</button>
                <button onClick={() => executeCommand('justifyRight')}>Right</button>
                <button onClick={() => executeCommand('justifyFull')}>Justify</button>
                <input type="color" onChange={(e) => executeCommand('foreColor', e.target.value)} />
                <input type="color" onChange={(e) => executeCommand('hiliteColor', e.target.value)} />
                <button onClick={() => executeCommand('insertUnorderedList')}>Bulleted List</button>
                <button onClick={() => executeCommand('insertOrderedList')}>Numbered List</button>
                <button onClick={() => executeCommand('outdent')}>Decrease Indent</button>
                <button onClick={() => executeCommand('indent')}>Increase Indent</button>
            </div>
            <div
                id={'custom-editor'}
                className='dataBoxes-container'
                style={{ border: '1px solid silver', width: '800px', padding: '10px', marginTop: "20px", marginLeft: '240px' }}
                ref={editorRef}
            >
                {dataBoxes.map(dataBox => (
                    <div
                        id={dataBox.id}
                        className='data-box'
                        contentEditable
                        onInput={(e) => handleInput(e, dataBox.id)}
                        dangerouslySetInnerHTML={{ __html: dataBox.content }}
                        onClick={(e) => handelActiveBlock(e, dataBox.id)}
                        onKeyDown={handelKeyDown}
                    >
                    </div>
                ))}
            </div>
            <div style={{ width: '80%', minHeight: '100px', marginLeft: '200px', marginTop: '360px' }}>
                <h3>Editor HTML Content:</h3>
                <textarea value={editorHtml} readOnly style={{ width: '100%', minHeight: '100px' }} />
            </div>
        </div>
    );
}

export default React.memo(CustomEditor);