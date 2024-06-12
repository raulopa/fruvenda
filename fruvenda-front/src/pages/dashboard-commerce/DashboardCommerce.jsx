import ProductCard from "components/product-card/ProductCard";
import { Carousel } from 'primereact/carousel';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useProductService from "services/product-service/useProductService";
import useCommerceService from "services/commerce-service/useCommerceService";
import { Button } from 'primereact/button';
import { MiniStoreSmile, ClockCircle, User, Pencil, Announcement } from "react-huge-icons/bulk";
import { Dialog } from "primereact/dialog";
import { MarketManagementPanel, TimetableManagementPanel, OrderListPanel, MarketProfileEdit, MarketManagementPostPanel, TakeOrderPanel } from "components";
import { Toast } from "primereact/toast";




export default function DashboardCommerce() {
    let navigation = useNavigate()
    const toast = useRef(null);
    const { getCommerceProducts } = useProductService();
    const { getCommerce } = useCommerceService();
    const [commerce, setCommerce] = useState(null);

    const [refreshOrders, setRefreshOrders] = useState(false);

    const [products, setProducts] = useState([]);
    const [visibleMarketDialog, setVisibleMarketDialog] = useState(false);
    const [visibleTimetableDialog, setVisibleTimetableDialog] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visiblePostsDialog, setVisiblePostsDialog] = useState(false);
    const [visibleOrderDialog, setVisibleOrderDialog] = useState(false);
    const [phone, setPhone] = useState(false);

    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    useEffect(() => {
        getCommerceProducts().then((response) => {
            if (Array.isArray(response)) {
                setProducts(response);
            }
        });
        getCommerce().then((response) => {
            setCommerce(response.comercio);
        });
    }, [refreshOrders]);
    const productTemplate = (product) => {
        return (
            <ProductCard product={product}></ProductCard>
        )
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) {
                setPhone(true)
            } else {
                setPhone(false)
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const goToGestionProductos = () => {
        navigation('/product-management');
    }

    const goToOrderManagement = () => {
        navigation('/order-management');
    }

    const hideDialog = () => {
        setVisibleMarketDialog(false);
        setVisibleTimetableDialog(false);
        setVisibleEdit(false);
        setVisiblePostsDialog(false);
        setVisibleOrderDialog(false);
    }

    return (
        <div className="p-4 h-11/12 flex flex-col">
            <Toast ref={toast} position="bottom-right" />
            <Dialog
                header={visibleTimetableDialog ? "Administra tus horarios" : visibleOrderDialog ? 'Toma nota de un pedido' : visibleMarketDialog ? "Administra tus mercados" : visiblePostsDialog ? 'Administre sus posts' : "Cambie sus datos"}
                style={{ width: phone ? '100%' : '50vw', height: phone ? '100%' : '70%' }}
                visible={visibleMarketDialog || visibleTimetableDialog || visibleEdit || visiblePostsDialog || visibleOrderDialog}
                maximizable
                modal
                onHide={() => {
                    hideDialog();
                }}
            >
                {visibleTimetableDialog && <TimetableManagementPanel restartDialog={hideDialog} toast={toast} />}
                {visibleMarketDialog && <MarketManagementPanel restartDialog={hideDialog} toast={toast} />}
                {visibleEdit && <MarketProfileEdit commerce={commerce} visible={setVisibleEdit} setComercio={setCommerce} toast={toast} />}
                {visiblePostsDialog && <MarketManagementPostPanel toast={toast} />}
                {visibleOrderDialog && <TakeOrderPanel commerce={commerce} toast={toast} visible={hideDialog} refresh={refreshOrders} setRefresh={setRefreshOrders}/>}

            </Dialog>
            {commerce &&

                <div className="flex mt-10 lg:md:mt-0">
                    <h1 className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-l lg:text-aureus-2xl h-24 bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">
                        ¡Hola, {commerce.nombre}!
                    </h1>
                </div>
            }

            <div className="h-full flex lg:md:flex-row flex-col">
                <div className="w-full lg:md:w-8/12 m-1">
                    <div className="w-full border p-2 border-emerald-500 rounded-lg shadow-lg">
                        <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent">Tus productos</p>
                        {products.length != 0 ? <Carousel responsiveOptions={responsiveOptions} value={products} numVisible={4} numScroll={2} itemTemplate={productTemplate} circular>
                        </Carousel> :
                            <div className="flex justify-around">
                                <div className="w-64 h-80 bg-slate-200 animate-pulse rounded-lg mt-2"></div>
                                <div className="w-64 h-80 bg-slate-200 animate-pulse rounded-lg mt-2"></div>
                                <div className="w-64 h-80 bg-slate-200 animate-pulse rounded-lg mt-2"></div>
                                <div className="w-64 h-80 bg-slate-200 animate-pulse rounded-lg mt-2"></div>
                            </div>
                        }

                        <div className="flex justify-end">
                            <Button onClick={goToGestionProductos} label="Gestionar todos los productos" className="w-full lg:md:w-auto flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 py-2 px-2 rounded-lg text-white hover:animate-gradient-x"></Button>
                        </div>
                    </div>
                    <div>
                        <div className="flex">
                            <div className="mr-1 mt-4 flex flex-col justify-center items-center bg-gradient-to-r to-green-500 from-emerald-600 rounded-lg shadow-lg w-48 h-48">
                                <Button onClick={() => setVisibleMarketDialog(true)} className="w-full h-full flex flex-col justify-center items-center">
                                    <div className='flex flex-col mr-2 justify-center items-center'><MiniStoreSmile className='w-24 h-24 text-white font-bold' /></div>
                                    <p className="text-white text-aureus-l">Tus mercados</p>
                                </Button>
                            </div>
                            <div className="mr-1 mt-4 flex flex-col justify-center items-center bg-gradient-to-r to-green-500 from-emerald-600 rounded-lg shadow-lg w-48 h-48">
                                <Button onClick={() => setVisibleTimetableDialog(true)} className="w-full h-full flex flex-col justify-center items-center">
                                    <div className='flex flex-col mr-2 justify-center items-center'><ClockCircle className='w-24 h-24 text-white font-bold' /></div>
                                    <p className="text-white text-aureus-l">Tus horarios</p>
                                </Button>
                            </div>
                            <div className="mr-1 mt-4 flex flex-col justify-center items-center bg-gradient-to-r to-green-500 from-emerald-600 rounded-lg shadow-lg w-48 h-48">
                                <Button onClick={() => setVisiblePostsDialog(true)} className="w-full h-full flex flex-col justify-center items-center">
                                    <div className='flex flex-col mr-2 justify-center items-center'><Announcement className='w-24 h-24 text-white font-bold' /></div>
                                    <p className="text-white text-aureus-l">Tus posts</p>
                                </Button>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="mt-1 bg-gradient-to-r to-green-500 from-emerald-600 rounded-lg shadow-lg w-96-1 h-28">
                                <Button onClick={() => navigation('/profile')} className="w-full h-full flex  justify-center items-center">
                                    <div className='flex flex-col mr-2 justify-center items-center'><User className='w-24 h-24 text-white font-bold' /></div>
                                    <p className="text-white text-aureus-l">Tu perfil</p>
                                </Button>
                            </div>
                            <div className="mt-1 mx-1 bg-gradient-to-r to-green-500 from-emerald-600 rounded-lg shadow-lg w-48 h-28">
                                <Button onClick={() => setVisibleEdit(true)} className="w-full h-full flex  justify-center items-center">
                                    <div className='flex flex-col mr-2 justify-center items-center'><Pencil className='w-16 h-24 text-white font-bold' /></div>
                                    <p className="text-white text-aureus-l">Tus datos</p>
                                </Button>
                            </div>
                        </div>

                    </div>

                </div>
                <div className="w-full  lg:md:w-4/12 m-1 relative">
                    <div className="w-full h-96 lg:md:h-full border p-2 border-emerald-500 rounded-lg shadow-lg overflow-hidden">
                        <OrderListPanel externalRefresh={refreshOrders} />
                        <div className="absolute bottom-2 flex justify-between w-full">
                            <Button onClick={() => setVisibleOrderDialog(true)} className="flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 py-2 px-2 rounded-lg text-white hover:animate-gradient-x" label="Tomar pedido" />
                            <Button onClick={goToOrderManagement} className=" mr-4 flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 py-2 px-2 rounded-lg text-white hover:animate-gradient-x" label="Gestión de pedidos" />
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}