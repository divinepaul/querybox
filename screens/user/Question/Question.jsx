import React, { useEffect, useState, useRef, useContext } from 'react'
import '../Customer.css';
import './Question.css';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula, materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'
import { useParams, useNavigate } from 'react-router-dom';
import { requestWithAuth, request, formatDate } from '../../../lib/random_functions';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { Button, CircularProgress } from '@mui/material';
import FileView from '../../../components/File/File';
import Votes from '../../../components/Vote/Votes';
import Comments from '../../../components/Comment/Comment';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import Answer from '../../../components/Answer/Answer';
import UserBadge from '../../../components/UserBadge/UserBadge';
import UserContext from '../../../lib/usercontext';
import { Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import deepcopy from 'deepcopy';
import Modal from '../../../components/Modal/Modal';
import Form from '../../../components/Form/Form';

export default function Question() {
    const navigate = useNavigate();

    let ref = useRef();

    let addComplaintFormTemplate = {
        apiRoute: '/api/complaints/post',
        submitButtonText: "Submit",
        id: 0,
        inputs: {
            "reason": {
                type: "textarea",
                width: "100%",
                label: "Reason to report.",
                required: true,
                minLength: 5,
                maxLength: 100
            }
        }
    };

    let { postNumber } = useParams();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [files, setFiles] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addComplaintForm, setAddComplaintForm] = useState(addComplaintFormTemplate);

    const [user, setUser] = useContext(UserContext);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = (post_id) => {
        navigate(`/question/ask/${post_id}/edit`);
        setAnchorEl(null);
    };

    const handleDelete = async (post_id) => {
        console.log(post_id);
        let [res, data] = await requestWithAuth(navigate, "/api/answers/delete/", { id: post_id });
        setAnchorEl(null);
        navigate(`/questions`);
    };

    const handleReport = (post_id) => {
        setAnchorEl(null);
        let addFormCopy = deepcopy(addComplaintForm);
        addFormCopy.id = post_id;
        setAddComplaintForm(addFormCopy);
        setIsAddModalOpen(true);
    };

    const handleAdd = (values) => {
        setIsAddModalOpen(false);
        //navigate(`/answer/${post_id}/edit`);
        //setAnchorEl(null);
    };

    useEffect(() => {
        if (!postNumber) {
            navigate("/questions");
        }
        (async () => {
            let [res, data] = await request(`/api/questions/get/${postNumber}`);
            let [res2, answersData] = await request(`/api/answers/get-per-question/${data.question.question_id}`);
            let [res3, filesData] = await request(`/api/files/get-info-per-post/${postNumber}`);

            setQuestion(data.question);
            setAnswers(answersData);
            setFiles(filesData);
        })();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            (async () => {
                if (user && user.type == "customer") {
                    let [res, data] = await request(`/api/questions/get/${postNumber}`);
                    await requestWithAuth(navigate, `/api/questions/history/add/${data.question.question_id}`);
                }
            })();
        }, 2000);
    }, [user]);


    let submitAnswer = async () => {
        let [res, data] = await requestWithAuth(navigate, "/api/answers/new/", { question_id: question.question_id });
        if (res.status == 200) {
            navigate(`/answer/${data.post_id}/add`);
        }

        //else {
        //setSnackBarOpen(true);
        //}
    }

    return (
        <div className="main-container">
            {question ?
                <>
                    <div className="question-container">
                        <div className="post-sidebar">
                            <Votes postNumber={postNumber} />
                        </div>
                        <div className="question">
                            <div>
                                <div class="question-header">
                                    <h1>{question.question_title}</h1>
                                    <Button onClick={submitAnswer} variant="contained" startIcon={<QuestionAnswerIcon />}>
                                        Sumbit an Answer
                                    </Button>
                                </div>
                                <div class="question-info-container">
                                    <div style={{ display: 'flex' }}>
                                        <p><b>Category: </b>{question.category_name}</p>
                                        <p><b>Topic: </b>{question.topic_name}</p>
                                        <p><b>Viewed: </b>{question.view_count} views</p>
                                    </div>
                                    <>
                                        <IconButton
                                            aria-label="more"
                                            id="long-button"
                                            aria-controls={open ? 'long-menu' : undefined}
                                            aria-expanded={open ? 'true' : undefined}
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                        >

                                            {user && user.customer_id && user.customer_id == question.customer_id ?
                                                <>
                                                    <MenuItem onClick={() => { handleEdit(question.post_id) }}>Edit</MenuItem>
                                                    <MenuItem onClick={() => { handleDelete(question.post_id) }}>Delete</MenuItem>
                                                </>
                                                :
                                                <MenuItem onClick={() => { handleReport(question.post_id) }}>Report</MenuItem>
                                            }
                                        </Menu>
                                    </>
                                </div>
                                <hr />
                                <br />
                                <ReactMarkdown
                                    children={question.question_description}
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
                                {files.length ?
                                    <div>
                                        <br />
                                        <h4> Files attached with the question</h4>
                                        <br />
                                        <div class="files-container">
                                            {files.map((file) => (
                                                <FileView file={file} />
                                            ))}
                                        </div>
                                    </div>
                                    : <></>}
                            </div>
                            <div class="question-time-details">
                                <div class="time-details">
                                    <p><b>Date modified: </b>{formatDate(question.date_modified)}</p>
                                    <p><b>Date posted: </b>{formatDate(question.date_added)}</p>
                                </div>
                                <UserBadge
                                    name={question.customer_fname + " " + question.customer_lname}
                                    profession={question.customer_profession}
                                    education={question.customer_education}
                                />
                            </div>
                            <Comments postNumber={postNumber} />
                        </div>
                    </div>
                    <br />
                    <br />
                    <br />
                    {answers.length ?
                        <>
                            <h2>Answers</h2>
                            <br />
                            <br />
                            {answers.map((answer) => (
                                <Answer postNumber={answer.post_id} />
                            ))}
                        </>
                        :
                        <h2>No Answers yet.</h2>
                    }

                    <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(!isAddModalOpen) }} >
                        <div className="admin-modal">
                            <h1>Report this post</h1>
                            <p>If you found this post offensive or inappropriate to you, you can report it here. Also tell us ther reason why you are reporting this post.</p>
                            <br />
                            <br />

                            <Form ref={ref} formDetails={addComplaintForm} onResponse={handleAdd} />

                        </div>
                    </Modal>
                </>

                : <CircularProgress />}
        </div>
    );

}
