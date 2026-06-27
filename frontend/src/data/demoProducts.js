export const demoProducts = [
    {
        id: "demo-phone",
        name: "Astra X1 5G Smartphone with 128 GB Storage",
        description: "A slim everyday phone with a bright display, long battery life and fast charging support.",
        price: 18999,
        category: "Mobiles",
        brand: "Astra",
        stock: 18,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
        demo: true
    },
    {
        id: "demo-headphones",
        name: "SoundCore Wireless Noise Cancelling Headphones",
        description: "Comfortable over-ear headphones with deep bass, active noise cancellation and 40 hours of playtime.",
        price: 5499,
        category: "Electronics",
        brand: "SoundCore",
        stock: 31,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
        demo: true
    },
    {
        id: "demo-laptop",
        name: "NimbusBook Air 14-inch Laptop",
        description: "A lightweight laptop for work, study and streaming with a sharp 14-inch display.",
        price: 57990,
        category: "Electronics",
        brand: "Nimbus",
        stock: 12,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
        demo: true
    },
    {
        id: "demo-shoes",
        name: "UrbanRun Everyday Sneakers",
        description: "Breathable sneakers with cushioned soles for travel, walks and daily wear.",
        price: 2199,
        category: "Fashion",
        brand: "UrbanRun",
        stock: 42,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
        demo: true
    },
    {
        id: "demo-watch",
        name: "Classic Steel Analog Watch",
        description: "A clean stainless-steel watch with water resistance and a comfortable everyday strap.",
        price: 3299,
        category: "Fashion",
        brand: "Northline",
        stock: 9,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
        demo: true
    },
    {
        id: "demo-chair",
        name: "ErgoFlex Mesh Office Chair",
        description: "Supportive mesh chair with adjustable height, tilt control and a compact home-office footprint.",
        price: 7499,
        category: "Home",
        brand: "ErgoFlex",
        stock: 15,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
        demo: true
    },
    {
        id: "demo-maker",
        name: "BrewMate 12-Cup Coffee Maker",
        description: "Programmable coffee maker with a reusable filter, pause-and-serve brewing and easy cleaning.",
        price: 2899,
        category: "Home",
        brand: "BrewMate",
        stock: 24,
        image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=900&q=80",
        demo: true
    },
    {
        id: "demo-book",
        name: "Designing Better Products",
        description: "A practical guide for planning, prototyping and shipping digital products that people enjoy using.",
        price: 699,
        category: "Books",
        brand: "PaperTrail",
        stock: 64,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80",
        demo: true
    }
];

export const getDemoProducts = ({ keyword = "", category = "" } = {}) => {
    const term = keyword.trim().toLowerCase();

    return demoProducts.filter((product) => {
        const matchesCategory = !category || product.category === category;
        const searchable = [
            product.name,
            product.brand,
            product.category,
            product.description
        ].join(" ").toLowerCase();

        return matchesCategory && (!term || searchable.includes(term));
    });
};
