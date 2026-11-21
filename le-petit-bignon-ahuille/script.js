/* Le Petit Bignon — demo interactions (vanilla JS, nothing is sent anywhere). */
(function () {
  document.documentElement.classList.add('js');
  var EMAIL = 'lepetitbignonreception@gmail.com';

  /* Season tabs: default to the season of today's month */
  var tabs = [].slice.call(document.querySelectorAll('[role="tab"]'));
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  }
  if (tabs.length) {
    var m = new Date().getMonth() + 1;
    var start = m >= 5 && m <= 9 ? 0 : (m === 4 || m === 10 ? 1 : 2);
    select(tabs[start]);
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') select(tabs[(i + 1) % tabs.length], true);
        if (e.key === 'ArrowLeft') select(tabs[(i + tabs.length - 1) % tabs.length], true);
      });
    });
  }

  /* Min date = today */
  var today = new Date().toISOString().slice(0, 10);
  ['q-date', 'f-date'].forEach(function (id) { var el = document.getElementById(id); if (el) el.min = today; });

  /* Hero quick form -> prefill main form */
  var quick = document.getElementById('quick');
  if (quick) quick.addEventListener('submit', function (e) {
    e.preventDefault();
    document.getElementById('f-date').value = document.getElementById('q-date').value;
    document.getElementById('f-invites').value = document.getElementById('q-invites').value;
    document.getElementById('f-type').value = document.getElementById('q-type').value;
    document.getElementById('devis').scrollIntoView();
    setTimeout(function () { document.getElementById('f-nom').focus({ preventScroll: true }); }, 400);
  });

  /* Main form: validate, then prepare a mailto (no network request) */
  var form = document.getElementById('devis-form');
  var msg = document.getElementById('form-msg');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (id) { return (document.getElementById(id).value || '').trim(); };
    if (!v('f-nom') || !/^\S+@\S+\.\S+$/.test(v('f-email'))) {
      msg.className = 'form-msg err';
      msg.textContent = 'Merci d\'indiquer votre nom et une adresse e-mail valide.';
      (v('f-nom') ? document.getElementById('f-email') : document.getElementById('f-nom')).focus();
      return;
    }
    var d = v('f-date') ? new Date(v('f-date') + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'à définir';
    var body = [
      'Bonjour,', '',
      'Je souhaite un devis pour : ' + v('f-type') + ' (' + v('f-formule') + ')',
      'Date souhaitée : ' + d,
      'Nombre d\'invités : ' + (v('f-invites') || 'à définir'),
      document.getElementById('f-visite').checked ? 'Je souhaiterais également planifier une visite.' : '',
      '', v('f-msg'), '',
      v('f-nom'), v('f-email'), v('f-tel')
    ].join('\n');
    var href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Demande de devis — ' + v('f-type') + ' — ' + d) + '&body=' + encodeURIComponent(body);
    msg.className = 'form-msg ok';
    msg.innerHTML = '';
    msg.appendChild(document.createTextNode('Merci ' + v('f-nom').split(' ')[0] + ' ! (Démo : rien n\'a été envoyé.) '));
    var a = document.createElement('a');
    a.href = href; a.textContent = 'Ouvrir l\'e-mail prérempli';
    msg.appendChild(a);
    msg.appendChild(document.createTextNode(' ou appelez le 02 43 68 96 35.'));
  });

  /* Gallery lightbox */
  var lb = document.getElementById('lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var big = lb.querySelector('img');
    document.querySelectorAll('.gallery button').forEach(function (b) {
      b.addEventListener('click', function () {
        var img = b.querySelector('img');
        big.src = b.getAttribute('data-full'); big.alt = img.alt;
        lb.showModal();
      });
    });
    lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }
})();
