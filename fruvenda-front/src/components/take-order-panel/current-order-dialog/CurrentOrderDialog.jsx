import { DataView } from "primereact/dataview";
import CartRow from "components/cart-panel/cart-row/CartRow";
import { Image } from "primereact/image";
import { Button } from "primereact/button";

export default function CurrentOrderDialog({ lineOrders, setLineOrders }) {

    const handleDeleteRow = (id) => {
        setLineOrders ((prevLineOrders) => {
            return prevLineOrders.filter(order => order.producto.id !== id);
        });
    }

    const itemTemplate = (lineOrder) => {
        console.log(lineOrder.cantidad);
        return (
            <div>
                <div className="w-full h-24 flex my-5">
                    <div className="h-full w-2/12 aspect-square mr-5 rounded-lg overflow-hidden">
                        {lineOrder.producto.images == null ? <div className="w-full h-full bg-gray-200 animation-pulse rounded-lg">
                        </div> : <Image src={lineOrder.producto.images[0]} className="rounded-lg" preview />}
                    </div>
                    <div className="my-auto w-9/12">
                        <p className="font-semibold text-aureus-l">{lineOrder.producto.nombre}</p>
                        <p className="text-aureus-m">{lineOrder.producto.descripcion}</p>
                        <p>Precio ({lineOrder.producto.ud_medida == 'precio_kilo' ? 'kg/€' : 'unidad'}): {lineOrder.producto.precio}€</p>
                        <p>Cantidad: {lineOrder.cantidad}</p>

                    </div>
                    <div className="flex items-center justify-around">
                        <p className="font-semibold text-aureus-l mr-5">{lineOrder.precio_producto * lineOrder.cantidad}€</p>

                        <Button onClick={() => handleDeleteRow(lineOrder.producto.id)} className="bg-emerald-200 text-white hover:bg-emerald-500 w-10 h-10 rounded-full" icon="pi pi-times" />

                    </div>
                </div>
                <hr className="w-8/12 border-gray-100" />

            </div>
        )
    }


    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return itemTemplate(product, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    const calculateTotal = (orders) => {
        return orders.reduce((acc, order) => acc + order.precio_producto * order.cantidad, 0);
    };

    const total = calculateTotal(lineOrders);


    return (
        <div>
            <DataView value={lineOrders} listTemplate={listTemplate} />
            <div className="flex justify-end">
                <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-l bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent">Total: {total}€</p>
            </div>
        </div>
    );
}