import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { useEffect, useRef, useState } from "react";
import useOrderService from "services/order-service/useOrderService";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import OrderDialogContent from "./order-dialog-content/OrderDialogContent";
import { OverlayPanel } from 'primereact/overlaypanel';
import Pusher from "pusher-js";

export default function OrderListPanel({ externalRefresh }) {
    const toast = useRef();
    const [orders, setOrders] = useState([]);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const { getOrdersPendingByCommerce, changeStatus } = useOrderService();
    const [detailedOrder, setDetailedOrder] = useState();
    const overlayRefs = useRef({}); // Store references to multiple OverlayPanels
    const [refresh, setRefresh] = useState(false);
    const [phone, setPhone] = useState(false);

    useEffect(() => {
        getOrdersPendingByCommerce().then((response) => {
            if (response.status) {
                setOrders(response.data);
            }
        });
        const pusher = new Pusher('8caaee086e75a8c793aa', {
            cluster: 'eu',
            encrypted: false
        });

        const channel = pusher.subscribe('pedidos');

        channel.bind('nuevo-pedido', (php) => {
            const hasOrders = orders.length > 0;
            const hasMatchingOrder = orders.some(order => php.includes(order.id_comercio));

            // Si hay órdenes y alguna coincide o si no hay órdenes, ejecutamos fetchOrders
            if (hasOrders && hasMatchingOrder || !hasOrders) {
                getOrdersPendingByCommerce().then((response) => {
                    if (response.status) {
                        setOrders(response.data);
                    }
                });
            }

        });

        const channel2 = pusher.subscribe('estados');

        channel2.bind('nuevo-estado', (php) => {
            const hasMatchingOrder = orders.some(order => order.id_cliente == php);
            if (hasMatchingOrder) {
                getOrdersPendingByCommerce().then((response) => {
                    if (response.status) {
                        setOrders(response.data);
                    }
                });
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };

    }, [refresh, externalRefresh]);

    const pusher = new Pusher('8caaee086e75a8c793aa', {
        cluster: 'eu',
        encrypted: false
    });

    const channel = pusher.subscribe('pedidos');

    channel.bind('nuevo-pedido', (php) => {
        const hasOrders = orders.length > 0;
        const hasMatchingOrder = orders.some(order => php.includes(order.id_comercio));

        // Si hay órdenes y alguna coincide o si no hay órdenes, ejecutamos fetchOrders
        if (hasOrders && hasMatchingOrder || !hasOrders) {
            getOrdersPendingByCommerce().then((response) => {
                if (response.status) {
                    setOrders(response.data);
                }
            });
        }

    });

    const channel2 = pusher.subscribe('estados');

    channel2.bind('nuevo-estado', (php) => {
        const hasMatchingOrder = orders.some(order => order.id_cliente == php);
        if (hasMatchingOrder) {
            getOrdersPendingByCommerce().then((response) => {
                if (response.status) {
                    setOrders(response.data);
                }
            });
        }
    });

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

    const getSeverity = (estado) => {
        switch (estado) {
            case 'procesado':
                return 'danger';
            case 'confirmado':
                return 'warning';
            case 'preparacion':
                return 'success';
            case 'listo':
                return 'info'
            case 'entregado':
                return 'info';
            default:
                return null;
        }
    };

    const handleStatus = async (estado, order) => {
        let status = await changeStatus(order.id, estado);
        if (status.status) {
            const updatedOrder = status.data.pedido;
            toast.current.show({ severity: 'success', summary: 'Actualizado', detail: status.data.message });

            // Update the orders array with the updated order
            setOrders((prevOrders) =>
                prevOrders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
            );

            // Close the specific OverlayPanel
            overlayRefs.current[order.id].hide();
        }
    };

    const estadoTemplate = (order) => (
        <div>
            <Button onClick={(e) => overlayRefs.current[order.id].toggle(e)}>
                <Tag className={`${order.estado == 'cancelado' ? 'bg-black' : ''} capitalize`} severity={getSeverity(order.estado)} value={order.estado}></Tag>
            </Button>
            <OverlayPanel ref={(el) => (overlayRefs.current[order.id] = el)} closeOnEscape>
                <div className="flex flex-col w-full h-full items-center justify-center">
                    <Button onClick={() => handleStatus('confirmado', order)} className="w-full mt-2">
                        <div className="w-full flex justify-center">
                            <Tag className="w-full capitalize" severity={getSeverity('confirmado')} value={'confirmado'}></Tag>
                        </div>
                    </Button>
                    <Button onClick={() => handleStatus('preparacion', order)} className="w-full mt-2">
                        <div className="w-full flex justify-center">
                            <Tag className="w-full capitalize" severity={getSeverity('preparacion')} value={'preparacion'}></Tag>
                        </div>
                    </Button>
                    <Button onClick={() => handleStatus('listo', order)} className="w-full mt-2">
                        <div className="w-full flex justify-center">
                            <Tag className="w-full px-6 capitalize bg-" severity={getSeverity('listo')} value={'listo'}></Tag>
                        </div>
                    </Button>
                    <Button onClick={() => handleStatus('entregado', order)} className="w-full mt-2">
                        <div className="w-full flex justify-center">
                            <Tag className="w-full px-6 capitalize bg-purple-400" severity={getSeverity('entregado')} value={'entregado'}></Tag>
                        </div>
                    </Button>
                    
                    <Button onClick={() => handleStatus('cancelado', order)} className="w-full mt-2">
                        <div className="w-full flex justify-center">
                            <Tag className="w-full px-6 capitalize bg-black" severity={getSeverity('cancelado')} value={'cancelado'}></Tag>
                        </div>
                    </Button>
                </div>
            </OverlayPanel>
        </div>
    );

    const detailsTemplate = (order) => (
        <Button icon="pi pi-eye" onClick={() => {
            setDetailedOrder(order); setVisibleDialog(true);
        }} className="flex justify-center w-8 h-8 bg-green-500 text-white" />
    );

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="flex ">
                    <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent">Tus pedidos</p>
                </div>
            </div>

            <div className="overflow-y-auto overflow-x-hidden h-full">
                <Toast ref={toast} position="bottom-right" />
                <Dialog header={'Detalles de pedido'} visible={visibleDialog} style={{ width: phone ? '100vw' : '50vw', height: '60%' }} onHide={() => { setVisibleDialog(false); setDetailedOrder(null) }}>
                    {detailedOrder != null &&
                        <OrderDialogContent order={detailedOrder} toast={toast}></OrderDialogContent>
                    }
                </Dialog>
                <DataTable removableSort className="text-aureus-m h-full" value={orders} tableStyle={{ minWidth: '20rem' }}>
                    <Column field="id" header="Id" ></Column>
                    {!phone && <Column sortable field="fecha_hora" header="Fecha"></Column>}
                    <Column sortable field="estado" header="Estado" body={estadoTemplate}></Column>
                    <Column body={detailsTemplate}></Column>
                </DataTable>
            </div>

        </div>
    );

}
