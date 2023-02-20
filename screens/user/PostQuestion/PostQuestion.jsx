import React, { useEffect, useState, useRef } from 'react'
import Input from '../../../components/Input/Input';
import '../Customer.css';
import Button from '@mui/material/Button';
import './PostQuestion.css';
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

export default function PostQuestion() {


    const navigate = useNavigate();
    let { postNumber, mode } = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const titleRef = useRef();
    const descRef = useRef();

    const [topics, setTopics] = useState([]);
    const [topic, setTopic] = useState(1);
    const [isLoading, setisLoading] = useState(true);

    const [files, setFiles] = useState([]);

    let handleTitleChange = (valueObject) => {
        setTitle(valueObject.value);
    }
    let handleTopicChange = (valueObject) => {
        setTopic(valueObject.value);
    }
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
            [res, data] = await requestWithAuth(navigate, `/api/questions/get/${postNumber}`);

            let [res2, topicsData] = await requestWithAuth(navigate, `/api/questions/topics`);

            let [res3, filesData] = await requestWithAuth(navigate, `/api/files/get-info-per-post/${postNumber}`);

            setFiles(filesData);
            setTopics(topicsData.topics);

        })().then(() => {
            setTitle(data.question.question_title);
            setTopic(data.question.topic_id);
            setDescription(data.question.question_description);
            setisLoading(false);
        });
    }, []);


    useEffect(() => {
        (async () => {
        if (titleRef.current && descRef.current) {
            if (!titleRef.current.validateInput() && !descRef.current.validateInput()) {
                await requestWithAuth(navigate, `/api/questions/update/`, {
                    post_id: postNumber,
                    question_title: title,
                    question_description: description,
                    topic_id: topic
                })
            }
        }
        })();
    }, [title, description, topic])

    let askQuestion = async () => {
        if (titleRef.current && descRef.current) {
            if (!titleRef.current.validateInput() && !descRef.current.validateInput()) {
                let [res,data] = await requestWithAuth(navigate, `/api/questions/publish/`, {
                    post_id: postNumber,
                    question_title: title,
                    question_description: description,
                    topic_id: topic
                })
                if(res.status == 200){
                    navigate(`/question/${postNumber}`);
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
                        <h1>{mode=="add" ? "Post a Question": "Edit Question" }</h1>
                        <div className="title-section-side">
                            <Input
                                onChange={handleTopicChange}
                                ref={titleRef}
                                value={topic}
                                error={""}
                                inputDetails={{
                                    type: "select",
                                    label: "Question Topic",
                                    selectValues: topics,
                                    value: topic,
                                }} />
                            <div className="post-button">
                                <Button variant="contained" onClick={askQuestion}>{mode=="add" ? "POST": "Edit" }</Button>
                            </div>
                        </div>
                    </div>
                    <Input
                        onChange={handleTitleChange}
                        value={title}
                        ref={descRef}
                        error={""}
                        inputDetails={{
                            type: "text",
                            label: "Question Title",
                            width: "100%",
                            value: title,
                            required: true,
                            minLength: 5,
                            maxLength: 100,
                        }} />
                    <Input
                        onChange={handleDescriptionChange}
                        error={""}
                        inputDetails={{
                            type: "textarea",
                            label: "Question Details",
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
                    <h1>Question Preview </h1>
                    <div className="question-preview-container">
                        <h2>{title ? title : "Question Title"}</h2>
                        <br />
                        <br />
                        <ReactMarkdown
                            children={description ? description : "Question Description" }
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
: <p>loading..</p>}
        </div>

    );
}

