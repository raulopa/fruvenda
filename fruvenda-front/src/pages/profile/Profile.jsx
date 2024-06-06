import { useState, useEffect } from "react";
import { ProfileCommerce, ProfileCustomer, Wrapper } from "pages";
import { useParams, useNavigate } from "react-router-dom";

export default function Profile() {
    const { slug } = useParams();
    const [isCommerceProfile, setIsCommerceProfile] = useState(null);
    let navigation = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('commerceToken')) {
            sessionStorage.setItem('entityType', 1);

        } else if (localStorage.getItem('token')) {
            sessionStorage.setItem('entityType', 0);
        }
        if (slug == null) {

            if (!localStorage.getItem('commerceToken') && !localStorage.getItem('token')) {
                navigation('/login');
            }
            if (sessionStorage.getItem('entityType') == '1') {
                setIsCommerceProfile(true);
            } else if (sessionStorage.getItem('entityType') == '0') {
                setIsCommerceProfile(false);
            }

        } else {
            const hasHyphens = /-/g.test(slug);
            setIsCommerceProfile(hasHyphens);
        }
    }, [slug]);


    return (
        <Wrapper page={isCommerceProfile != null ? isCommerceProfile ? <ProfileCommerce /> : <ProfileCustomer /> : 'Cargando...'} />
    );
}