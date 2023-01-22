// récupération du local storage
let elementLocalStorage = JSON.parse(localStorage.getItem("product"));

let productsApi = [];
let quantityTotal = [];
let priceTotal = [];
let responseServeur = [];

// stockage du panier dans une variable 
let basketStock = JSON.parse(localStorage.getItem("orderProducts"));

getProductApi(elementLocalStorage);

//on affiche les produit qui sont dans le panier 
async function getProductApi(products) {
    const cartElement = document.querySelector("#cart__items");

    //pour un panier vide
    if (products == null || products == 0) {
        const cartNoElement =  `<article class = "container-no-element"><div> Votre panier est vide.</div></article>`;
    cartElement.innerHTML = cartNoElement;

    } else {
        for (let i = 0; i < products.length; i++) {
            let productApi = null;
            await fetch("http://localhost:3000/api/products" + products[i].id)
                .then((response) => response.json())
                .then((data) => (productApi = data))
                .catch((error) => alert("Chargement impossible, le serveur ne répond pas"));
            
                productApi.color = products[i].color;
                productApi.quantity = products[i].quantity;
                productsApi.push(productApi);

        }
        showProducts()
    }
}

function showProducts() {

    const cartElement = document.querySelector("#cart__items");
    cartElement.innerHTML = productsApi
        //itération selon l'ordre d'ajout
        .map((product) => {
            return `<article class="cart__item" data-id="¤${product.id}" data-color="${product.color}">
                        <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>              
                                <p>${product.color}</p>
                                <p>${product.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                                </div>
                                 <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article>`;
        })

    // calcul du nombre de produit dans le panier et conversion en base 10
    function totalElementInBasket () {
        totalQuantity = 0;
        for (let p = 0; p < elementLocalStorage.length; p++) {
            let newElementQuantity = parseInt(elementLocalStorage[p].quantity, 10);
            totalQuantity += newElementQuantity;
        }

        let quantityTotal = document.querySelector("#totalQuantity");
        quantityTotal.innerText = totalQuantity
    };
    totalElementInBasket()

    //avertissement quand trop d'articles ou pas assez    
    function warningQuantity () {
        let warningElementQuantity = document.querySelectorAll(".itemQuantity");
        for (let j = 0; j < warningElementQuantity.length; j++){
            warningElementQuantity[j].addEventListener("change", function(event) {
                if (event.target.value >= 1 && event.target.value <= 100) {
                    warningElementQuantity[j].quantity = event.target.value;
                    localStorage.setItem("product", JSON.stringify(elementLocalStorage));
                } else {
                    alert ("Vous devez sélectionner entre 1 et 99 produits.");
                    event.target.value = 1;
                    warningElementQuantity[j].quantity = event.target.value;
                    localStorage.setItem("product", JSON.stringify(elementLocalStorage))
                }
            });
        };

    };
    warningQuantity();

    // modification et maj des canapés sélectionnés 
    function basketElementQuantity () {
        let elementQuantity = document.querySelectorAll(".itemQuantity");
        for (let n = 0; n < elementQuantity.length; n++) {
            elementQuantity[n].addEventListener("change", (event) => {
                event.preventDefault();
                let newElementQuantity = elementQuantity[n].value;
                const itemElementNew = {
                    id : elementLocalStorage[n].id,
                    src : elementLocalStorage[n].src,
                    alt : elementLocalStorage[n].alt,
                    name : elementLocalStorage[n].name,
                    color : elementLocalStorage[n].color,
                    quantity : newElementQuantity
                };

                elementLocalStorage[n] = itemElementNew;
                localStorage.setItem("product", JSON.stringify(elementLocalStorage));

                alert ("Votre panier a bien été mis à jour.");
                totalElementInBasket();
                location.reload()
            })
        }
    };
    basketElementQuantity();


    function deleteElementAllOver () {
        let deleteElement = document.querySelectorAll(".deleteItem");
        for (let q = 0; q < deleteElement.length; q ++) {
            deleteElement[q];addEventListener("click", (event) => {
                event.preventDefault();

                let deleteId = elementLocalStorage[q].id;
                let deleteColor = elementLocalStorage[q].color;

                elementLocalStorage = elementLocalStorage.filter(a => a.id !== deleteId || a.color !== deleteColor );
                localStorage.setItem("product", JSON.stringify(elementLocalStorage));

                alert ("l'article a été supprimé de votre panier")
                window.location.href = "cart.html";
            });
        }
    }

    deleteElementAllOver()

    function totalElementPrice () {
        for (let t = 0; t < productsApi.length; t++) {
            let elementGlobalPrice = productsApi[t].price;
            let elementQuantityPrice = productsApi[t].quantity;
            priceTotal.push(elementGlobalPrice * elementQuantityPrice);
        }

        const elementReduce = (totalizer, actual) => totalizer + actual;
        const priceAddition = priceTotal.reduce(elementReduce);
    }
    totalElementPrice();


};

// formulaire 

// récupération des id
const firstNameElement = document.getElementById("firstName");
const lastNameElement = document.getElementById("lastName");
const addressElement = document.getElementById("address");
const cityElement = document.getElementById("city");
const emailElement = document.getElementById("email");
