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
		link.addEventListener("click", () => {
			closeMenu(true);

			const href = link.getAttribute("href");
			if (!href || !href.startsWith("#")) return;

			const targetSection = document.querySelector(href);
			if (!(targetSection instanceof HTMLElement)) return;

			targetSection.classList.remove("nav-click-fade");
			void targetSection.offsetWidth;
			targetSection.classList.add("nav-click-fade");
		});
	});

	document.addEventListener("click", (event) => {
		if (!navbar.classList.contains("scrolled") && !navbar.classList.contains("compact")) return;
		if (!navbar.classList.contains("menu-open")) return;
		if (navbar.contains(event.target)) return;
		closeMenu();
	});
}

const sectionsToReveal = document.querySelectorAll("main section");
const studioBanner = document.querySelector(".studio-banner");

const updatePageBackgroundShift = () => {
	const shift = Math.min(window.scrollY * 0.08, 64);
	document.body.style.setProperty("--page-bg-shift", `${shift}px`);
};

window.addEventListener("scroll", updatePageBackgroundShift, { passive: true });
window.addEventListener("load", updatePageBackgroundShift);
window.addEventListener("resize", updatePageBackgroundShift);

if (studioBanner instanceof HTMLElement) {
	const updateBannerBlend = () => {
		const fadeDistance = 180;
		const progress = Math.min(window.scrollY / fadeDistance, 1);
		studioBanner.style.opacity = String(1 - progress);
		studioBanner.style.transform = `translateY(${-14 * progress}px)`;
		studioBanner.style.pointerEvents = progress > 0.96 ? "none" : "auto";
	};

	window.addEventListener("scroll", updateBannerBlend, { passive: true });
	window.addEventListener("load", updateBannerBlend);
	window.addEventListener("resize", updateBannerBlend);
}

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

const contactSuccessMessage = document.getElementById("form-success-message");

if (contactSuccessMessage instanceof HTMLElement) {
	const searchParams = new URLSearchParams(window.location.search);
	const wasSubmitted = searchParams.get("submitted") === "1";

	if (wasSubmitted) {
		contactSuccessMessage.hidden = false;
		history.replaceState({}, document.title, `${window.location.pathname}#contact-us`);
	}
}
