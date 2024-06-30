import { DataView } from "primereact/dataview";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import useProductService from "services/product-service/useProductService";
import TakeOrderCard from "./take-order-card/TakeOrderCard";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import CurrentOrderDialog from "./current-order-dialog/CurrentOrderDialog";
import useOrderService from "services/order-service/useOrderService";

export default function TakeOrderPanel({ commerce, toast, visible, refresh, setRefresh }) {

    const [customer, setCustomer] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [products, setProducts] = useState([]);
    const [lineOrder, setLineOrder] = useState([]);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const { takeOrder } = useOrderService();
    const [phone, setPhone] = useState(false);


    const { getCommerceProductsForCustomers } = useProductService();
    useEffect(() => {
        getCommerceProductsForCustomers(commerce.id).then((response) => {
            if (Array.isArray(response.products)) {
                setProducts(response.products);
            }
        });
    }, []);

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

    const itemTemplate = (item) => {
        return <TakeOrderCard key={item.id} item={item} addProduct={setLineOrder} />
    }


    const listTemplate = (items, layout) => {

        return (
            <div className="flex justify-center">
                <div className={items.length < 5 ? 'flex justify-center gap-6' : `grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6`}>
                    {items.map((item, index) => itemTemplate(item, layout, index))}
                </div>
            </div>
        );
    };

    const handleSubmit = async () => {
        if (customer == '') {
            toast.current.show({ severity: 'error', summary: 'Requerido', detail: 'El nombre de cliente es requerido' });
        }

        if (customerPhone == '') {
            toast.current.show({ severity: 'error', summary: 'Requerido', detail: 'El telefono del cliente es requerido' });
        }

        if (lineOrder.length == 0) {
            toast.current.show({ severity: 'error', summary: 'Vacío', detail: 'No hay ningun producto apuntado' });

        }

        let linesWithId = lineOrder.map((line) => {
            return { id_producto: line.producto.id, cantidad: line.cantidad, precio_producto: line.precio_producto }
        })

        let ordered = await takeOrder(customer, linesWithId);
        if (ordered.status) {
            toast.current.show({ severity: 'success', summary: 'Realizado', detail: 'El pedido ha sido realizado correctamente' });
            setRefresh(!refresh);
            visible();

        }

    }

    return (
        <div className="p-4 w-full h-full">
            <Dialog header={"Pedido actual"}
                style={{ width: phone ? '100%' : '50%', height: '70%' }}
                visible={visibleDialog}
                modal
                maximizable
                onHide={() => {
                    setVisibleDialog(false)
                }}>
                <CurrentOrderDialog lineOrders={lineOrder} setLineOrders={setLineOrder} />
            </Dialog>
            <div className="flex flex-row justify-between items-center">
                <div className="w-10/12 flex flex-col lg:md:flex-row justify-between">
                    <InputText placeholder="Nombre del cliente..." className="border border-emerald-500 rounded-md p-2 text-aureus-m w-11/12 lg:md:w-5/12" onChange={(e) => setCustomer(e.target.value)} />
                    <InputText placeholder="Telefono del cliente..." className="border border-emerald-500 rounded-md p-2 text-aureus-m w-11/12 lg:md:w-5/12" onChange={(e) => setCustomerPhone(e.target.value)} />
                </div>
                <div className="flex justify-center items-center">
                    <Button onClick={() => setVisibleDialog(true)} icon="pi pi-receipt" className="bg-gradient-to-r from-emerald-500 to-green-500 text-white w-12 h-12 rounded-full"></Button>
                </div>
            </div>
            <div className="h-5/6 overflow-y-auto overflow-x-hidden mt-2 border border-emerald-500 rounded-lg p-2">
                <DataView className="h-full" value={products} listTemplate={listTemplate} />
            </div>
            <div>
                <Button onClick={handleSubmit} className="w-full mt-2 p-4 bg-emerald-500 text-white hover:bg-emerald-600" label="Realizar pedido" />
            </div>
        </div>

    );
}