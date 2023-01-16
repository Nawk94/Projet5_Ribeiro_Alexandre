fetch("http://localhost:3000/api/products")
    .then(r => r.json())
    .then((products) => displayProducts(products))
    .catch(error => alert("Chargement de la page impossible"));