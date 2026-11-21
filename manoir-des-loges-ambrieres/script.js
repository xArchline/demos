/* Le Manoir des Loges — demo site. No data is sent anywhere. */
(function () {
  "use strict";
  var EMAIL = "contact@manoirdesloges.fr";
  var TEL = "+33609035970";

  var form = document.getElementById("request-form");
  var msg = document.getElementById("form-msg");

  /* "Devis" / "Visite" buttons preselect the request type */
  Array.prototype.forEach.call(document.querySelectorAll("[data-demande]"), function (a) {
    a.addEventListener("click", function () {
      if (!form) return;
      var v = a.getAttribute("data-demande") === "visite" ? "Demande de visite" : "Demande de devis";
      Array.prototype.forEach.call(form.elements.demande, function (r) { r.checked = r.value === v; });
    });
  });

  /* Request form: never submits — builds a pre-filled email instead */
  if (form) {
    var date = form.elements.date;
    date.min = new Date().toISOString().slice(0, 10);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = [];
      ["date", "invites", "nom", "email"].forEach(function (n) {
        var el = form.elements[n];
        var ok = el.value.trim() !== "" && (!el.checkValidity || el.checkValidity());
        el.classList.toggle("err", !ok);
        el.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok) bad.push(el);
      });
      if (bad.length) { bad[0].focus(); return; }

      var f = form.elements;
      var kind = form.querySelector("input[name=demande]:checked").value;
      var fmt = function (d) { return d ? d.split("-").reverse().join("/") : ""; };
      var body =
        "Bonjour,\n\n" + kind + " pour le Manoir des Loges :\n" +
        "- Type d'événement : " + f.type.value + "\n" +
        "- Date souhaitée : " + fmt(date.value) + "\n" +
        "- Nombre d'invités : " + f.invites.value + "\n" +
        "- Durée : " + f.duree.value + "\n" +
        (f.message.value.trim() ? "\n" + f.message.value.trim() + "\n" : "") +
        "\n" + f.nom.value + "\n" + f.email.value + (f.tel.value ? "\n" + f.tel.value : "");
      var subject = kind + " — " + f.type.value + " le " + fmt(date.value) + " (" + f.invites.value + " pers.)";
      var href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      msg.hidden = false;
      msg.innerHTML =
        "<strong>Votre demande est prête.</strong> (Version de démonstration : ce formulaire n'envoie rien en ligne.) " +
        "Envoyez-la par e-mail en un clic, ou appelez-nous directement." +
        '<div class="cta"><a class="btn btn-red" id="mailto-btn">Envoyer par e-mail</a>' +
        '<a class="btn btn-outline" href="tel:' + TEL + '">Appeler le 06 09 03 59 70</a></div>';
      document.getElementById("mailto-btn").setAttribute("href", href);
      msg.setAttribute("tabindex", "-1");
      msg.focus();
    });
  }

  /* Gallery lightbox */
  var lb = document.getElementById("lightbox");
  var links = Array.prototype.slice.call(document.querySelectorAll("#gallery a"));
  if (lb && links.length && typeof lb.showModal === "function") {
    var img = lb.querySelector("img"), cap = lb.querySelector(".lb-cap"), idx = 0;
    var show = function (i) {
      idx = (i + links.length) % links.length;
      var a = links[idx], alt = a.querySelector("img").alt;
      img.src = a.getAttribute("href"); img.alt = alt; cap.textContent = alt;
    };
    links.forEach(function (a, i) {
      a.addEventListener("click", function (e) { e.preventDefault(); show(i); lb.showModal(); });
    });
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.open) return;
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }
})();
