import {countryList} from './constants.js';

//let loginForm = {
    //apiRoute: '/api/login',
    //submitButtonText: "Login",
    //inputs: {
        //"email": {
            //type: "email",
            //label: "Email",
            //required: true,
            //minLength: 5,
            //maxLength: 50,
        //},
        //"userType": {
            //type: "select",
            //label: "Email",
            //value: 2,
            //databaseType: "number",
            //selectValues: [
                //{ value: 1, label: "User 1" },
                //{ value: 2, label: "User 2" },
                //{ value: 3, label: "User 3" },
                //{ value: 4, label: "User 4" },
            //],
            //required: true,
            //minLength: 5,
            //maxLength: 50,
        //},
        //"password": {
            //type: "password",
            //label: "Password",
            //required: true,
            //minLength: 5,
            //maxLength: 50,
        //}
    //}
//};

let loginForm = {
    apiRoute: '/api/auth/login',
    submitButtonText: "Login",
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
            required: true,
            minLength: 5,
            maxLength: 50,
        }
    }
};

let registerForm = {
    apiRoute: '/api/auth/register',
    submitButtonText: "Register",
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
        "customer_house_name": {
            type: "text",
            label: "House Name",
            group: "row2",
            required: true,
            minLength: 2,
            maxLength: 20,
        },
        "customer_street": {
            type: "text",
            label: "Street",
            group: "row2",
            required: true,
            minLength: 5,
            maxLength: 20,
        },
        "customer_city": {
            type: "text",
            label: "City",
            group: "row5",
            required: true,
            minLength: 2,
            maxLength: 20,
        },
        "customer_state": {
            type: "text",
            label: "State",
            group: "row5",
            required: true,
            minLength: 5,
            maxLength: 20,
        },
        "customer_country": {
            type: "select",
            label: "Country",
            value: "in",
            group: "row6",
            selectValues: countryList,
            required: true,
            minLength: 5,
            maxLength: 50,
        },
        "customer_pincode": {
            type: "text",
            label: "Pincode",
            datatype: "number",
            group: "row6",
            required: true,
            minLength: 6,
            maxLength: 7,
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



export {
    loginForm,
    registerForm
};
