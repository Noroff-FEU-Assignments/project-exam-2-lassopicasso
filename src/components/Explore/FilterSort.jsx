import React from "react";
import Header from "../../common/Header";
import { priceList, buttonList } from "../../constants/arrays";
function FilterSort({ handleSubmit, priceRange, setPriceRange, sort, setSort }) {
  return (
    <form
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <div className="filterSort__content">
        <div className="filterSort__filter">
          <Header type="sub" header="Filter" />
          <div className="filterSort__price">
            <span> Total Price </span>
            {priceList.map((price, index) => {
              return (
                <label key={index}>
                  <input type="radio" name="filter_price" checked={priceRange.label === price.label} onChange={() => setPriceRange(price)} />
                  {price.label}
                </label>
              );
            })}
          </div>
        </div>
        <div className="filterSort__sort">
          <Header type="sub" header="Sort" />
          {buttonList.map((button, index) => {
            return (
              <div key={index}>
                <span>{button.title}</span>
                <div className="filterSort__buttons">
                  {button.btns.map((btn, index) => {
                    return (
                      <input
                        key={index}
                        className={`${btn.btn} sortBtn ${sort.type === button.type && sort.btn === btn.btn ? "sortBtn-active" : ""}`}
                        type="button"
                        value={btn.value}
                        onClick={() => {
                          setSort({ type: button.type, btn: btn.btn });
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <button className="cta__update cta" type="submit">
        Update
      </button>
    </form>
  );
}

export default FilterSort;
