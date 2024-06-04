import axios from "axios";

const apiUrl = process.env.REACT_APP_LARAVEL_API_URL;
export default function usePostService() {

    async function publishPost(post){
        try {
            let token = localStorage.getItem('commerceToken');
            let response = await axios.post(`${apiUrl}posts/publicar`,
                post
                , {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.status == 200) {
                return { 'status': true, post: response.data.post };
            }
        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        };
    }

    async function getCommercePosts(){
        try {
            let token = localStorage.getItem('commerceToken');
            let response = await axios.get(`${apiUrl}posts/comercio`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.status == 200) {
                return { 'status': true, posts: response.data.posts };
            }
        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        };
    }

    async function getCommercePostsBySlug(slug){
        try {
            let response = await axios.get(`${apiUrl}posts/comercio/${slug}`);

            if (response.status == 200) {
                return { 'status': true, posts: response.data.posts };
            }
        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        };
    }

    async function deletePost(id){
        try {
            let token = localStorage.getItem('commerceToken');
            let response = await axios.delete(`${apiUrl}posts/${id}`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            if (response.status == 200) {
                return { 'status': true, deleted: response.data.deleted };
            }
        } catch (error) {
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        };
    }

    return {
        publishPost,
        getCommercePosts,
        deletePost,
        getCommercePostsBySlug
    }
}