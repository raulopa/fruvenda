import { useEffect, useState } from "react";
import useCustomerService from "services/customer-service/useCustomerService";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";

export default function FollowedMarketsProfilePanel({toast}){
    const [follows, setFollows] = useState([]);
    const { getFollowed, setFollowCommerce } = useCustomerService();
    const [hover, setHover] = useState(false);
    const [refresh, setRefresh] = useState(false);
    useEffect(()=> {
        getFollowed().then((response) => {
            if(response.status){
                setFollows(response.seguidos)
            }
        });
    }, [refresh]);


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

    const itemTemplate = (item, key) => (
        <div key={key} className="flex  flex-col w-full">
            <div className="flex">
            <div className="flex items-center w-9/12">
                <img src={item.comercio_foto} className="w-16 h-16 rounded-full mr-10" />
                <p className="text-aureus-l">{item.comercio_nombre}</p>
            </div>
            <div className="flex items-center ">
                <Button onClick={()=> handleFollow(item.id_comercio)} icon={hover ? 'pi pi-times':'pi pi-check'} label={hover ? 'Dejar de seguir'  : 'Seguido'} onMouseOver={()=> setHover(true)} onMouseLeave={() => setHover(false)} className={ `px-4 py-2 rounded-full border ${hover ? 'border-red-500 bg-red-500' : 'border-emerald-500 bg-emerald-500'}  text-white`}></Button>
            </div>
            </div>
            
           <hr className="mt-6" />
        </div>
    );
    
    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((follow, index) => {
            return itemTemplate(follow, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };
    
    return(
        <div>
            <DataView value={follows} listTemplate={listTemplate} />
        </div>
    );
}