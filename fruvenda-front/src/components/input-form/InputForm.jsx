import { useState } from "react";

export default function InputForm({ type, placeholder, name, value, onChange, required, externalError }) {

    const errors = {
        'required' : 'Campo requerido',
    }
    

    const [errorState, setErrorState] = useState(false);
    const [error, setError] = useState(false);


    const handleBlur = (e) => {
        const {value} = e.target;
        if(value == '' && required){
            setErrorState(true);
            setError(errors.required);
        }else{
            setError('');
            setErrorState(false)
        }
    }

    return (
        <div>
            <span className={`text-aureus-m text-red-400 ${externalError != '' ? 'block' : 'hidden'}`}>{externalError}</span>
            <span className={`text-aureus-s text-red-400 ${errorState  ? 'block' : 'hidden'}`}>{error}</span>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                onBlur={handleBlur}
                className={`outline w-full outline-1 ${externalError != '' ?? 'outline-red-400' } ${errorState ?? 'outline-red-400' }  outline-gray-300 rounded-md px-3 py-2 focus:outline-emerald-500 focus:outline-2 dark:bg-slate-600`}
            />
        </div>



    );
}