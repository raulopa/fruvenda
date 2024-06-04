import axios from "axios";

const apiUrl = process.env.REACT_APP_LARAVEL_API_URL;
export default function useCartService() {

    async function addProductToCart(id, cantidad) {
        try {
            let cartToken = localStorage.getItem('cartToken');
            let token = localStorage.getItem('token'); // Obtén el token de autenticación
            let requestData = {
                id: id,
                cantidad: cantidad,
            };
    
            if (cartToken) {
                requestData.cartToken = cartToken;
            }
    
            let axiosConfig = {};
            if (token) {
                axiosConfig.headers = {
                    'Authorization': `Bearer ${token}`
                };
            }
    
            let response = await axios.post(`${apiUrl}carrito/addCarrito`, requestData, axiosConfig);
            localStorage.setItem('cartToken', response.data.cartToken);
            return { status: true, data: response.data };
        } catch (error) {
            return { status: false, message: error.response?.data?.message || 'An error occurred' };
        }
    }
    

    async function deleteCartRow(id){
        try {
            let cartToken = localStorage.getItem('cartToken');
            if(cartToken != null){
                let response = await axios.get(`${apiUrl}carrito/deleteFilaCarrito/${cartToken}/${id}`);
                return { status: true, data: response.data };
            }
        } catch (error) {
            return { status: false, message: error.response?.data?.message || 'An error occurred' };
        }
    }

    async function getCartContent(){
        try {
            let cartToken = localStorage.getItem('cartToken');
            if(cartToken != null){
                let response = await axios.get(`${apiUrl}carrito/getContenidoCarrito/${cartToken}`);
                return { status: true, data: response.data };
            }
            return { status: false, dmessage: 'El carrito está vacío' };
        } catch (error) {
            return { status: false, message: error.response?.data?.message || 'An error occurred' };
        }

    }

    function updateCartLength(newLength) {
        localStorage.setItem('cartLength', newLength);
        const event = new Event('cartLengthChanged');
        window.dispatchEvent(event);
    }
    
    return {
        addProductToCart,
        updateCartLength,
        getCartContent,
        deleteCartRow
    };
}
