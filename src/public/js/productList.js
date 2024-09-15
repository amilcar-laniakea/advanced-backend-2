async function handleAddProduct(productId) {
  let cartId = JSON.parse(localStorage.getItem("cart"));

  if (!cartId) {
    try {
      const response = await axios.post(`/api/cart/`);

      localStorage.setItem("cart", JSON.stringify(response.data.data._id));

      cartId = response.data.data._id;

      addProductToCart(cartId, productId);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: `Error al crear el carrito de compras: ${error.response.status}`,
        timer: 10000,
      });
    }
  } else {
    addProductToCart(cartId, productId);
  }
}

async function addProductToCart(cartId, productId) {
  try {
    const response = await axios.post(`/api/cart/${cartId}/product/${productId}`);

    Swal.fire({
      icon: "success",
      title: `${response.data.message}`,
      timer: 10000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: `Error al agregar el producto al carrito: ${error.response.data.message}`,
      timer: 10000,
    });
  }
}

function goToProductDetail(id) {
  window.location.href = `/views/product-detail/${id}`;
}

function goToProducts() {
  window.location.href = `/views/products`;
}

function goToCart() {
  window.location.href = `/views/cart`;
}

function clearForm() {
  document.getElementById("productForm").reset();
}