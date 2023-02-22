import '../Customer.css';
import { requestWithAuth } from '../../../lib/random_functions';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import './Topics.css';
import { CircularProgress } from '@mui/material';
import SearchContext from '../../../lib/searchcontext';

export default function UserTopics() {
    const [topics, setTopics] = useState([]);

    const [search, setSearch] = useContext(SearchContext);

    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            let [res, data] = await requestWithAuth(navigate, "/api/profile/topics");
            console.log(data);
            setTopics([...data]);
        })();
    }, []);

    const navigateToTopic = async (topicName) => {
        setSearch(topicName);
        navigate("/questions");
    }

    return (
        <div className="topics-main-container">
            <h1>Topics</h1>
            {topics.length > 0 ?
                <div className="topics-container">
                    {topics.map((topic) => (
                        <div className="topic-item" onClick={()=>{navigateToTopic(topic.topic_name)}}>
                            <h2>{topic.topic_name}</h2>
                            <h4>{topic.category_name}</h4>
                            <br/>
                            <p>{topic.topic_description}</p>
                        </div>
                    ))
                    }
                </div>
                :
                <CircularProgress />
            }
        </div>
    );
}
