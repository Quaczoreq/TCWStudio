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
const contactForm = document.getElementById("contact-form");
const contactAccordionButton = document.getElementById("contactAccordionBtn");
const contactAccordionPanel = document.getElementById("contactAccordionPanel");
const contactSection = document.getElementById("contact-us");

const setContactAccordionState = (open) => {
	if (!(contactAccordionButton instanceof HTMLButtonElement)) return;
	if (!(contactAccordionPanel instanceof HTMLElement)) return;
	if (!(contactSection instanceof HTMLElement)) return;

	contactAccordionButton.setAttribute("aria-expanded", String(open));
	contactAccordionPanel.hidden = !open;
	contactSection.classList.toggle("is-open", open);
};

if (contactAccordionButton instanceof HTMLButtonElement) {
	contactAccordionButton.addEventListener("click", () => {
		const isOpen = contactAccordionButton.getAttribute("aria-expanded") === "true";
		setContactAccordionState(!isOpen);
	});
}

const showFormMessage = (message, isError = false) => {
	if (!(contactSuccessMessage instanceof HTMLElement)) return;
	contactSuccessMessage.textContent = message;
	contactSuccessMessage.hidden = false;
	contactSuccessMessage.style.borderColor = isError ? "rgba(255, 120, 120, 0.8)" : "rgba(255, 255, 255, 0.45)";
	contactSuccessMessage.style.background = isError ? "rgba(120, 10, 10, 0.35)" : "rgba(17, 24, 39, 0.56)";
};

if (contactForm instanceof HTMLFormElement) {
	const emailJsConfig = window.EMAILJS_CONFIG || {};
	const hasValidConfig =
		typeof emailjs !== "undefined" &&
		emailJsConfig.publicKey &&
		emailJsConfig.serviceId &&
		emailJsConfig.templateId &&
		emailJsConfig.publicKey !== "YOUR_PUBLIC_KEY" &&
		emailJsConfig.serviceId !== "YOUR_SERVICE_ID" &&
		emailJsConfig.templateId !== "YOUR_TEMPLATE_ID";

	if (hasValidConfig) {
		emailjs.init({ publicKey: emailJsConfig.publicKey });
	}

	contactForm.addEventListener("submit", async (event) => {
		event.preventDefault();

		if (!contactForm.checkValidity()) {
			contactForm.reportValidity();
			return;
		}

		setContactAccordionState(true);
		if (contactSuccessMessage instanceof HTMLElement) {
			contactSuccessMessage.hidden = true;
		}

		if (!hasValidConfig) {
			showFormMessage("Email service is not configured yet. Add your EmailJS keys in index.html.", true);
			return;
		}

		const submitButton = contactForm.querySelector('button[type="submit"]');
		if (submitButton instanceof HTMLButtonElement) {
			submitButton.disabled = true;
			submitButton.textContent = "Sending...";
		}

		const formData = new FormData(contactForm);
		const templateParams = {
			from_name: String(formData.get("name") || ""),
			from_email: String(formData.get("email") || ""),
			topic: String(formData.get("topic") || ""),
			message: String(formData.get("message") || "")
		};

		try {
			await emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateId, templateParams);
			showFormMessage("Thank you for your enquiry. We will contact you shortly.");
			contactForm.reset();
		} catch (error) {
			showFormMessage("Sorry, your message could not be sent. Please try again.", true);
		}

		if (submitButton instanceof HTMLButtonElement) {
			submitButton.disabled = false;
			submitButton.textContent = "Send Message";
		}
	});
}

document.addEventListener("contextmenu", (event) => {
	event.preventDefault();
});

document.addEventListener("copy", (event) => {
	event.preventDefault();
});

document.addEventListener("cut", (event) => {
	event.preventDefault();
});

document.addEventListener("dragstart", (event) => {
	event.preventDefault();
});

document.addEventListener("keydown", (event) => {
	const key = event.key.toLowerCase();
	const hasCtrlOrCmd = event.ctrlKey || event.metaKey;
	const isDevToolsShortcut =
		event.key === "F12" ||
		(hasCtrlOrCmd && event.shiftKey && (key === "i" || key === "j" || key === "c")) ||
		(hasCtrlOrCmd && key === "u");

	if (isDevToolsShortcut) {
		event.preventDefault();
	}
});
