/* Domaine des Pierres Jumelles — demo site. No data is sent anywhere. */
(function () {
  "use strict";
  var EMAIL = "pierresjumelles@gmail.com";
  var TEL = "+33641903459";

  /* Request form: never submits — builds a pre-filled email instead */
  var form = document.getElementById("request-form");
  var msg = document.getElementById("form-msg");
  if (form) {
    var arr = form.elements.arrivee, dep = form.elements.depart;
    var today = new Date().toISOString().slice(0, 10);
    arr.min = today; dep.min = today;
    arr.addEventListener("change", function () { dep.min = arr.value || today; });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = [];
      ["arrivee", "depart", "personnes", "nom", "email"].forEach(function (n) {
        var el = form.elements[n];
        var ok = el.value.trim() !== "" && (!el.checkValidity || el.checkValidity());
        el.classList.toggle("err", !ok);
        el.setAttribute("aria-invalid", ok ? "false" : "true");
        if (!ok) bad.push(el);
      });
      if (bad.length) { bad[0].focus(); return; }

      var opts = Array.prototype.slice.call(form.querySelectorAll("input[name=options]:checked"))
        .map(function (c) { return c.value; });
      var fmt = function (d) { return d ? d.split("-").reverse().join("/") : ""; };
      var body =
        "Bonjour,\n\nJe souhaite connaître vos disponibilités :\n" +
        "- Arrivée : " + fmt(arr.value) + "\n" +
        "- Départ : " + fmt(dep.value) + "\n" +
        "- Nombre de personnes : " + form.elements.personnes.value + "\n" +
        "- Hébergement : " + form.elements.unite.value + "\n" +
        (opts.length ? "- Options : " + opts.join(", ") + "\n" : "") +
        (form.elements.message.value.trim() ? "\n" + form.elements.message.value.trim() + "\n" : "") +
        "\n" + form.elements.nom.value + "\n" + form.elements.email.value +
        (form.elements.tel.value ? "\n" + form.elements.tel.value : "");
      var subject = "Demande de disponibilité — " + form.elements.unite.value + " — arrivée le " + fmt(arr.value);
      var href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      msg.hidden = false;
      msg.innerHTML =
        "<strong>Votre demande est prête.</strong> (Version de démonstration : ce formulaire n'envoie rien en ligne.) " +
        "Envoyez-la par e-mail en un clic, ou appelez-nous directement." +
        '<div class="cta"><a class="btn btn-green" id="mailto-btn">Envoyer par e-mail</a>' +
        '<a class="btn btn-outline" href="tel:' + TEL + '">Appeler le 06 41 90 34 59</a></div>';
      document.getElementById("mailto-btn").setAttribute("href", href);
      msg.focus && msg.setAttribute("tabindex", "-1");
      msg.focus();
    });
  }

  /* "Demander cette suite" buttons preselect the unit */
  Array.prototype.slice.call(document.querySelectorAll("[data-unit]")).forEach(function (b) {
    b.addEventListener("click", function () {
      if (form) form.elements.unite.value = b.getAttribute("data-unit");
    });
  });

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
