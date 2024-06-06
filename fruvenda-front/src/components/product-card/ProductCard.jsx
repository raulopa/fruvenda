import React, { useRef, useState } from 'react';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Ripple } from 'primereact/ripple';
import { Tag } from 'primereact/tag';
import { Image } from 'primereact/image';

export default function ProductCard({ product }) {
    const header = () => {
        if (product.images.length == 0) {
            return (
                <div className="w-full h-36 bg-slate-200 animate-pulse rounded-lg">
                </div>
            );
        } else {
            return (
                <div className='w-full h-36 rounded-lg overflow-hidden'>
                    <Image className='rounded-lg' src={product.images[0]} preview />
                </div>
            );
        }
    };
    return (

        <Card header={header} title={product.nombre.length > 10 ? product.nombre.slice(0, 10) + '...' : product.nombre} subTitle={product.descripcion.length > 30 ? product.descripcion.slice(0, 20) + '...' :  product.descripcion} className="h-80 w-64 border border-slate-200 rounded-xl p-4">
            <div className="w-full flex items-center justify-between">
                <Tag className='w-6/12 text-aureus-s -mt-4' icon={product.stock != 0 ? "pi pi-check" : "pi pi-times"} severity={product.stock != 0 ? 'info' : 'danger'} value={product.stock != 0 ? product.stock + " " + (product.ud_medida == 'unidades' ? 'uds' : 'kgs') : 'Sin stock'}></Tag>
                <Tag className='w-6/12 text-aureus-s -mt-4' icon={product.visible ? "pi pi-eye" : "pi pi-eye-slash"} severity={product.visible ? 'success' : 'warning'} value={product.visible ? "Visible" : "No visible"}></Tag>
            </div>
        </Card >
    );
}