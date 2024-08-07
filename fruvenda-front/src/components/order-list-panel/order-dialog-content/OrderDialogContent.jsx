import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { Tag } from "primereact/tag";
import { useState, useEffect } from "react";


export default function OrderDialogContent({order, toast}){

    const [total, setTotal] = useState(0);
    const [phone, setPhone] = useState(false);

    useEffect(() => {
        let newTotal = order.rows.reduce((acc, product) => acc + product.precio_producto * product.cantidad, 0);
        setTotal(newTotal);
    }, [order.rows]);

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
            case 'entregado':
                return 'info';
            default:
                return null;
        }
    };

    const imageBodyTemplate = (product) => {
        if (product.images.length == 0) {
            return <div className="w-20 h-20 bg-slate-200 animate-pulse rounded-lg mt-2"></div>;
        }
        return <img src={product.images[0]} alt={product.image} className="w-20 h-20 rounded-lg" />;
    };
    const subtotalTemplate = (product) => {
        return product.precio_producto *product.cantidad + '€';
    }

    const footer = () => (
        <div className="flex justify-end mr-10">
            <p>Total pedido: {total} €</p>
        </div>
    );

    return(
        <div>
            <div>
                <p>Id del pedido: {order.id}</p>
                <p>Nombre: {order.nombre_cliente}</p>
                <p>Teléfono cliente: {order.telefono_cliente}</p>
                <p>Fecha: {order.fecha_hora}</p>
                <p>Estado: <Tag severity={getSeverity(order.estado)} value={order.estado} className="capitalize"></Tag></p>
                
            </div>
            <div>
                <div className="flex">
                <p className="font-outfit-semibold text-aureus-m lg:text-aureus-l bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-transparent">Productos</p>
                </div>
                <DataTable footer={footer} value={order.rows}>
                    <Column header="Imagen" body={imageBodyTemplate}></Column>
                    <Column sortable field="nombre" header="Nombre"></Column>
                    <Column field="cantidad" header="Cantidad"></Column>
                    <Column field="precio_producto" header="Precio"></Column>
                    <Column header="Subtotal" body={subtotalTemplate} ></Column>
                </DataTable>
            </div>
        </div>
    );
}