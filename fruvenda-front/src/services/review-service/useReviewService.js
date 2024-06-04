import axios from "axios";

const apiUrl = process.env.REACT_APP_LARAVEL_API_URL;
export default function useReviewService() {

    async function sendReview(review, slug) {
        try {
            let token = localStorage.getItem('token');
            let response = await axios.post(`${apiUrl}resenas/enviar/${slug}`,
                review
                , {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.status == 200) {
                return { 'status': true, resena: response.data.resena };
            }
        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        };
    }

    async function getReviewsCustomer() {
        try {
            let token = localStorage.getItem('token');
            let response = await axios.get(`${apiUrl}resenas/cliente`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status == 200) {
                return { 'status': true, resenas: response.data.resenas };
            }
        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        };
    }

    async function getReviewsCommerce() {
        try {
            let token = localStorage.getItem('commerceToken');
            let response = await axios.get(`${apiUrl}resenas/comercio`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status == 200) {
                return { 'status': true, resenas: response.data.resenas };
            }
        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        };
    }

    async function deleteReview(id) {
        try {
            let token = localStorage.getItem('token');
            let response = await axios.delete(`${apiUrl}resenas/borrar/${id}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status == 200) {
                return { 'status': true, message: response.data.message };
            }
        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        };
    }

    return {
        sendReview,
        getReviewsCustomer,
        getReviewsCommerce,
        deleteReview
    }
}