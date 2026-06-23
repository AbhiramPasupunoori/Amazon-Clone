import { useEffect, useState } from "react";

import API from "../services/api";

function Cart() {

const [cart, setCart] =
    useState([]);

const [subtotal, setSubtotal] =
    useState(0);

useEffect(() => {

    getCart();

}, []);

const getCart = async () => {

    try {

        const res =
            await API.get("/cart");

        setCart(res.data);

        let total = 0;

        res.data.forEach(item => {

            total +=
                item.price *
                item.quantity;

        });

        setSubtotal(total);

    } catch (error) {

        console.error(error);

    }

};

const updateQuantity =
    async (id, quantity) => {

        try {

            await API.put(
                "/cart/update",
                {
                    id,
                    quantity
                }
            );

            getCart();

        } catch (error) {

            console.error(error);

        }

    };

const removeItem =
    async (id) => {

        try {

            await API.delete(
                `/cart/${id}`
            );

            getCart();

        } catch (error) {

            console.error(error);

        }

    };

return (

    <div
        style={{
            padding: "20px"
        }}
    >

        <h1>
            My Cart
        </h1>

        {cart.map(item => (

            <div
                key={item.id}
                style={{
                    border:
                        "1px solid #ddd",
                    padding:
                        "15px",
                    marginBottom:
                        "10px"
                }}
            >

                <h3>
                    {item.name}
                </h3>

                <p>
                    ₹{item.price}
                </p>

                <p>
                    Quantity:
                    {item.quantity}
                </p>

                <button
                    onClick={() =>
                        updateQuantity(
                            item.id,
                            item.quantity + 1
                        )
                    }
                >
                    +
                </button>

                <button
                    onClick={() =>
                        updateQuantity(
                            item.id,
                            item.quantity - 1
                        )
                    }
                >
                    -
                </button>

                <button
                    onClick={() =>
                        removeItem(
                            item.id
                        )
                    }
                >
                    Remove
                </button>

            </div>

        ))}

        <h2>
            Subtotal:
            ₹{subtotal}
        </h2>

    </div>

);


}

export default Cart;
