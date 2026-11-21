// Gîte des Faluères — small enhancements. The site works without JS.
(function () {
  var EMAIL = "coquet.laurence@wanadoo.fr", TEL = "+33243560083", TEL_TXT = "02 43 56 00 83";

  // Lightbox for photos
  var lb = document.getElementById("lightbox");
  if (lb && typeof lb.showModal === "function") {
    var lbImg = lb.querySelector("img");
    document.querySelectorAll("[data-full]").forEach(function (b) {
      b.addEventListener("click", function () {
        var img = b.querySelector("img");
        lbImg.src = b.getAttribute("data-full");
        lbImg.alt = img ? img.alt : "";
        lb.showModal();
      });
    });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  }

  // Pre-select the request type from CTA buttons
  document.querySelectorAll("[data-pick]").forEach(function (a) {
    a.addEventListener("click", function () {
      var v = a.getAttribute("data-pick") === "gite" ? 1 : 0;
      var radios = document.querySelectorAll('#dispo-form input[name="type"]');
      if (radios[v]) radios[v].checked = true;
    });
  });

  // Dates: no past dates, departure after arrival
  var form = document.getElementById("dispo-form");
  if (!form) return;
  var arr = form.elements.arrivee, dep = form.elements.depart;
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  var iso = today.toISOString().slice(0, 10);
  arr.min = iso; dep.min = iso;
  arr.addEventListener("change", function () { dep.min = arr.value || iso; if (dep.value && dep.value <= arr.value) dep.value = ""; });

  function fr(d) { return d ? d.split("-").reverse().join("/") : "?"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // Demo form: never sends anything over the network.
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements, msg = form.querySelector(".form-msg");
    var missing = [];
    if (!f.arrivee.value) missing.push("la date d'arrivée");
    if (!f.depart.value) missing.push("la date de départ");
    if (!f.nom.value.trim()) missing.push("votre nom");
    if (!f.email.value.trim() && !f.tel.value.trim()) missing.push("un e-mail ou un téléphone");
    msg.hidden = false;
    if (missing.length) {
      msg.className = "form-msg err";
      msg.innerHTML = "<p>Merci d'indiquer " + esc(missing.join(", ")) + ".</p>";
      return;
    }
    var type = form.querySelector('input[name="type"]:checked').value;
    var body = "Bonjour,\n\nJe souhaite connaître vos disponibilités :\n" +
      "- " + type + "\n- Du " + fr(f.arrivee.value) + " au " + fr(f.depart.value) + "\n" +
      "- " + f.personnes.value + " personne(s), " + f.chambres.value + " chambre(s)\n" +
      (f.chevaux.checked ? "- Avec cheval / chevaux\n" : "") +
      (f.message.value.trim() ? "\n" + f.message.value.trim() + "\n" : "") +
      "\n" + f.nom.value.trim() + (f.tel.value.trim() ? "\nTél. : " + f.tel.value.trim() : "") +
      (f.email.value.trim() ? "\nE-mail : " + f.email.value.trim() : "");
    var href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Demande de disponibilité — " + type) + "&body=" + encodeURIComponent(body);
    msg.className = "form-msg";
    msg.innerHTML = "<p><strong>Merci, " + esc(f.nom.value.trim()) + " !</strong> Ceci est une maquette de démonstration : votre demande n'a pas été envoyée.</p>" +
      "<p>Pour la transmettre à Laurence, envoyez-la par e-mail (message prérempli) ou appelez :</p>" +
      '<a class="btn btn-teal btn-sm" href="' + href + '">Envoyer par e-mail</a>' +
      '<a class="btn btn-gold btn-sm" href="tel:' + TEL + '">Appeler le ' + TEL_TXT + "</a>";
    msg.focus && msg.setAttribute("tabindex", "-1"); msg.focus();
  });
})();
