import axios from "axios";

const apiUrl = process.env.REACT_APP_LARAVEL_API_URL;
export default function useProductService() {

    async function getCommerceProducts() {
        try {
            let response = await axios.get(`${apiUrl}productos`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('commerceToken')}`
                }
            });

            if (response.status == 200) {
                return response.data.products;
            }

        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    async function getCommerceProductsForCustomers(id) {
        try {
            let response = await axios.get(`${apiUrl}productos/${id}`);

            if (response.status == 200) {
                return { 'status': true, products:response.data.products}
            }

        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    async function deleteProduct(id) {
        try {
            let response = await axios.delete(`${apiUrl}productos/${id}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('commerceToken')}`
                }
            });

            if (response.status === 200) {
                console.log(response)
                return { 'status': true, message: response.data.message }
            }
        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    async function deleteProducts(arrayId) {
        try {
            let response = await axios.delete(`${apiUrl}productos`, {
                data: { ids: arrayId },
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('commerceToken')}`
                }
            });

            if (response.status === 200) {
                console.log(response)
                return { 'status': true, message: response.data.message }
            }
        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    async function saveProduct(product, images) {
        const formData = new FormData();

        // Añadir datos del producto
        formData.append('nombre', product.nombre);
        formData.append('descripcion', product.descripcion);
        formData.append('precio', product.precio);
        formData.append('ud_medida', product.ud_medida);
        formData.append('stock', product.stock);
        formData.append('visible', product.visible ? 1 : 0);

        // Añadir imágenes
        images.forEach((image, index) => {
            console.log(image);
            formData.append('images[]', image);
        });

        try {
            let response = await axios.post(`${apiUrl}productos/add`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('commerceToken')}`
                }
            });

            if (response.status === 200) {
                console.log(response);
                return { 'status': true, message: response.data.message };
            }
        } catch (error) {
            return { 'status': false, message: error.response?.data?.message || 'Error' };
        }
    }

    async function editProduct(product, images) {
        const formData = new FormData();

        // Añadir datos del producto
        formData.append('nombre', product.nombre);
        formData.append('descripcion', product.descripcion);
        formData.append('precio', product.precio);
        formData.append('ud_medida', product.ud_medida);
        formData.append('stock', product.stock);
        formData.append('visible', product.visible ? 1 : 0);

        try {
            let response = await axios.put(`${apiUrl}productos/edit`, { ...product }, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('commerceToken')}`
                }
            });

            if (response.status === 200) {
                return { 'status': true, message: response.data.message };
            }
        } catch (error) {
            return { 'status': false, message: error.response?.data?.message || 'Error' };
        }
    }



    return {
        getCommerceProducts,
        deleteProducts,
        deleteProduct,
        saveProduct,
        editProduct,
        getCommerceProductsForCustomers
    };
}