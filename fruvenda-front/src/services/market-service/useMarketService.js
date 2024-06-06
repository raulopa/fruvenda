import axios from "axios";

const apiUrl = process.env.REACT_APP_LARAVEL_API_URL;
export default function useMarketService() {


    async function getMarkets(){
        try{
            let response = await axios.get(`${apiUrl}mercado`);
            if(response.status == 200){
                return {status: true, markets: response.data.markets};
            }
        }catch(error){
            return {status: false, message: 'No se han encontrado mercados'}
        }
    }

    async function getMarketBySlug(slug){
        try{
            let response = await axios.get(`${apiUrl}mercado/${slug}`);
            if(response.status == 200){
                return {status: true, market: response.data.market};
            }
        }catch(error){
            return {status: false, message: 'No se han encontrado mercados'}
        }
    }

    async function getCommerceByMarket(id){
        try{
            let response = await axios.get(`${apiUrl}comercio/mercado/${id}`);
            if(response.status == 200){
                return {status: true, commerces: response.data.comercios};
            }
        }catch(error){
            return {status: false, message: 'No se han encontrado mercados'}
        }
    }

    async function searchMarketByCp(cp){
        try{
            let response = await axios.get(`${apiUrl}mercado/buscar/${cp}`);
            if(response.status == 200){
                return {status: true, markets: response.data.markets};
            }
        }catch(error){
            return {status: false, message: 'No se han encontrado mercados'}
        }
       
    }

    async function searchSuscribedMarket(){
        try{
            let response = await axios.get(`${apiUrl}mercado/suscrito`, {
                withCredentials: true,
                headers: {  
                    Authorization: `Bearer ${localStorage.getItem('commerceToken')}`
                }
            });
            if(response.status == 200){
                return {status: true, markets: response.data.markets};
            }
        }catch(error){
            return {status: false, message: 'No se han encontrado mercados'}
        }
       
    }

    
    async function suscribeToMarkets(arrayIds){
        try{
            let response = await axios.post(`${apiUrl}mercado/suscribir`,
                {ids : arrayIds},
                {
                    withCredentials: true,
                    headers: {  
                        Authorization: `Bearer ${localStorage.getItem('commerceToken')}`
                    }
                }
                
            );
            if(response.status == 200){
                return {status: true, message: response.data.message};
            }
        }catch(error){
            return {status: false, message: 'No se han encontrado mercados'}
        }
       
    }

    return {
        searchMarketByCp,
        searchSuscribedMarket,
        suscribeToMarkets,
        getMarkets,
        getMarketBySlug,
        getCommerceByMarket
    };
}
