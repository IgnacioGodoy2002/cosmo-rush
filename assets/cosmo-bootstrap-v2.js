// Safari bloquea localStorage en iframes de terceros (ITP) y en modo privado:
// el acceso tira SecurityError en vez de devolver null. El juego lo usa sin
// try/catch (récord, piloto, mute), así que una excepción acá rompe el menú.
// Si el storage real no sirve, lo reemplazamos por uno en memoria.
(function () {
  try {
    var k = '__cosmo_ls_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return;
  } catch (e) {
    console.warn('[Cosmo] localStorage no disponible, usando fallback en memoria:', e && e.name);
  }
  var mem = Object.create(null);
  var shim = {
    getItem: function (n) { n = String(n); return n in mem ? mem[n] : null; },
    setItem: function (n, v) { mem[String(n)] = String(v); },
    removeItem: function (n) { delete mem[String(n)]; },
    clear: function () { mem = Object.create(null); },
    key: function (i) { var ks = Object.keys(mem); return i < ks.length ? ks[i] : null; },
    get length() { return Object.keys(mem).length; }
  };
  try {
    Object.defineProperty(window, 'localStorage', { value: shim, configurable: true });
  } catch (e) {
    console.warn('[Cosmo] no se pudo instalar el fallback de localStorage:', e);
  }
})();

try { await document.fonts.load('32px "Lilita One"'); } catch {}
await import("./cosmo-rush-v2.js");
