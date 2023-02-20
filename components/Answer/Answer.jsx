import React, { useEffect, useContext, useState, useRef } from 'react'
import './Answer.css';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula, materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'
import { useParams, useNavigate } from 'react-router-dom';
import { requestWithAuth, request, formatDate } from '../../lib/random_functions';
import { Button, CircularProgress } from '@mui/material';
import FileView from '../../components/File/File';
import Votes from '../../components/Vote/Votes';
import Comments from '../../components/Comment/Comment';
import UserBadge from '../UserBadge/UserBadge';
import UserContext from '../../lib/usercontext';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import deepcopy from 'deepcopy';
import Modal from '../Modal/Modal';
import Form from '../Form/Form';

export default function Answer(props) {

    const navigate = useNavigate();
    let ref = useRef();

    let addComplaintFormTemplate = {
        apiRoute: '/api/complaints/post',
        submitButtonText: "Submit",
        id: props.postNumber,
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

    const [answer, setAnswer] = useState(null);
    const [files, setFiles] = useState(null);

    const [user, setUser] = useContext(UserContext);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addComplaintForm, setAddComplaintForm] = useState(addComplaintFormTemplate);

    useEffect(() => {
        (async () => {
            let [res, data] = await request(`/api/answers/get/${props.postNumber}`);
            let [res3, filesData] = await request(`/api/files/get-info-per-post/${props.postNumber}`);
            setAnswer(data);
            console.log(data);
            setFiles(filesData);
        })();
    }, []);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = (post_id) => {
        navigate(`/answer/${post_id}/edit`);
        setAnchorEl(null);
    };

    const handleDelete = async (post_id) => {
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

    return (
        <>
            {answer ?
                <>
                    <div className="question-container answer">
                        <div className="post-sidebar">
                            <Votes postNumber={props.postNumber} />
                        </div>
                        <div className="question">
                            <div>
                                <br />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
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
                                            {user && user.customer_id && user.customer_id == answer.customer_id ?
                                                <>
                                                    <MenuItem onClick={() => { handleEdit(answer.post_id) }}>Edit</MenuItem>
                                                    <MenuItem onClick={() => { handleDelete(answer.post_id) }}>Delete</MenuItem>
                                                </>
                                                :
                                                <MenuItem onClick={() => { handleReport(answer.post_id) }}>Report</MenuItem>
                                            }
                                        </Menu>
                                    </>
                                </div>
                                <ReactMarkdown
                                    children={answer.answer_content}
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
                                        <h4> Files attached with the answer</h4>
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
                                    <p><b>Date modified: </b>{formatDate(answer.date_modified)}</p>
                                    <p><b>Date posted: </b>{formatDate(answer.date_added)}</p>
                                </div>
                                <UserBadge
                                    name={answer.customer_fname + " " + answer.customer_lname}
                                    profession={answer.customer_profession}
                                    education={answer.customer_education}
                                />
                            </div>
                            <Comments postNumber={props.postNumber} />
                        </div>
                    </div>
                    <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(!isAddModalOpen) }} >
                        <div className="admin-modal">
                            <h1>Report this post</h1>
                            <p>If you found this post offensive or inappropriate to you, you can report it here. Also tell us ther reason why you are reporting this post.</p>
                            <br/>
                            <br/>

                            <Form ref={ref} formDetails={addComplaintForm} onResponse={handleAdd} />

                        </div>
                    </Modal>
                </>

                : <CircularProgress />}
        </>
    );


}
