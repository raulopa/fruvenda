import { React, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthService from "services/auth-service/UseAuthService";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

export default function RegisterCommerceForm() {

    let navigation = useNavigate();
    let toast = useRef();

    const { registrarComercio } = useAuthService();

    const [formValues, setFormValues] = useState({
        cif: { value: "", required: true },
        nombre: { value: "", required: true },
        email: { value: "", required: true },
        telefono: { value: "", required: true },
        password: { value: "", required: true },
        password_confirmation: { value: "", required: true },
        slug: { value: "", required: true }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: { value, required: formValues[name].required }
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let requeridos = Object.keys(formValues).filter(name => formValues[name].required);
        const norellenados = requeridos.filter(fieldName => formValues[fieldName].value === '');
        if (norellenados.length > 0) {
            toast.current.show({ severity: 'error', summary: 'Incorrecto', detail: `Los siguientes campos son requeridos: ${norellenados.join(', ')}` });
            return;
        }

        if (formValues.password.value !== formValues.password_confirmation.value) {
            toast.current.show({ severity: 'error', summary: 'Incorrecto', detail: 'Las contraseñas no coinciden' });
            return;
        }

        let validatePassword = validarPassword(formValues.password.value);
        if (!validatePassword.state) {
            toast.current.show({ severity: 'error', summary: 'Incorrecto', detail: validatePassword.message });
            return;
        }
        let registro = await registrarComercio({
            cif: formValues.cif.value,
            nombre: formValues.nombre.value,
            email: formValues.email.value,
            telefono: formValues.telefono.value,
            password: formValues.password.value,
            password_confirmation: formValues.password_confirmation.value,
            slug: formValues.slug.value
        });

        if (registro.status) {
            navigation('/dashboard', { replace: true });
            e.target.reset();
        } else {
            if(registro.message.includes('The email has already been taken')){
            toast.current.show({ severity: 'error', summary: 'Incorrecto', detail: 'El email ya está en uso'});
            }else{
                toast.current.show({ severity: 'error', summary: 'Incorrecto', detail: registro.message });

            }
        }
    }

    function validarPassword(password) {
        const expresiones = {
            mayuscula: /[A-Z]/,
            minuscula: /[a-z]/,
            numero: /\d/,
            especial: /[!@#$%^&*(),.?":{}|<>]/
        };
        if (!expresiones.mayuscula.test(password)) {
            return { state: false, message: "Debe contener al menos una letra mayúscula." };
        }

        if (!expresiones.minuscula.test(password)) {
            return { state: false, message: "Debe contener al menos una letra minúscula." };
        }

        if (!expresiones.numero.test(password)) {
            return { state: false, message: "Debe contener al menos un número." };
        }

        if (!expresiones.especial.test(password)) {
            return { state: false, message: "Debe contener al menos un carácter especial." };
        }

        if (password.length < 8) {
            return { state: false, message: "Debe tener al menos 8 caracteres." };
        }

        return { state: true };
    }

    return (
        <div className="w-full mt-20 md:w-6/12 lg:w-5/12 p-10 outline outline-1 outline-gray-200 dark:outline-slate-600 m-auto shadow-xl rounded-2xl flex items-center justify-center transition-all">
            <Toast ref={toast} position="bottom-right" />
            <div className="w-full">
                <h1 className="font-outfit-semibold p-2 text-center text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-4xl text-transparent">¡Regístrate gratis!</h1>
                <form className="text-center dark:text-white  w-10/12 lg:md:6/12 mx-auto " onSubmit={handleSubmit}>
                    <p className="font-outfit-semibold text-aureus-l mt-4">Sobre tu comercio</p>
                    <InputText name="cif" invalid={formValues['cif'].required} onChange={handleChange} placeholder={'CIF o NIF...'} className="my-2 border border-gray-300 p-2 w-full" />
                    <InputText name="nombre" invalid={formValues['nombre'].required} onChange={handleChange} placeholder={'Nombre...'} className=" my-2 border border-gray-300 p-2 w-full" />
                    <InputText keyfilter='email' name="email" invalid={formValues['email'].required} onChange={handleChange} placeholder={'Email...'} className="my-2 border border-gray-300 p-2 w-full" />
                    <InputText name="telefono" invalid={formValues['telefono'].required} onChange={handleChange} placeholder={'Teléfono...'} className=" my-2 border border-gray-300 p-2 w-full" />
                    
                    <p className="font-outfit-semibold dark:text-white text-aureus-l">Contraseña</p>
                    <InputText type="password" name="password" placeholder={'Contraseña...'} invalid={formValues['password'].required} onChange={handleChange} className="border border-gray-300 p-2 w-full" />
                    <InputText type="password" name='password_confirmation' placeholder={'Confirmar contraseña...'} invalid={formValues['password_confirmation'].required} onChange={handleChange} className="border my-2  border-gray-300 p-2 w-full" />
                    
                    <p className="font-outfit-semibold dark:text-white text-aureus-l">Nombre de usuario</p>
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon  my-2">@</span>
                        <InputText keyfilter={/^[0-9a-z-]+$/} name="slug" placeholder={'Nombre de usuario...'} invalid={formValues['slug'].required} onChange={handleChange} className=" my-2 border border-gray-300 p-2 w-full" />
                    </div>
                    
                    <input className="bg-gradient-to-r dark:text-slate-800 to-green-500 from-emerald-600 dark:from-green-300 dark:to-emerald-400 text-white w-full py-3 rounded-lg hover:animate-gradient-x cursor-pointer" type="submit" value="Crear cuenta" />
                </form>
                <div>
                    <Link to={'/login'}>
                        <p className="font-outfit text-center lg:text-right p-2 text-aureus-m lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-4xl text-transparent">
                            ¿Ya tienes cuenta? ¡Inicia sesión!
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
