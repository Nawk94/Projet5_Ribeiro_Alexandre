//récupération des informations (url, id)
const url = window.location.search;
const params = new URLSearchParams(url);
const _id = params.get("_id");

//récupération de l'id dans le fetch
fetch("http://localhost:3000/api/products/" + _id)
    .then(r => r.json())
    .then((product) => displayElementProduct(product))
    .catch(error => alert("Chargement impossible, le serveur ne répond pas"));



//affichage des éléments du produit, utilisation de querySelector afin de retourner le 1er élement dans le doc
function displayElementProduct(product) {
    let picElement = document.querySelector(".item__img");
    let imageProduct = document.createElement("img");
    imageProduct.src = product.imageUrl;
    imageProduct.alt = product.altTxt;
    picElement.appendChild(imageProduct);
    let descrtionElement = document.querySelector("#description");
    descrtionElement.innerText = product.description;
    let namElement = document.querySelector("#title");
    namElement.innerText = product.name;
    let pricElement = document.querySelector("#price");
    pricElement.innerText = product.price;






	//choix des différentes couleurs 
	let selectColor = document.getElementById("colors");

	product.colors.forEach(choiceColor => {
		let optionColor = document.createElement("option");
		//parent + enfant 
		selectColor.appendChild(optionColor);
		optionColor.value = `${choiceColor}`;
		optionColor.innerText = `${choiceColor}`
	});

	//ajout des articles au panier en écoutant le bouton et empêchement d'actualisation de la page 

	const listenElement = document.getElementById("addToCart");
	listenElement.addEventListener("click", (event) => {
		event.preventDefault();

		//récupération de la selection
		const selectColor = document.getElementById("colors");
		const quantityElement = document.querySelector("#quantity");

		//items à enregistrer 
		let choice = {
			id : _id,
			color : `${selectColor.value}`,
			quantity : `${quantityElement.value}`,
		};

		//ajout de  la selection dans le localstorage

		//transformation en tableau
		let itemsLocalStorage = JSON.parse(localStorage.getItem("product")); 

		let basketUpdate = false;

		const additemsLocalStorage = () => {
			itemsLocalStorage.push(choice);
			//transformation en chaîne de caractères 
			localStorage.setItem("product", JSON.stringify(itemsLocalStorage));
		};

		let confirmText = () => {
			alert ('Le canapé a été ajouté à votre panier');
		};

		// vérifie que 1 <= canapé < 100 et qu'une couleur est sélectionée
		function quantityAndColorChoice () {
			if (choice.quantity < 1 ||
				choice.quantity > 100 ||
				choice.quantity === undefined ||
				choice.color === "" ||
				choice.color === undefined
			) {
				alert ("Veuillez choisir une couleur et/ou une quantité pour votre canapé avant de l'ajouter à votre panier")
			} else if
				//si le local storage contient déja des produits avec la même ide et la même couleur et si des produits sont présent avec les même key
				(itemsLocalStorage) {
				itemsLocalStorage.forEach(function (product, key){
					if (product.id == _id && product.color == selectColor.value){
						itemsLocalStorage[key].quantity = parseInt(product.quantity) + parseInt(quantityElement.value);
						localStorage.setItem("product", JSON.stringify(itemsLocalStorage));
						basketUpdate = true;
						confirmText();
					}
				});

				if (!basketUpdate) {
					additemsLocalStorage();
					confirmText();
				}

			}
			// finalement, si aucun produit n'existe dans le local storage
			else {
				itemsLocalStorage = [];
				additemsLocalStorage();
				confirmText();
			}
		};

		quantityAndColorChoice();

	});
};