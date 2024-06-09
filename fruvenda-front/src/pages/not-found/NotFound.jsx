import { Wrapper } from "pages";
import NotFoundContent from "./NotFoundContent";

export default function NotFound(){
    return(
        <div>
            <Wrapper page={<NotFoundContent />} />
        </div>
    );
}