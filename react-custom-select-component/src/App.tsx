import { useEffect, useState } from "react";
import "./App.css";
import { ApiResponse, Product, Suggestion } from "./types";
import { truncateString } from "./utils";
import SuggestionItem from "./SuggestionsList";
import SuggestionsList from "./SuggestionsList";

let isEmptySearchTerm: boolean;

export default function App() {
  const [SearchTerm, setSearchTerm] = useState<string>('');
  const [Suggestions, setSuggestions] = useState<Suggestion<Product>[]>([])
  const [Pills, setPills] = useState<Suggestion<Product[]>>([]) // * Pills are just 'Selected-Suggestions' by the user
  isEmptySearchTerm = SearchTerm.trim() === ''

  useEffect(() => {
    // https://dummyjson.com/users/search?q=Jo
    const fetchProducts = () => {

      // * don't allow to query whitespaces in the end or start
      if (isEmptySearchTerm) {
        setSuggestions([])
        return;
      }
      fetch(`https://dummyjson.com/products/search?q=${SearchTerm}`)
        .then(res => res.json())
        .then((data: ApiResponse) => {

          console.log(data)
          setSuggestions(data.products)
        });
    };
    fetchProducts();
  }, [SearchTerm])


  function addToPills(suggestion: Suggestion<Product>) {
    const isSuggestionExistsInPills = Pills.find(_ => _.id === suggestion.id)

    if (isSuggestionExistsInPills)
      deletePill(suggestion)
    else
      setPills([...Pills, suggestion])

  }
  function deletePill(pill: Suggestion<Product>) {
    setPills(_ => _.filter(_ => _.id !== pill.id))
  }
  const isSuggestionInPills = (suggestion: Suggestion<Product>) => Pills.some(pill => pill.id === suggestion.id);

  const handleSelectSuggestionItem = (suggestion: Suggestion<Product>) => {
    addToPills(suggestion);
    setSearchTerm('');
  };

  return (

    <div className="user-search-container react-select">
      <div className="user-search-input react-select__search-input">
        <div className="react-select__search-input__pills">
          {Pills.map(_ => (
            <div className="react-select_search-input__pills-item">
              <span>
                {truncateString(_.title)}
              </span>
              <span onClick={() => deletePill(_)} >X</span>
            </div>
          ))}
        </div>

        {/* input feild with search suggestions */}
        <div style={{ width: '100%' }}>
          <input type="text" placeholder="Search Products To Mark Them as Featred" value={SearchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>
          ) => setSearchTerm(e.currentTarget.value)} />


          <div className="react-select__search-input__suggestion-list">

            <SuggestionsList Suggestions={Suggestions} onClick={handleSelectSuggestionItem} isSuggestionInPills={isSuggestionInPills} />


          </div>
        </div>
      </div>
    </div>
  );
}