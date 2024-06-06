import axios from "axios";

const apiUrl = process.env.REACT_APP_LARAVEL_API_URL;
export default function useCommerceService() {


    async function getCommerce(){
        try{
            let response = await axios.get(`${apiUrl}comercio`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('commerceToken')}`
                }
            });
    
            if(response.status == 200){
                let comercio = {...response.data.comercio, image : response.data.image} 
                console.log(comercio);
                return { status: true, comercio: comercio };
            }
        }catch(error){
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }  
    }

    async function getCommerceBySlug(slug){
        try{
            let response = await axios.get(`${apiUrl}comercio/${slug}`);
    
            if(response.status == 200){
                let comercio = {...response.data.comercio, image : response.data.image} 
                console.log(comercio);
                return { status: true, comercio: comercio };
            }
        }catch(error){
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }  
    }

    async function getReviewsCommerceProfile(slug){
        try{
            let response = await axios.get(`${apiUrl}comercio/resenas/${slug}`);
    
            if(response.status == 200){
                return {status: true, reviews: response.data.resenas};
            }
        }catch(error){
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }  
    }

    async function editCommerce(comercio, token){
        try{
            const formData = new FormData();
            formData.append('nombre', comercio.nombre);
            formData.append('email', comercio.email);
            formData.append('activo', 1);
            formData.append('telefono', comercio.telefono);
            if (comercio.image) {
                formData.append('image', comercio.image);
            }

            let response = await axios.post(`${apiUrl}comercio/edit`, formData, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status == 200) {
                let comercio = {...response.data.comercio, image : response.data.image} 
                return { status: true, comercio: comercio };
            }
        }catch(error){
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    return {
        getCommerce,
        getCommerceBySlug,
        getReviewsCommerceProfile,
        editCommerce
    };
}
