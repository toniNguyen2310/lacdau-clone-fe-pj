/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import CategoryFilter from "./CategoryFilter";
import "./category.scss";
import CategoryProduct from "./CategoryProduct";
import { useLocation } from "react-router-dom";
import { dataBrand, dataCategory } from "../AdminControl/ManagerProducts";
import { getProducts } from "../../services.js/api";
import { useDebounce } from "../../utils/hook";
function Category(props) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [brandValue, setBrandValue] = useState("");
  const [brandLabel, setBrandLabel] = useState("");
  const [listData, setListData] = useState([]);
  const [listBrand, setListBrand] = useState([]);
  const [notChoosen, setNotChoosen] = useState(false);
  const [priceFilter, setPriceFilter] = useState("");
  //Filter Value
  const [filterValue, setFilterValue] = useState({
    category: "",
    brand: "",
    price: "",
    sort: "",
  });
  //PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [total, setTotal] = useState(0);

  const handleRefreshFilter = () => {
    setCurrentPage(1);
    setTotal(0);
    setCategoryName("");
    setCategoryValue("");
    setBrandValue("");
    setBrandLabel("");
    setListBrand([]);
  };

  const fetchProductFilter = async () => {
    let brands = [];
    if (!categoryValue) {
      return;
    }

    if (categoryValue && brandValue) {
      const query = `current=${currentPage}&pageSize=${pageSize}&category=${categoryValue}&brand=${brandValue}`;
      const res = await getProducts(query);
      if (res && res.data) {
        console.log("BOTH");
        console.log("res>>> ", res);
        setListData(res.data.products);
        setTotal(res.data.count);
        //LIST BRAND
        res.data.products.map((e) => {
          brands.push(e.brand);
        });
        setListBrand(
          dataBrand.filter((e) => {
            return (
              brands
                ?.filter((item, index) => {
                  return brands.indexOf(item) === index;
                })
                .indexOf(e.value) > -1
            );
          })
        );
      }
      return;
    }

    if (categoryValue) {
      setBrandValue("");
      const query = `current=${currentPage}&pageSize=${pageSize}&category=${categoryValue}`;
      const res = await getProducts(query);
      if (res && res.data) {
        console.log("res>>> ", res);
        setListData(res.data.products);
        setTotal(res.data.count);
        if (currentPage === 1) {
          console.log("ONLY");
          //LIST BRAND
          res.data.products.map((e) => {
            brands.push(e.brand);
          });
          setListBrand(
            dataBrand.filter((e) => {
              return (
                brands
                  ?.filter((item, index) => {
                    return brands.indexOf(item) === index;
                  })
                  .indexOf(e.value) > -1
              );
            })
          );
        }
        return;
      }
    }
  };

  const handleOnchangeProductsFilter = (pagination) => {
    console.log("pagination>>> ", pagination);
    if (pagination !== currentPage) {
      setCurrentPage(pagination);
    }
    // if (pagination && pagination.pageSize != pageSize) {
    //   console.log("onchange2");
    //   setPageSize(pagination.pageSize);
    //   setCurrentPage(1);
    // }
  };

  let location = useLocation();
  // let params = new URLSearchParams(location.pathname);

  const debounceLocation = useDebounce(location, 100);
  const debounceCurrentPage = useDebounce(currentPage, 300);
  const debounceCategoryValueAndBrandValue = useDebounce(
    JSON.stringify(categoryValue) + JSON.stringify(brandValue),
    300
  );

  useEffect(() => {
    console.log("category>> ", location?.pathname.split("/")[2]);
    console.log(
      "params>>> ",
      new URLSearchParams(location.search).get("brand")
    );
    const foundCategory = dataCategory.find(
      (e) => e.value === location?.pathname.split("/")[2]
    );
    const foundBrand = dataBrand.find(
      (e) => e.value === new URLSearchParams(location.search).get("brand")
    );

    if (foundCategory && foundBrand) {
      console.log("categoryBr");
      setCategoryName(foundCategory?.label);
      setCategoryValue(foundCategory?.value);
      setBrandValue(foundBrand.value);
      setBrandLabel(foundBrand.label);
      console.log("foundBrand>>> ", foundBrand);

      return;
    }
    if (foundCategory && notChoosen) {
      console.log("category ");
      setCategoryName(foundCategory?.label);
      setCategoryValue(foundCategory?.value);

      return;
    }
    if (foundCategory && !notChoosen) {
      setBrandValue("");
      setBrandLabel("");
      setListBrand([]);
      console.log("category!");
      setCategoryName(foundCategory?.label);
      setCategoryValue(foundCategory?.value);
      return;
    }
  }, [debounceLocation]);

  useEffect(() => {
    console.log("currentChange>>>1111111111 ");
    fetchProductFilter();
  }, [debounceCurrentPage]);

  useEffect(() => {
    console.log(
      "debounceCategoryValueAndBrandValue> ",
      debounceCategoryValueAndBrandValue
    );
    setCurrentPage(1);
    fetchProductFilter();
  }, [debounceCategoryValueAndBrandValue]);
  return (
    <div className="page-category">
      <div className="category">
        <nav className="category-header">TRANG CHỦ / {categoryName}</nav>
        <div className="category-container">
          <CategoryFilter
            listBrand={listBrand}
            categoryValue={categoryValue}
            categoryName={categoryName}
            fetchProductFilter={fetchProductFilter}
            setBrandValue={setBrandValue}
            setBrandLabel={setBrandLabel}
            brandValue={brandValue}
            setCurrentPage={setCurrentPage}
            handleRefreshFilter={handleRefreshFilter}
            setNotChoosen={setNotChoosen}
            setPriceFilter={setPriceFilter}
            priceFilter={priceFilter}
          />
          <CategoryProduct
            total={total}
            pageSize={pageSize}
            currentPage={currentPage}
            categoryName={categoryName}
            listData={listData}
            handleOnchangeProductsFilter={handleOnchangeProductsFilter}
            brandLabel={brandLabel}
          />
        </div>
      </div>
    </div>
  );
}

export default Category;
