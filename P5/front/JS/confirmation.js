const url = window.location.search;
const params = new URLSearchParams(url);
const finalBasketElementId = params.get("id");

function showFinalOrder() {
    const finalOrderElement = document.getElementById("orderId");
    finalOrderElement.innerText = finalBasketElementId;
};

showFinalOrder();