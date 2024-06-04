import { useState, useEffect } from "react";
import { ProfileCommerce, ProfileCustomer, Wrapper } from "pages";
import { useParams } from "react-router-dom";

export default function Profile() {
    const { slug } = useParams();
    const [isCommerceProfile, setIsCommerceProfile] = useState(null);

    useEffect(() => {  
        if (localStorage.getItem('commerceToken')) {
            sessionStorage.setItem('entityType', 1);
    
        } else {
            sessionStorage.setItem('entityType', 0);
        }    
    if(slug == null){
        if(sessionStorage.getItem('entityType') == '1'){
            setIsCommerceProfile(true);
        }else if(sessionStorage.getItem('entityType') == '0'){
            setIsCommerceProfile(false);
        }
    }else{
        const hasHyphens = /-/g.test(slug);
        setIsCommerceProfile(hasHyphens);
    }
    console.log(isCommerceProfile);
    }, [slug]);
    if (localStorage.getItem('commerceToken')) {
        sessionStorage.setItem('entityType', 1);

    } else {
        sessionStorage.setItem('entityType', 0);
    }

    console.log(isCommerceProfile);
    return (
        <Wrapper page={isCommerceProfile  != null ? isCommerceProfile  ? <ProfileCommerce /> : <ProfileCustomer /> : 'Cargando...'} />
    );
}