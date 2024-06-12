import { Carousel } from "primereact/carousel";
import mercado from '../../../assets/img/carousel-landing/1.jpg';
import comprando from '../../../assets/img/carousel-landing/2.jpg';
import bolsacompra from '../../../assets/img/carousel-landing/3.jpg';
import largeLogo from '../../../assets/img/fruvenda-banner-back-png.png'
import largeLogoWhite from '../../../assets/img/fruvenda-banner-back-whitepng.png'
import carniceria from '../../../assets/img/carniceria.jpg';
import { Call, CartAdd, Facebook, FacebookSquare, Heart, Instagram, Mail, MiniStoreSmile, PhoneLock, Receipt, Search, SmartPhone, Store, Telegram } from "react-huge-icons/bulk";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LandingContent() {

    let navigation = useNavigate();
    const [cp, setCp] = useState('');

    let carouselObject = [
        {
            titulo: 'El mercado en tu mano',
            subtitulo: 'Sin colas, sin esperas. El mercado y tú.',
            texto: 'Explora y pide tus productos favoritos.',
            imagen: mercado,
            cta: 'Explorar Mercados',
            link: '/markets'
        },
        {
            titulo: 'Compras fáciles',
            subtitulo: 'Haz tus compras más fáciles',
            texto: 'Pide desde casa y recoge en tu tienda favorita.',
            imagen: comprando,
            cta: 'Regístrate Ahora',
            link: '/signup'
        },
        {
            titulo: 'Compra Saludable',
            subtitulo: 'Tu compra saludable y a kilómetro 0',
            texto: 'Apoya a los comercios locales y come sano.',
            imagen: bolsacompra,
            cta: 'Ver Productos',
            link: '/products'
        }
    ];

    const carouselTemplate = (carousel) => {
        return (
            <div className="w-full flex justify-between relative h-64 lg:md:h-full overflow-hidden">
                <div className="w-6/12">
                </div>
                <div className="h-64 lg:md:h-full absolute flex w-full m-auto items-center lg:md:justify-start bg-gradient-to-r from-white from-50%  to-transparent">
                    <div className="w-6/12">
                        <p className="font-outfit-bold text-emerald-500 text-aureus-l md:text-aureus-xl lg:text-aureus-2xl">
                            {carousel.titulo}
                        </p>
                        <p className="px-2 font-outfit-semibold text-gray-400 text-aureus-m md:text-aureus-m lg:text-aureus-xl">
                            {carousel.texto}
                        </p>
                    </div>
                </div>
                <div className="lg:md:w-6/12 w-full h-full rounded-lg overflow-hidden">
                    <img className="rounded-lg w-full h-full" src={carousel.imagen} />
                </div>
            </div>
        );

    }

    return (
        <div className="w-full lg:md:p-4">
            <div className="relative">
                <Carousel className="shadow-lg mt-24 lg:md:mt-0 bg-white h-64 lg:md:h-full" value={carouselObject} autoplayInterval={10000} numVisible={1} numScroll={1} itemTemplate={carouselTemplate} />
                <div className="h-div-gradient w-full -mt-20 -z-10 bg-gradient-to-b from-green-200 to-transparent absolute shadow-inset-white">

                </div>
                <div className="flex justify-center flex-col items-center mt-10">
                    <p className="text-aureus-l md:text-aureus-l lg:text-aureus-2xl font-outfit-bold text-center">Empieza a comprar con Fruvenda</p>
                    <div className=" flex-col items-center lg:md:flex-row flex justify-center">
                        <InputText onChange={(e) => setCp(e.target.value)} keyfilter="int" className="p-2 text-aureus-m lg:md:py-2 md:text-aureus-m lg:text-aureus-l rounded-full border border-emerald-500 pl-6" placeholder="Introduce codigo postal..." />
                        <Button onClick={() => {
                            navigation('/markets', {
                                state: { message: cp}
                            })
                        }} className="lg:md:ml-6 lg:md:mt-0 mt-2 rounded-full lg:md:py-2 text-aureus-m lg:md:text-aureus-l px-10 hover:animation-gradient-x bg-gradient-to-r from-emerald-500 to-green-500 text-white" label="Buscar" icon="pi pi-search" />
                    </div>
                    <hr className="my-14 lg:md:my-28 border-transparent w-full"></hr>
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-aureus-l lg:text-aureus-xl font-outfit-semibold md:mb-20">¿Quienes somos?</p>
                        <div className="flex lg:md:flex-row flex-col justify-center items-center  lg:-mt-10">
                            <img src={largeLogo} className="w-8/12 lg:md:w-4/12" />
                            <p className="lg:md:w-6/12 -mt-10 text-center lg:md:text-left text-aureus-m lg:text-aureus-l text-gray-500">Somos una plataforma digital innovadora dedicada a la digitalización y gestión de pedidos para los comercios locales y mercados de abasto. Nuestra misión es ayudar a los comerciantes a llevar sus negocios al siguiente nivel, aprovechando las ventajas de estar presentes en línea sin complicaciones.</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center w-full mt-10">
                        <p className="text-aureus-l lg:text-aureus-xl font-outfit-semibold text-center">¿Que beneficios aportamos a los comercios?</p>
                        <div className="lg:md:flex-row flex flex-col justify-evenly items-center w-full">
                            <div className="w-full h-52 lg:md:w-80 lg:md:h-80 flex flex-col justify-center items-center bg-gradient-to-r from-emerald-500 to-green-500 hover:animation-gradient-x rounded-xl shadow-md mt-4">
                                <Store className="w-36 h-36 text-white" />
                                <h2 className="text-white text-center text-xl font-bold mt-4">Digitalizamos negocios</h2>
                                <p className="text-balance text-white text-sm lg:md:text-lg text-center mt-2">Llevamos tu negocio al mundo digital, facilitando la gestión y aumentando tu visibilidad online.</p>
                            </div>
                            <div className="w-full h-52 lg:md:w-80 lg:md:h-80 flex flex-col justify-center items-center bg-gradient-to-r from-emerald-500 to-green-500 hover:animation-gradient-x rounded-xl shadow-md mt-4">
                                <MiniStoreSmile className="w-36 h-36 text-white" />
                                <h2 className="text-white text-center  font-bold mt-4">Acercamos el mercado</h2>
                                <p className="text-balance text-white text-sm lg:md:text-lg text-center mt-2">Conectamos a los comercios locales con los clientes, creando un puente digital entre la oferta y la demanda.</p>
                            </div>
                            <div className="w-full h-52 lg:md:w-80 lg:md:h-80 flex flex-col justify-center items-center bg-gradient-to-r from-emerald-500 to-green-500 hover:animation-gradient-x rounded-xl shadow-md mt-4">
                                <Receipt className="w-36 h-36 text-white" />
                                <h2 className="text-white text-center text-xl font-bold mt-4">Gestión de pedidos</h2>
                                <p className="text-balance text-white text-sm lg:md:text-lg text-center mt-2">Optimizamos el proceso de pedidos, permitiéndote gestionar tu inventario y satisfacer las necesidades de tus clientes de manera eficiente.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center items-center mt-24 bg-green-200 w-full py-10">
                        <p className="text-aureus-l lg:text-aureus-xl font-outfit-semibold text-center">¿Qué beneficios aportamos a los clientes?</p>
                        <div className="lg:md:flex-row flex flex-col justify-evenly items-center w-full">
                            <div className="w-full h-52 lg:md:w-80 lg:md:h-80 flex flex-col justify-center items-center bg-gradient-to-r from-emerald-500 to-green-500 hover:animation-gradient-x rounded-xl shadow-md mt-4">
                                <CartAdd className="w-36 h-36 text-white" />
                                <h2 className="text-white text-center text-xl font-bold mt-4">Productos frescos a tu alcance</h2>
                                <p className="text-balance text-white  text-sm lg:md:text-lg text-center mt-2">Compra los mejores productos frescos de tus comercios locales favoritos, directamente desde la comodidad de tu hogar.</p>
                            </div>
                            <div className="w-full h-52 lg:md:w-80 lg:md:h-80 flex flex-col justify-center items-center bg-gradient-to-r from-emerald-500 to-green-500 hover:animation-gradient-x rounded-xl shadow-md mt-4">
                                <Heart className="w-36 h-36 text-white" />
                                <h2 className="text-white text-center text-xl font-bold mt-4">Colabora con tus comercios locales y el medio ambiente</h2>
                                <p className="text-balance text-white text-sm lg:md:text-lg text-center mt-2">Contribuyes al desarrollo de tu comunidad y reduces la huella de carbono al optar por productos de kilómetro cero.</p>
                            </div>
                            <div className="w-full h-52 lg:md:w-80 lg:md:h-80 flex flex-col justify-center items-center bg-gradient-to-r from-emerald-500 to-green-500 hover:animation-gradient-x rounded-xl shadow-md mt-4">
                                <Search className="w-36 h-36 text-white" />
                                <h2 className="text-white text-center text-xl font-bold mt-4">Descubre nuevos comercios y productos</h2>
                                <p className="text-balance text-white text-sm lg:md:text-lg text-center mt-2">Explora una variedad de comercios locales y productos únicos que quizás no conocías antes, ¡y amplía tus opciones de compra!</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full mt-10">
                        <div className="lg:md:flex-row flex-col flex justify-center items-center w-fulll lg:md:w-7/12">
                            <div className="flex flex-col lg:md:items-start justify-center items-center w-10/12 lg:md:w-6/12 lg:md:text-left text-center">
                            <p className="font-outfit-bold text-aureus-l lg:md:text-aureus-xl bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500 text-transparent">Únete a Fruvenda</p>
                            <p className="text-gray-400 text-sm text-balance lg:md:text-lg">¿Quieres llevar tu negocio al mundo digital? ¡Contáctanos hoy mismo para comenzar! Envíanos un correo electrónico</p>
                            <p className="font-outfit-bold  text-aureus-m lg:md:text-aureus-xl bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500 text-transparent">hola@fruvenda.es</p>
                            </div>
                            <img src={carniceria} className="w-6/12 rounded-lg shadow-lg" />
                        </div>
                    </div>
                </div>

                <div id="footer" className="bg-emerald-500 h-96 mt-10 lg:md:flex-row flex flex-col items-center">
                    <div className="w-full lg:md:w-3/12 -mt-10">
                        <img src={largeLogoWhite} />
                    </div>
                    <div className="lg:md:ml-10 lg:md:mt-0 -mt-20 lg:md:w-6/12 w-full justify-around flex lg:md:flex-col flex-row">
                        <p className="text-white font-outfit-semibold underline lg:md:text-aureus-l my-10 cursor-pointer" onClick={()=> { navigation('/markets') }}>Mercados</p>
                        <p className="text-white font-outfit-semibold underline lg:md:text-aureus-l my-10 cursor-pointer" onClick={()=> { navigation('/signup') }}>Registro</p>
                        <p className="text-white font-outfit-semibold underline lg:md:text-aureus-l my-10 cursor-pointer" onClick={()=> { navigation('/login') }}>Login</p>
                    </div>
                    <div className="lg:md:flex-col flex flex-row flex-wrap justify-center lg:md:justify-start">
                        <p className="text-white text-aureus-l lg:md:text-start text-center font-outfit-bold">Contacto</p>
                        <div className="lg:md:flex-col flex flex-row flex-wrap lg:md:items-start lg:md:justify-normal items-center justify-around">
                        <div className="flex items-center my-6 lg:md:mb-6 justify-start mr-2">
                            <Mail className="text-white lg:md:mr-6 w-10 h-10"/>
                            <p className="text-white text-aureus-m">hola@fruvenda.es</p>
                        </div>
                        <div className="flex items-center lg:md:my-6 justify-start mr-2">
                            <Instagram className="text-white lg:md:mr-6 w-10 h-10"/>
                            <p className="text-white text-sm lg:md:text-aureus-m">@fruvenda</p>
                        </div>
                        <div className="flex items-center lg:md:my-6 justify-start mr-2">
                            <FacebookSquare className="text-white lg:md:mr-6 w-10 h-10"/>
                            <p className="text-white text-sm lg:md:text-aureus-m">Fruvenda</p>
                        </div>
                        <div className="flex items-center lg:md:my-6  justify-start mr-2">
                            <i style={{ fontSize: '2rem' }} className="pi pi-twitter text-white ml-1 lg:md:mr-6"></i>
                            <p className="text-white text-sm lg:md:text-aureus-m">@fruvenda</p>
                        </div>
                        </div>
                       
                    </div>
                </div>

            </div>

        </div>
    );
}