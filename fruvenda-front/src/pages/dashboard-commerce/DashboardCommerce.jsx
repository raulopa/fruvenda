import ProductCard from "components/product-card/ProductCard";
import { Carousel } from 'primereact/carousel';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useProductService from "services/product-service/useProductService";
import useCommerceService from "services/commerce-service/useCommerceService";
import { Button } from 'primereact/button';
import { MiniStoreSmile, ClockCircle, User, Pencil, Announcement } from "react-huge-icons/bulk";
import { Dialog } from "primereact/dialog";
import { MarketManagementPanel, TimetableManagementPanel, OrderListPanel, MarketProfileEdit, MarketManagementPostPanel } from "components";
import { Toast } from "primereact/toast";




export default function DashboardCommerce() {
    let navigation = useNavigate()
    const toast = useRef(null);
    const { getCommerceProducts } = useProductService();
    const { getCommerce } = useCommerceService();
    const [commerce, setCommerce] = useState(null);

    const [products, setProducts] = useState([]);
    const [visibleMarketDialog, setVisibleMarketDialog] = useState(false);
    const [visibleTimetableDialog, setVisibleTimetableDialog] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visiblePostsDialog, setVisiblePostsDialog] = useState(false);
    useEffect(() => {
        getCommerceProducts().then((response) => {
            if (Array.isArray(response)) {
                setProducts(response);
            }
        });
        getCommerce().then((response) => {
            setCommerce(response.comercio);
        });
    }, []);
    const productTemplate = (product) => {
        return (
            <ProductCard product={product}></ProductCard>
        )
    }

    const goToGestionProductos = () => {
        navigation('/product-management');
    }

    const hideDialog = () => {
        setVisibleMarketDialog(false);
        setVisibleTimetableDialog(false);
        setVisibleEdit(false);
        setVisiblePostsDialog(false);
    }

    return (
        <div className="p-4 h-11/12 flex flex-col">
            <Toast ref={toast} position="bottom-right" />
            <Dialog
                header={visibleTimetableDialog ? "Administra tus horarios" : visibleMarketDialog ? "Administra tus mercados" : visiblePostsDialog ? 'Administre sus posts' : "Cambie sus datos"}
                style={{ width: '50%', height: '70%' }}
                visible={visibleMarketDialog || visibleTimetableDialog || visibleEdit || visiblePostsDialog}
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

            </Dialog>
            {commerce &&

                <div className="flex">
                    <h1 className="font-outfit-semibold pl-2 pt-6 pb-6 text-aureus-xl lg:text-aureus-2xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">
                        ¡Hola, {commerce.nombre}!
                    </h1>
                </div>
            }

            <div className="h-full flex">
                <div className="w-8/12 m-1">

                    <div className="w-full border p-2 border-emerald-500 rounded-lg shadow-lg">
                        <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent">Tus productos</p>
                        {products.length != 0 ? <Carousel value={products} numVisible={4} numScroll={2} itemTemplate={productTemplate} circular>
                        </Carousel> :
                            <div className="flex justify-around">
                                <div className="w-64 h-96 bg-slate-200 animate-pulse rounded-lg mt-2"></div>
                                <div className="w-64 h-96 bg-slate-200 animate-pulse rounded-lg mt-2"></div>
                                <div className="w-64 h-96 bg-slate-200 animate-pulse rounded-lg mt-2"></div>
                                <div className="w-64 h-96 bg-slate-200 animate-pulse rounded-lg mt-2"></div>
                            </div>
                        }

                        <div className="flex justify-end">
                            <Button onClick={goToGestionProductos} label="Gestionar todos los productos" className="flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 py-2 px-2 rounded-lg text-white hover:animate-gradient-x"></Button>
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
                <div className="w-4/12 m-1">
                    <div className="w-full h-full border p-2 border-emerald-500 rounded-lg shadow-lg overflow-hidden">
                        <OrderListPanel />
                    </div>
                </div>
            </div>


        </div>
    );
}