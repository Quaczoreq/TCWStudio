const navbar = document.querySelector(".navbar");
const burgerButton = document.getElementById("burgerBtn");
const navLinks = document.getElementById("navLinks");

if ("scrollRestoration" in history) {
	history.scrollRestoration = "manual";
}

window.addEventListener("pageshow", () => {
	window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});

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

	const scrollToSectionBelowNavbar = (targetSection, hash) => {
		const navbarOffset = navbar.getBoundingClientRect().height + 12;
		const targetY = targetSection.getBoundingClientRect().top + window.scrollY - navbarOffset;

		window.scrollTo({
			top: Math.max(0, targetY),
			behavior: "smooth"
		});

		history.replaceState({}, document.title, hash);
	};

	navLinks.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", (event) => {
			closeMenu(true);

			const href = link.getAttribute("href");
			if (!href || !href.startsWith("#")) return;

			const targetSection = document.querySelector(href);
			if (!(targetSection instanceof HTMLElement)) return;

			event.preventDefault();
			scrollToSectionBelowNavbar(targetSection, href);

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

const contactSuccessMessage = document.getElementById("form-success-message");
const contactForm = document.getElementById("contact-form");
const contactIntroMessage = document.getElementById("contact-intro-message");
const newsletterForm = document.querySelector(".newsletter-form");
const newsletterSuccessMessage = document.getElementById("newsletter-success-message");
const contactAccordionButton = document.getElementById("contactAccordionBtn");
const contactAccordionPanel = document.getElementById("contactAccordionPanel");
const contactSection = document.getElementById("contact-us");

if (newsletterForm instanceof HTMLFormElement) {
	newsletterForm.addEventListener("submit", (event) => {
		event.preventDefault();

		if (!newsletterForm.checkValidity()) {
			newsletterForm.reportValidity();
			return;
		}

		if (newsletterSuccessMessage instanceof HTMLElement) {
			newsletterSuccessMessage.hidden = false;
		}

		newsletterForm.reset();
	});
}

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
			user_name: String(formData.get("name") || ""),
			user_email: String(formData.get("email") || ""),
			from_name: String(formData.get("name") || ""),
			from_email: String(formData.get("email") || ""),
			topic: String(formData.get("topic") || ""),
			message: String(formData.get("message") || "")
		};

		try {
			await emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateId, templateParams);
			showFormMessage("We received your message and will be in touch shortly.");
			contactForm.hidden = true;
			if (contactIntroMessage instanceof HTMLElement) {
				contactIntroMessage.hidden = true;
			}
		} catch {
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
