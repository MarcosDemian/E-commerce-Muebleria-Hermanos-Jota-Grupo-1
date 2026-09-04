# Hermanos Jota — E-commerce académico
## Grupo 1: Cristian Joel Soto, Marcos Demian Garcia y Joaquin Esteban Monzón Fernández.
Proyecto final de Sprint 1 y 2 realizado únicamente con HTML, CSS y JavaScript vanilla.

## Estructura

- `index.html`: inicio, hero y productos destacados.
- `productos.html`: catálogo y búsqueda.
- `producto.html`: detalle del producto y carrito simulado.
- `contacto.html`: formulario y validación.
- `css/styles.css`: todos los estilos.
- `js/productos.js`: array de objetos con los productos.
- `js/main.js`: lógica de inicio y carga asíncrona.
- `js/catalogo.js`: lógica del catálogo.
- `js/detalle.js`: lógica del detalle y localStorage.
- `js/contacto.js`: validación del formulario.
- `img/`: identidad visual y fotografías del proyecto.

## Fuente de los datos

El proyecto incluye 11 productos en `js/productos.js`, superando el mínimo de 8 solicitado por la consigna. Los seis productos con ficha técnica fueron cargados a partir del texto del catálogo proporcionado: Mesa de Noche Aconcagua, Sofá Patagonia, Mesa Comedor Pampa, Sillas Córdoba, Escritorio Costa y Silla de Trabajo Belgrano. Los cinco productos adicionales (Aparador Uspallata, Biblioteca Recoleta, Butaca Mendoza, Mesa de Centro Araucaria y Sillón Copacabana) corresponden a las piezas visuales incluidas en el Kit de imágenes.

El catálogo no informa precios ni tiempos de fabricación. Para no inventar información comercial, esos campos aparecen como `null` y/o `A consultar` en la interfaz.

El resto de características se conserva según el texto suministrado: medidas, materiales, acabados, almacenamiento, capacidad, extensión, apilabilidad, regulación, certificación y sostenibilidad cuando corresponda. Para los cinco productos que solo cuentan con referencia visual en el material recibido, los campos técnicos no especificados se muestran explícitamente como “No especificado en el material de catálogo recibido”, y el tiempo de fabricación queda “A consultar”.

## Ejecución

Abrir `index.html` directamente en el navegador. No requiere backend ni servidor.
