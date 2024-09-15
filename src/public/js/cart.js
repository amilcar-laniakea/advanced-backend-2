const cartId = JSON.parse(localStorage.getItem("cart"));

if (cartId) {
  showLoading();

  axios.get(`/api/cart/${cartId}`).then((response) => {
    hideLoading();

    const cartProducts = response.data.data;

    let totalQuantity = 0;
    let totalPrice = 0;

    cartProducts.products.forEach((item) => {
      totalQuantity += item.quantity;
      totalPrice += item.product.price * item.quantity;
    });

    const cartContainer = document.getElementById("cart-container");
    cartContainer.innerHTML = `
      <h1>Cart</h1>
      <h4>Productos del Carrito: ${cartProducts.products.length}</h4>
     
      ${cartProducts.products
        .map(
          (product) =>
            `
        <ul style="border: 1px solid #a0a0a0; padding-top: 15px; padding-bottom: 15px; border-radius: 8px; position: relative; margin-top: 10px; margin-bottom: 10px;">
          <li style="margin: 0px">ID: <strong>${
            product.product._id
          }</strong></li>
          <li style="margin: 0px">Nombre: <strong>${
            product.product.name
          }</strong></li>
          <li style="margin: 0px">Descripción: ${
            product.product.description
          }</li>
          <li style="margin: 0px">Código: ${product.product.code}</li>
          <li style="margin: 0px">Precio: <strong>${
            product.product.price
          }</strong></li>
          <li style="margin: 0px">Status: ${
            product.product.status ? "<strong>Activo</strong>" : "Inactivo"
          }</li>
          <li style="margin: 0px">Stock: ${product.product.stock}</li>
          <li style="margin: 0px">Categoría: <strong>${
            product.product.category
          }</strong></li> 
          <li style="margin: 0px">Cantidad: <strong style="color: red">${
            product.quantity
          }</strong></li> 

          <div style="position: absolute; top: 50%; right: 0; transform: translate(-50%, -50%); width: min-content;">
            <button type="button" onclick="handleDeleteProduct('${
              product.product._id
            }')"  style="border: 0; border-radius: 4px; background-color: #279033; color: #ffffff; font-size: 1em; padding: .625em 1.1em; cursor: pointer; margin-bottom: 10px; min-width: 100px">Eliminar</button>
          </div> 
        </ul>        
        `
        )
        .join("")}

        <h4 style="margin-left: 10px">Total Productos: ${totalQuantity} &nbsp; &nbsp; &nbsp; Total Monto: $${totalPrice}</h4>

        <div style="width: 100%; text-align: center; margin: 30px 0">
          <button type="button" onclick="goBack()"  style="border: 0; border-radius: 4px; background-color: #aab1e1a1; color: #ffffff; font-size: 1em; padding: .625em 1.1em; cursor: pointer; margin-bottom: 10px; min-width: 100px">Volver</button>
        </div>
        
      `;
  }).catch((error) => {
    hideLoading();
    showError();
    console.error("Error fetching cart data:", error);
  });
}

function showLoading() {
  document.getElementById("loading").style.display = "block";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

function showError() {
  document.getElementById("error").style.display = "block";
}

function goToCart() {
  window.location.href = `/views/cart`;
}

function goBack() {
  window.history.back();
}

function handleDeleteProduct(productId) {
  Swal.fire({
    title: `¿Estás seguro de eliminar el producto?`,
    text: "Esta acción es irreversible...",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    allowOutsideClick: false,
    preConfirm: async () => {
      try {
        const response = await axios.delete(`/api/cart/${cartId}/product/${productId}`);

        return response.data;
      } catch (error) {
        Swal.showValidationMessage("Error al eliminar el producto: " + error.response.data.message);

        return false;
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: `${result.value.message}`,
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });;
    }
  });
}

