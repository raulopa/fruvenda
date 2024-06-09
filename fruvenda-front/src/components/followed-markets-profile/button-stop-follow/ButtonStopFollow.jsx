import { useState } from "react";
import useCustomerService from "services/customer-service/useCustomerService";
import { Button } from "primereact/button";
export default function ButtonStopFollow({toast, item, setRefresh, refresh}){

    const [hover, setHover] = useState(false);
    const {setFollowCommerce } = useCustomerService();
    const handleFollow = (id)=> {
        setFollowCommerce(id).then((response)=>{
            if(response.status){
                toast.current.show({
                    severity: 'success',
                    summary: 'Seguido',
                    detail: response.seguido ? 'Comercio seguido correctamente' : 'Has dejado de seguir el comercio'
                });
                setRefresh(!refresh);
            }else{
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se ha podido seguir al comercio'});
            }
            
        });
    }

    return(
        <Button onClick={(e)=>{e.stopPropagation(); handleFollow(item.id_comercio)}} icon={hover ? 'pi pi-times':'pi pi-check'} label={hover ? 'Dejar de seguir'  : 'Seguido'} onMouseOver={()=> setHover(true)} onMouseLeave={() => setHover(false)} className={ `lg:md:px-4 px-1 lg:md:py-2 py-1 text-aureus-m lg:md:text-lg rounded-full border ${hover ? 'border-red-500 bg-red-500' : 'border-emerald-500 bg-emerald-500'}  text-white`}></Button>
    );
}