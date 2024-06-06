import { Wrapper, DashboardCommerce, DashboardCustomer } from "pages";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard(){
    let navigation = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('commerceToken') && !localStorage.getItem('token')) {
            navigation('/login');
        }
    },[])

    if (localStorage.getItem('commerceToken')) {
        sessionStorage.setItem('entityType', 1);

    } else if(localStorage.getItem('token')) {
        sessionStorage.setItem('entityType', 0);
    }

    return(
        <Wrapper page={sessionStorage.getItem('entityType') == 1 ? <DashboardCommerce /> : <DashboardCustomer />} />
    );

}