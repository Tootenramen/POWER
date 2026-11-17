/* shared behaviour: aurora, progress, reveal, spotlight, tilt, nav. No dependencies. */
(function () {
  document.documentElement.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // aurora blobs
  var au = document.querySelector('.aurora');
  if (au) {
    var cols = ['#8b7bff', '#22d3ee', '#ff6fb1', '#34e3b0'];
    [[ '18%', '22%', 23, 0], ['82%', '30%', 29, -6], ['50%', '86%', 34, -12], ['10%', '78%', 27, -3]].forEach(function (b, i) {
      var d = document.createElement('div');
      d.className = 'blob';
      d.style.cssText = '--x:' + b[0] + ';--y:' + b[1] + ';--col:' + cols[i] + ';--t:' + b[2] + 's;--dl:' + b[3] + 's';
      d.innerHTML = '<b></b>';
      au.appendChild(d);
    });
    var g = document.createElement('div'); g.className = 'grain'; au.appendChild(g);
  }
  // scroll progress
  var pr = document.querySelector('.progress');
  function onScroll() {
    if (!pr) return;
    var h = document.documentElement.scrollHeight - innerHeight;
    pr.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  // reveal
  var rv = [].slice.call(document.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (n) { io.observe(n); });
  } else rv.forEach(function (n) { n.classList.add('in'); });
  // spotlight + tilt
  document.addEventListener('pointermove', function (e) {
    var t = e.target.closest && e.target.closest('.glass.spot');
    if (t) { var r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px'); }
    if (reduce) return;
    var tl = e.target.closest && e.target.closest('.tilt');
    if (tl) { var q = tl.getBoundingClientRect(); var x = (e.clientX - q.left) / q.width - .5, y = (e.clientY - q.top) / q.height - .5; tl.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg'); tl.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg'); }
  });
  document.addEventListener('pointerout', function (e) {
    var tl = e.target.closest && e.target.closest('.tilt');
    if (tl) { tl.style.setProperty('--rx', '0deg'); tl.style.setProperty('--ry', '0deg'); }
  });
  // helpers for pages
  window.FR = {
    sleep: function (ms) { return new Promise(function (r) { setTimeout(r, reduce ? Math.min(ms, 40) : ms); }); },
    type: async function (el, text, speed) {
      el.textContent = '';
      for (var i = 0; i < text.length; i++) { el.textContent += text[i]; await FR.sleep(speed || 22); }
    },
    el: function (html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  };
})();
