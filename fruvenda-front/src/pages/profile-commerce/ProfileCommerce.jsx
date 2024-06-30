import { useState, useEffect, useRef } from "react";
import useProductService from "services/product-service/useProductService";
import useCommerceService from "services/commerce-service/useCommerceService";
import useCustomerService from "services/customer-service/useCustomerService";
import { Rating } from "primereact/rating";
import { TabView, TabPanel } from 'primereact/tabview';
import { ReviewsProfilePanel, SellProductCommerce, PostsProfilePanel } from "components";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export default function ProfileCommerce() {
    let navigation = useNavigate();
    const { slug } = useParams()
    const [commerce, setCommerce] = useState({});
    const [products, setProducts] = useState([]);
    const [followed, setFollowed] = useState(false);
    const { getCommerceProducts, getCommerceProductsForCustomers } = useProductService();
    const { getCommerce, getCommerceBySlug } = useCommerceService();
    const { getFollowCommerce, setFollowCommerce } = useCustomerService();
    let toast = useRef(null);

    useEffect(() => {
        if (slug == null) {
            getCommerce().then((response) => {
                if (response.status) {
                    setCommerce(response.comercio);
                }
            });
            getCommerceProducts().then((response) => {
                if (Array.isArray(response)) {
                    setProducts(response);
                }
            });
        } else {
            getCommerceBySlug(slug).then((response) => {
                if (response.status) {
                    setCommerce(response.comercio);
                    if(sessionStorage.getItem('entityType')){
                        getFollowCommerce(response.comercio.id).then((response)=> {
                            setFollowed(response.seguido);
                        });
                    }

                    getCommerceProductsForCustomers(response.comercio.id).then((response) => {
                        if (Array.isArray(response.products)) {
                            setProducts(response.products);
                        }
                    });

                }else{
                    navigation('/notFound', {
                        replace: true,
                    })
                }

                
            });

           
        }

    }, []);

    const tabHeaderTemplate = (icon, text) => (options) => {
        return (
            <div className="flex justify-center items-baseline my-2 mx-5" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <i className={icon}></i>
                <span className="font-bold ml-2 white-space-nowrap">{text}</span>
            </div>
        );
    };

    const handleFollow = ()=> {
        setFollowed(!followed);
        setFollowCommerce(commerce.id).then((response)=>{
            if(response.status){
                setFollowed(response.seguido);
                toast.current.show({
                    severity: 'success',
                    summary: 'Seguido',
                    detail: response.seguido ? 'Comercio seguido correctamente' : 'Has dejado de seguir el comercio'
                });
                
            }else{
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se ha podido seguir al comercio'});
                setFollowed(followed);
            }
            
        });
    }


    return (
        <div className="p-4 h-full flex flex-col mt-20 lg:md:mt-0">
            <Toast ref={toast} position="bottom-right" />
            <div className="h-64 flex lg:md:flex-row flex-col items-center">
                <div className="lg:md:h-64 relative lg:md:w-64 h-28 flex items-center w-28">
                    {commerce != null && commerce.image != null ? (
                        <img src={commerce.image} alt="Commerce profile" className="-mt-5 lg:md:h-full w-28 lg:md:w-64 aspect-square rounded-full" />
                    ) : (
                        <div className="h-28 lg:md:h-full w-28 lg:md:w-64 bg-gray-200 animate-pulse rounded-full"></div>
                    )}
                </div>
                <div className="flex justify-center flex-col lg:md:items-start items-center">
                    <h1 className="font-outfit-semibold p-2 text-aureus-xl lg:text-aureus-2xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">{commerce.nombre}</h1>
                    <Rating className="ml-2 mt-3" value={commerce.rating} readOnly cancel={false} />
                </div>
                {sessionStorage.getItem('entityType') == 0 && <div className="h-full flex items-center mb-4">
                    <Button label={followed ? 'Seguido' : 'Seguir'} icon={followed ? 'pi pi-check' : 'pi pi-plus'} onClick={()=>handleFollow()} className={ `px-2 py-1 rounded-full border border-emerald-500 ${followed ? 'bg-emerald-500 text-white' : 'text-emerald-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white'}`} />
                </div>}
            </div>

            <hr className="my-4" />

            <TabView >
                <TabPanel headerTemplate={tabHeaderTemplate('pi pi-shopping-bag', 'Productos')}>
                    <div className="flex flex-col">
                        <div className="flex">
                            <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">Productos</p>
                        </div>
                        <div className="flex justify-center md:justify-start w-100">
                            <SellProductCommerce  products={products} />
                        </div>
                        
                    </div>
                </TabPanel>
                <TabPanel headerTemplate={tabHeaderTemplate('pi pi-info-circle', 'Posts')}>
                    <div className="flex flex-col">
                        <div className="flex">
                            <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">Posts</p>
                        </div>
                        <PostsProfilePanel />
                    </div>
                </TabPanel>
                <TabPanel headerTemplate={tabHeaderTemplate('pi pi-comment', 'Reseñas')}>
                    <div className="flex flex-col">
                        <div className="flex">
                            <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">Reseñas</p>
                        </div>
                        <ReviewsProfilePanel readOnly={false} />
                    </div>
                </TabPanel>
                <TabPanel headerTemplate={tabHeaderTemplate('pi pi-question-circle', 'Contacto')}>
                    <div className="flex">
                        <p className="font-outfit-semibold p-2 text-aureus-l lg:text-aureus-xl bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">Contacto</p>
                    </div>
                        <div className="flex items-baseline"> <p className="font-outfit-semibold p-2 text-aureus-m lg:text-aureus-l bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">Telefono :</p> <p>{commerce.telefono}</p> </div>
                        <div className="flex items-baseline"> <p className="font-outfit-semibold p-2 text-aureus-m lg:text-aureus-l bg-gradient-to-r to-green-500 from-emerald-600 bg-clip-text font-bold text-4xl text-transparent capitalize">Email :</p> <p>{commerce.email}</p> </div>
                        
                </TabPanel>
            </TabView>
        </div>
    );
}