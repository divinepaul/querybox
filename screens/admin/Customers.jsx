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
import { countryList } from "../../lib/constants";
import { registerForm } from "../../lib/forms";
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

let addCustomerForm = {
    apiRoute: '/api/admin/customer/add',
    submitButtonText: "Add Customer",
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
        "customer_fname": {
            type: "text",
            group: "row1",
            label: "First Name",
            required: true,
            minLength: 5,
            maxLength: 15,
        },
        "customer_lname": {
            type: "text",
            group: "row1",
            label: "Last Name",
            required: true,
            minLength: 2,
            maxLength: 15,
        },
        "customer_profession": {
            type: "text",
            group: "row2",
            label: "Current Profession",
            required: true,
            minLength: 3,
            maxLength: 20,
        },
        "customer_education": {
            type: "text",
            group: "row2",
            label: "Current Education",
            required: true,
            minLength: 3,
            maxLength: 20,
        },

        "customer_phone": {
            type: "text",
            datatype: "number",
            label: "Phone",
            required: true,
            minLength: 7,
            maxLength: 10,
        },
    }
};

export default function AdminCustomers() {

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
        { label: "Id", name: "customer_id", selected: true },
        { label: "Email", name: "email", selected: true },
        { label: "Password", name: "password", selected: false },
        { label: "Full Name", name: "full_name", selected: true },
        { label: "Profession", name: "customer_profession", selected: true },
        { label: "Education", name: "customer_education", selected: true },
        { label: "Phone", name: "customer_phone", selected: true },
        { label: "Date Added", name: "date_added", selected: true },
        { label: "Status", name: "status", selected: true }
    ];

    const [data, setData] = useState(null);

    const [tableHeaders, setTableHeaders] = useState(tableHeadersData);
    const [editForm, setEditForm] = useState({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState('customer_id');
    const [searchBy, setSearchBy] = useState('');

    //const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        (async () => {
            let feilds = getCurrentFeilds();
            let [res, data] = await requestWithAuth(navigate, "/api/admin/customer/",
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
        let [res, resdata] = await requestWithAuth(navigate, "/api/admin/customer/get", { id });
        let editFormCopy = deepcopy(addCustomerForm);
        Object.keys(resdata).map(key => {
            if (editFormCopy.inputs[key] && !["password", "confirm_password"].includes(key)) {
                editFormCopy.inputs[key]["value"] = resdata[key];
            }
        });
        editFormCopy.apiRoute = "/api/admin/customer/edit";
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

        await requestWithAuth(navigate, "/api/admin/customer/delete", { id });

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
        tableHeaders.forEach(header => {
            if (field == header.name) {
                isSelected = header.selected;
            }
        })
        return isSelected;
    }

    let getCurrentHeaders = () => {
        let fields = [];
        tableHeaders.forEach(header => {
            if (header.selected) {
                fields.push(header.label);
            }
        });
        return fields;
    }

    let printPDF = async () => {
        const doc = new jsPDF()
        doc.setFontSize(22);
        doc.text("QUERYBOX CUSTOMER REPORT", 10, 20);
        doc.setFontSize(13);
        doc.text(`Reported Generated at ${formatDate(new Date())}`, 10, 30);
        doc.setFontSize(15);
        doc.text(`Address:`, 10, 40);
        doc.setFontSize(10);
        doc.text(`No: 9B2, 9th floor, Wing-2`, 12, 45);
        doc.text(`Jyothirmaya building,`, 12, 50);
        doc.text(`Infopark Phase 2`, 12, 55);
        doc.text(`Brahmapuram P.O`, 12, 60);
        doc.text(`682303`, 12, 65);
        doc.text(`Kerala,India`, 12, 70);
        doc.text(`mail@querybox.xyz`, 12, 75);


        let tableData = data.map(item => {
            if('status' in item){
                item['status'] = (item['status'] ? 'active' : 'inactive')
            }
            return item;
        })

        tableData = data.map(item => {
            return Object.values(item);
        });


        autoTable(doc, {
            head: [getCurrentHeaders()],
            startY: 80,
            startX: 10,
            body:
                tableData,

            didDrawPage: function(data) {

                // Footer
                var str = "QueryBox Report | Page " + doc.internal.getNumberOfPages();

                doc.setFontSize(10);

                // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                var pageSize = doc.internal.pageSize;
                var pageHeight = pageSize.height
                    ? pageSize.height
                    : pageSize.getHeight();
                doc.text(str, data.settings.margin.left, pageHeight - 10);
            }

        })


        doc.save('customer-report.pdf')

    }

    return (
        <div className="admin-main-container">

            <div className="admin-header-container">
                <h1 className="admin-main-title">Customers</h1>
                <div style={{display: 'flex'}}>
                    <div style={{marginRight: '20px'}}>
                        <Button variant="contained" onClick={() => printPDF()}>Print</Button>
                    </div>
                    <Button variant="contained" onClick={() => setIsAddModalOpen(!isAddModalOpen)}>Add Customers</Button>
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

                                            {isFieldActive('customer_id') && <td>{item['customer_id']}</td>}
                                            {isFieldActive('email') && <td>{item['email']}</td>}
                                            {isFieldActive('password') && <td>{item['password']}</td>}
                                            {isFieldActive('full_name') && <td>{item['full_name']}</td>}
                                            {isFieldActive('customer_profession') && <td>{item['customer_profession']}</td>}
                                            {isFieldActive('customer_education') && <td>{item['customer_education']}</td>}
                                            {isFieldActive('customer_phone') && <td>{item['customer_phone']}</td>}
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
                    <h1>Add Customer </h1>
                    <Form ref={ref} formDetails={addCustomerForm} onResponse={handleAdd} />
                </div>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(!isEditModalOpen) }} >
                <div className="admin-modal">
                    <h1>Edit Customer</h1>
                    <Form ref={ref} formDetails={editForm} onResponse={onEdit} />
                </div>
            </Modal>

        </div>
    );
}
