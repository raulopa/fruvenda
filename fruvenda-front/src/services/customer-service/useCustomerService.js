import axios from "axios";

const apiUrl = process.env.REACT_APP_LARAVEL_API_URL;
export default function useCustomerService() {


    async function getCustomer() {
        try {
            let token = localStorage.getItem('token');
            let response = await axios.get(`${apiUrl}usuario`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status == 200) {
                let cliente = { ...response.data.cliente, image: response.data.image }
                console.log(cliente);
                return { status: true, cliente: cliente };
            }
        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    async function getCustomerById(id) {
        try {
            let token = localStorage.getItem('token');
            let response = await axios.get(`${apiUrl}usuario/${id}`);

            if (response.status == 200) {
                let cliente = { ...response.data.cliente, image: response.data.image }
                return { status: true, cliente: cliente };
            }
        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }


    async function editCustomer(cliente, token) {
        try {
            const formData = new FormData();
            formData.append('nombre', cliente.nombre);
            formData.append('apellidos', cliente.apellidos);
            formData.append('telefono', cliente.telefono);
            formData.append('email', cliente.email);
            if (cliente.image) {
                formData.append('image', cliente.image);
            }

            let response = await axios.post(`${apiUrl}usuario/edit`, formData, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status == 200) {
                let cliente = { ...response.data.cliente, image: response.data.image }
                console.log(cliente);
                return { status: true, cliente: cliente };
            }

        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    async function getFollowCommerce(idCommerce) {
        try {
            let token = localStorage.getItem('token');
            let response = await axios.get(`${apiUrl}usuario/seguido/${idCommerce}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status == 200) {
                return { status: true, seguido: response.data.seguido };
            }

        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    async function setFollowCommerce(idCommerce) {
        try {
            let token = localStorage.getItem('token');
            let response = await axios.get(`${apiUrl}usuario/seguir/${idCommerce}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status == 200) {
                return { status: true, seguido: response.data.seguido };
            }

        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    async function getFollowed() {
        try {
            let token = localStorage.getItem('token');
            let response = await axios.get(`${apiUrl}usuario/seguidos`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status == 200) {
                return { status: true, seguidos: response.data.seguidos };
            }

        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    async function getLastPosts() {
        try {
            let token = localStorage.getItem('token');
            let response = await axios.get(`${apiUrl}usuario/ultimos`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status == 200) {
                return { status: true, posts: response.data.posts };
            }

        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }





    return {
        getCustomer,
        getCustomerById,
        editCustomer,
        getFollowCommerce,
        setFollowCommerce,
        getFollowed,
        getLastPosts
    };
}
