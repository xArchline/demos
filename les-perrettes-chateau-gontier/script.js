// Les Perrettes — small enhancements. The site works without JS (contact links stay usable).
(function () {
  var EMAIL = "infos@lesperrettes.fr";
  var form = document.getElementById("book-form");
  var fin = document.getElementById("f-in"), fout = document.getElementById("f-out");
  var heb = document.getElementById("f-heb");
  var err = document.getElementById("form-err"), ok = document.getElementById("form-ok");

  function iso(d) { return d.toISOString().slice(0, 10); }
  function frDate(s) { if (!s) return ""; var p = s.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }

  // Dates: no past dates, departure after arrival
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
      Array.prototype.forEach.call(heb.options, function (o) { if (o.text === v) heb.value = o.value; });
    });
  });

  // The form never submits to a server: it builds a pre-filled e-mail (mailto) for the guest to send.
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    var missing = [];
    if (!f.arrivee.value) missing.push("la date d'arrivée");
    if (!f.depart.value) missing.push("la date de départ");
    if (!f.nom.value.trim()) missing.push("votre nom");
    if (missing.length) {
      err.textContent = "Merci d'indiquer " + missing.join(", ") + ".";
      err.hidden = false; ok.hidden = true; return;
    }
    err.hidden = true;
    var nights = Math.round((new Date(f.depart.value) - new Date(f.arrivee.value)) / 864e5);
    var subject = "Demande de disponibilité — " + f.hebergement.value + " — " + frDate(f.arrivee.value);
    var body = [
      "Bonjour,",
      "",
      "Je souhaiterais savoir si cet hébergement est disponible :",
      "- Hébergement : " + f.hebergement.value,
      "- Arrivée : " + frDate(f.arrivee.value),
      "- Départ : " + frDate(f.depart.value) + (nights > 0 ? " (" + nights + " nuit" + (nights > 1 ? "s" : "") + ")" : ""),
      "- Adultes : " + f.adultes.value + " · Enfants : " + f.enfants.value,
      f.message.value.trim() ? "\n" + f.message.value.trim() : "",
      "",
      "Merci,",
      f.nom.value.trim() + (f.tel.value.trim() ? " · " + f.tel.value.trim() : "")
    ].join("\n");
    ok.hidden = false;
    window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();
