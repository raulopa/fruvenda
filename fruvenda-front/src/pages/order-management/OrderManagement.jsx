import { OrderManagementPanel } from "components";
import { Wrapper } from "pages";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

export default function OrderManagement(){

    let navigation = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem('entityType') != '1' && !localStorage.getItem('commerceToken')) {
            navigation('/login');
        }
    }, []);

    return(
        <div>
            <Wrapper page={<OrderManagementPanel />}></Wrapper>
        </div>
    );
}