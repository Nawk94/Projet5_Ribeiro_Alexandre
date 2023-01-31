// récupération du local storage
let elementLocalStorage = JSON.parse(localStorage.getItem("product"));

let productsApi = [];
let quantityTotal = [];
let priceTotal = [];
let responseServeur = [];

// stockage et récupération du panier dans une variable 
let basketStock = JSON.parse(localStorage.getItem("orderProducts"));

// Récupère les données dans une variable
getProductApi(elementLocalStorage);

// on affiche les produit qui sont dans le panier et on récupere les données du localstorage (productapi.color ...) 
async function getProductApi(products) {

  const cartElement = document.querySelector("#cart__items");
  // pour un panier vide
  if (products === null || products == 0) { 
    const cartNoElement =
      `<article class="container-cart-empty">
      <div> Le panier est vide. Veuillez rajouter des articles à partir de la page d'accueil avant de passer commande. Merci de votre compréhension.</div> </article>`;

    cartElement.innerHTML = cartNoElement;

  } else {
    for (let j = 0; j < products.length; j++) {
      let productApi = null;
      await fetch("http://localhost:3000/api/products/" + products[j].id)
        .then((res) => res.json())
        .then((data) => (productApi = data))
        .catch(error => alert("Chargement impossible, le serveur ne répond pas"));

      
      productApi.color = products[j].color;
      productApi.quantity = products[j].quantity;
      productsApi.push(productApi);
    }
    
    showProducts();
  }
}

function showProducts() {

  const cartElement = document.querySelector("#cart__items");
  cartElement.innerHTML = productsApi
    // itération selon l'ordre d'ajout grâce à .map
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
                </article>
        `;
    })


  // avertissement quand trop d'articles ou pas assez 
  function warningQuantity() {
    let warningElementQuantity = document.querySelectorAll(".itemQuantity");
    for (let o = 0; o < warningElementQuantity.length; o++) {
      warningElementQuantity[o].addEventListener("change", function (event) {
        if (event.target.value >= 1 && event.target.value <= 100) {
          warningElementQuantity[o].quantity = event.target.value;
          localStorage.setItem("product", JSON.stringify(elementLocalStorage));
        } else {
          alert("Vous devez sélectionner entre 1 et 99 produits.");
          event.target.value = 1;
          warningElementQuantity[o].quantity = event.target.value;
          localStorage.setItem("product", JSON.stringify(elementLocalStorage));
        }
      });
    };
  };

  warningQuantity();

  // modification et maj des canapés sélectionnés + rechargement de la page 
  function basketElementQuantity() {
    let elementQuantity = document.querySelectorAll(".itemQuantity");
    for (let k = 0; k < elementQuantity.length; k++) {
      elementQuantity[k].addEventListener("change", (event) => {
        event.preventDefault();
        let newElementQuantity = elementQuantity[k].value;
        const newElementInBasket = {
          id: elementLocalStorage[k].id,
          src: elementLocalStorage[k].src,
          alt: elementLocalStorage[k].alt,
          name: elementLocalStorage[k].name,
          color: elementLocalStorage[k].color,
          quantity: newElementQuantity
        };

        elementLocalStorage[k] = newElementInBasket;
        localStorage.setItem("product", JSON.stringify(elementLocalStorage));

        alert("Votre panier a bien été mis à jour.");
        getTotalElementInBasket();
        location.reload(); 
      })
    }
  };

  basketElementQuantity();

  // on supprime de partout (DOM + localstorage) / on utilise filter pour retourner un nouveau tableau 
  function deletElementAllOver() {
    let deletElement = document.querySelectorAll(".deleteItem");
    for (let l = 0; l < deletElement.length; l++) {
      deletElement[l].addEventListener("click", (event) => {
        event.preventDefault();

        let deleteId = elementLocalStorage[l].id;
        let deleteColor = elementLocalStorage[l].color;


        elementLocalStorage = elementLocalStorage.filter(e => e.id !== deleteId || e.color !== deleteColor);

        localStorage.setItem("product", JSON.stringify(elementLocalStorage));

        alert("l'article a été supprimé de votre panier");
        window.location.href = "cart.html"; 

      });
    }
  }

  deletElementAllOver();

  // calcul du nombre de produit dans le panier et conversion en base 10
  function getTotalElementInBasket() {
    totalElementQuantity = 0;
    for (let m = 0; m < elementLocalStorage.length; m++) {
      let newTotalElementQuantity = parseInt(elementLocalStorage[m].quantity, 10);
      

      totalElementQuantity += newTotalElementQuantity;
    }

    let quantityTotalElementinBasket = document.querySelector("#totalQuantity");
    quantityTotalElementinBasket.innerText = totalElementQuantity;

  };

  getTotalElementInBasket();


  // on somme le panier avec reduce
  function getTotalElementPrice() {
    for (let n = 0; n < productsApi.length; n++) {
      let elementGlobalPrice = productsApi[n].price;
      let elementQuantityPrice = productsApi[n].quantity;
      priceTotal.push(elementGlobalPrice * elementQuantityPrice);
    }

    const reducer = (accumulator, value) => accumulator + value;
    const priceAddition = priceTotal.reduce(reducer);

    let showPriceinBasket = document.querySelector("#totalPrice");
    showPriceinBasket.innerText = priceAddition;
  }
  getTotalElementPrice();
};

// Formulaire 



// récupération des données

const firstNameElement = document.getElementById("firstName");
const lastNameElement = document.getElementById("lastName");
const addressElement = document.getElementById("address");
const cityElement = document.getElementById("city");
const emailForm = document.getElementById("email");

// création de variables afin de récuépérer les informations rentrées par les utilisateurs 
let inputFirstName;
let inputLastName;
let inputAddress;
let inputCity;
let inputEmail;

//pour le prénom avec les regex 
firstNameElement.addEventListener("input", (event) => {
  inputFirstName;
  if (event.target.value.length == 0) {
    firstNameErrorMsg.innerText = "";
    inputFirstName = null;
  }
  else if (event.target.value.length < 2 || event.target.value.length > 15) {
    firstNameErrorMsg.innerText = "Le prénom doit comprendre entre 2 et 15 caractères";
    inputFirstName = null;
  }
  if (event.target.value.match(/^[a-z A-Z áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,15}$/)) { // regex
    firstNameErrorMsg.innerText = ""; 
    inputFirstName = event.target.value;
  }
  if (
    !event.target.value.match(/^[a-z A-Z áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,15}$/) &&
    event.target.value.length > 2 &&
    event.target.value.length < 15
  ) {
    firstNameErrorMsg.innerText = "Pas de caractères spéciaux et pas de chiffres dans votre prénom s'il vous plait.";
    inputFirstName = null;
  }
});

// pour le nom avec les regex
lastNameElement.addEventListener("input", (event) => {
  inputLastName;
  if (event.target.value.length == 0) {
    lastNameErrorMsg.innerText = "";
    inputLastName = null; 
  }
  else if (event.target.value.length < 2 || event.target.value.length > 15) {
    lastNameErrorMsg.innerText = "Le nom doit comprendre entre 2 et 15 caractères";
    inputLastName = null;
  }
  if (event.target.value.match(/^[a-z A-Z áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,15}$/)) { // regex
    lastNameErrorMsg.innerText = ""; 
    inputLastName = event.target.value;
  }
  if (
    !event.target.value.match(/^[a-z A-Z áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,15}$/) &&
    event.target.value.length > 2 &&
    event.target.value.length < 15
  ) {
    lastNameErrorMsg.innerText = "Pas de caractères spéciaux et pas de chiffres dans votre nom s'il vous plait.";
    inputLastName = null;
  }
});

// pour l'adresse avec les regex 
addressElement.addEventListener("input", (event) => {
  inputAddress;
  if (event.target.value.length == 0) {
    addressErrorMsg.innerText = "";
    inputAddress = null;
  }
  else if (event.target.value.length < 2 || event.target.value.length > 30) {
    addressErrorMsg.innerText = "L'adresse doit comprendre entre 2 et 30 caractères.";
    inputAddress = null;
  }
  if (event.target.value.match(/^[0-9]{1,5} [a-z A-Z áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,30}$/)) { // regex
    addressErrorMsg.innerText = ""; // 
    inputAddress = event.target.value;
  }
  if (
    !event.target.value.match(/^[0-9]{1,5} [a-z A-Z áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,30}$/) &&
    event.target.value.length > 2 &&
    event.target.value.length < 30
  ) {
    addressErrorMsg.innerText = "pas de caractères spéciaux dans votre adresse s'il vous plait";
    inputAddress = null;
  }
});

// pour la ville avec les regex
cityElement.addEventListener("input", (event) => {
  inputCity;
  if (event.target.value.length == 0) {
    cityErrorMsg.innerText = "";
    inputCity = null;
  }
  else if (event.target.value.length < 2 || event.target.value.length > 15) {
    cityErrorMsg.innerText = "La ville doit comprendre entre 2 et 25 caractères.";
    inputCity = null;
  }
  if (event.target.value.match(/^[a-z A-Z áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,15}$/)) { // regex
    cityErrorMsg.innerText = ""; // 
    inputCity = event.target.value;
  }
  if (
    !event.target.value.match(/^[a-z A-Z áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{2,15}$/) &&
    event.target.value.length > 2 &&
    event.target.value.length < 15
  ) {
    cityErrorMsg.innerText = "Pas de caractères spéciaux et pas de chiffres dans le nom de votre ville s'il vous plait.";
    inputCity = null;
  }
});

// pour le mail
emailElement.addEventListener("input", (event) => {
  if (event.target.value.length == 0) {
    emailErrorMsg.innerText = "";
    inputEmail = null;
  }
  else if (event.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    emailErrorMsg.innerText = "";
    inputEmail = event.target.value;
  }
  if (!event.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) && !event.target.value.length == 0) {
    emailErrorMsg.innerText = "Veuillez entrer une adresse email respectant le bon format (ex: exemple@exemple.com).";
    inputEmail = null;
  }
});

//pour envoyer l'ensemble des informations 

let formContactElementSubmit = document.querySelector(".cart__order");

formContactElementSubmit.addEventListener("submit", (event) => {
  event.preventDefault();

  if (inputFirstName && inputLastName && inputAddress && inputCity && inputEmail) {
    const lastOrderElement = JSON.parse(localStorage.getItem("product"));
    let orderElementId = [];

    lastOrderElement.forEach((order) => {
      orderElementId.push(order.id);
    });

    // Données attendues par le controller
    const data = {
      contact: {
        firstName: valueFirstName,
        lastName: valueLastName,
        address: valueAddress,
        city: valueCity,
        email: valueEmail,
      },
      products: orderElementId,
    };


    // Fetch post
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(data => {
        document.location.href = `confirmation.html?id=` + data.orderElementId;
        localStorage.removeItem("product");
      });

    //On efface le formulaire pour éviter les erreurs
    firstNameElement.value = "";
    lastNameElement.value = "";
    addressElement.value = "";
    cityElement.value = "";
    emailElement.value = "";
    inputFirstName = null;
    inputLastName = null;
    inputAddress = null;
    inputCity = null;
    inputEmail = null;

  } else {
    alert("verifier le formulaire.")
  }
});