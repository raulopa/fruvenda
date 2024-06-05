import { ProductDetailPanel } from "components";
import { Wrapper } from "pages";

export default function ProductDetail(){
    
    return(
        <div className="h-full w-full">
            <Wrapper page={<ProductDetailPanel />} />
        </div>
    );
}