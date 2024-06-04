import { useEffect, useState } from "react";
import useCustomerService from "services/customer-service/useCustomerService";
import { TabView, TabPanel } from 'primereact/tabview';
import { ReviewsProfilePanel } from "components";

export default function ProfileCustomer() {
    const [customer, setCustomer] = useState(null);
    const { getCustomer } = useCustomerService();

    useEffect(() => {
        getCustomer().then((response) => {
            if (response.status) {
                console.log(response.cliente)
                setCustomer(response.cliente);
            }
        });
        
    }, []);

    const tabHeaderTemplate = (icon, text) => (options) => {
        return (
            <div className="flex justify-center items-baseline my-2 mx-5" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <i className={icon}></i>
                <span className="font-bold ml-2 white-space-nowrap">{text}</span>
            </div>
        );
    };

    return (
        <div className="p-4 h-full flex flex-col">
            <div className="h-64 flex items-center">
                <div className="h-full mr-10">
                <div className="h-64 relative w-64">
                    {customer != null && customer.image != null ? (
                        <img src={customer.image} alt="Customer profile" className="h-full w-64 aspect-square rounded-full" />
                    ) : (
                        <div className="h-full w-full bg-gray-200 animate-pulse rounded-full"></div>
                    )}
                </div>
                </div>
                <div>
                    {customer ? (
                        <h1 className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-xl lg:text-aureus-2xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">
                            {customer.nombre} {customer.apellidos}
                        </h1>
                    ) : (
                        <h1 className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-xl lg:text-aureus-2xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">
                            Cargando...
                        </h1>
                    )}
                </div>
            </div>
            <hr className="my-4" />

            <TabView >
                <TabPanel headerTemplate={tabHeaderTemplate('pi pi-comment', 'Reseñas')}>
                    <div className="flex flex-col">
                        <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">Reseñas</p>
                        <ReviewsProfilePanel readOnly={true} />
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
}
