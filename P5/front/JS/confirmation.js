//on récupere l'orderId
const url = window.location.search;
const params = new URLSearchParams(url);
const orderId = params.get("id");

function ShowLastOrder() {
    const lastOrderElementoShow = document.getElementById("orderId");
    lastOrderElementoShow.innerText = orderId;
};

ShowLastOrder();