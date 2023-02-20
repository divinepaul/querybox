import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import './Input.css';

export default forwardRef((props, ref) => {
    let [inputDetails, setInputDetails] = useState({ value: "", ...props.inputDetails });
    let [error, setError] = useState(props.error);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    let setValue = (event) => {

        setInputDetails({ ...inputDetails, value: event.target.value });

        if (inputDetails.maxLength && event.target.value.length > inputDetails.maxLength) {
            inputDetails.maxLengthError ?
                setError(inputDetails.minLengthError) :
                setError(`${inputDetails.label} canonot be more than ${inputDetails.maxLength} characters.`);
            return;
        }
        if (inputDetails.datatype == "number" && (/[^0-9]+/g.test(event.target.value))) {
            inputDetails.dataTypeError ?
                setError(inputDetails.dataTypeError) :
                setError(`${inputDetails.label} cannot contain any alphabets`);
            return;
        }
        setError("");

    }

    useImperativeHandle(ref, () => ({
        validateInput() {
            return checkErrors();
        },
        setInputError(error) {
            setError(error);
        }
    }));

    useEffect(() => {
        props.onChange({ value: inputDetails.value, name: props.name });
    }, [inputDetails]);

    useEffect(() => {
        if (props.onError) {
            props.onError({ isError: error.length ? true : false, error: error, name: props.name });
        }
    }, [error]);

    let checkErrors = (event) => {
        if (inputDetails.required && !inputDetails.value.toString().trim()) {
            inputDetails.requiredError ?
                setError(inputDetails.requiredError) :
                setError(`${inputDetails.label} cannot be empty`);
            return true;
        }
        if (inputDetails.minLength && inputDetails.value.toString().length < inputDetails.minLength) {
            inputDetails.minLengthError ?
                setError(inputDetails.minLengthError) :
                setError(`${inputDetails.label} canonot be less than ${inputDetails.minLength} characters.`);
            return true;
        }
        if (inputDetails.type == "email" && !validateEmail(inputDetails.value)) {
            inputDetails.emailError ?
                setError(inputDetails.emailError) :
                setError(`Not a valid Email.`);
            return true;
        }

        if (inputDetails.maxLength && inputDetails.value.toString().length > inputDetails.maxLength) {
            inputDetails.maxLengthError ?
                setError(inputDetails.minLengthError) :
                setError(`${inputDetails.label} canonot be more than ${inputDetails.maxLength} characters.`);
            return true;
        }
        return false;
    }


    return (
        <div style={{
            width: inputDetails.width ? inputDetails.width : '300px',
            marginBottom: inputDetails.marginBottom ? inputDetails.marginBottom : '30px',
        }}>
            {inputDetails.type == "select" ?
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{inputDetails.label}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label={inputDetails.label}
                        color={inputDetails.color}
                        required={inputDetails.required}
                        disabled={inputDetails.disabled}
                        value={inputDetails.value}
                        onChange={setValue}
                    >
                        {inputDetails.selectValues.map((item) => {
                            return <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                :
                inputDetails.type == "textarea" ?
                    <>
                        <p className="input-label">
                            {inputDetails.label}
                        </p>
                        <textarea className={error.length ? "error" : ""}
                            onBlur={checkErrors}
                            onChange={setValue}
                            value={inputDetails.value}
                        >
                        </textarea>
                        <p className="input-error">{error.length ? error : null}</p>
                    </>
                    :

                    <TextField
                        type={inputDetails.type}
                        onBlur={checkErrors}
                        color={inputDetails.color}
                        fullWidth={true}
                        onChange={setValue}
                        required={inputDetails.required}
                        disabled={inputDetails.disabled}
                        error={error.length ? true : false}
                        helperText={error}
                        value={inputDetails.value}
                        label={inputDetails.label}
                        variant="outlined"
                    />
            }
        </div>
    );
});
