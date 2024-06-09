import axios from "axios";

const apiUrl = process.env.REACT_APP_LARAVEL_API_URL;
export default function useTimetableService() {

    async function saveTimetable(timetable, market){
        try{
            let token = localStorage.getItem('commerceToken');

            let response = await axios.post(`${apiUrl}horario`, {timetable: timetable, mercado:market}, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status == 200){
                
                return {status: true, timetables: response.data.horarios}
            }
        }catch(error){
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    async function getTimetables(){
        try{
            let token = localStorage.getItem('commerceToken');
            let response = await axios.get(`${apiUrl}horario`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status == 200){
                return {status: true, timetables: response.data.horarios}
            }
        }catch(error){
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    async function getTimetablesPublic(comercio){
        try{
            let response = await axios.get(`${apiUrl}horario/${comercio}`);

            if(response.status == 200){
                return {status: true, timetables: response.data.timetables}
            }
        }catch(error){
            return { 'status': false, message: JSON.parse(error.request.responseText).message }
        }
    }

    return {
        saveTimetable,
        getTimetables
    }
}