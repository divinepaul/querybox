import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import Button from '@mui/material/Button';
import Input from "../Input/Input";
import './Form.css';

export default forwardRef((props, ref) => {

    let [formDetails, setFormDetails] = useState(props.formDetails);
    let refs = {};

    let formValuesDummy = {};
    let formErrorsDummy = {};

    Object.keys(formDetails.inputs).forEach(inputName => {
        formValuesDummy[inputName] = "";
        formErrorsDummy[inputName] = { name: inputName, error: "", isError: true };
    });


    let [formValues, setFormValues] = useState(formValuesDummy);
    let [formErrors, setFormErrors] = useState(formErrorsDummy);

    let handleChange = (valueObject) => {
        formValues[valueObject.name] = valueObject.value;
        setFormValues(formValues);
    }

    let handleError = (eventValue) => {
        formErrors[eventValue.name] = eventValue;
        setFormErrors(formErrors);
    }

    useImperativeHandle(ref, () => ({
        setInputError(inputName, error) {
            refs[inputName].current.setInputError(error);
        }
    }));


    function checkError() {
        let isCorrect = true;
        Object.keys(formValues).forEach(inputName => {
            isCorrect = refs[inputName].current.validateInput();
        });
        return isCorrect;
    }

    let handleSubmit = async (_) => {
        if (!checkError()) {
            if (!props.onSubmit) {
                try {
                    const rawResponse = await fetch(formDetails.apiRoute, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formValues)
                    });
                    const data = await rawResponse.json();
                    if (props.onResponse) {
                        props.onResponse(data);
                    }
                } catch (err) {
                    if (props.onError) {
                        props.onError(err);
                    } else {
                        console.error(err);
                    }
                }

            } else {
                props.onSubmit(formValues);
            }
        }
    }

    let inputElements  = []; 

    let inputGroupElements  = {}; 

    return (
        <div>
            {
                (Object.keys(formDetails.inputs)).forEach((inputName) => {
                let inputDetails = formDetails.inputs[inputName];
                const inputRef = useRef();
                refs[inputName] = inputRef;
                    if(!inputDetails.group){
                        inputElements.push(<Input ref={inputRef} error={formErrors[inputName]["error"]} key={inputName} name={inputName} onChange={handleChange} onError={handleError} inputDetails={inputDetails} />);
                    } else {
                        if(!inputGroupElements[inputDetails.group]) {
                            inputGroupElements[inputDetails.group] = [];
                        }
                        if(inputGroupElements[inputDetails.group].length == 1){
                                inputElements.push(
                                    <div className="input-row">
                                        {inputGroupElements[inputDetails.group][0]}
                                        <div className="input-gap" ></div>
                                        <Input ref={inputRef} error={formErrors[inputName]["error"]} key={inputName} name={inputName} onChange={handleChange} onError={handleError} inputDetails={inputDetails} />
                                    </div>);
                        } else {
                            inputGroupElements[inputDetails.group].push(<Input ref={inputRef} error={formErrors[inputName]["error"]} key={inputName} name={inputName} onChange={handleChange} onError={handleError} inputDetails={inputDetails} />);
                        }
                    }
            })}
            {inputElements}
            <Button onClick={handleSubmit} variant="contained">{formDetails.submitButtonText}</Button>
        </div>
    );
});
