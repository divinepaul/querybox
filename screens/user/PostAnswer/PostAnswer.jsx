import React, { useEffect, useState, useRef } from 'react'
import Input from '../../../components/Input/Input';
import '../Customer.css';
import Button from '@mui/material/Button';
import './PostAnswer.css';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula, materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'
import { useParams, useNavigate } from 'react-router-dom';
import { requestWithAuth } from '../../../lib/random_functions';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

export default function PostAnswer() {

    const navigate = useNavigate();
    let { postNumber, mode } = useParams();

    const [description, setDescription] = useState("");
    const [questionPostId, setQuestionPostId] = useState(0);
    const [isLoading, setisLoading] = useState(true);

    const descRef = useRef();

    const [files, setFiles] = useState([]);

    let handleDescriptionChange = (valueObject) => {
        setDescription(valueObject.value);
    }


    useEffect(() => {
        if (!postNumber || !mode) {
            navigate("/questions");
        }
        let res;
        let data;
        (async () => {
            [res, data] = await requestWithAuth(navigate, `/api/answers/get/${postNumber}`);

            let [res3, filesData] = await requestWithAuth(navigate, `/api/files/get-info-per-post/${postNumber}`);
            setFiles(filesData);
        })().then(() => {

            setDescription(data.answer_content);
            setQuestionPostId(data.question_post_id);
            setisLoading(false);
        });
    }, []);


    useEffect(() => {
        (async () => {
            if (descRef.current) {
                if (!descRef.current.validateInput()) {
                    await requestWithAuth(navigate, `/api/answers/update/`, {
                        post_id: postNumber,
                        answer_content: description,
                    })
                }
            }
        })();
    }, [description])

    let askQuestion = async () => {
        if (descRef.current) {
            if (!descRef.current.validateInput()) {
                let [res, data] = await requestWithAuth(navigate, `/api/answers/publish/`, {
                    post_id: postNumber,
                    answer_content: description,
                })
                if (res.status == 200) {
                    navigate(`/question/${questionPostId}`);
                }
            }
        }
    }


    let handleFileUpload = async (event) => {
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        let rawResponse = await fetch(`/api/files/upload/${postNumber}`, {
            method: 'POST',
            headers: {
                'Authorization': document.cookie.split("=")[1]
            },
            body: formData
        });
        let data = await rawResponse.json();

        let [res3, filesData] = await requestWithAuth(navigate, `/api/files/get-info-per-post/${postNumber}`);
        setFiles(filesData);
    }

    let handleDelete = async (file_id) => {
        let [res, data] = await requestWithAuth(navigate, `/api/files/delete`,
            { id: file_id }
        );
        let [res3, filesData] = await requestWithAuth(navigate, `/api/files/get-info-per-post/${postNumber}`);
        setFiles(filesData);
    }

    return (
        <div className="main-container">
                { !isLoading ? 
                <div>
                    <div className="title-section">
                        <h1>{mode=="add"?"Post an Answer":"Edit Answer"}</h1>
                        <div className="title-section-side">
                            <div className="post-button">
                                <Button variant="contained" onClick={askQuestion}>{mode=="add"?"Post Answer":"Edit Answer"}</Button>
                            </div>
                        </div>
                    </div>
                    <Input
                        onChange={handleDescriptionChange}
                        ref={descRef}
                        error={""}
                        inputDetails={{
                            type: "textarea",
                            label: "Answer",
                            value: description,
                            width: "100%",
                            required: true,
                            minLength: 50,
                        }} />
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Upload File
                        <input
                            type="file"
                            hidden
                            onChange={handleFileUpload}
                        />

                    </Button>
                    <br />
                    <br />
                    <br />
                    <h1>Answer Preview </h1>
                    <div className="question-preview-container">
                        <br />
                        <ReactMarkdown
                            children={description}
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            children={String(children).replace(/\n$/, '')}
                                            style={materialLight}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        />
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}

                        />
                        <br />
                        <div class="files-container">
                            {files.map((file) => (
                                <div class="file-item" key={file.file_id}>
                                    <div class="file-item-header">
                                        <p>{file.file_name}</p>
                                        <IconButton color="error" onClick={() => handleDelete(file.file_id)} aria-label="delete" size="large">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                    <InsertDriveFileIcon style={{ fontSize: '50px' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                : <>loading..</>}
        </div>

    );
}

