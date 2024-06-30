import { useEffect, useRef, useState } from "react";
import useCommerceService from "services/commerce-service/useCommerceService";
import useReviewService from "services/review-service/useReviewService";
import { useNavigate, useParams } from "react-router-dom";
import { DataView } from 'primereact/dataview';
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import ReviewDialogContent from "./review-dialog-content/ReviewDialogContent";
import { Toast } from "primereact/toast";

export default function ReviewsProfilePanel({ readOnly }) {
    let toast = useRef(null)
    const navigation = useNavigate();
    const { slug } = useParams()
    const [reviews, setReviews] = useState([]);
    const [visibleDialog, setVisibleDialog] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const { getReviewsCommerceProfile, getReviewsCustomerProfile } = useCommerceService();
    const { getReviewsCommerce, getReviewsCustomer } = useReviewService();
    const [phone, setPhone] = useState(false);

    useEffect(() => {

        if (slug != null) {
            if(/@/g.test(slug)){
                getReviewsCommerceProfile(slug).then((response) => {
                    if (Array.isArray(response.reviews)) {
                        setReviews(response.reviews);
                    }
                });
            }else{
                getReviewsCustomerProfile(slug).then((response) => {
                    if (Array.isArray(response.reviews)) {
                        setReviews(response.reviews);
                    }
                });
            }
            
        } else {
            if (sessionStorage.getItem('entityType') == '1') {
                getReviewsCommerce().then((response) => {
                    if (Array.isArray(response.resenas)) {
                        setReviews(response.resenas);
                    }
                });
            } else if (sessionStorage.getItem('entityType') == '0') {
                getReviewsCustomer().then((response) => {
                    if (Array.isArray(response.resenas)) {
                        setReviews(response.resenas);
                    }
                });
            }
        }

        const handleResize = () => {
            
            if (window.innerWidth < 600) {
                setPhone(true);
            } else {
                setPhone(false)
            }
        };
        handleResize();
    }, [refresh]);
    

    const goToProfile = (id) => {
        navigation(`/profile/${id}`);
    }

    const itemTemplate = (review, index) => {
        return (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden my-4">
                <div className="flex justify-between items-center w-full bg-gray-100 p-4 cursor-pointer hover:bg-gray-200">
                    <div onClick={() =>  goToProfile(review.cliente_id)} className="flex justify-start items-center w-6/12 ">
                        {review.cliente_foto ?  <img className="rounded-full w-12 h-12" src={review.cliente_foto} alt="Foto de perfil de cliente" /> : <div className="rounded-full w-12 h-12 bg-gray-300 animate-pulse"></div> }
                        <p className=" ml-2 lg:md:ml-6 w-6/12">{review.cliente_nombre}</p>
                    </div>
                    <div>
                        <Rating  readOnly value={review.valoracion} cancel={false} />
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
            <Toast ref={toast} position="bottom-right" />
            {!readOnly && <div className="w-full flex justify-center">
                <Dialog header={'Escribe tu reseña'}  visible={visibleDialog} style={{ width: phone ? '100vw' : '50vw', height: phone && '50vh' }} onHide={() => { setVisibleDialog(false); }} >
                    <ReviewDialogContent setVisible={setVisibleDialog} setRefresh={setRefresh} toast={toast} />
                </Dialog>
                {sessionStorage.getItem('entityType') == 0 &&
                    <Button onClick={() => setVisibleDialog(true)} className="bg-gradient-to-r p-2 w-8/12 lg:md:w-2/12 from-emerald-500 to-green-500 text-white hover:animate-gradient-x" label="Añadir Reseña" />
                }
            </div>}

            <DataView className="w-full lg:md:w-7/12" value={reviews} listTemplate={listTemplate} />
        </div>
    );

};