import Form from "../../components/Form/Form";

import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, requestWithAuth } from "../../lib/random_functions";
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
import { countryList, countryListShort } from "../../lib/constants";



let addStaffForm = {
    apiRoute: '/api/admin/staff/add',
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
        "staff_fname": {
            type: "text",
            group: "row1",
            label: "First Name",
            required: true,
            minLength: 5,
            maxLength: 15,
        },
        "staff_lname": {
            type: "text",
            group: "row1",
            label: "Last Name",
            required: true,
            minLength: 2,
            maxLength: 15,
        },
        "staff_house_name": {
            type: "text",
            label: "House Name",
            group: "row2",
            required: true,
            minLength: 2,
            maxLength: 20,
        },
        "staff_street": {
            type: "text",
            label: "Street",
            group: "row2",
            required: true,
            minLength: 5,
            maxLength: 20,
        },
        "staff_city": {
            type: "text",
            label: "City",
            group: "row5",
            required: true,
            minLength: 2,
            maxLength: 20,
        },
        "staff_state": {
            type: "text",
            label: "State",
            group: "row5",
            required: true,
            minLength: 5,
            maxLength: 20,
        },
        "staff_pincode": {
            type: "text",
            label: "Pincode",
            datatype: "number",
            group: "row6",
            required: true,
            minLength: 6,
            maxLength: 7,
        },
        "staff_country": {
            type: "select",
            label: "Country",
            value: "in",
            group: "row6",
            selectValues: countryList,
            required: true,
        },
        "staff_phone": {
            type: "text",
            datatype: "number",
            label: "Phone",
            group: "row7",
            required: true,
            minLength: 8,
            maxLength: 10,
        },
        "staff_salary": {
            type: "text",
            datatype: "number",
            label: "Salary",
            group: "row7",
            required: true,
            minLength: 4,
            maxLength: 10,
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

export default function AdminStaff() {

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
        { label: "Id", name: "staff_id", selected: true },
        { label: "Email", name: "email", selected: true },
        { label: "Password", name: "password", selected: false },
        { label: "Full Name", name: "full_name", selected: true },
        { label: "House Name", name: "staff_house_name", selected: true },
        { label: "Street", name: "staff_street", selected: true },
        { label: "City", name: "staff_city", selected: true },
        { label: "State", name: "staff_state", selected: true },
        { label: "Country", name: "staff_country", selected: true },
        { label: "Pincode", name: "staff_pincode", selected: true },
        { label: "Phone", name: "staff_phone", selected: true },
        { label: "Salary", name: "staff_salary", selected: true },
        { label: "Date Added", name: "date_added", selected: false },
        { label: "Status", name: "status", selected: true }
    ];

    const [data, setData] = useState(null);

    const [tableHeaders, setTableHeaders] = useState(tableHeadersData);
    const [editForm, setEditForm] = useState(adminUserEditForm);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState('staff_id');
    const [searchBy, setSearchBy] = useState('');

    //const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        (async () => {
            let feilds = getCurrentFeilds();
            let [res, data] = await requestWithAuth(navigate, "/api/admin/staff/",
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
        let [res, resdata] = await requestWithAuth(navigate, "/api/admin/staff/get", { id });
        let editFormCopy = deepcopy(addStaffForm);
        Object.keys(resdata).map(key => {
            if (editFormCopy.inputs[key] && !["password", "confirm_password"].includes(key)) {
                editFormCopy.inputs[key]["value"] = resdata[key];
            }
        });
        editFormCopy.apiRoute = "/api/admin/staff/edit";
        editFormCopy.inputs.email.disabled = true;
        delete editFormCopy.inputs.password;
        delete editFormCopy.inputs.confirm_password;
        //editFormCopy.inputs.password.disabled = true;
        //editFormCopy.inputs.confirm_password.disabled = true;
        editFormCopy.submitButtonText = "Update";
        setEditForm(editFormCopy);
        setIsEditModalOpen(true);
    }

    let handleDelete = async (id) => {

        await requestWithAuth(navigate, "/api/admin/staff/delete", { id });

        let dataCopy = deepcopy(data);
        for (let i = 0; i < dataCopy.length; i++) {
            if (dataCopy[i].email == id) {
                dataCopy[i].status = !dataCopy[i].status
            }
        }
        setData(dataCopy);

        //let feilds = getCurrentFeilds();
        //let [res, data] = await requestWithAuth(navigate, "/api/admin/users/",
        //{ feilds, sortBy, searchBy });
        //setData([...data]);
    }

    let isFieldActive = (field) => {
        let isSelected = true;
        tableHeaders.forEach(header=>{
            if(field == header.name){
                isSelected = header.selected;
            }
        })
        return isSelected;
    }

    let printPDF = async () => {
        let body = {
            title: "Staff",
            tableHeaders: tableHeaders,
            searchBy: searchBy,
            sortBy: sortBy
        };

        let res = await fetch("/api/admin/staff/print", {
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
                <h1 className="admin-main-title">Staff</h1>
                <div style={{display: 'flex'}}>
                    <div style={{marginRight: '20px'}}>
                        <Button variant="contained" onClick={() => printPDF()}>Print</Button>
                    </div>
                    <Button variant="contained" onClick={() => setIsAddModalOpen(!isAddModalOpen)}>Add Staff</Button>
                </div>
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


                                        {isFieldActive('staff_id') && <td>{item['staff_id']}</td>}
                                        {isFieldActive('email') && <td>{item['email']}</td>}
                                        {isFieldActive('password') && <td>{item['password']}</td>}
                                        {isFieldActive('full_name') && <td>{item['full_name']}</td>}
                                        {isFieldActive('staff_house_name') && <td>{item['staff_house_name']}</td>}
                                        {isFieldActive('staff_street') && <td>{item['staff_street']}</td>}
                                        {isFieldActive('staff_city') && <td>{item['staff_city']}</td>}
                                        {isFieldActive('staff_state') && <td>{item['staff_state']}</td>}
                                        {isFieldActive('staff_country') && <td>{countryListShort[item['staff_country']]}</td>}
                                        {isFieldActive('staff_pincode') && <td>{item['staff_pincode']}</td>}
                                        {isFieldActive('staff_phone') && <td>{item['staff_phone']}</td>}
                                        {isFieldActive('staff_salary') && <td>{item['staff_salary']}</td>}
                                        {isFieldActive('date_added') && <td>{formatDate(item['date_added'])}</td>}
                                        {isFieldActive('status') && <td>{item['status'] ? "active" : "inacitve"}</td>}

                                            <td style={{ display: 'flex' }}>
                                                <Switch checked={item['status']} onChange={() => { handleDelete(item["email"]) }} />
                                                <IconButton aria-label="edit" onClick={() => handleEdit(item["email"])} >
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
                    <h1>Add Staff </h1>
                    <Form ref={ref} formDetails={addStaffForm} onResponse={handleAdd} />
                </div>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(!isEditModalOpen) }} >
                <div className="admin-modal">
                    <h1>Edit Staff</h1>
                    <Form ref={ref} formDetails={editForm} onResponse={onEdit} />
                </div>
            </Modal>

        </div>
    );
}
