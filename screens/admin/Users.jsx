//import { useEffect, useRef } from "react";
//import { Link } from "react-router-dom";
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

//async function getData(){
//let res = await fetch("/api/hello");
//let obj = await res.json();
//}


let adminUserAddForm = {
    apiRoute: '/api/admin/users/add',
    submitButtonText: "Add",
    inputs: {
        "email": {
            type: "email",
            label: "Email",
            required: true,
            minLength: 5,
            maxLength: 50,
        },
        "password": {
            type: "password",
            label: "Password",
            group: "row3",
            required: true,
            minLength: 5,
            maxLength: 50,
        },
        "confirm_password": {
            type: "password",
            label: "Confirm Password",
            group: "row3",
            required: true,
            minLength: 5,
            maxLength: 50,
        },
    }
};

let adminUserEditForm = {
    apiRoute: '/api/admin/users/add',
    submitButtonText: "Add",
    inputs: {
        "email": {
            type: "email",
            label: "Email",
            required: true,
            minLength: 5,
            maxLength: 50,
        },
        "password": {
            type: "password",
            label: "Password",
            group: "row3",
            required: true,
            minLength: 5,
            maxLength: 50,
        },
    }
};

export default function AdminUsers() {

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
        { label: "Email", name: "email", selected: true },
        { label: "Password", name: "password", selected: true },
        { label: "Type", name: "type", selected: true },
        { label: "Status", name: "status", selected: true }
    ];

    const [data, setData] = useState(null);

    const [tableHeaders, setTableHeaders] = useState(tableHeadersData);
    const [editForm,setEditForm] = useState(adminUserEditForm);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState('type');
    const [searchBy, setSearchBy] = useState('');

    //const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        (async () => {
            let feilds = getCurrentFeilds();
            let [res, data] = await requestWithAuth(navigate, "/api/admin/users/",
                { feilds, sortBy, searchBy });


            setData([...data]);
        })();

    }, [tableHeaders, sortBy, searchBy,isAddModalOpen])

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
        console.log('onResponse', values)
    }

    let handleEdit = async (id) => {

        let [res, data] = await requestWithAuth(navigate, "/api/admin/users/get",{id});
        let editFormCopy = deepcopy(editForm);

        Object.keys(data).map(key=>{
            editFormCopy.inputs[key]["value"] = data[key];
        });
        setEditForm(editFormCopy);
    }

    let handleDelete = async (id) => {
        await requestWithAuth(navigate, "/api/admin/users/delete",{id});

        let dataCopy = deepcopy(data);

        for (let i = 0; i < dataCopy.length; i++) {
            if(dataCopy[i].email == id){
                dataCopy[i].status = !dataCopy[i].status
            }
        }
        setData(dataCopy);
        //let feilds = getCurrentFeilds();
        //let [res, data] = await requestWithAuth(navigate, "/api/admin/users/",
            //{ feilds, sortBy, searchBy });

        //setData([...data]);
    }

    return (
        <div className="admin-main-container">

            <div className="admin-header-container">
                <h1 className="admin-main-title">Users</h1>
                <Button variant="contained" onClick={() => setIsAddModalOpen(!isAddModalOpen)}>Add Admin</Button>
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
                                        className={item['status']? "active-tr": "inactive-tr"}
                                        initial={{ opacity: 0, translateY: -10 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        exit={{ opacity: 0, translateX: -50 }}
                                        transition={{ duration: 0.3, delay: i * 0.1 }}
                                    >
                                        {Object.keys(item).map((key, j) => {
                                            let feilds = getCurrentFeilds();
                                            if (feilds.includes(key)) {
                                                return <td
                                                    key={i.toString() + j.toString()}
                                                >
                                                    {key != "status" ?
                                                        item[key].toString()
                                                        :
                                                        item[key] ?
                                                            "active" : "inactive"
                                                    }
                                                </td>
                                            }
                                        })}
                                        <td>
                                          <Switch checked={item['status']} onChange={()=>{handleDelete(item["email"])}} />
                                        </td>
                                    </motion.tr>
                            );

                        })
                        }
                    </tbody>
                </table>
            }
            </AnimatePresence>

            <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(!isAddModalOpen) }} >
                <div className="admin-modal">
                    <h1>Add Admin User</h1>
                    <Form ref={ref} formDetails={adminUserAddForm} onResponse={handleAdd} />
                </div>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(!isEditModalOpen) }} >
                <div className="admin-modal">
                    <h1>Add Admin User</h1>
                    <Form ref={ref} formDetails={editForm} onResponse={onEdit} />
                </div>
            </Modal>

        </div>
    );
}
