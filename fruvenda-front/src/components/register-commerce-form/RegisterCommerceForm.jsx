import { React, useState } from "react";
import InputForm from "components/input-form/InputForm";
import { Link, useNavigate } from "react-router-dom";
import useAuthService from "services/auth-service/UseAuthService";

export default function RegisterCommerceForm() {

    let navigation = useNavigate()

    const { registrarComercio } = useAuthService();

    const [formValues, setFormValues] = useState({
        cif: { value: "", required: false },
        nombre: { value: "", required: false },
        email: { value: "", required: false },
        telefono: { value: "", required: false },
        password: { value: "", required: false },
        password_confirmation: { value: "", required: false }
    });
        
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: { value, required: formValues[name].required }
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e.target);
        let requeridos = Object.keys(formValues).filter(name => formValues[name].required);
        const norellenados = requeridos.filter(fieldName => !formValues[fieldName].value.trim());
        if (norellenados.length > 0) {
            alert('Los siguientes campos son requeridos: ' + norellenados);
            return;
        }
        let validatePassword = validarPassword(formValues.password);
        if (!validatePassword.state) {
            alert(validatePassword.message);
            return
        }

        if (formValues.password.value !== formValues["password_confirmation"].value) {
            alert('Las contraseñas no coinciden');
            return
        }

        let registro = await registrarComercio(formValues);
        if (registro.status) {
            navigation('/dashboard', {
                replace: true
            })
            e.target.reset();
        } else {
            if(registro.message.includes('(and 1 more error)')){
                setError('Hay varios errores en el registro');
            }else{
                setError(registro.message);
            }
            
        };



    }

    function validarPassword(password) {
        const expresiones = {
            mayuscula: /[A-Z]/,
            minuscula: /[a-z]/,
            numero: /\d/,
            especial: /[!@#$%^&*(),.?":{}|<>]/
        };
        if (!expresiones.mayuscula.test(password.value)) {
            return { state: false, message: "Debe contener al menos una letra mayúscula." };
        }

        if (!expresiones.minuscula.test(password.value)) {
            return { state: false, message: "Debe contener al menos una letra minúscula." };
        }

        if (!expresiones.numero.test(password.value)) {
            return { state: false, message: "Debe contener al menos un número." };
        }

        if (!expresiones.especial.test(password.value)) {
            return { state: false, message: "Debe contener al menos un carácter especial." };
        }

        if (password.value.length < 8) {
            return { state: false, message: "Debe tener al menos 8 caracteres." };
        }

        return { state: true };
    }

    return (
        <div className=" w-full md:6/12 lg:w-5/12 p-10 mt-2 outline outline-1 outline-gray-200 dark:outline-slate-600 m-auto shadow-xl rounded-2xl flex items-center justify-center transition-all">
            <div className="w-full">
                <h1 className="font-outfit-semibold  p-2 text-center text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-4xl text-transparent">¡Registrate gratis!</h1>
                <p className="text-red-400 font-outfit-bold">{error}</p>
                <form className="text-center dark:text-white w-6/12 mx-auto" onSubmit={handleSubmit}>
                    <p className="font-outfit-semibold text-aureus-l mt-4">Sobre tu comercio</p>
                    <InputForm type={'text'} placeholder={'Código Identificación Fiscal...'} name={'cif'} onChange={handleChange} required={formValues['cif'].required} externalError={error != '' ? true : false} />
                    <br />
                    <InputForm type={'text'} placeholder={'Nombre...'} name={'nombre'} onChange={handleChange} required={formValues['nombre'].required} externalError={error != '' ? true : false} />
                    <br />
                    <InputForm type={'email'} placeholder={'Email...'} name={'email'} onChange={handleChange} required={formValues['email'].required} externalError={error != '' ? true : false} />
                    <br />
                    <InputForm type={'text'} placeholder={'Telefono...'} name={'telefono'} onChange={handleChange} required={formValues['telefono'].required} externalError={error != '' ? true : false} />
                    <br />
                    <br />
                    <p className="font-outfit-semibold dark:text-white text-aureus-l">Contraseña</p>
                    <InputForm type={'password'} placeholder={'Contraseña...'} name={'password'} onChange={handleChange} required={formValues['password'].required} externalError={error != '' ? true : false} />
                    <br />
                    <InputForm type={'password'} placeholder={'Confirmar contraseña...'} name={'password_confirmation'} onChange={handleChange} required={formValues['password_confirmation'].required} externalError={error != '' ? true : false} />
                    <br />
                    <br />
                    <input className="bg-gradient-to-r dark:text-slate-800 to-green-500 from-emerald-600 dark:from-green-300 dark:to-emerald-400 text-white w-full py-3 rounded-lg hover:animate-gradient-x cursor-pointer" type="submit" value="Crear cuenta" />
                </form>
                <div>
                    <Link to={'/login'} className=" ">
                        <p className="font-outfit  text-center lg:text-right p-2 text-aureus-m lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-4xl text-transparent">
                            ¿Ya tienes cuenta? ¡Inicia sesión!
                        </p></Link>
                </div>
            </div>
        </div>
    );
}