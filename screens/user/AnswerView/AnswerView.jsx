import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Answer from '../../../components/Answer/Answer';
import { request } from '../../../lib/random_functions';

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula, materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'
import FileView from '../../../components/File/File';

export default function AnswerView() {

    const navigate = useNavigate();
    let { postNumber } = useParams();

    const [answer, setAnswer] = useState(null);
    const [files, setFiles] = useState(null);

    useEffect(() => {
        (async () => {
            let [res, data] = await request(`/api/answers/get/${postNumber}`);
            let [res3, filesData] = await request(`/api/files/get-info-per-post/${postNumber}`);
            setAnswer(data);
            setFiles(filesData);
        })();
    }, []);


    return (
        <div className="main-container">
            {answer != null &&
                <>
                    <h1>Answer Details</h1>
                    <h2>Question Title: {answer.question_title}</h2>
                    <ReactMarkdown
                        children={answer.question_description}
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
                    <hr />
                    <br />
                    <br />
                    <Answer postNumber={postNumber} />

                </>
            }
        </div >
    );
}
