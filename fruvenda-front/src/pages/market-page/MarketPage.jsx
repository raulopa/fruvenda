import { MarketPagePanel } from "components";
import { Wrapper } from "pages";


export default function MarketPage({}){
   
    return(
        <div>
            <Wrapper page={<MarketPagePanel />}></Wrapper>
        </div>
    
    );
}