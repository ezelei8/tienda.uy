(function () {
  "use strict";

  var WHATSAPP_NUMBER = "59899576240"; // +598 99 576 240

  function waLink(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  window.__BRAND__ = {
    name: "TIENDA UY",
    tagline: "Estilo · Calidad · Confianza",
    instagram: "https://www.instagram.com/tiendauy__",
    instagramHandle: "@tiendauy__",
    whatsappNumber: "+598 99 576 240",
    waLink: waLink,
    messages: {
      general: "Hola! 👋 Vengo de la web de TIENDA UY y quiero ver el catálogo.",
      contact: "Hola TIENDA UY! Vengo de la web y quiero hacer una consulta 📱",
      wholesale: "Hola! Quiero info de precios mayoristas (compra de +6 unidades) para emprender con TIENDA UY 🤝",
      product: function (name) {
        return "Hola! 👋 Quiero comprar el " + name + " que vi en la web de TIENDA UY 🛒 ¿Cómo sigo con la compra?";
      }
    }
  };
})();
