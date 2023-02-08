import React, { useEffect, useState } from 'react'
import Input from '../../../components/Input/Input';
import '../Customer.css';
import './PostQuestion.module.css';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula,materialDark,materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'

export default function PostQuestion() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(`Enter your Question Details here

Describe your question in the best way possible to get the best answers.
`);
    let handleTitleChange = (valueObject) => {
        setTitle(valueObject.value);
    }

    let handleDescriptionChange = (valueObject) => {
        setDescription(valueObject.value);
    }
    return (
        <div className="main-container">
            <h1>Post a Question</h1>
            <Input
                onChange={handleTitleChange}
                value={title}
                error={""}
                inputDetails={{
                    type: "text",
                    label: "Question Title",
                    width: "100%",
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
            <h1>Question Preview </h1>
            <div className="question-preview-container">
                <h2>{title ? title : "Question Title"}</h2>
                <br/>
                <br/>
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
            </div>
        </div>

    );
}

