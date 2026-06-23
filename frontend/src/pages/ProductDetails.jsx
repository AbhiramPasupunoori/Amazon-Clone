import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../services/api";

function ProductDetails() {

    const { id } = useParams();

    const [product, setProduct] =
        useState(null);

    useEffect(() => {

        getProduct();

    }, []);

    const getProduct = async () => {

        try {

            const res = await API.get(
                `/products/${id}`
            );

            console.log("Product:", res.data);

            setProduct(res.data);

        } catch (error) {

            console.error(
                "Product fetch error:",
                error
            );

        }

    };

}

export default ProductDetails;