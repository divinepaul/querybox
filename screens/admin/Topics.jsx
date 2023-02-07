import Form from "../../components/Form/Form";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestWithAuth } from "../../lib/random_functions";
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

let addTopicForm = {
    apiRoute: '/api/admin/topics/add',
    submitButtonText: "Add Topic",
    inputs: {
        "category_id": {
            type: "select",
            label: "Category",
            value: "in",
            required: true,
            minLength: 5,
            maxLength: 50,
        },
        "topic_name": {
            type: "text",
            label: "Topic Name",
            required: true,
            minLength: 3,
            maxLength: 30,
        },
        "topic_description": {
            type: "textarea",
            width: "500px",
            label: "Topic Description",
            required: true,
            minLength: 5,
        }
    }
};

export default function AdminTopics() {

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
        { label: "Id", name: "topic_id", selected: true },
        { label: "Category", name: "category_name", selected: true },
        { label: "Topic Name", name: "topic_name", selected: true },
        { label: "Topic Description", name: "topic_description", selected: true },
        { label: "Date Added", name: "date_added", selected: false },
        { label: "Status", name: "status", selected: true }
    ];

    const [data, setData] = useState(null);

    const [tableHeaders, setTableHeaders] = useState(tableHeadersData);
    const [editForm, setEditForm] = useState({});
    const [addForm, setAddForm] = useState({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState('topic_id');
    const [searchBy, setSearchBy] = useState('');

    //const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        (async () => {
            let feilds = getCurrentFeilds();
            let [res, data] = await requestWithAuth(navigate, "/api/admin/topics/",
                { feilds, sortBy, searchBy });
            console.log(data);
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


        let [res, resdata] = await requestWithAuth(navigate, "/api/admin/topics/get", { id });
        let [res2, categories] = await requestWithAuth(navigate, "/api/admin/category", { feilds: ["category_id","category_name"], sortBy: "category_name", searchBy: '' });
        let editFormCopy = deepcopy(addTopicForm);
        let selectValues = categories.map(category => { return {value: category.category_id, label: category.category_name } });

        editFormCopy.inputs.category_id["selectValues"] = selectValues;
        editFormCopy.inputs.category_id["value"] = selectValues[0]['value'];

        Object.keys(resdata).map(key => {
            if (editFormCopy.inputs[key] && !["password", "confirm_password"].includes(key)) {
                editFormCopy.inputs[key]["value"] = resdata[key];
            }
        });

        editFormCopy.apiRoute = "/api/admin/topics/edit";
        editFormCopy.submitButtonText = "Update";
        editFormCopy.id = id;
        setEditForm(editFormCopy);
        setIsEditModalOpen(true);
    }

    let readyAdd = async (id) => {
        let [res, categories] = await requestWithAuth(navigate, "/api/admin/category", { feilds: ["category_id","category_name"], sortBy: "category_name", searchBy: '' });
        let selectValues = categories.map(category => { return {value: category.category_id, label: category.category_name } });
        //let tmpAddTopicForm = deepcopy(addTopicForm);
        addTopicForm.inputs.category_id["selectValues"] = selectValues;
        addTopicForm.inputs.category_id["value"] = selectValues[0]['value'];
        setAddForm(addTopicForm);
        setIsAddModalOpen(true);
    }

    let handleDelete = async (id) => {

        await requestWithAuth(navigate, "/api/admin/topics/delete", { id });

        let dataCopy = deepcopy(data);
        for (let i = 0; i < dataCopy.length; i++) {
            if (dataCopy[i].topic_id == id) {
                dataCopy[i].status = !dataCopy[i].status
            }
        }
        setData(dataCopy);
    }

    return (
        <div className="admin-main-container">

            <div className="admin-header-container">
                <h1 className="admin-main-title">Topics</h1>
                <Button variant="contained" onClick={() => readyAdd()}>Add Topic</Button>
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
                    <div style={{overflowX: "auto"}}>
                    <table>
                        <thead>
                            <tr>
                                {
                                    returnValues(tableHeaders).map(headerLabel => {
                                        return <th key={headerLabel}>
                                            {headerLabel}
                                        </th>;

                                    })}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, i) => {
                                return (
                                    <motion.tr
                                        key={i.toString()}
                                        className={item['status'] ? "active-tr" : "inactive-tr"}
                                        initial={{ opacity: 0, translateY: -10 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        exit={{ opacity: 0, translateX: -50 }}
                                        transition={{ duration: 0.3, delay: i * 0.1 }}
                                    >
                                        {Object.keys(item).map((key, j) => {
                                            let feilds = getCurrentFeilds();
                                            if (feilds.includes(key)) {
                                                return <motion.td
                                                >
                                                    {key != "status" ?
                                                        item[key].toString()
                                                        :
                                                        item[key] ?
                                                            "active" : "inactive"
                                                    }
                                                </motion.td>
                                            }
                                        })}
                                        <td style={{ display: 'flex' }}>
                                            <Switch checked={item['status']} onChange={() => { handleDelete(item["topic_id"]) }} />
                                            <IconButton aria-label="edit" onClick={() => handleEdit(item["topic_id"])} >
                                                <EditIcon />
                                            </IconButton>
                                        </td>

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
                    <h1>Add Topic </h1>
                    <Form ref={ref} formDetails={addForm} onResponse={handleAdd} />
                </div>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(!isEditModalOpen) }} >
                <div className="admin-modal">
                    <h1>Edit Topic</h1>
                    <Form ref={ref} formDetails={editForm} onResponse={onEdit} />
                </div>
            </Modal>

        </div>
    );
}
