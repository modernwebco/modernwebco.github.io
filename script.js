const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

document.getElementById("year") && (document.getElementById("year").textContent = new Date().getFullYear());

$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:"smooth", block:"start"}); }
    document.body.classList.remove("menu-open");
  });
});

const menu = $(".menu-toggle");
const nav = $(".nav");
menu?.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  if(open){
    nav.style.display = "flex";
    nav.style.position = "absolute";
    nav.style.top = "70px";
    nav.style.left = "10px";
    nav.style.right = "10px";
    nav.style.padding = "18px";
    nav.style.flexDirection = "column";
    nav.style.background = "rgba(10,10,10,.96)";
    nav.style.border = "1px solid #292929";
    nav.style.borderRadius = "16px";
  } else {
    nav.removeAttribute("style");
  }
});

const dot = $(".cursor-dot"), ring = $(".cursor-ring");
if (matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", e => {
    dot.style.left = e.clientX+"px"; dot.style.top = e.clientY+"px";
    ring.animate({left:e.clientX+"px", top:e.clientY+"px"}, {duration:180,fill:"forwards"});
  });
  $$("a,button,.project-card,.service-card,.price-card").forEach(el=>{
    el.addEventListener("mouseenter",()=>document.body.classList.add("hovering"));
    el.addEventListener("mouseleave",()=>document.body.classList.remove("hovering"));
  });
}

$$(".magnetic").forEach(el=>{
  el.addEventListener("pointermove", e=>{
    if(!matchMedia("(pointer:fine)").matches) return;
    const r=el.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${x*.08}px,${y*.08}px)`;
  });
  el.addEventListener("pointerleave",()=>el.style.transform="");
});

$$(".project-card").forEach(card=>{
  card.addEventListener("pointermove", e=>{
    if(!matchMedia("(pointer:fine)").matches) return;
    const r=card.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    const art=card.querySelector(".project-art");
    art.style.transform=`perspective(900px) rotateX(${y*-3}deg) rotateY(${x*3}deg) scale(.99)`;
  });
  card.addEventListener("pointerleave",()=>card.querySelector(".project-art").style.transform="");
});

const reveal = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add("is-visible"); reveal.unobserve(entry.target); }
  });
},{threshold:.08});
$$(".section-head,.project-card,.service-card,.process-card,.price-card,.location-card,.stats-panel").forEach(el=>reveal.observe(el));

$$('.counter').forEach(counter => {
  const target = Number(counter.dataset.target || 0);
  const suffix = counter.dataset.suffix || '';
  const format = counter.dataset.format;
  const duration = target > 1000 ? 1800 : 1200;
  const start = performance.now();
  function tick(now){
    const progress = Math.min((now-start)/duration,1);
    const eased = 1-Math.pow(1-progress,3);
    const value = Math.floor(target*eased);
    counter.textContent = format === 'k' ? Math.floor(value/1000)+'K'+suffix : value+suffix;
    if(progress<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
});


// AJAX inquiry form: keeps the visitor on the same page and gives a clear success state.
$$('.contact-form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-status');
    if (!button || !status) return;
    const original = button.innerHTML;
    button.disabled = true;
    button.innerHTML = 'Sending… <span>↗</span>';
    status.className = 'form-status is-sending';
    status.textContent = 'Sending your inquiry…';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });
      if (!response.ok) throw new Error('Submission failed');
      // Keep the success confirmation visible after a short, intentional delay.
      await new Promise(resolve => setTimeout(resolve, 3500));
      status.className = 'form-status is-success';
      status.textContent = 'Inquiry sent successfully. We’ll be in touch soon.';
      form.reset();
    } catch (err) {
      status.className = 'form-status is-error';
      status.textContent = 'Something went wrong. Please email modernwebcoo@gmail.com directly.';
    } finally {
      button.disabled = false;
      button.innerHTML = original;
    }
  });
});

// The logo is intentionally a same-page reload instead of linking to an external domain.
$$('.brand[href=""]').forEach(brand => {
  brand.addEventListener('click', e => {
    e.preventDefault();
    window.location.reload();
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".counter");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = parseInt(counter.dataset.target, 10);
            const suffix = counter.dataset.suffix || "";

            let current = 0;
            const duration = 1800;
            const start = performance.now();

            function update(time) {
                const progress = Math.min((time - start) / duration, 1);
                const value = Math.floor(progress * target);

                counter.textContent = value.toLocaleString() + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toLocaleString() + suffix;
                }
            }

            requestAnimationFrame(update);
            observer.unobserve(counter);
        });
    }, { threshold: 0.4 });

    counters.forEach(counter => observer.observe(counter));
});

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = parseInt(counter.dataset.target, 10);
      const suffix = counter.dataset.suffix || "";

      let current = 0;
      const duration = 1800;
      const start = performance.now();

      function update(time) {
        const progress = Math.min((time - start) / duration, 1);
        const value = Math.floor(progress * target);

        counter.textContent = value.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(update);
      observer.unobserve(counter);
    });
  }, { threshold: 0.4 });

  counters.forEach(counter => observer.observe(counter));
});