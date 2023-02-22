import Form from "../../components/Form/Form";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestWithAuth,formatDate } from "../../lib/random_functions";
import UserContext from "../../lib/usercontext";
import './Admin.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../../components/Modal/Modal";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import deepcopy from "deepcopy";

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula, materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'

let addCategoryForm = {
    apiRoute: '/api/admin/category/add',
    submitButtonText: "Add Category",
    inputs: {
        "category_name": {
            type: "text",
            label: "Category Name",
            required: true,
            minLength: 5,
            maxLength: 30,
        },
        "category_description": {
            type: "textarea",
            width: "500px",
            label: "Category Description",
            required: true,
            minLength: 5,
        }
    }
};

export default function AdminAnswers() {

    const navigate = useNavigate();
    let ref = useRef();

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    let tableHeadersData = [
        { label: "Id", name: "answer_id", selected: true },
        { label: "Question Title", name: "question_title", selected: true },
        { label: "Answer", name: "answer_content", selected: true },
        { label: "Customer Name", name: "full_name", selected: true },
        { label: "Date Added", name: "date_added", selected: false },
        { label: "Status", name: "status", selected: true }
    ];

    const [data, setData] = useState(null);

    const [tableHeaders, setTableHeaders] = useState(tableHeadersData);
    const [editForm, setEditForm] = useState({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState('answer_id');
    const [searchBy, setSearchBy] = useState('');

    //const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        (async () => {
            let feilds = getCurrentFeilds();
            let [res, data] = await requestWithAuth(navigate, "/api/admin/answers/",
                { feilds, sortBy, searchBy });
            setData([...data]);
        })();

    }, [tableHeaders, sortBy, searchBy, isAddModalOpen, isEditModalOpen])

    const changeSortBy = (event) => {
        setSortBy(event.target.value);
    };

    const handleChange = (event) => {
        let tableHeadersCopy = JSON.parse(JSON.stringify(tableHeaders));

        if (!event.target.value.length) {
            return;
        }

        for (let i = 0; i < tableHeaders.length; i++) {
            tableHeadersCopy[i].selected = false;
        }
        event.target.value.forEach(feild => {
            for (let i = 0; i < tableHeaders.length; i++) {
                if (tableHeaders[i].label == feild) {
                    tableHeadersCopy[i].selected = true;
                }

            }
        });
        setTableHeaders(tableHeadersCopy);
    };

    let returnValues = (headers) => {
        let values = [];
        headers.forEach(header => {
            if (header.selected) {
                values.push(header.label);
            }
        });
        return values;
    }

    let getCurrentFeilds = () => {
        let fields = [];
        tableHeaders.forEach(header => {
            if (header.selected) {
                fields.push(header.name);
            }
        });
        return fields;
    }

    let handleAdd = (_) => {
        setIsAddModalOpen(!isAddModalOpen);
    }

    let onEdit = (values) => {
        setIsEditModalOpen(false);
    }

    let handleEdit = async (id) => {
        let [res, resdata] = await requestWithAuth(navigate, "/api/admin/category/get", { id });
        let editFormCopy = deepcopy(addCategoryForm);
        Object.keys(resdata).map(key => {
            if (editFormCopy.inputs[key] && !["password", "confirm_password"].includes(key)) {
                editFormCopy.inputs[key]["value"] = resdata[key];
            }
        });
        editFormCopy.apiRoute = "/api/admin/category/edit";
        editFormCopy.submitButtonText = "Update";
        editFormCopy.id = id;
        setEditForm(editFormCopy);
        setIsEditModalOpen(true);
    }

    let handleDelete = async (id) => {

        await requestWithAuth(navigate, "/api/admin/category/delete", { id });

        let dataCopy = deepcopy(data);
        for (let i = 0; i < dataCopy.length; i++) {
            if (dataCopy[i].category_id == id) {
                dataCopy[i].status = !dataCopy[i].status
            }
        }
        setData(dataCopy);
    }

    let isFieldActive = (field) => {
        let isSelected = true;
        tableHeaders.forEach(header => {
            if (field == header.name) {
                isSelected = header.selected;
            }
        })
        return isSelected;
    }

    let printPDF = async () => {
        let body = {
            title: "Answers",
            tableHeaders: tableHeaders,
            searchBy: searchBy,
            sortBy: sortBy
        };

        let res = await fetch("/api/admin/answers/print", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': document.cookie.split("=")[1]
            },
            body: JSON.stringify(body)
        });
        let blob = await res.blob();
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "report.pdf";
        document.body.appendChild(a); 
        a.click();    
        a.remove();  
    }

    return (
        <div className="admin-main-container">

            <div className="admin-header-container">
                <h1 className="admin-main-title">Answers</h1>
                <Button variant="contained" onClick={() => printPDF()}>Print</Button>
            </div>

            <div className="data-control-container">

                <FormControl sx={{ width: 300 }}>
                    <InputLabel id="demo-multiple-checkbox-label">Selected Fields</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        onChange={handleChange}
                        value={returnValues(tableHeaders)}
                        input={<OutlinedInput label="Selected Fields" />}
                        renderValue={(selected) => selected.join(' | ')}
                        MenuProps={MenuProps}
                    >
                        {tableHeaders.map((feild, i) => (
                            <MenuItem key={feild.name} value={feild.label}>
                                <Checkbox checked={tableHeaders[i].selected} />
                                <ListItemText primary={feild.label} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField sx={{ m: 1 }} value={searchBy} onChange={(event) => setSearchBy(event.target.value)} fullWidth label="Search" id="fullWidth" />


                <FormControl style={{ width: '200px' }}>
                    <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sortBy}
                        onChange={changeSortBy}
                        label="Sort By"
                    >
                        {tableHeaders.map((feild, i) => (
                            <MenuItem key={i} value={feild.name}>{feild.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </div>

            <AnimatePresence>
                {data &&
                    <div style={{ overflowX: "auto" }}>
                        <table>
                            <thead>
                                <tr>
                                    {
                                        returnValues(tableHeaders).map(headerLabel => {
                                            return <th key={headerLabel}>
                                                {headerLabel}
                                            </th>;

                                        })}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, i) => {
                                    return (
                                        <motion.tr
                                            key={i.toString()}
                                            className={item['status'] == "published" ? "active-tr" : "inactive-tr"}
                                            initial={{ opacity: 0, translateY: -10 }}
                                            animate={{ opacity: 1, translateY: 0 }}
                                            exit={{ opacity: 0, translateX: -50 }}
                                            transition={{ duration: 0.3, delay: i * 0.1 }}
                                        >

                                            {isFieldActive('answer_id') && <td>{item['answer_id']}</td>}
                                            {isFieldActive('question_title') && <td>{item['question_title']}</td>}
                                            {isFieldActive('answer_content') && <td>
                                                <ReactMarkdown
                                                    children={item['answer_content']}
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
                                                /></td>

                                            }
                                            {isFieldActive('full_name') && <td>{item['full_name']}</td>}
                                            {isFieldActive('date_added') && <td>{formatDate(item['date_added'])}</td>}
                                            {isFieldActive('status') && <td>{item['status']}</td>}

                                        </motion.tr>
                                    );

                                })
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </AnimatePresence>

            <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(!isAddModalOpen) }} >
                <div className="admin-modal">
                    <h1>Add Category </h1>
                    <Form ref={ref} formDetails={addCategoryForm} onResponse={handleAdd} />
                </div>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(!isEditModalOpen) }} >
                <div className="admin-modal">
                    <h1>Edit Category</h1>
                    <Form ref={ref} formDetails={editForm} onResponse={onEdit} />
                </div>
            </Modal>

        </div>
    );
}
