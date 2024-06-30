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
import ProductDialogContent from "./product-dialog-content/ProductDialogContent";
import AddProductDialogContent from "./add-product-dialog-content/AddProductDialogContent";
import { FilterMatchMode, FilterOperator } from 'primereact/api';

export default function ProductManagementPanel() {
    const toast = useRef(null);
    const { getCommerceProducts, deleteProducts } = useProductService();
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [clickedProduct, setClickedProduct] = useState(null);
    const [addProduct, setAddProduct] = useState(false);
    const [editProduct, setEditProduct] = useState(false);
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
            nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            descripcion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            precio: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            stock: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            ud_medida: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            visible: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
        });
        setGlobalFilterValue('');
    };

    useEffect(() => {
        getCommerceProducts().then((response) => {
            if (Array.isArray(response)) {
                setProducts(response);
                initFilters();
            } else {
                setProducts([]);
            }
        });
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

    const formateoDivisa = (value) => {
        return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
    };

    const imageBodyTemplate = (product) => {
        if (product.images.length == 0) {
            return <div className="w-20 h-20 bg-slate-200 animate-pulse rounded-lg mt-2"></div>;
        }
        return <img src={product.images[0]} alt={product.image} className="w-20 h-20 rounded-lg" />;
    };

    const priceBodyTemplate = (product) => formateoDivisa(product.precio);

    const visibleBodyTemplate = (product) => (
        <Tag className='text-aureus-s' icon={product.visible ? "pi pi-eye" : "pi pi-eye-slash"} severity={product.visible ? 'success' : 'warning'} value={product.visible ? "Visible" : "No visible"}></Tag>
    );

    const stockBodyTemplate = (product) => (
        <Tag className='text-aureus-s ml-2' severity={product.stock !== 0 ? 'info' : 'danger'} value={product.stock}></Tag>
    );

    const seeBodyTemplate = (product) => (
        <Button icon="pi pi-eye" onClick={() => { setVisibleDialog(true); setClickedProduct(product); }} className="flex justify-center w-8 h-8 bg-green-500 text-white" />
    );

    const handleDeleteProducts = async () => {
        let deleted = await deleteProducts(selectedProducts.map((product) => product.id));
        if (deleted.status) {
            setRefresh(!refresh);
            toast.current.show({ severity: 'info', summary: 'Info', detail: deleted.message });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: deleted.message });
        }
    }

    const confirmDelete = () => {
        confirmDialog({
            group: 'headless',
            message: '¿Confirmas eliminar los productos seleccionados?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'delete',
        });
    };

    const startContent = (
        <div className="flex font-outfit-semibold p-2 text-aureus-l">
            <p className="mr-4 lg:md:mr-10">PRODUCTOS</p>
            <Button icon="pi pi-plus" className="mr-2 bg-gradient-to-r from-emerald-600 to-green-500 text-white" onClick={() => { setVisibleDialog(true); setAddProduct(true); }} />
            <Button icon="pi pi-trash" severity="danger" onClick={confirmDelete} disabled={selectedProducts.length === 0} className="mr-2 bg-red-500 text-white" />
        </div>
    );

    const endContent = (
        <div>
            <div className="p-inputgroup flex">
                <InputText placeholder="Buscar producto..." value={globalFilterValue} onChange={onGlobalFilterChange} className="h-10 p-2" />
                <Button icon="pi pi-search" className="flex justify-center bg-gradient-to-r from-emerald-600 to-green-500 text-white" />
            </div>
        </div>
    );

    const restartDialog = () => {
        setVisibleDialog(false); setClickedProduct(null); setAddProduct(false); setEditProduct(false)
    }


    return (
        <div className="w-full p-4">
            <Toast ref={toast} position="bottom-right" />
            <Dialog
                header=""
                style={{ width: phone ? '100%' : '50vw', height: phone ? '100%' : '70%' }}
                visible={visibleDialog}
                maximizable
                modal
                onHide={restartDialog}
            >
                {
                    clickedProduct != null && !editProduct &&
                    <ProductDialogContent product={clickedProduct} restartDialog={restartDialog} editProduct={setEditProduct} setRefresh={setRefresh} toast={toast} />
                }
                {
                    addProduct &&
                    <AddProductDialogContent product={clickedProduct} restartDialog={restartDialog} setRefresh={setRefresh} toast={toast} />
                }

                {
                    editProduct &&
                    <AddProductDialogContent product={clickedProduct} restartDialog={restartDialog} setRefresh={setRefresh} toast={toast} />
                }
            </Dialog>
            <div className="flex items-center mt-16 lg:md:mt-0">
                <h1 className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent">Gestión de Productos</h1>

            </div>
            <div className="mt-8">
                <DataTable filters={filters} globalFilterFields={['nombre', 'descripcion', 'stock', 'precio']} removableSort header={<Toolbar start={startContent} end={endContent} />} paginator rows={5} rowsPerPageOptions={[5, 10, 20]} selectionMode="multiple" selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)} value={products}>
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column header="Imagen" body={imageBodyTemplate}></Column>
                    {!phone &&
                        <Column sortable field="nombre" header="Nombre"></Column>
                    }
                    {!phone &&
                        <Column field="descripcion" header="Descripción" body={(product) => product.descripcion != null && product.descripcion.length > 20 ? product.descripcion.slice(0, 20) + '...' : product.descripcion}></Column>
                    }
                    {!phone &&
                        <Column sortable field="precio" header="Precio" body={priceBodyTemplate}></Column>
                    }
                    {!phone &&
                        <Column sortable field="stock" header="Stock" body={stockBodyTemplate}></Column>
                    }
                    {!phone &&
                        <Column sortable field="ud_medida" header="Medida" body={(product) => product.ud_medida == 'precio_kilo' ? 'kilogramos' : product.ud_medida}></Column>
                    }
                    {!phone &&
                        <Column sortable field="visible" header="Visible" body={visibleBodyTemplate}></Column>
                    }
                    <Column field="Ver" header="Ver" body={seeBodyTemplate} />
                </DataTable>
            </div>
            <ConfirmDialog
                group="headless"
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-col items-center p-5 rounded surface-overlay bg-white">
                        <div className="inline-flex bg-red-500 text-white justify-center items-center rounded-full bg-primary h-24 w-24 -mt-16">
                            <i className="pi pi-question text-5xl"></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            {message.header}
                        </span>
                        <p className="mb-0" ref={contentRef}>
                            {message.message}
                        </p>
                        <div className="flex w-full items-center justify-around gap-2 mt-4" ref={footerRef}>
                            <Button className="w-28 h-12 flex p-2 border rounded-lg border-black hover:border-emerald-600 hover:text-emerald-600" label="Cancelar" icon="pi pi-times" onClick={(event) => { hide(event); }}></Button>
                            <Button className="w-28 h-12 flex p-2 text-red-500 border rounded-lg border-red-500 hover:bg-red-500 hover:text-white" label="Eliminar" outlined icon="pi pi-trash" onClick={(event) => { hide(event); handleDeleteProducts(); }}></Button>
                        </div>
                    </div>
                )}
            />
        </div>
    );
}
