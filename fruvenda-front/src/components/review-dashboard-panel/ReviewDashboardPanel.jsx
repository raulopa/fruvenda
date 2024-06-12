import { useEffect, useState } from "react";
import { Rating } from "primereact/rating";
import { DataView } from "primereact/dataview";
import { Button } from "primereact/button";
import useReviewService from "services/review-service/useReviewService";

export default function ReviewDashboardPanel({toast}){
    const [reviews, setReviews] = useState([]);
    const { getReviewsCustomer, deleteReview } = useReviewService();
    const [refresh, setRefresh] = useState(false);
    useEffect(()=> {
        getReviewsCustomer().then((response)=> {
            if(response.status){
                setReviews(response.resenas);
            }
        })
    }, [refresh]);

    const handleDelete = async (id) => {
        let deleted = await deleteReview(id);
        if(deleted.status){
            setRefresh(!refresh);
            toast.current.show({ severity: 'success', summary: 'Eliminado', detail: deleted.message});
        }else{
            toast.current.show({ severity: 'error', summary: 'Error', detail: deleted.message});
        }
    }   

    const itemTemplate = (review, index) => {
        return (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden my-4">
                <div className="flex flex-col lg:md:flex-row lg:md:justify-between justify-center items-center w-full bg-gray-100 p-4">
                    <div className="flex justify-start items-center w-full lg:md:w-6/12 ">
                        <img className="rounded-full w-12 h-12" src={review.cliente_foto} alt="Foto de perfil de cliente" />
                        <p className="ml-6 w-6/12">{review.cliente_nombre}</p>
                    </div>
                    <div className="flex justify-around w-full">
                        <Rating readOnly value={review.valoracion} cancel={false} />
                        <Button onClick={()=> handleDelete(review.id)} icon="pi pi-times" className="lg:md:mx-6 lg:md:w-12 w-10 lg:md:h-12 h-10 border-red-500 border rounded-full text-red-500 hover:bg-red-500 hover:text-white" />
                    </div>
                </div>
                <div className=" p-4">
                    <div className="w-full h-10 lg:md:h-16">
                        <p className="text-aureus-m lg:md:text-aureus-l text-black font-semibold">{review.titulo}</p>
                    </div>
                    <div>
                    <p className="text-sm lg:md:text-aureus-m h-20 w-full break-words">{review.cuerpo}</p>
                    </div>
                </div>
                <div className="flex justify-end text-gray-500 p-4">
                    <p>{review.fecha}</p>
                </div>
            </div>
        );

    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((review, index) => {
            return itemTemplate(review, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    return (
        <div className="flex flex-col justify-center items-center">
            {reviews.length == 0 && <p>No tienes reseñas...</p>}
            <DataView className="w-full" value={reviews} listTemplate={listTemplate} />
        </div>
    );
}