import './Votes.css';
import React, { useEffect, useState, useRef, useContext } from 'react'
import { Button, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { request, requestWithAuth } from '../../lib/random_functions';
import { useNavigate } from 'react-router-dom';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import UserContext from '../../lib/usercontext';

export default function Votes(props) {

    const [votes, setVotes] = useState(0);

    let [upvotes, setUpvotes] = useState(0);
    let [downvotes, setDownvotes] = useState(0);

    const [user, setUser] = useContext(UserContext);
    const [currrentUserVote, setCurrentUserVote] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            let [res, data] = await request(`/api/votes/count/${props.postNumber}`);

            setVotes(Number(data.votes));

            setUpvotes(Number(data.upvotes));
            setDownvotes(Number(data.downvotes));

            console.log(data);

            if (user && user.type == "customer") {
                let [res2, data2] = await request(`/api/votes/get/${props.postNumber}`);
                setCurrentUserVote(data2.vote);
            }
        })();
    }, []);

    let upVote = async () => {
        let [res, data] = await requestWithAuth(navigate, `/api/votes/upvote/`,
            { post_id: props.postNumber }
        );

        [res, data] = await request(`/api/votes/count/${props.postNumber}`);
        setVotes(Number(data.votes));
        setUpvotes(Number(data.upvotes));
        setDownvotes(Number(data.downvotes));

        console.log(data);

        if (user && user.type == "customer") {
            let [res2, data2] = await request(`/api/votes/get/${props.postNumber}`);
            setCurrentUserVote(data2.vote);
        }
    }

    let downVote = async () => {
        let [res, data] = await requestWithAuth(navigate, `/api/votes/downvote/`,
            { post_id: props.postNumber }
        );

        [res, data] = await request(`/api/votes/count/${props.postNumber}`);
        setVotes(Number(data.votes));
        setUpvotes(Number(data.upvotes));
        setDownvotes(Number(data.downvotes));

        console.log(data);

        if (user && user.type == "customer") {
            let [res2, data2] = await request(`/api/votes/get/${props.postNumber}`);
            setCurrentUserVote(data2.vote);
        }
    }


    return (
        <div class="vote-container">

            <Button onClick={upVote} variant="outlined" color={currrentUserVote == 1 && currrentUserVote != 0 ? "green" : "grey"} endIcon={<ThumbUpIcon />}>
                {upvotes}
            </Button>
            <br/>

            {
                //<p className="votes-count">{votes}</p>
            }

            <Button onClick={downVote} variant="outlined" color={currrentUserVote == -1 && currrentUserVote != 0 ? "error" : "grey"} endIcon={<ThumbDownIcon />}>
                {downvotes}
            </Button>



        </div>
    );

}
