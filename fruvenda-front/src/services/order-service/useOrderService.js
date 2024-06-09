import axios from "axios";

const apiUrl = process.env.REACT_APP_LARAVEL_API_URL;
export default function useOrderService() {
    
    async function doOrder(){
        try{
            let cartToken = localStorage.getItem('cartToken');
            let token = localStorage.getItem('token');
            let response = await axios.get(`${apiUrl}pedidos/${cartToken}`,{
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
           
            if(response.status){
                localStorage.removeItem('cartLength');
                localStorage.removeItem('cartToken');
                return {status: true, data: response.data}
            }
           
        }catch(error){
            return { status: false, code: error.response?.status, message: error.response?.data?.message || 'An error occurred' };
        }
    }

    async function takeOrder(nombreCliente, lineas){
        try{
        let token = localStorage.getItem('commerceToken');
        let response = await axios.post(`${apiUrl}pedidos/tomarPedido`, {
            lineas : lineas,
            nombreCliente : nombreCliente
        }, {
            withCredentials: true,
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
         if(response.status == 200){
            return {status: true, data: response.data}
         }

        }catch(error){
            return { status: false, code: error.response?.status, message: error.response?.data?.message || 'An error occurred' };
        }
    }

    async function changeStatus(id, estado){
        try{
            let token = localStorage.getItem('commerceToken');
            let response = await axios.get(`${apiUrl}pedidos/changeEstado/${id}/${estado}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status){
                return {status: true, data: response.data}
            }
        }catch(error){
            return { status: false, message: error.response?.data?.message || 'An error occurred' };
        }
    }

    async function cancelOrder(id){
        try{
            let token = localStorage.getItem('token');
            console.log(token);
            let response = await axios.get(`${apiUrl}pedidos/cancelar/${id}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            if(response.status){
                return {status: true, data: response.data}
            }
        }catch(error){
            return { status: false, message: error.response?.data?.message || 'An error occurred' };
        }
    }
    

    async function getOrdersPendingByCommerce(){
        try{
            let token = localStorage.getItem('commerceToken');
            let response = await axios.get(`${apiUrl}pedidos/getPedidosPendientes`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status){
                return {status: true, data: response.data.pedidos}
            }
        }catch(error){
            return { status: false, message: error.response?.data?.message || 'An error occurred' };
        }
    }


    async function getOrdersByCommerce(){
        try{
            let token = localStorage.getItem('commerceToken');
            let response = await axios.get(`${apiUrl}pedidos/getPedidos`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status){
                return {status: true, data: response.data.pedidos}
            }
        }catch(error){
            return { status: false, message: error.response?.data?.message || 'An error occurred' };
        }
    }

    async function getPendingOrdersByCustomer(){
        try{
            let token = localStorage.getItem('token');
            let response = await axios.get(`${apiUrl}pedidos/getPedidosPendientesCliente`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status){
                return {status: true, data: response.data.pedidos}
            }
        }catch(error){
            return { status: false, message: error.response?.data?.message || 'An error occurred' };
        }
    }

    async function getOrdersByCustomer(){
        try{
            let token = localStorage.getItem('token');
            let response = await axios.get(`${apiUrl}pedidos/getPedidosCliente`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status){
                return {status: true, data: response.data.pedidos}
            }
        }catch(error){
            return { status: false, message: error.response?.data?.message || 'An error occurred' };
        }
    }

    return {
        doOrder,
        takeOrder,
        getOrdersByCommerce,
        changeStatus,
        getOrdersByCustomer,
        cancelOrder,
        getOrdersPendingByCommerce,
        getPendingOrdersByCustomer
    };
}