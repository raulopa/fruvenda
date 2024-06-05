import { useEffect, useState, useRef } from "react";
import useOrderService from "services/order-service/useOrderService";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import OrderDialogContent from "components/order-list-panel/order-dialog-content/OrderDialogContent";
import Pusher from "pusher-js";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { OverlayPanel } from 'primereact/overlaypanel';

export default function OrderListCustomer() {
    const toast = useRef();
    const overlayRefs = useRef({});
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [orders, setOrders] = useState([]);
    const { getOrdersByCustomer, cancelOrder } = useOrderService();
    const [detailedOrder, setDetailedOrder] = useState();
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        getOrdersByCustomer().then((response) => {
            if (response.status) {
                setOrders(response.data);
            }
        });

        const pusher = new Pusher('8caaee086e75a8c793aa', {
            cluster: 'eu',
            encrypted: false
        });

        const channel = pusher.subscribe('estados');

        channel.bind('nuevo-estado', (php) => {
            const hasMatchingOrder = orders.some(order => order.id_cliente == php); 
            orders.map((order)=> console.log(order.id_cliente +'-'+php))
            if (hasMatchingOrder) {
                getOrdersByCustomer().then((response) => {
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
    }, [refresh]);

    const pusher = new Pusher('8caaee086e75a8c793aa', {
        cluster: 'eu',
        encrypted: false
    });

    const channel = pusher.subscribe('estados');

    channel.bind('nuevo-estado', (php) => {
        const hasMatchingOrder = orders.some(order => order.id_cliente == php); 
        orders.map((order)=> console.log(order.id_cliente +'-'+php))
        if (hasMatchingOrder) {
            getOrdersByCustomer().then((response) => {
                if (response.status) {
                    setOrders(response.data);
                }
            });
        }
    });

    const getSeverity = (estado) => {
        switch (estado) {
            case 'procesado':
                return 'danger';
            case 'confirmado':
                return 'warning';
            case 'preparacion':
                return 'success';
            case 'entregado':
                return 'info';
            case 'cancelado':
                return 'info';
            default:
                return null;
        }
    };

    const handleStatus = async (estado, order) => {
        let status = await cancelOrder(order.id, estado);
        if (status.status) {
            const updatedOrder = status.data.pedido;
            console.log(updatedOrder);
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
                    {order.estado !== 'cancelado' && (
                        <Button onClick={() => handleStatus('cancelado', order)} className="w-full mt-2">
                            <div className="w-full flex justify-center">
                                <Tag className="w-full px-6 bg-black" severity={getSeverity('cancelado')} value={'Cancelar'}></Tag>
                            </div>
                        </Button>
                    )}
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
        <div className="border border-emerald-500 flex flex-col justify-center items-start rounded-xl w-full p-2 shadow-xl h-full">
            <div className="flex justify-between items-center w-full">
                <div className="flex ">
                <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent">Tus pedidos</p>
                </div>
                <Button onClick={()=> setRefresh(!refresh)} className="w-10 h-10 bg-gradient-to-r to-green-500 from-emerald-600 text-white hover:animate-gradient-x rounded-full"  icon="pi pi-refresh"></Button>
            </div>
            <Toast position="top-center" ref={toast} />
            <Dialog header={'Detalles de pedido'} visible={visibleDialog} style={{ width: '50vw' }} onHide={() => { setVisibleDialog(false); setDetailedOrder(null) }}>
                {detailedOrder != null &&
                    <OrderDialogContent order={detailedOrder} toast={toast}></OrderDialogContent>
                }
            </Dialog>
            <DataTable removableSort className="text-aureus-m h-full w-full" value={orders} tableStyle={{ minWidth: '20rem' }}>
                <Column field="id" header="Id" ></Column>
                <Column sortable field="fecha_hora" header="Fecha"></Column>
                <Column sortable field="estado" header="Estado" body={estadoTemplate}></Column>
                <Column body={detailsTemplate}></Column>
            </DataTable>
        </div>
    );
}
