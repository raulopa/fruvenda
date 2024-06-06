import { DashboardProfileEdit, DashboardProfileView, FollowedMarketsProfilePanel, LastPostsCustomerDashboard, ReviewsDashboardPanel } from "components";
import OrderListCustomer from "components/order-list-customer/OrderListCustomer";
import { useEffect, useRef, useState } from "react";
import useCustomerService from "services/customer-service/useCustomerService";
import { Button } from "primereact/button";
import { Store, Star } from "react-huge-icons/bulk";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";


export default function DashboardCustomer() {
    let toast = useRef(null);
    const [customer, setCustomer] = useState(null);
    const [edit, setEdit] = useState(false);
    const { getCustomer, getLastPosts } = useCustomerService();
    const [refresh, setRefresh] = useState(false);
    const [visibleDialogReview, setVisibleDialogReview] = useState(false);
    const [visibleDialogFollowed, setVisibleDialogFollowed] = useState(false);
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        getCustomer().then((response) => {
            if (response.status) {
                setCustomer(response.cliente);
            }
        });

        getLastPosts().then((response) => {
            if (response.status) {
                setPosts(response.posts);
            }
        });
    }, [refresh]);

    if (customer === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 h-full flex flex-col w-full">
            <Toast ref={toast} position="bottom-right" />
            <Dialog  header={visibleDialogFollowed ? 'Comercios a los que sigues' : 'Gestiona tus reseñas'} visible={visibleDialogReview || visibleDialogFollowed} style={{ width: '50vw', height: '70vh' }} onHide={() => { setVisibleDialogReview(false); setVisibleDialogFollowed(false); }}>
                { visibleDialogReview && <ReviewsDashboardPanel toast={toast} /> }
                {visibleDialogFollowed && <FollowedMarketsProfilePanel toast={toast} />}
            </Dialog>
            <div className="flex">
                <h1 className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-xl lg:text-aureus-2xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">
                    ¡Hola, {customer.nombre}!
                </h1>
            </div>
            <div className="flex h-full">
                <div className="w-6/12">
                    <OrderListCustomer />
                </div>
                <div className="w-6/12 flex flex-col justify-center items-end">
                    <div className="flex w-11/12">
                        <div className="w-10/12 ">
                            <p className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">
                                Últimos post
                            </p>
                            <div className="outline outline-1 outline-emerald-500 h-80 -mt-5 mb-1 rounded-lg mr-1">
                            <LastPostsCustomerDashboard />
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-end">
                            <div className="mr-1 mb-1 flex flex-col justify-center items-center bg-gradient-to-r to-green-500 from-emerald-600 rounded-lg shadow-lg w-44 h-44">
                                <Button onClick={()=> setVisibleDialogFollowed(true)} className="w-full h-full flex flex-col justify-center items-center">
                                    <div className='flex flex-col justify-center items-center'><Store className='w-24 h-24 text-white font-bold' /></div>
                                    <p className="text-white text-aureus-l">Tus comercios</p>
                                </Button>
                            </div>
                            <div className="mr-1 mb-1 flex flex-col justify-center items-center bg-gradient-to-r to-green-500 from-emerald-600 rounded-lg shadow-lg w-44 h-44">
                                <Button onClick={()=> setVisibleDialogReview(true)} className="w-full h-full flex flex-col justify-center items-center">
                                    <div className='flex flex-col justify-center items-center'><Star className='w-20 h-20 text-white font-bold' /></div>
                                    <p className="text-white text-aureus-l">Tus reseñas</p>
                                </Button>
                            </div>
                        </div>

                    </div>
                    {edit ? (
                        <DashboardProfileEdit customer={customer} edit={setEdit} refresh={setRefresh} />
                    ) : (
                        <DashboardProfileView customer={customer} edit={setEdit} />
                    )}
                </div>
            </div>

        </div>
    );
}
