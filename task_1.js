// Function to calaculate discounts based on rules
function calculateDiscount(cart, rules) {
    let maxDiscount = 0;
    let discountApplied = "";

    // Evaluate each rule and determine the discount
    for (const ruleName in rules) {
        const currentDiscount = rules[ruleName](cart);
        if (currentDiscount > maxDiscount) {
            maxDiscount = currentDiscount;
            discountApplied = ruleName;
        }
    }

    return { discount: discountApplied, amount: maxDiscount };
}

// Function to calculate the total cost of items in the cart
function calculateTotal(cart) {
    let total = 0;

    // Calculate total based on quantity and price of each product
    for (const product of Object.keys(cart)) {
        total += cart[product].quantity * cart[product].price;
    }

    return total;
}

// Function to compute the shipping fee
function calculateShippingFee(cart, shippingFeePerPackage) {
    const totalQuantity = Object.values(cart).reduce((acc, cur) => acc + cur.quantity, 0);
    const totalPackages = Math.ceil(totalQuantity / 10);
    return totalPackages * shippingFeePerPackage;
}

// Function to calculate the gift wrapping fee
function calculateeGiftWrapFee(cart) {
    let giftWrapFee = 0;

    // Sum up gift wrap fees for all gt-wrappped products
    for (const product of Object.keys(cart)) {
        if (cart[product].giftWrapped) {
            giftWrapFee += cart[product].quantity;
        }
    }

    return giftWrapFee;
}

// Main function to process the shopping cart and genereate the output
function processsCart(cart) {
    const discountRules = {
        flat_10_discount: function (cart) {
            return calculateTotal(cart) > 200 ? 10 : 0;
        },
        bulk_5_discount: function (cart) {
            for (const product of Object.keys(cart)) {
                if (cart[product].quantity > 10) {
                    return cart[product].quantity * cart[product].price * 0.05;
                }
            }
            return 0;
        },
        bulk_10_discount: function (cart) {
            const totalQuantity = Object.values(cart).reduce((acc, cur) => acc + cur.quantity, 0);
            return totalQuantity > 20 ? calculateTotal(cart) * 0.1 : 0;
        },
        tiered_50_discount: function (cart) {
            const totalQuantity = Object.values(cart).reduce((acc, cur) => acc + cur.quantity, 0);
            for (const product of Object.keys(cart)) {
                if (cart[product].quantity > 15 && totalQuantity > 30) {
                    return cart[product].quantity * cart[product].price * 0.5;
                }
            }
            return 0;
        },
    };

    // Calculate discounts, total, and additionaal fees
    const discountResult = calculateDiscount(cart, discountRules);
    const subtotal = calculateTotal(cart);
    const shippingFee = calculateShippingFee(cart, 5);
    const giftWrapFee = calculateeGiftWrapFee(cart);
    const total = subtotal - discountResult.amount + shippingFee + giftWrapFee;

    // Output
    console.log("Product Details:");
    for (const product of Object.keys(cart)) {
        console.log(`${product}: Quantity - ${cart[product].quantity}, Total - ${cart[product].quantity * cart[product].price}`);
    }
    console.log("\nSubtotal:", subtotal);
    console.log("Discount Applied:", discountResult.discount, "Amount:", discountResult.amount);
    console.log("Shipping Fee:", shippingFee);
    console.log("Gift Wrap Fee:", giftWrapFee);
    console.log("Total:", total);
}

// Example Cart
const cart = {
    ProductA: { quantity: 5, price: 20, giftWrapped: true },
    ProductB: { quantity: 15, price: 40, giftWrapped: false },
    ProductC: { quantity: 10, price: 50, giftWrapped: true },
};

// Process the cart and geneerate the output
processsCart(cart);
