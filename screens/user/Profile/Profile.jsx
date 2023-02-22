import '../Customer.css';
import './Profile.css';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../../lib/usercontext';
import { requestWithAuth } from '../../../lib/random_functions';
import { useNavigate } from 'react-router-dom';

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula, materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'

function TabPanel(props) {

    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div style={{
                    padding: '20px',
                }}>{children}</div>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

//<Tab label="Liked Questions" {...a11yProps(2)} />
//<Tab label="DisLiked Questions" {...a11yProps(3)} />
//<Tab label="Liked Answers" {...a11yProps(4)} />
//<Tab label="DisLiked Answers" {...a11yProps(5)} />
export default function UserProfile() {

    const [value, setValue] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [drafts, setDrafts] = useState([]);
    const [viewed, setViewed] = useState([]);
    const [answers, setAnswers] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [user, setUser] = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            let [res, data] = await requestWithAuth(navigate, "/api/profile/user-questions");
            setQuestions(data);
            [res, data] = await requestWithAuth(navigate, "/api/profile/draft-questions");
            setDrafts(data);
            [res, data] = await requestWithAuth(navigate, "/api/profile/viewed-questions");
            setViewed(data);
            [res, data] = await requestWithAuth(navigate, "/api/profile/answers-posted");
            setAnswers(data);
        })();
    }, []);

    let openQuestion = async (id) => {
        navigate(`/question/${id}`);
    }
    let openDraftQuestion = async (id) => {
        navigate(`/question/ask/${id}/add`);
    }

    return (
        <div className="main-container">
            <h1>User Profile</h1>
            <div>
                <h3>{user.customer_fname} {user.customer_lname}</h3>
                <p><b>Profession:</b> {user.customer_profession}</p>
                <p><b>Education:</b> {user.customer_education}</p>
                <br />
            </div>
            <Tabs
                variant="scrollable"
                scrollButtons="auto"
                value={value} onChange={handleChange} aria-label="basic tabs example">

                <Tab label="Asked Questions" {...a11yProps(0)} />
                <Tab label="Draft Questions" {...a11yProps(1)} />
                <Tab label="Answers Posted" {...a11yProps(2)} />
                <Tab label="Questions Viewed" {...a11yProps(3)} />
            </Tabs>

            <TabPanel value={value} index={0} >
                <h2>Asked Questions</h2>
                <br />
                {questions.length ?
                    questions.map((question) => (
                        <div className="question-list-item" onClick={() => openQuestion(question.post_id)}>
                            <h3>{question.question_title}</h3>
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
                        </div>
                    )) : <p>No questions posted yet!</p>}
            </TabPanel>

            <TabPanel value={value} index={1}>
                <h2>Draft Questions</h2>
                <br />
                {drafts.length ?
                    drafts.map((question) => (
                        <div className="question-list-item" onClick={() => openDraftQuestion(question.post_id)}>
                            <h3>{question.question_title}</h3>
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
                        </div>
                    )) : <p>No draft questions found!</p>}
            </TabPanel>



            <TabPanel value={value} index={2}>
                <h2>Answers Posted</h2>
                <br />
                {answers.length ?
                    answers.map((question) => (
                        <div className="question-list-item" onClick={() => openQuestion(question.post_id)}>
                            <p><b>Question:</b>{question.question_title}</p>
                            <p><b>Answer:</b>{question.answer_content}</p>
                        </div>
                    )) : <p>No answers posted yet!</p>}
            </TabPanel>







            <TabPanel value={value} index={3}>
                <h2>Questions Viewed</h2>
                <br />
                {viewed.length ?
                    viewed.map((question) => (
                        <div className="question-list-item" onClick={() => openQuestion(question.post_id)}>
                            <h3>{question.question_title}</h3>
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
                        </div>
                    )) : <p>No questions viewed yet!</p>}
            </TabPanel>


        </div>
    );
}
