import './Comment.css';
import React, { useEffect, useState, useRef, useContext } from 'react'
import { formatDate, request, requestWithAuth } from '../../lib/random_functions';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CommentIcon from '@mui/icons-material/Comment';
import Modal from '../Modal/Modal';
import Form from '../Form/Form';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UserContext from '../../lib/usercontext';
import deepcopy from 'deepcopy';

export default function Comments(props) {

    const [comments, setComments] = useState([]);
    const [user, setUser] = useContext(UserContext);

    const navigate = useNavigate();
    let ref = useRef();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    let addCommentForm = {
        apiRoute: '/api/comments/post',
        submitButtonText: "Post Comment",
        id: props.postNumber,
        inputs: {
            "comment": {
                type: "textarea",
                width: "100%",
                label: "Comment",
                required: true,
                minLength: 5,
                maxLength: 200
            }
        }
    };

    let editCommentFormTemplate = {
        apiRoute: '/api/comments/edit',
        submitButtonText: "Edit Comment",
        inputs: {
            "comment": {
                type: "textarea",
                width: "100%",
                label: "Comment",
                required: true,
                minLength: 5,
                maxLength: 200
            }
        }
    };


    const [editCommentForm, setEditCommentForm] = useState(editCommentFormTemplate);

    useEffect(() => {
        (async () => {
            let [res, data] = await request(`/api/comments/all/${props.postNumber}`);
            setComments(data);
        })();
    }, []);

    let handleAdd = async (msg) => {
        setIsAddModalOpen(!isAddModalOpen);
        let [res, data] = await request(`/api/comments/all/${props.postNumber}`);
        setComments(data);
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const handleEdit = (comment_id,comment) => {
        let editFormCopy = deepcopy(editCommentForm);
        editFormCopy.inputs.comment["value"] = comment;
        editFormCopy.id = comment_id;

        setEditCommentForm(editFormCopy);
        setIsEditModalOpen(true);

        setAnchorEl(null);
    };
    const handleDelete = async (comment_id) => {
        await requestWithAuth(navigate,'/api/comments/delete',{id: comment_id})
        let [res, data] = await request(`/api/comments/all/${props.postNumber}`);
        setComments(data);
        setAnchorEl(null);
    };

    let onEditSubmit = async (msg) => {
        setIsEditModalOpen(false);
        let [res, data] = await request(`/api/comments/all/${props.postNumber}`);
        setComments(data);
    }

    return (
        <div class="comments-container">
            <div class="comment-header">
                {comments.length ?
                    <h3>Comments</h3> : <h4>No Comments</h4>
                }
                <Button onClick={() => setIsAddModalOpen(true)} variant="outlined" startIcon={<CommentIcon />}>
                    Comment
                </Button>
            </div>

            {comments.length ?
                <>
                    {comments.map((comment) => (
                        <div class="comment">
                            <p>{comment.comment}</p>
                            <div style={{ display: 'flex' }}>
                                <div>
                                    <p>{comment.customer_fname} {comment.customer_lname}</p>
                                    <p className="comment-date">{formatDate(comment.date_added)}</p>
                                </div>
                                {user && user.customer_id && user.customer_id == comment.customer_id ?
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
                                            <MenuItem onClick={()=>{handleEdit(comment.comment_id,comment.comment)}}>Edit</MenuItem>
                                            <MenuItem onClick={()=>{handleDelete(comment.comment_id)}}>Delete</MenuItem>
                                        </Menu>
                                    </>
                                    : <></>}
                            </div>
                        </div>
                    ))}
                </>
                : <></>}

            <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(!isAddModalOpen) }} >
                <div className="admin-modal">
                    <h1>Post Comment</h1>
                    <Form ref={ref} formDetails={addCommentForm} onResponse={handleAdd} />
                </div>
            </Modal>
            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(!isEditModalOpen) }} >
                <div className="admin-modal">
                    <h1>Post Comment</h1>
                    <Form ref={ref} formDetails={editCommentForm} onResponse={onEditSubmit} />
                </div>
            </Modal>
        </div>
    );

}
