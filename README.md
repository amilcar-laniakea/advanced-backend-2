# Aplicación Backend E-Commerce:  **Backend Avanzado II**

(ultima actualización: => 15/09/2024)

Primera pre-entrega de la segunda parte del curso avanzado de backend.

El proyecto se estructuro de forma que pudiera mostrar una modularidad fácilmente escalable a un proyecto que solo funcione desde el server side, por ahora hay secciones del proyecto que a manera ilustrativa funcionan como una especia de frontend y tienen como nombre `static` como palabra clave en la nomenclatura de archivos, las rutas de renderizado y los controladores especialmente elaborados para demostración, todo esto con el objetivo de que esas partes de la aplicación puedan sustraerse de forma sencilla y rápida en posteriores iteraciones de la segunda parte del curso.

Proyecto hecho con conexión a una base de datos no-relacional basada en la arquitectura de mongoDB.

> [!IMPORTANT]
> `Actualización 15/09/2024:` para realizar un test de la funcionalidad de cookies, la cual fue implementada de de forma `opcional`, revisar toda la información necesaria para probar y entender su uso se ir a la seccion de `uso => endpoints de la api => rutas de usuarios`, allí se encontraran 2 avisos importantes de como usarlo por medio de `postman`
 
## Tabla de Contenidos

1. [Instalación](#instalación)
2. [Configuración](#configuración)
3. [Swagger](#swagger)
4. [Uso](#uso)
5. [MongoDB](#mongodb)
6. [Uso de Handlebars](#handlebars)
7. [Postman Collection](#postman)
8. [Estructura del Proyecto](#estructura-del-proyecto)
9. [Desarrollo](#desarrollo)
10. [Licencia](#licencia)
11. [Autores y Reconocimientos](#autores-y-reconocimientos)
12. [Contactos y Soporte](#contactos-y-soporte)

## Instalación

### Requisitos previos

- Node.js v20.16.0

### Instrucciones de instalación

Repositorio publico : https://github.com/amilcar-laniakea/advanced-backend-2.git

1. Clonar el repositorio:
   via HTTP:
   ```sh
   git clone https://github.com/amilcar-laniakea/advanced-backend-2.git
   ```
   via SSH:
   ```sh
   git clone git@github.com:amilcar-laniakea/advanced-backend-2.git
   ```

## Configuración

### Variables de entorno

Las variables de entornos necesarias se encuentran a manera de guía en el archivo `.env.example`:

`NODE_ENV`: Variable que indica el tipo de deployment realizado
`PORT`: El puerto se encuentra definido por default en el archivo principal del proyecto (app.js): 8080
`MONGO_DB_URI`: La dirección en donde se encuentra la base de datos de mongoDB
`DATABASE_NAME`: Nombre de la base de datos en mongoDB

### Package.json

Contiene las siguientes librerías necesarias para los requerimientos necesarios del trabajo final:

`express`: En su version 4.19.2.  
`express-handlebars`: En su version 7.1.3  
`mongoose`: En su version ^8.5.1,
`mongoose-paginate-v2`: En su version ^1.8.3,

**Importante:** las versiones descritas con anterioridad fueron o son las usadas al momento de hacer el desarrollo del proyecto.

## Swagger

Se agrego la ruta `/api-docs` en donde se encuentra la documentación de Swagger.

Actualmente solo están disponibles los endpoints para listar los productos y el que retorna un producto por código o id, en futuras actualizaciones se irán incorporando progresivamente el resto.

<p align="center">
   <image src="external_resources/images/swagger.jpg" alt="Descripción de la imagen">
</p>

## Uso

### Iniciar Aplicación

```sh
   npm run start
```

Esto iniciara la aplicación en la dirección: [http://localhost:8080](http://localhost:8080/)

### Recursos:

Los recursos de la aplicación como condición a la persistencia requerida para el proyecto final están basado en su uso mediante una base de datos no relacional usando MongoDB, de esta forma la misma hace uso de dos colecciones para su interacción en la app teniendo la siguiente estructura:

> Colección de datos para products (Ver Schema en `src/model/product.model.js`):

```sh
{
   "_id": "66bb65d02c30c36570abeea0",
   "name": "Awesome Wooden Shoes",
   "description": "Principal",
   "price": 5,
   "code": 879,
   "status": true,
   "stock": 0,
   "category": "Handcrafted Wooden Table",
   "thumbnail": "",
   "createdAt": "2024-08-13T13:55:28.083Z",
   "updatedAt": "2024-08-13T13:55:28.083Z",
   "__v": 0,
   "id": "66bb65d02c30c36570abeea0"
}
```

> Colección de datos para carts (Ver Schema en `src/model/cart.model.js`):

```sh
{
   "product": {
         "_id": "6693261ab04352892ecd1efd",
         "name": "Licensed Plastic Bacon",
         "description": "Legacy",
         "price": 316,
         "code": 430,
         "status": true,
         "stock": 204,
         "category": "Ergonomic Rubber Tuna",
         "thumbnail": "",
         "createdAt": "2024-07-14T01:12:58.496Z",
         "updatedAt": "2024-07-14T01:12:58.496Z",
         "__v": 0
   },
   "quantity": 1,
   "_id": "66bbfbc08b531b06d35a2bfd"
}
```

> [!IMPORTANT]
> En el caso anterior la variable product en el modelo de `cart` solo guarda el id del producto haciendo referencial al mismo en la colección de `products`, es un ejemplo mediante el método populate de `mongoose`, el cual se usa en la aplicación.

### Endpoints de la API

Los endpoints se dividen en tres archivos de rutas, las cuales manejar sus respectivos métodos de consulta:

Los servicios de la APP responderán la siguiente estructura:

> Ejemplo de respuesta exitosa:

```sh
   {
      "status": 200,
      "data": {
         "title": "Practical Steel Shirt",
         "description": "Corporate",
         "code": 338,
         "price": 144,
         "status": true,
         "stock": 942,
         "category": "Licensed Steel Shirt",
         "thumbnail": "",
         "id": 5
      },
      "message": "Product with requested ID 5: updated successfully."
   }
```

> Ejemplo de respuesta en excepción o error:

```sh
   {
      "status": 200,
      "data": null,
      "message": "Product with requested ID 15: not found"
   }
```

Nótese los atributos comunes a la respuesta: `status` indica el código de la respuesta solicitada, `data` para la información generada por la respuesta, en caso de ser una excepción su valor sera `null` y acompañada de un `message` que detalla la información de la respuesta en caso de ser necesaria, de los contrario, su valor sera `null`.

#### Rutas de productos:

**GET** `/api/product`: Obtiene la lista de productos. Puede enviarse como parámetros opcionales `limit, page, category, status, stock, name, code y sort` todo esto con el fin de poder hacer un filtrado avanzado en el servicio y posteriormente obtener los resultados.  
**GET** `/api/product/:id`: Obtiene un producto con el id requerido por parámetro en ruta.  
**POST** `/api/product`: Crea un producto con un id autogenerado, requiere los siguientes atributos enviados por el body (ejemplo de variables usadas en Postman para generar valores aleatorios de atributos):

```sh
   {
      "title": "{{$randomProductName}}",
      "description": "{{$randomJobDescriptor}}",
      "category": "{{$randomProductName}}",
      "code": {{$randomInt}},
      "price": {{$randomInt}},
      "stock": {{$randomInt}}
   }
```

**PUT** `/api/product/:id`: actualiza el producto requerido, pueden enviarse los mismos parámetros que en el ejemplo de crear un producto, sin embargo, son de manera opcional, y pueden editarse uno por individual por request o todos a la vez, ejemplos:

```sh
   {
      "title": "{{$randomProductName}}",
   }
```

```sh
   {
      "title": "{{$randomProductName}}",
      "description": "{{$randomJobDescriptor}}",
   }
```

**DELETE** `/api/product/:id`: borra el producto requerido

#### Rutas de Carrito de compras:

**GET** `/api/cart`: Obtiene la lista de carrito de compras creados. En este caso se usa el método `populate()` para hidratar el objeto producto, el cual solo esta almacenado el id y hace referencia al id en la colección de `products`  
**GET** `/api/cart/:id`: Obtiene un carrito de compras con el id requerido por parámetro en ruta.  
**POST** `/api/cart`: Genera un carrito de compras con un id secuencial único y lo incluye en la lista de carritos de compras, este es necesario para usar los servicios de crear y gestionar los productos del mismo.  
**POST** `/api/cart/:cid/product/:pid`: Este servicio tiene como principal funcion agregar productos a un carrito de compras elegido, el parámetro `:cid` indica el carrito objetivo a ser gestionado, como segundo parámetro `:pid` que representa el id del producto a agregar, este se usa junto con el parámetro por body `quantity` para verificar si el producto existe en la lista de productos generada y almacenada en `data/products.json` cuenta con la existencia de ese producto y tiene un stock suficiente para ser agregado.

El parámetro `quantity` (opcional) debe ser enviado de la siguiente manera (ejemplo por Postman), en caso de no ser enviado, por default se agrega un `1` solo producto:
De igual forma el parámetro `isReduceQuantity` (opcional) es usado para aumentar si esta en `true` y disminuir si esta en `false` la cantidad de productos del carrito, si no es enviado por default la aplicación lo toma como un true.

> [!IMPORTANT]
> El parámetro `isReduceQuantity` es sensible y detecta la disponibilidad del stock al producto agregado, si no existe suficiente stock al momento de agregar, o al momento de disminuir mostrara un mensaje de `no hay stock disponible`

```sh
   {
      "quantity": 3 // tipo numero
      "isReduceQuantity": false, // tipo boolean
   }
```

**DELETE** `/api/cart/:cid/product/:pid`: Elimina un producto deseado por medio del id del carrito `:cid` y el id del producto `:pid`  
**DELETE** `/api/cart/:id`: Elimina un carrito de la lista de carrito de compras por medio del parámetro `:id`

#### Rutas de usuarios:

> [!IMPORTANT]
> Todos los servicios de usuarios pueden ser usados con un `parámetro opcional` que debe ser colocado en el header del request llamado `cookie_auth` que es de tipo booleano, si se usa como true, los endpoints crearan (para el caso de los endpoints de registro y login de usuario) u obtendrán (en el caso del endpoint current) el `JWT token` de la cookie generada previamente (caso de los servicios registro y login), la cookie generada con este parámetro se llama `jwt_token`. En caso de no colocar ese parámetro en el header, los endpoints por default buscaran el token el tipo de autorización `bearer token`.

> [!IMPORTANT]
> Lo anterior se realizo para cumplir con el requerimiento de la `pre-entrega numero 1` del curso.

**GET** `/api/session/current`: Obtiene la información del usuario por medio del JWT y su tipo de rol por medio de dos (2) middlewares; si el token no es valido o el usuario que intenta acceder no es de tipo `user`, se obtendrá ua respuesta de tipo `no autorizado`.  

**POST** `/api/session/login`: Inicia sesión del usuario, los campos requeridos son `email => con su email correspondiente` y `password => con la clave que uso al momento del registro`

```sh
   {
      "email": 'example@example.com' // el formato de email debe ser valido
      "password": 'example'
   }
```

**POST** `/api/session/register`: Endpoint para registro del usuario, los campos a usar son los siguientes:

```sh
   {
      "first_name": "Jose"  // requerido
      "last_name": "Arimatea"  // requerido
      "email": 'example@example.com' // el formato de email debe ser valido - requerido
      "password": 'example' // requerido, con un mínimo de longitud de 6 caracteres
      "age": 4 // requerido, tipo numero,
      "role" "user" // opcional, solo permite opciones "user" y "admin"
      "cart_id": // opcional - no implementado por el momento, objeto tipo id de mongodb
   }
```

La implementación del `registro` y `login` de usuario hacen el uso de las herramientas `passport` para el método de registro e inicio de sesión, `jwt` para devolver la información del usuario por medio de un token y `bcryptjs` para encriptar el password del usuario para ser guardado en la base de datos.

#### Rutas estáticas:

> [!IMPORTANT]
> Estas rutas son para demostración de renderizado de contenido del lado der servidor para ser servido por frontend, los archivos clave de estas rutas exclusivas se encuentran en el archivo `src/routes/static.router.js` y sus métodos en `src/controllers/static.controller.js` de formas de ser abstraídas o quitadas con facilidad en el momento de no necesitarse mas como forma de hacer el proyecto mas escalable a largo plazo.

> [!NOTE]
> Cada vista presenta en su mecánica un archivo JS vinculado a su lógica ubicado en la ruta `src/public/js`

Son las rutas usadas para renderizar del lado del servidor contenido que pueda ser visualizado y manipulado por el cliente, estas vistas permiten mostrar los productos que son devueltos anteriormente por el endpoint `/api/products` de forma gráfica.

$${\color{green}Rutas \space Estáticas:}$$

$${\color{lightgreen}/views/products:}$$

Esta muestra los productos que son consultados a la base de datos de mongoDB y los muestra sin ningún ordenamiento, de forma paginada y por default como limite de elementos un total de `20`, sin embargo como se muestra en la imagen, existen una serie de filtros avanzados los cuales pueden aplicarse a la consulta como: `stock, status, resultados por pagina(limit), ordenamiento (sort tipo asc y des) en relación a precio, búsqueda por nombre y por código, de igual forma en endpoint esta preparado para buscar por categorías, los cuales no se incluyeron en la demostración de este frontend (revisar colección de postman ubicada en la raíz del proyecto (postman))`.

> [!IMPORTANT]
> Existen 2 botones como acciones principales en cada producto renderizado, uno redirige a la vista de `/views/product-detail/:pid` y el otro realiza la funcionalidad de agregar un producto al carro de compra, cabe destacar que al momento de realizar esta acción se verifica si existe un id de carro de compras almacenado en `localStorage` de no ser asi, este consulta el servicio de generar carro de compras y posteriormente agrega el producto al mismo, en caso contrario de existir el id del carrito, solo es obtenido y usado por la funcion de agregar producto..

Como ultimo acción, se ubica el botón `Ir Al Carrito` el cual lleva a la vista `views/cart`

<p align="center">
   <image src="external_resources/images/productList.jpg" alt="Descripción de la imagen">
</p>

La estructura de información mostrada es la misma que la devuelta por el endpoint **GET** `api/product`

$${\color{lightgreen}/views/product-detail/:id:}$$

Esta vista muestra a mas detalle mas información procedente del servicio `api/product/:pid` que no es mostrada en la lista anteriormente descrita, de igual manera, se muestra un botón de acción ya que en esta vista es posible de igual manera agregar un producto al carro de compras obteniendo el `cid` de localStorage como de menciono con anterioridad.

El botón `Ir Al Carrito` se encuentra disponible en esta vista al igual que en la lista de productos.

<p align="center">
   <image src="external_resources/images/productDetail.jpg" alt="Descripción de la imagen">
</p>

$${\color{lightgreen}/views/cart:}$$

Esta vista muestra los productos agregados al carrito del usuario que actualmente esta usando el equipo, esta vista verifica la existencia de un `id` almacenado en localStorage y desde esa verificación hace la consulta al servicio devolviendo solo el carrito correspondiente a ese id almacenado, en caso de no existir la vista mostrara un texto de `no encontrado`

En la vista existe por producto un botón de `eliminar` el cual elimina el producto elegido del carrito de compras, como dato adicional, en la vista se muestra el total de productos y precio de los mismos previamente agregados.

Como se explico con anterioridad, a modo de acotación: al momento de agregar un producto es verificado si hay un id almacenado en localStorage como nombre `cart`, de no ser asi es creado por el servicio correspondiente de `generateCart`, en caso de existir es agregado al id recogido desde localStorage.

<p align="center">
   <image src="external_resources/images/cartProducts.jpg" alt="Descripción de la imagen">
</p>

## Mongodb

Existe un archivo en la carpeta `src/config/db.js` el cual tiene la configuración a la conexión a la base de datos:

```sh
   const dbConnect = async () => {
   try {
      await mongoose.connect(
         `${process.env.MONGO_DB_URI}${process.env.DATABASE_NAME}`,
         {}
      );
      console.log("success: connected to database!");
   } catch (error) {
      console.error("error:", error.message);
      process.exit(1);
   }
   };

   const dbError = db.on("error", (err) => {
   console.log(err);
   });

   module.exports = { dbConnect, dbError };

```

## Handlebars

La carpeta `views` contiene toda la estructura del proyecto en lo referente a la librería `handlebars`, tiene como carpeta principal `layout` en donde se encuentra el esqueleto general de la estructura html, y la carpeta `partials` que incluye el archivo `productList` que es compartido con todas las vistas estáticas.

- Cada plantilla tiene sus dependencias que son invocadas por medios de CDN's
- Cada plantilla su archivo `.js` ubicado en la ruta `/src/public/js` que contienen la lógica necesaria para su funcionamiento
- La configuración de la librería `handlebars` se encuentra ubicada en el archivo `app.js`, donde están declaradas la ubicación de la carpeta `partials` detalles como extension personalizada:

  ```sh
     const hbs = create({ extname: "hbs", partialsDir: path.join(__dirname, "views", "partials")});
  ```

## Postman

En la ruta `/postman` se encuentra la colección de postman necesaria a importar en la aplicación de `Postman` y usar los recursos de la APP, el nombre del archivo es `collection_v1.json`

## Estructura del proyecto

```
proyecto/
├── api/ (carpeta usada solo para el despliegue correcto de la aplicación en Vercel)
├── external_resources/ (recursos ajenos a la aplicación)
│   ├── images/ (imágenes del README.md)
│   └──  postman/ (colección de postman)
├── src/
│   ├── config/ (archivo de configuración y conexión a la base de datos)
│   ├── constants/ (carpeta con variables de constantes generalmente usadas en mostrar mensajes de notificación en los servicios)
│   ├── controllers/ (carpeta con los métodos y/o funciones necesarias para los servicios)
│   ├── models/ (carpeta que ubica los modelos (Schema) de datos para las colecciones usadas por medio de mongoose)
│   ├── public/
│   │   └── js/ (recursos para paginas de handlebars)
│   ├── routes/
|   ├── services/
|   ├── utils/
|   ├── views/ (vistas de handlebars)
│   │   ├── layouts/
│   │   └── partials/
│   └── app.js
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## Desarrollo

### Guías de estilo

No disponible

### Procedimientos de desarrollo

1. Crea una rama nueva: `git checkout -b feature/nueva-feature`
1. Realiza tus cambios y realiza commits.

### Código de conducta

Este proyecto sigue el Código de Conducta.

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo LICENSE para más detalles.

## Autores y reconocimientos

- Amilcar Barahona - Desarrollador principal - amilcar-laniakea

## Contacto y soporte

Para preguntas o soporte, contacta a amilcar.laniakea@gmail.com.

### Notas Adicionales

Cualquier otra información relevante.
