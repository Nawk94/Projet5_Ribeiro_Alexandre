//récupération des informations (url, id)
const url = window.location.search;
const factor = new URLSearchParams(url);
const ident = factor.get("_id");


//récupération de l'id dans le fetch
fetch("http://localhost:3000/api/products" + ident)
    .then((response) => response.json())
    .then((products) => showProducts(products))
    .catch((error) => alert("Chargement impossible, le serveur ne répond pas"));


//affichage des éléments du produit, utilisation de querySelector afin de retourner le 1er élement dans le doc
function showProducts(product) {
	let picElement = document.querySelector(".item__img");
	let picProduct = document.createElement("img");
	picProduct.src = product.imageUrl;
	picProduct.alt = product.altTxt;
	//parent + enfant
	picElement.appendChild(picProduct);
	let descrElement = document.querySelector("#description");
	descrElement.innerText = product.description;
	let titlElement = document.querySelector("#title");
	titlElement.innerText = product.name;
	let costElement = document.querySelector("#price");
	costElement.innerText = product.price;





	//choix des différentes couleurs 
	let choiceColor = document.getElementById("colors");

	product.colors.foreach(selectColor => {
		let difColor = document.createElement("option");
		difColor.value = `${selectColor}`;
		difColor.innerText = `${selectColor}`

		//parent + enfant 
		choiceColor.appendChild(difColor);

	});

	//ajout des articles au panier en écoutant le bouton et empêchement d'actualisation de la page 

	const listenElement = document.getElementById("addToCart");
	listenElement.addEventListener("click", (event) => {
		event.preventDefault();

		//récupération de la selection
		const choiceColor = document.getElementById("colors");
		const quantityElement = document.querySelector("#quantity");

		//items à enregistrer 
		let choice = {
			id : ident,
			color : `${choiceColor.value}`,
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

		// vérifie que 1 <= canapé <= 100 et qu'une couleur est sélectionée
		function quantityAndColorChoice () {
			if (choice.quantity < 1 ||
				choice.quantity > 100 ||
				choice.quantity === undefined ||
				choice.color === "" ||
				choice.color === undefined
			) {
				alert ("Veuillez choisir une couleur pour votre canapé avant de l'ajouter à votre panier")
			} else if
				//si le local storage contient déja des produits avec la même ident et la même couleur et si des produits sont présent avec les même key
				(itemsLocalStorage) {
				itemsLocalStorage.forEach(function (product, key){
					if (product.id == ident && product.color == choiceColor.value){
						itemsLocalStorage[key].quantity = parseInt(product.quantity) + parseInt(quantityElement.value);
						localStorage.setItem("product", JSON.stringify(itemsLocalStorage));
						basketUpdate = true;
						confirmText();
					}
				});

				if (!basketUpdate) {
					additemsLocalStorage();
					confirmText;
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