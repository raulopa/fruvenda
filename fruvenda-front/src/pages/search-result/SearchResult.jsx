import { SearchResultPanel } from "components";
import { Wrapper } from "pages";


export default function SearchResult() {
    return(
        <div>
            <Wrapper page={<SearchResultPanel />}></Wrapper>
        </div>
    );
}