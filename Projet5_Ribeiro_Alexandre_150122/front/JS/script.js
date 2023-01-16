fetch("http://localhost:3000/api/products")
    .then(r => r.json())
    .then((products) => displayProducts(products))
    .catch(error => alert("Chargement  impossible"));
