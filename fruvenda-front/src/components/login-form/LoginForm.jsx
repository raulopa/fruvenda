import { React, useEffect, useRef, useState } from "react";
import InputForm from "components/input-form/InputForm";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthService from "services/auth-service/UseAuthService";
import { Toast } from "primereact/toast";

export default function LoginForm() {

    let toast = useRef(null)
    let navigation = useNavigate()
    const { loginUsuario } = useAuthService();
    let location = useLocation();
    const message = location.state?.error || null;

    useEffect(() => {
        if (message) {
            toast.current.show(message);
            location.state.error = null;
        }
    }, [])

    const [formValues, setFormValues] = useState({
        email: { value: "", required: true },
        password: { value: "", required: true },
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

        let login = await loginUsuario(formValues);
        if (login.status) {
            navigation('/dashboard', {
                replace: true
            });
            e.target.reset();
        } else {
            setError(login.message);
        };
    }

    return (
        <div className="w-full md:6/12 lg:w-5/12 p-10 mt-2 outline outline-1 outline-gray-200 dark:outline-slate-600 m-auto shadow-xl rounded-2xl flex items-center justify-center transition-all">
            <Toast ref={toast} position="bottom-right" />
            <div className="w-full m-auto">
                <h1 className="font-outfit-semibold  p-2 text-center text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-4xl text-transparent">Iniciar sesión</h1>
                <form className="text-center dark:text-white w-6/12 mx-auto" onSubmit={handleSubmit}>
                    <p className="text-red-400 font-outfit-bold">{error}</p>
                    <InputForm type={'email'} placeholder={'Email...'} name={'email'} onChange={handleChange} required={formValues['email'].required} externalError={error != '' ? true : false} />
                    <br />
                    <InputForm type={'password'} placeholder={'Contraseña...'} name={'password'} onChange={handleChange} required={formValues['password'].required} externalError={error != '' ? true : false} />
                    <br />
                    <br />
                    <input className="bg-gradient-to-r dark:text-slate-800 to-green-500 from-emerald-600 dark:from-green-300 dark:to-emerald-400 text-white w-full py-3 rounded-lg hover:animate-gradient-x cursor-pointer" type="submit" value="Acceder" />
                </form>
                <div>
                    <Link to={'/signup'} className="flex justify-center mt-3">
                        <span className="font-outfit text-center lg:text-right p-2 text-aureus-s lg:text-aureus-m bg-gradient-to-r to-green-500 from-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text font-bold text-transparent">
                            ¿No tienes cuenta? Registrate, ¡es gratis!
                        </span></Link>
                </div>
            </div>
        </div>
    );
}