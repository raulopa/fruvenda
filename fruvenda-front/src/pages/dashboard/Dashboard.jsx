import { Wrapper, DashboardCommerce, DashboardCustomer } from "pages";

export default function Dashboard(){
    if (localStorage.getItem('commerceToken')) {
        sessionStorage.setItem('entityType', 1);

    } else {
        sessionStorage.setItem('entityType', 0);
    }

    return(
        <Wrapper page={sessionStorage.getItem('entityType') == 1 ? <DashboardCommerce /> : <DashboardCustomer />} />
    );

}