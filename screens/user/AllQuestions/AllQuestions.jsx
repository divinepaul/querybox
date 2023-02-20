import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import '../Customer.css';
import './AllQuestions.css';
import Snackbar from '@mui/material/Snackbar';
import { requestWithAuth, request } from "../../../lib/random_functions";
import SearchContext from '../../../lib/searchcontext';

import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AllQuestions() {

    const navigate = useNavigate();

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [questions, setQuestions] = useState([]);

    const [search, setSearch] = useContext(SearchContext);


    useEffect(() => {
        (async () => {
            let [res, data] = await request("/api/questions/", {
                searchBy: search,
                feilds: ["question_title", "question_description", "category_name", "topic_name"]
            });
            console.log(data);
            setQuestions(data);
        })();
    }, [search]);

    let openQuestion = async (id) => {
        navigate(`/question/${id}`);
    }

    let askQuestion = async () => {
        let [res, data] = await requestWithAuth(navigate, "/api/questions/new/");
        if (res.status == 200) {
            navigate(`/question/ask/${data.post_id}/add`);
        } else {
            setSnackBarOpen(true);
        }
    }

    return (
        <div className="main-container">
            <div className="questions-header">
                <h1>All Questions</h1>
                <Button variant="contained" onClick={askQuestion}> Post new Question</Button>
            </div>

            <div className="questions-list-container">
                {questions.length ?
                    <>
                        {questions.map((question) => {
                                return <>

                                {question.status == "published" ?
                                    <div onClick={() => openQuestion(question.post_id)} className="question-list-item">
                                        <h2>{question.question_title}</h2>
                                        <p>{question.question_description}</p>
                                    </div>
                                    : <></>}
                                </>
                        })}
                    </>
                    : <p>No Questions Found!</p>}

            </div>


            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "center" }} open={snackBarOpen} autoHideDuration={2000} onClose={() => setSnackBarOpen(!snackBarOpen)}>
                <Alert onClose={() => setSnackBarOpen(!snackBarOpen)} severity="error" sx={{ width: '100%' }}>
                    Failed to Create New Question.
                </Alert>
            </Snackbar>
        </div>
    );
}
