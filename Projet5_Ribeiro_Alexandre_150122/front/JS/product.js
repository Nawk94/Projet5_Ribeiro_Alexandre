//récupération des informations (url, id)
const url = window.location.search;
const factor = new URLSearchParams(url);
const ident = factor.get("_id");


//récupération de l'id dans le fetch
fetch("http://localhost:3000/api/products" + ident)
    .then((reponse) => response.json())
    .then((products) => displayProducts(products))
    .catch((error) => alert("Chargement impossible, le serveur ne répond pas"));


//affichage des éléments du produit, utilisation de querySelector afin de retourner le 1er élement dans le doc
function showProducts(product) {
	let picElement = document.querySelector(".item__img");
	let picProduct = document.createElement("img");
	picProduct.src = product.imageUrl;
	picProduct.alt = product.altTxt;
	let descrElement = document.querySelector("#description");
	descrElement.innerText = product.description;
	let titlElement = document.querySelector("#title");
	titlElement.innerText = product.name;
	let costElement = document.querySelector("#price");
	costElement.innerText = product.price;


	//parent + enfant
	picElement.appendChild(picProduct);


	//choix des différentes couleurs 
	let choiceColor = document.getElementById("colors");
	product.colors.foreach(selectColor => {
		let difColor = document.createElement("option");
		difColor.value = `${selectColor}`;
		difColor.innerText = `${selectColor}`

		//parent + enfant 
		choiceColor.appendChild(difColor);

	});

	//ajout des articles au panier

	const listenElement = document.getElementById("addToCart");
	listenElement.addEventListener("click"), (event) => {
		event.preventDefault();

		//récupération de la selection
		const choiceColor = document.getElementById("colors");
		const quantityElement = document.querySelector("#quantity");
	};

};