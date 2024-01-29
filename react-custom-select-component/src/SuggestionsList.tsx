
import { Product, Suggestion } from './types';
interface SuggestionItemProps {
    onClick: (suggestion: Suggestion<Product>) => void;
    isSuggestionInPills: (suggestion: Product) => boolean;
    Suggestions: Suggestion<Product>[]
}

export default function SuggestionsList({ onClick, isSuggestionInPills, Suggestions }: SuggestionItemProps) {
    return (
        Suggestions.map((suggestion, index) => (

            <div onClick={() => onClick(suggestion)} key={`suggestion-item-${index}`}
                style={{ background: isSuggestionInPills(suggestion) ? "cyan" : "" }} className="react-select__search-input__suggestion-list__item">
                {suggestion.title}
            </div>
        ))

    )
}
