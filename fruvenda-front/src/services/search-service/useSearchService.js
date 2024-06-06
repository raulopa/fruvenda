import axios from "axios";

const apiUrl = process.env.REACT_APP_LARAVEL_API_URL;
export default function useSearchService() {
    async function searchEntity(entity) {
        try {
            let response = await axios.get(`${apiUrl}buscar/${entity}`);
            if (response.status == 200) {
                return { status: true, commerces: response.data.comercios, markets: response.data.mercados };
            }
        } catch (error) {
            return { status: false, message: 'No hay resultados coincidentes' }
        }
    }

    return {
        searchEntity
    }
}