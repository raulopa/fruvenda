import React, { useRef, useState } from "react";
import InputForm from "components/input-form/InputForm";
import { Link, useNavigate } from "react-router-dom";
import useAuthService from "services/auth-service/UseAuthService";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Password } from "primereact/password";

export default function RegisterForm() {
    let navigation = useNavigate();
    let toast = useRef();

    const { registrarCliente } = useAuthService();

    const [formValues, setFormValues] = useState({
        nombre: { value: "", required: true, error: '' },
        apellidos: { value: "", required: true, error: '' },
        email: { value: "", required: true, error: '' },
        telefono: { value: "", required: true, error: '' },
        password: { value: "", required: true, error: '' },
        password_confirmation: { value: "", required: true, error: '' }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: { ...formValues[name], value } // Agregamos el spread operator para mantener las propiedades
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let requeridos = Object.keys(formValues).filter(name => formValues[name].required);
        const norellenados = requeridos.filter(fieldName => formValues[fieldName].value === '');
        if (norellenados.length > 0) {
            toast.current.show({ severity: 'error', summary: 'Incorrecto', detail: `Los siguientes campos son requeridos: ${norellenados.join(', ')}` });
            return;
        }
        let validatePassword = validarPassword(formValues.password);
        if (!validatePassword.state) {
            toast.current.show({ severity: 'error', summary: 'Incorrecto', detail: validatePassword.message });
            return;
        }

        if (formValues.password.value !== formValues.password_confirmation.value) {
            toast.current.show({ severity: 'error', summary: 'Incorrecto', detail: 'Las contraseñas no coinciden' });
            return;
        }

        let registro = await registrarCliente(formValues);
        if (registro.status) {
            navigation('/dashboard', { replace: true });
            e.target.reset();
        } else {
            if (registro.message.includes('The email has already been taken')) {
                toast.current.show({ severity: 'error', summary: 'Incorrecto', detail: 'El email ya está en uso' });
            } else {
                toast.current.show({ severity: 'error', summary: 'Incorrecto', detail: registro.message });
            }
        }
    };

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
        <div className="w-full md:6/12 lg:w-5/12 p-10 mt-20 outline outline-1 outline-gray-200 dark:outline-slate-600 m-auto shadow-xl rounded-2xl flex items-center justify-center transition-all">
            <div className="w-full">
                <Toast ref={toast} position="bottom-right" />
                <h1 className="font-outfit-semibold  p-2 text-center text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-4xl text-transparent">¡Registrate gratis!</h1>
                <form className="text-center dark:text-white w-10/12 lg:md:6/12 mx-auto" onSubmit={handleSubmit}>
                    <p className="font-outfit-semibold text-aureus-l mt-4">Sobre ti</p>
                    <InputText name="nombre" invalid={formValues['nombre'].required} onChange={handleChange} placeholder={'Nombre...'} className=" my-2 border border-gray-300 p-2 w-full" />
                    <InputText name="apellidos" placeholder={'Apellidos...'} invalid={formValues['apellidos'].required} onChange={handleChange} className=" my-2 border border-gray-300 p-2 w-full" />
                    <InputText keyfilter='email' name="email" invalid={formValues['email'].required} onChange={handleChange} placeholder={'Email...'} className="my-2 border border-gray-300 p-2 w-full" />
                    <InputText name="telefono" invalid={formValues['telefono'].required} onChange={handleChange} placeholder={'Teléfono...'} className=" my-2 border border-gray-300 p-2 w-full" />
                    <p className="font-outfit-semibold dark:text-white text-aureus-l">Contraseña</p>
                    <style jsx='true'>
                        {
                            `
                            .password-field-fruvenda{
                                width:105.2%;
                            
                            }
                            .password-field-fruvenda input{
                                    margin-left: 30px;
                                    width: 100%;
                                    height: 100%;
                                    outline: none !important;
                                    border: 1px solid rgb(209 213 219);
                                    padding: 0.5rem;
                                    font-family: outfit;
                            }
                                    `
                        }
                    </style>
                    <Password  value={formValues['password'].value} name="password" placeholder={'Contraseña...'} invalid={formValues['password'].required} onChange={handleChange} className="password-field-fruvenda -ml-7" promptLabel="Elige tu contraseña" weakLabel="Demasiado simple" mediumLabel="Contraseña media" strongLabel="Contraseña compleja" toggleMask />
                    <InputText type="password" name='password_confirmation' placeholder={'Confirmar contraseña...'} invalid={formValues['password_confirmation'].required} onChange={handleChange} className="border my-2  border-gray-300 p-2 w-full" />
                    <input className="bg-gradient-to-r dark:text-slate-800 to-green-500 from-emerald-600 dark:from-green-300 dark:to-emerald-400 text-white w-full py-3 rounded-lg hover:animate-gradient-x cursor-pointer" type="submit" value="Crear cuenta" />
                </form>
                <div>
                    <Link to={'/login'} className=" ">
                        <p className="font-outfit  text-center lg:text-right p-2 text-aureus-m lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-4xl text-transparent">
                            ¿Ya tienes cuenta? ¡Inicia sesión!
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
