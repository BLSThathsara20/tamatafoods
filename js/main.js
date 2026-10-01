(() => {
  const nav = document.getElementById("nav");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("menu");
  const year = document.getElementById("year");
  const form = document.querySelector(".form");
  const status = document.querySelector(".form-status");

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeMenu = () => {
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    menu.hidden = true;
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".story, .craft, .statement, .vision, .contact, .pillars li").forEach((el) => {
    io.observe(el);
  });

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      status.textContent = "Sending…";

      try {
        const body = new URLSearchParams(new FormData(form)).toString();
        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });
        if (!res.ok) throw new Error("Network");
        form.classList.add("is-sent");
        status.textContent = "Received — we will write back shortly.";
      } catch {
        status.textContent = "Please try again, or write to us directly.";
        button.disabled = false;
      }
    });
  }
})();
