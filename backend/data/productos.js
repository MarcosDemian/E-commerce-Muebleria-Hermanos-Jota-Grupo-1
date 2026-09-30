/* ==========================================================================
   DATOS DE PRODUCTOS — MUEBLERÍA HERMANOS JOTA
   Array de objetos local (sin base de datos). Lo consume routes/productos.routes.js
   ========================================================================== */

const productos = [
  {
    id: 1,
    nombre: "Aparador Uspallata",
    categoria: "Guardado",
    precio: 890000,
    imagen: "img/aparador-uspallata.png",
    descripcion: "Aparador de seis puertas fabricado en nogal sostenible con tiradores metálicos en acabado latón. Su silueta minimalista realza el veteado natural de la madera, creando una pieza que combina funcionalidad y elegancia atemporal para espacios contemporáneos.",
    detalles: {
      material: "Nogal macizo FSC®, herrajes de latón",
      dimensiones: "180 × 45 × 75 cm",
      tiempoFabricacion: "A consultar",
      acabado: "Aceite natural ecológico",
      peso: "68 kg",
      capacidad: "6 compartimentos interiores"
    }
  },
  {
    id: 2,
    nombre: "Biblioteca Recoleta",
    categoria: "Guardado",
    precio: 745000,
    imagen: "img/biblioteca-recoleta.png",
    descripcion: "Sistema modular de estantes abierto que combina estructura de acero Sage Green y repisas en roble claro. Perfecta para colecciones y objetos de diseño, su diseño versátil se adapta a cualquier espacio contemporáneo con elegancia funcional.",
    detalles: {
      material: "Estructura de acero, estantes de roble",
      dimensiones: "100 × 35 × 200 cm",
      tiempoFabricacion: "A consultar",
      acabado: "Laca mate ecológica",
      capacidad: "45 kg por estante",
      modulares: "5 estantes ajustables"
    }
  },
  {
    id: 3,
    nombre: "Butaca Mendoza",
    categoria: "Living",
    precio: 620000,
    imagen: "img/butaca-mendoza.png",
    descripcion: "Butaca tapizada en bouclé Dusty Rose con base de madera de guatambú. El respaldo curvo abraza el cuerpo y ofrece máximo confort, mientras que su diseño orgánico aporta calidez y sofisticación a cualquier ambiente contemporáneo.",
    detalles: {
      material: "Guatambú macizo, tela bouclé",
      dimensiones: "80 × 75 × 85 cm",
      tiempoFabricacion: "A consultar",
      acabado: "Cera vegetal, tapizado premium",
      tapizado: "Repelente al agua y manchas",
      confort: "Espuma alta densidad"
    }
  },
  {
    id: 4,
    nombre: "Sillón Copacabana",
    categoria: "Living",
    precio: 1250000,
    imagen: "img/sillon-copacabana.png",
    descripcion: "Sillón lounge en cuero cognac con base giratoria en acero Burnt Sienna. Inspirado en la estética brasileña moderna de los años 60, combina comodidad excepcional con un diseño icónico que trasciende tendencias y épocas.",
    detalles: {
      material: "Cuero curtido vegetal, acero pintado",
      dimensiones: "90 × 85 × 95 cm",
      tiempoFabricacion: "A consultar",
      acabado: "Cuero anilina premium",
      rotacion: "360° silenciosa y suave",
      garantia: "10 años en estructura"
    }
  },
  {
    id: 5,
    nombre: "Mesa de Centro Araucaria",
    categoria: "Living",
    precio: 980000,
    imagen: "img/mesa-centro-araucaria.png",
    descripcion: "Mesa de centro con sobre circular de mármol Patagonia y base de tres patas en madera de nogal. Su diseño minimalista se convierte en el punto focal perfecto para cualquier sala de estar contemporánea, combinando la frialdad del mármol con la calidez de la madera.",
    detalles: {
      material: "Sobre de mármol Patagonia, patas de nogal",
      dimensiones: "90 × 90 × 45 cm",
      tiempoFabricacion: "A consultar",
      acabado: "Mármol pulido, aceite natural en madera",
      peso: "42 kg",
      cargaMaxima: "25 kg distribuidos"
    }
  },
  {
    id: 6,
    nombre: "Mesa de Noche Aconcagua",
    categoria: "Dormitorio",
    precio: 285000,
    imagen: "img/mesa-noche-aconcagua.png",
    descripcion: "Mesa de noche con cajón oculto y repisa inferior en roble certificado FSC®. Su diseño limpio y funcional permite convivir con diferentes estilos de dormitorio, ofreciendo almacenamiento discreto y elegante para objetos personales.",
    detalles: {
      material: "Roble macizo FSC®, herrajes soft-close",
      dimensiones: "45 × 35 × 60 cm",
      tiempoFabricacion: "A consultar",
      acabado: "Barniz mate de poliuretano",
      almacenamiento: "1 cajón + repisa inferior",
      caracteristicas: "Cajón con cierre suave"
    }
  },
  {
    id: 7,
    nombre: "Sofá Patagonia",
    categoria: "Living",
    precio: 1850000,
    imagen: "img/sofa-patagonia.png",
    descripcion: "Sofá de tres cuerpos tapizado en lino Warm Alabaster con patas cónicas de madera. Los cojines combinan espuma de alta resiliencia con plumón reciclado, ofreciendo comodidad duradera y sostenible para el hogar moderno.",
    detalles: {
      estructura: "Madera de eucalipto certificada FSC®",
      dimensiones: "220 × 90 × 80 cm",
      tiempoFabricacion: "A consultar",
      tapizado: "Lino 100% natural premium",
      relleno: "Espuma HR + plumón reciclado",
      sostenibilidad: "Materiales 100% reciclables"
    }
  },
  {
    id: 8,
    nombre: "Mesa Comedor Pampa",
    categoria: "Comedor",
    precio: 1420000,
    imagen: "img/mesa-comedor-pampa.png",
    descripcion: "Mesa extensible de roble macizo con tablero biselado y sistema de apertura suave. Su diseño robusto y elegante se adapta perfectamente a reuniones íntimas o grandes celebraciones familiares, extendiéndose de 6 a 10 comensales.",
    detalles: {
      material: "Roble macizo FSC®, mecanismo alemán",
      dimensiones: "160-240 × 90 × 75 cm",
      tiempoFabricacion: "A consultar",
      acabado: "Aceite-cera natural",
      capacidad: "6-10 comensales",
      extension: "Sistema de mariposa central"
    }
  },
  {
    id: 9,
    nombre: "Sillas Córdoba",
    categoria: "Comedor",
    precio: 760000,
    imagen: "img/sillas-cordoba.png",
    descripcion: "Set de cuatro sillas apilables en contrachapado moldeado de nogal y estructura tubular pintada en Sage Green. Su diseño ergonómico y materiales de calidad garantizan comodidad y durabilidad en el uso diario, perfectas para comedores contemporáneos.",
    detalles: {
      material: "Contrachapado nogal, tubo de acero",
      dimensiones: "45 × 52 × 80 cm (cada una)",
      tiempoFabricacion: "A consultar",
      acabado: "Laca mate, pintura epoxi",
      apilables: "Hasta 6 sillas",
      incluye: "Set de 4 sillas"
    }
  },
  {
    id: 10,
    nombre: "Escritorio Costa",
    categoria: "Trabajo",
    precio: 690000,
    imagen: "img/escritorio-costa.png",
    descripcion: "Escritorio compacto con cajón organizado y tapa pasacables integrada en bambú laminado. Ideal para espacios de trabajo en casa, combina funcionalidad moderna con estética minimalista y sostenible, perfecto para el trabajo remoto.",
    detalles: {
      material: "Bambú laminado, herrajes ocultos",
      dimensiones: "120 × 60 × 75 cm",
      tiempoFabricacion: "A consultar",
      acabado: "Laca mate resistente",
      almacenamiento: "1 cajón con organizador",
      cables: "Pasacables integrado"
    }
  },
  {
    id: 11,
    nombre: "Silla de Trabajo Belgrano",
    categoria: "Trabajo",
    precio: 540000,
    imagen: "img/silla-trabajo-belgrano.png",
    descripcion: "Silla ergonómica regulable en altura con respaldo de malla transpirable y asiento tapizado en tejido reciclado. Diseñada para largas jornadas de trabajo con máximo confort y apoyo lumbar, ideal para oficinas en casa y espacios de coworking.",
    detalles: {
      material: "Malla técnica, tejido reciclado",
      dimensiones: "60 × 60 × 90-100 cm",
      tiempoFabricacion: "A consultar",
      acabado: "Base cromada, tapizado premium",
      regulacion: "Altura + inclinación respaldo",
      certificacion: "Ergonomía europea EN 1335"
    }
  }
];

module.exports = productos;
