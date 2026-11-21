// Le Manoir des Rochers — small enhancements. The site works without JS (tel:/mailto: links stay usable).
// DEMO: the availability form never submits anywhere; it only shows a message and a prepared mailto link.
(function () {
  var EMAIL = "accueil@lemanoirdesrochers.fr";
  var form = document.getElementById("book-form");
  var fin = document.getElementById("f-in"), fout = document.getElementById("f-out");
  var room = document.getElementById("f-room");
  var err = document.getElementById("form-err"), ok = document.getElementById("form-ok");
  var mailLink = document.getElementById("mail-link");

  function iso(d) { return d.toISOString().slice(0, 10); }
  function frDate(s) { if (!s) return ""; var p = s.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }

  var today = new Date(); today.setHours(12);
  if (fin) fin.min = iso(today);
  if (fin && fout) {
    fout.min = iso(new Date(today.getTime() + 864e5));
    fin.addEventListener("change", function () {
      if (!fin.value) return;
      var next = new Date(fin.value + "T12:00:00"); next.setDate(next.getDate() + 1);
      fout.min = iso(next);
      if (!fout.value || fout.value <= fin.value) fout.value = iso(next);
    });
  }

  // "Demander ces dates" on a room card preselects that room
  document.querySelectorAll("[data-pick]").forEach(function (a) {
    a.addEventListener("click", function () {
      var v = a.getAttribute("data-pick");
      Array.prototype.forEach.call(room.options, function (o) { if (o.text === v) room.value = o.value; });
    });
  });

  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault(); // demo: nothing is sent
    var f = form.elements, missing = [];
    if (!f.arrivee.value) missing.push("la date d'arrivée");
    if (!f.depart.value) missing.push("la date de départ");
    if (!f.nom.value.trim()) missing.push("votre nom");
    if (missing.length) {
      err.textContent = "Merci d'indiquer " + missing.join(", ") + ".";
      err.hidden = false; ok.hidden = true; return;
    }
    err.hidden = true;
    var nights = Math.round((new Date(f.depart.value) - new Date(f.arrivee.value)) / 864e5);
    var subject = "Demande de disponibilité — " + f.chambre.value + " — " + frDate(f.arrivee.value);
    var body = [
      "Bonjour,", "",
      "Je souhaiterais savoir si cette chambre est disponible :",
      "- Chambre : " + f.chambre.value,
      "- Arrivée : " + frDate(f.arrivee.value),
      "- Départ : " + frDate(f.depart.value) + (nights > 0 ? " (" + nights + " nuit" + (nights > 1 ? "s" : "") + ")" : ""),
      "- Adultes : " + f.adultes.value + " · Enfants : " + f.enfants.value,
      "- Dîner en table d'hôtes : " + (f.diner.checked ? "oui" : "non"),
      f.message.value.trim() ? "\n" + f.message.value.trim() : "",
      "", "Merci,",
      f.nom.value.trim() + (f.tel.value.trim() ? " · " + f.tel.value.trim() : "")
    ].join("\n");
    mailLink.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    ok.hidden = false;
    ok.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });

  // Gallery lightbox
  var lb = document.getElementById("lightbox"), lbImg = document.getElementById("lightbox-img");
  if (lb && typeof lb.showModal === "function") {
    document.querySelectorAll("#gallery button").forEach(function (b) {
      b.addEventListener("click", function () {
        var img = b.querySelector("img");
        lbImg.src = b.getAttribute("data-full"); lbImg.alt = img.alt;
        lb.showModal();
      });
    });
    document.getElementById("lb-close").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  }
})();
