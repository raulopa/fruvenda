import axios from "axios";

const apiUrl = process.env.REACT_APP_LARAVEL_API_URL;
export default function useAuthService() {

    async function registrarCliente(formValues) {
        try {
            let response = await axios.post(`${apiUrl}registroCliente`, {
                'nombre': formValues.nombre.value,
                'apellidos': formValues.apellidos.value,
                'email': formValues.email.value,
                'telefono': formValues.telefono.value,
                'password': formValues.password.value,
                'password_confirmation': formValues.password_confirmation.value
            });

            if (response.status == 200) {
                if (response.data.type == 0) {
                    localStorage.setItem('token', response.data.auth.token);
                }
                return { 'status': response.status }
            }else{
                return {'status' : response.status, 'errors': response.errors}
            }
        } catch (error) {
            console.log(error);
            return { 'status': false, errors: JSON.parse(error.request.responseText).errors }
        }
    }

    async function registrarComercio(formValues) {
        try {
            let response = await axios.post(`${apiUrl}registroComercio`, {
                'cif': formValues.cif.value,
                'nombre': formValues.nombre.value,
                'telefono': formValues.telefono.value,
                'email': formValues.email.value,
                'password': formValues.password.value,
                'password_confirmation': formValues.password_confirmation.value
            });

            if (response.status == 200) {
                if (response.data.type == 1) {
                    localStorage.setItem('commerceToken', response.data.auth.token);
                }
                return { 'status': response.status }
            }else{
                return {'status' : response.status, 'errors': response.errors}
            }
        } catch (error) {
            console.log(error);
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    async function loginUsuario(formValues) {
        try {
            let response = await axios.post(`${apiUrl}login`, {
                'email': formValues.email.value,
                'password': formValues.password.value
            });

            if (response.status == 200) {
                if (response.data.type == 1) {
                    localStorage.setItem('commerceToken', response.data.token);
                } else {
                    localStorage.setItem('token', response.data.token);
                }

                return { 'status': response.status }
            }else{
                return {'status' : response.status, 'errors': response.errors}
            }
        } catch (error) {
            console.log(error);
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }

    }

    async function logout(){
        try {
            let response = await axios.get(`${apiUrl}usuario/logout`);

            if (response.status == 200) {
                return { 'status': response.status, message : response.message }
            }
        } catch (error) {
            console.log(error);
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    return {
        registrarCliente,
        loginUsuario,
        registrarComercio,
        logout
    };
}
