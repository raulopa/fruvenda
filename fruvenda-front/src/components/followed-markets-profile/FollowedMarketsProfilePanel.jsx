import { useEffect, useState } from "react";
import useCustomerService from "services/customer-service/useCustomerService";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import { useNavigate} from "react-router-dom";
import ButtonStopFollow from "./button-stop-follow/ButtonStopFollow";

export default function FollowedMarketsProfilePanel({toast}){
    let navigation = useNavigate();
    const [follows, setFollows] = useState([]);
    const { getFollowed, setFollowCommerce } = useCustomerService();
   
    const [refresh, setRefresh] = useState(false);
    useEffect(()=> {
        getFollowed().then((response) => {
            if(response.status){
                setFollows(response.seguidos)
            }
        });
    }, [refresh]);


   

    const goToProfile = (slug) => {
        navigation(`/profile/${slug}`)
    }

    const itemTemplate = (item, key) => (
        <div  key={key} className="flex flex-col w-full ">
            <div onClick={() => goToProfile(item.slug)} className="flex cursor-pointer hover:bg-gray-100 py-6">
            <div  className="flex items-center w-9/12">
                <img src={item.comercio_foto} className="lg:md:w-16 lg:md:h-16 w-10 h-10 rounded-full lg:md:mr-10" />
                <p className="text-aureus-m lg:md:text-aureus-l lg:md:ml-0 ml-2">{item.comercio_nombre}</p>
            </div>
            <div className="flex items-center ">
                <ButtonStopFollow toast={toast} item={item} refresh={refresh} setRefresh={setRefresh} />
            </div>
            </div>
            
           <hr className="" />
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