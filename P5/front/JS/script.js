//récupération des produits + réponse en json + affichage résultat + message d'erreur
fetch("http://localhost:3000/api/products")
    .then(r => r.json())
    .then((products) => showProducts(products))
    .catch((error) => alert("Chargement impossible, le serveur ne répond pas"));

//fonction d'affichage avec boucle for afin de parcourir et d'insérer les éléments + lien vers html et récupération de l'id
function showProducts(products) {
	const productElement = document.getElementById("items");

	for (const product of products) {
		const linkElement = document.createElement("a");
		linkElement.href = "./product.html?_id=" + product._id;
		const articlElement = document.createElement("article");
		const picElement = document.createElement("img");
		picElement.src = product.imageUrl;
		picElement.alt = product.altTxt;
		const titlElement = document.createElement('h3');
		titlElement.innerText = product.name;
		const descrElement = document.createElement('p');
		descrElement.innerText = product.description;

		//parents + enfants
		productElement.appendChild(linkElement);
		linkElement.appendChild(articlElement);
		articlElement.appendChild(picElement);
		articlElement.appendChild(titlElement);
		articlElement.appendChild(descrElement);
	};

};
