const navbar = document.querySelector(".navbar");
const burgerButton = document.getElementById("burgerBtn");
const navLinks = document.getElementById("navLinks");

if (navbar && burgerButton && navLinks) {
	const compactMediaQuery = window.matchMedia("(max-width: 900px)");

	const isCompact = () => compactMediaQuery.matches;

	const closeMenu = (instant = false) => {
		if (instant) {
			navbar.classList.add("no-nav-animate");
		}

		navbar.classList.remove("menu-open");
		burgerButton.setAttribute("aria-expanded", "false");

		if (instant) {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					navbar.classList.remove("no-nav-animate");
				});
			});
		}
	};

	const updateScrollState = () => {
		const scrolled = window.scrollY > 20;
		const compact = isCompact();
		navbar.classList.toggle("scrolled", scrolled);
		navbar.classList.toggle("compact", compact);

		if (!scrolled && !compact) {
			closeMenu();
		}
	};

	window.addEventListener("scroll", updateScrollState, { passive: true });
	window.addEventListener("load", updateScrollState);
	window.addEventListener("resize", updateScrollState);
	compactMediaQuery.addEventListener("change", updateScrollState);

	burgerButton.addEventListener("click", () => {
		if (!navbar.classList.contains("scrolled") && !navbar.classList.contains("compact")) return;

		const willOpen = !navbar.classList.contains("menu-open");
		navbar.classList.toggle("menu-open", willOpen);
		burgerButton.setAttribute("aria-expanded", String(willOpen));
	});

	navLinks.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => closeMenu(true));
	});

	document.addEventListener("click", (event) => {
		if (!navbar.classList.contains("scrolled") && !navbar.classList.contains("compact")) return;
		if (!navbar.classList.contains("menu-open")) return;
		if (navbar.contains(event.target)) return;
		closeMenu();
	});
}

const sectionsToReveal = document.querySelectorAll("main section");

if (sectionsToReveal.length > 0) {
	sectionsToReveal.forEach((section) => {
		section.classList.add("reveal-section");
	});

	if ("IntersectionObserver" in window) {
		const revealObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					entry.target.classList.add("is-visible");
					observer.unobserve(entry.target);
				});
			},
			{ threshold: 0.18 }
		);

		sectionsToReveal.forEach((section) => {
			revealObserver.observe(section);
		});
	} else {
		sectionsToReveal.forEach((section) => {
			section.classList.add("is-visible");
		});
	}
}
