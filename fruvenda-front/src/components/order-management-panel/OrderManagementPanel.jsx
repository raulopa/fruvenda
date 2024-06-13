import { useState, useEffect, useRef } from "react";
import useProductService from "services/product-service/useProductService";
import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import useOrderService from "services/order-service/useOrderService";
import Pusher from "pusher-js";
import { OverlayPanel } from "primereact/overlaypanel";
import OrderDialogContent from "components/order-list-panel/order-dialog-content/OrderDialogContent";

export default function OrderManagementPanel() {
    const toast = useRef(null);
    const [orders, setOrders] = useState([]);
    const [delivered, setDelivered] = useState([]);
    const [cancelled, setCancelled] = useState([]);
    const { getOrdersByCommerce, changeStatus } = useOrderService();
    const [refresh, setRefresh] = useState(false);
    const overlayRefs = useRef({}); // Store references to multiple OverlayPanels
    const [detailedOrder, setDetailedOrder] = useState();
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [phone, setPhone] = useState(false);

    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            estado: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            fecha: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            cliente: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
        });
        setGlobalFilterValue('');
    };


    useEffect(() => {
        getOrdersByCommerce().then((response) => {
            if (response.status) {
                const orders = [];
                const cancelled = [];
                const delivered = [];

                response.data.forEach((order) => {
                    if (order.estado === 'cancelado') {
                        cancelled.push(order);
                    } else if (order.estado === 'entregado') {
                        delivered.push(order);
                    } else {
                        orders.push(order);
                    }
                });

                setOrders(orders);
                setCancelled(cancelled);
                setDelivered(delivered);
                initFilters();
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
                getOrdersByCommerce().then((response) => {
                    if (response.status) {
                        const orders = [];
                        const cancelled = [];
                        const delivered = [];

                        response.data.forEach((order) => {
                            if (order.estado === 'cancelado') {
                                cancelled.push(order);
                            } else if (order.estado === 'entregado') {
                                delivered.push(order);
                            } else {
                                orders.push(order);
                            }
                        });

                        setOrders(orders);
                        setCancelled(cancelled);
                        setDelivered(delivered);
                    }
                });

            }

        });

        const channel2 = pusher.subscribe('estados');

        channel2.bind('nuevo-estado', (php) => {
            const hasMatchingOrder = orders.some(order => order.id_cliente == php);
            if (hasMatchingOrder) {
                getOrdersByCommerce().then((response) => {
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


    const estadoTemplate = (order) => (
        <div>
            <Button onClick={(e) => order.estado != 'cancelado' || order.estado != 'entregado' && overlayRefs.current[order.id].toggle(e)}>
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

    const startContent = (tabla) => (
        <div className="flex font-outfit-semibold p-2 text-aureus-l">
            <p className="mr-10">{tabla}</p>
        </div>
    );

    const endContent = (
        <div>
            <div className="p-inputgroup flex-1">
                <InputText placeholder="Buscar pedido..." value={globalFilterValue} onChange={onGlobalFilterChange} className="h-10 p-2" />
                <Button icon="pi pi-search" className="flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white" />
            </div>
        </div>
    );

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

    return (
        <div className="w-full p-4">
            <Toast ref={toast} position="bottom-right" />
            <Dialog header={'Detalles de pedido'} visible={visibleDialog} style={{ width: phone ? '100%' : '50vw' }} onHide={() => { setVisibleDialog(false); setDetailedOrder(null) }}>
                {detailedOrder != null &&
                    <OrderDialogContent order={detailedOrder} toast={toast}></OrderDialogContent>
                }
            </Dialog>
            <div className="flex mt-16 lg:md:mt-0">
                <h1 className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent">Gestión de Pedidos</h1>
            </div>
            <div className="lg:md:mt-8">
                <DataTable filters={filters} globalFilterFields={['estado', 'fecha', 'cliente', 'id']} value={orders} removableSort header={<Toolbar start={startContent('PENDIENTES')} end={endContent} />} paginator rows={5} rowsPerPageOptions={[5, 10, 20]} >
                    <Column sortable header="Id" field="id"></Column>
                    {!phone ?? <Column sortable header="Cliente" field="id_cliente"></Column>}
                    {!phone ?? <Column sortable header="Fecha" field="fecha_hora" ></Column>}
                    <Column sortable header="Estado" body={estadoTemplate}></Column>
                    <Column sortable header="Ver" body={detailsTemplate}></Column>
                </DataTable>
            </div>

            <div className="mt-8">
                <DataTable value={delivered} removableSort header={<Toolbar start={startContent('ENTREGADOS')} />} paginator rows={5} rowsPerPageOptions={[5, 10, 20]} >
                    <Column sortable header="Id" field="id"></Column>
                    {!phone ?? <Column sortable header="Cliente" field="id_cliente"></Column>}
                    {!phone ?? <Column sortable header="Fecha" field="fecha_hora" ></Column>}
                    <Column sortable header="Estado" body={estadoTemplate}></Column>
                    <Column sortable header="Ver" body={detailsTemplate}></Column>
                </DataTable>
            </div>

            <div className="mt-8">
                <DataTable value={cancelled} removableSort header={<Toolbar start={startContent('CANCELADOS')} />} paginator rows={5} rowsPerPageOptions={[5, 10, 20]} >
                    <Column sortable header="Id" field="id"></Column>
                    {!phone ?? <Column sortable header="Cliente" field="id_cliente"></Column>}
                    {!phone ?? <Column sortable header="Fecha" field="fecha_hora" ></Column>}
                    <Column sortable header="Estado" body={estadoTemplate}></Column>
                    <Column sortable header="Ver" body={detailsTemplate}></Column>
                </DataTable>
            </div>

        </div>
    );
}