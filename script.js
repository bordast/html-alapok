// METU CSS Kert — Editorial 3D interakciók
// 1. IntersectionObserver — onAppear animációk
// 2. 3D kártya tilt — egér követés
// 3. Fejléc parallax — görgetésre
// 4. Mágneses badge-ek

/* ─── 1. ONAPPEAR ───────────────────────── */
const figyeltElementek = document.querySelectorAll(
    '.fooldal-cim, .alcim, .bevezeto, ' +
    '.tartalom .kartya, .szabaly, ' +
    '.inspiracio-elem, .tech-badge, ' +
    '.szerzo-info, .hasznos-linkek, .link-lista li, ' +
    '.lablec'
);

const megjelenes = new IntersectionObserver((bejegyzesek) => {
    bejegyzesek.forEach((b) => {
        if (b.isIntersecting) {
            b.target.classList.add('is-visible');
            megjelenes.unobserve(b.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

figyeltElementek.forEach((el) => megjelenes.observe(el));


/* ─── 2. 3D KÁRTYA TILT ─────────────────── */
const TILT_MAX = 8;     // max fokszám
const TILT_SCALE = 1.02;

document.querySelectorAll('.kartya, .inspiracio-elem').forEach((card) => {
    let rafId = null;

    card.addEventListener('mousemove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width  / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -TILT_MAX;
            const rotY = ((x - cx) / cx) *  TILT_MAX;

            card.style.transform =
                `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${TILT_SCALE})`;
            card.style.transition = 'transform 0.08s linear';

            // Mozgó fényvisszaverődés
            const shine = card.querySelector('.tilt-shine');
            if (shine) {
                const pctX = (x / rect.width)  * 100;
                const pctY = (y / rect.height) * 100;
                shine.style.background =
                    `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
            }
        });
    });

    card.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
        card.style.transform  = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });

    // Fényvisszaverődő réteg hozzáadása
    const shine = document.createElement('div');
    shine.className = 'tilt-shine';
    shine.style.cssText =
        'position:absolute;inset:0;pointer-events:none;border-radius:inherit;transition:background 0.1s ease;z-index:1;';
    card.style.position = 'relative';
    card.appendChild(shine);
});


/* ─── 3. FEJLÉC PARALLAX ────────────────── */
const fejlec = document.querySelector('.fejlec');
const focim  = document.querySelector('.fooldal-cim');
const alcim  = document.querySelector('.alcim');

if (fejlec && focim) {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scroll = window.scrollY;
                const limit  = fejlec.offsetHeight;

                if (scroll < limit) {
                    const t = scroll / limit;
                    // Főcím lassan felfelé úszik
                    focim.style.transform = `translateY(${scroll * 0.35}px)`;
                    focim.style.opacity   = `${1 - t * 1.5}`;
                    // Alcím kicsit gyorsabban
                    if (alcim) {
                        alcim.style.transform = `translateY(${scroll * 0.5}px)`;
                        alcim.style.opacity   = `${1 - t * 2}`;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}


/* ─── 4. MÁGNESES BADGE-EK ──────────────── */
const MAGNET_STRENGTH = 0.35;
const MAGNET_RADIUS   = 60;

document.querySelectorAll('.tech-badge').forEach((badge) => {
    badge.addEventListener('mousemove', (e) => {
        const rect = badge.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = e.clientX - cx;
        const dy   = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MAGNET_RADIUS) {
            const pull = (1 - dist / MAGNET_RADIUS) * MAGNET_STRENGTH;
            badge.style.transform   = `translate(${dx * pull}px, ${dy * pull}px) translateY(-3px) scale(1.05)`;
            badge.style.transition  = 'transform 0.15s ease';
        }
    });

    badge.addEventListener('mouseleave', () => {
        badge.style.transform  = '';
        badge.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)';
    });
});
