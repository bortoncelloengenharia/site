"use strict";

const helper = {
	isMobileScreen() {
		return window.matchMedia("(max-width: 768px)").matches;
	},
	scrollToHash() {
		const hash = window.location.hash;
		if (!hash) return;

		const target = document.querySelector(hash);
		if (!target) return;

		target.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	},
};

const build = {
	mainContainer() {
		const mainScreen = document.getElementById("mainScreen");
		const div = document.createElement("main");
		mainScreen.append(div);

		div.id = "sections";
		div.classList.add("sections");
	},
	sectionDiv(divId) {
		const parent = document.getElementById("sections");
		const section = document.createElement("section");
		const container = document.createElement("div");
		section.id = divId;
		section.classList.add(divId);
		container.id = `${divId}Container`;
		container.classList.add(`${divId}Container`);
		section.append(container);
		parent.append(section);
		return section;
	},
	p(text, pClass = null) {
		const p = document.createElement("p");
		if (pClass) p.classList.add(pClass);

		const regex = /\[([a-zA-Z0-9-_]+)\](.+?)\[\/\1\]/g;
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(text)) !== null) {
			appendBeforeMatch();
			appendStylizedSpan();
			lastIndex = regex.lastIndex;
		}
		appendAfterMatch();

		return p;

		function appendBeforeMatch() {
			if (match.index <= lastIndex) return;
			p.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
		}
		function appendStylizedSpan() {
			const [fullMatch, className, content] = match;
			const span = document.createElement("span");
			span.classList.add(className);
			span.textContent = content;
			p.appendChild(span);
		}
		function appendAfterMatch() {
			if (lastIndex >= text.length) return;
			p.appendChild(document.createTextNode(text.slice(lastIndex)));
		}
	},
	span(text, spanClass = null) {
		const span = document.createElement("span");
		span.textContent = text;
		if (spanClass) span.classList.add(spanClass);
		return span;
	},
	h1(text, h1Class = null) {
		const h1 = document.createElement("h1");
		h1.textContent = text;
		h1.classList.add(h1Class);
		return h1;
	},
	h2(text, h2Class = null) {
		const h2 = document.createElement("h2");
		h2.textContent = text;
		h2.classList.add(h2Class);
		return h2;
	},
	h3(text, h3Class = null) {
		const h3 = document.createElement("h3");
		h3.textContent = text;
		h3.classList.add(h3Class);
		return h3;
	},
	h4(text, h4Class = null) {
		const h4 = document.createElement("h4");
		h4.textContent = text;
		h4.classList.add(h4Class);
		return h4;
	},
	img({src, alt}, imgClass = undefined) {
		const img = document.createElement("img");
		img.src = src;
		img.alt = alt;
		img.draggable = false;
		img.loading = "lazy";
		if (imgClass) img.classList.add(imgClass);
		return img;
	},
	a(text, icon = null, link = null, newTab = false, iconFirst = false) {
		const a = document.createElement("a");
		const content = iconFirst
			? [icon && build.img(icon), text && build.span(text)]
			: [text && build.span(text), icon && build.img(icon)];

		content.filter(Boolean).forEach((element) => a.append(element));

		a.href = link;
		a.target = newTab ? "_blank" : "_self";
		return a;
	},
	button(text, icon = null, iconFirst = false) {
		const button = document.createElement("button");
		const content = iconFirst
			? [icon && build.img(icon), text && build.span(text)]
			: [text && build.span(text), icon && build.img(icon)];

		content.filter(Boolean).forEach((element) => button.append(element));
		return button;
	},
	closeButton() {
		const closeButton = document.createElement("button");

		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("width", "20");
		svg.setAttribute("height", "20");
		svg.setAttribute("viewBox", "0 0 20 20");
		svg.setAttribute("fill", "none");

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", "M15 5L5 15M5 5L15 15");
		path.setAttribute("stroke", "currentColor");
		path.setAttribute("stroke-width", "2");
		path.setAttribute("stroke-linecap", "round");

		svg.appendChild(path);
		closeButton.appendChild(svg);
		return closeButton;
	},
	textList(img, textArray) {
		const container = document.createElement("ul");
		container.classList.add("textListContainer");
		for (const text of textArray) {
			const textContainer = document.createElement("li");
			textContainer.classList.add("textList");
			const imgElement = build.img(img);
			const spanElement = build.span(text);
			textContainer.append(imgElement, spanElement);
			container.append(textContainer);
		}
		return container;
	},
	label(text, labelClass = undefined) {
		const label = document.createElement("label");
		label.textContent = text;
		if (labelClass) label.classList.add(labelClass);
		return label;
	},
	input(inputClass) {
		const input = document.createElement("input");
		if (inputClass) input.classList.add(inputClass);
		return input;
	},
	textArea(textAreaClass) {
		const textArea = document.createElement("textarea");
		if (textAreaClass) textArea.classList.add(textAreaClass);
		return textArea;
	},
};

const siteHeader = {
	createAll(isMain) {
		this.createContainer(isMain);
		this.createLogo();
		this.createButtons();
		this.createWhatsapp();
	},
	createContainer(isMain) {
		const mainScreen = document.getElementById("mainScreen");
		const header = document.createElement("header");
		mainScreen.append(header);

		header.id = "header";
		header.classList.add("header");

		if (!isMain) header.classList.add("headerBackground");
	},
	createLogo() {
		const headerDiv = document.getElementById("header");
		const logoDiv = build.a(null, iconLibrary.internal.whiteLogo, linkLibrary.internal.home);
		logoDiv.classList.add("headerLogo");
		headerDiv.append(logoDiv);
	},
	createButtons() {
		const headerDiv = document.getElementById("header");
		const buttonsDiv = document.createElement("nav");
		buttonsDiv.classList.add("headerButtons");

		const textList = textLibrary.header.buttons;
		const frag = document.createDocumentFragment();
		for (const {text, link, dropdown} of textList) {
			const a = build.a(text, null, link);
			frag.append(a);

			this.createDropdown(a, dropdown);
		}
		buttonsDiv.append(frag);
		headerDiv.append(buttonsDiv);
	},
	createWhatsapp() {
		if (helper.isMobileScreen()) return;

		const buttonDiv = document.getElementById("header");
		const {text, icon, link} = textLibrary.header.whatsapp;
		const a = build.a(text, icon, link, true);
		a.classList.add("aIcon", "buttonStyleWhite");

		buttonDiv.append(a);
	},
	createDropdown(a, dropdown) {
		if (!dropdown) return;

		a.classList.add("dropdownArrow");
		const container = document.createElement("div");
		container.classList.add("dropdown", "boxShadow");
		for (const {text, link} of dropdown) {
			const a = build.a(text, null, link);
			container.append(a);
		}
		a.append(container);
	},
};

const siteFooter = {
	createAll() {
		this.createSectionContainer();
		this.createFirstColumn();
		this.createSecondColumn();
		this.createThirdColumn();
		this.createFourthColumn();
		this.createCredits();
	},
	createSectionContainer() {
		const mainScreen = document.getElementById("mainScreen");
		const footer = document.createElement("footer");
		mainScreen.append(footer);

		footer.id = "footer";
		footer.classList.add("footer");
	},
	createFooterSection() {
		const footer = document.getElementById("footer");
		const container = document.createElement("section");
		footer.append(container);
		return container;
	},
	createFirstColumn() {
		const container = this.createFooterSection();
		container.classList.add("footerFirstColumn");
		const {image, text} = textLibrary.footer.first;

		const img = buildImg();
		const p = buildText();
		container.append(img, p);

		function buildImg() {
			const div = document.createElement("div");
			const img = build.img(image);
			div.append(img);
			return div;
		}
		function buildText() {
			const p = build.p(text);
			return p;
		}
	},
	createSecondColumn() {
		const container = this.createFooterSection();
		const textObject = textLibrary.footer.second;

		buildHeader();
		buildContent();

		function buildHeader() {
			const h3 = build.h3(textObject.header);
			container.append(h3);
		}
		function buildContent() {
			const aContainer = document.createElement("nav");
			aContainer.classList.add("footerGrid");

			for (const {text, link} of textObject.content) {
				const a = build.a(text, null, link);
				aContainer.append(a);
			}
			container.append(aContainer);
		}
	},
	createThirdColumn() {
		const container = this.createFooterSection();
		const textObject = textLibrary.footer.third;

		buildHeader();
		buildContent();

		function buildHeader() {
			const h3 = build.h3(textObject.header);
			container.append(h3);
		}
		function buildContent() {
			const aContainer = document.createElement("nav");
			aContainer.classList.add("footerGrid");

			for (const {text, link} of textObject.content) {
				const a = build.a(text, null, link);
				aContainer.append(a);
			}
			container.append(aContainer);
		}
	},
	createFourthColumn() {
		const container = this.createFooterSection();
		const textObject = textLibrary.footer.fourth;

		buildHeader();
		buildContent();
		buildButtons();

		function buildHeader() {
			const h3 = build.h3(textObject.header);
			container.append(h3);
		}
		function buildContent() {
			const aContainer = document.createElement("nav");
			aContainer.classList.add("footerGrid");

			for (const {text, link} of textObject.content) {
				const a = build.a(text, null, link);
				aContainer.append(a);
			}
			container.append(aContainer);
		}
		function buildButtons() {
			const buttonContainer = document.createElement("div");
			buttonContainer.classList.add("footerButtonContainer");

			const {linkedin: linkedinImg, instagram: instagramImg} = iconLibrary.external;
			const {linkedin: linkedinLink, instagram: instagramLink} = linkLibrary.external;
			const linkedinButton = build.a(null, linkedinImg, linkedinLink, true);
			const instagramButton = build.a(null, instagramImg, instagramLink, true);

			buttonContainer.append(linkedinButton, instagramButton);
			container.append(buttonContainer);
		}
	},
	createCredits() {
		const footer = document.getElementById("mainScreen");
		const credits = document.createElement("aside");
		credits.classList.add("credits");

		const p = build.p(textLibrary.footer.credits);
		credits.append(p);
		footer.append(credits);
	},
};

const sidebarMenu = {
	isOpen() {
		if (document.getElementsByClassName("activeSidebar").length > 0) return true;
		return false;
	},
	open() {
		document.getElementById("sidebar").classList.add("activeSidebar");
		this.disableSwipeY();
	},
	close() {
		document.getElementById("sidebar").classList.remove("activeSidebar");
		this.enableSwipeY();
	},
	toggle() {
		document.getElementById("sidebar").classList.toggle("activeSidebar");
		if (this.isOpen()) return this.disableSwipeY();
		this.enableSwipeY();
	},
	disableSwipeY() {
		document.body.style.overflowY = "hidden";
		document.documentElement.style.overflow = "hidden";
	},
	enableSwipeY() {
		document.body.style.removeProperty("overflow-y");
		document.documentElement.style.removeProperty("overflow-y");
	},
	createAll() {
		this.createSidebarButton();
		this.createSidebarHeader();
		this.createSidebarBody();
		this.swipeToOpen();
	},
	createSidebarButton() {
		if (!helper.isMobileScreen()) return;

		const header = document.getElementById("header");

		const sidebarButton = build.button();
		const icon = iconLibrary.internal.sidebarButton;
		const img = build.img(icon);
		sidebarButton.append(img);
		header.append(sidebarButton);

		sidebarButton.classList.add("sidebarButton");
		sidebarButton.addEventListener("click", () => {
			sidebarMenu.toggle();
		});
		sidebarButton.addEventListener("touchstart", (e) => {
			e.preventDefault();
			sidebarMenu.toggle();
		});
	},
	createSidebarHeader() {
		const sidebar = document.getElementById("sidebar");
		const header = document.createElement("div");
		sidebar.append(header);
	},
	createSidebarBody() {
		const sidebar = document.getElementById("sidebar");
		const container = document.createElement("nav");
		sidebar.append(container);

		container.classList.add("sidebarBody");

		buildButtons();

		function buildButtons() {
			const frag = document.createDocumentFragment();

			const buttonsList = textLibrary.header.buttons;
			for (const {text, link} of buttonsList) {
				const button = build.a(text, null, link);
				frag.append(button);
			}

			container.append(frag);
		}
	},
	swipeToOpen() {
		eventListeners.horizontalSwipe("body", undefined, () => this.close());
	},
};

const persistentWhatsapp = {
	build(isMain) {
		const container = document.getElementById("mainScreen");
		const a = build.a(null, iconLibrary.external.whatsapp, linkLibrary.external.whatsapp, true);
		a.classList.add("persistentWhatsapp");
		container.append(a);
		if (!isMain) a.classList.add("nonOpaque");
	},
};

const eventListeners = {
	createInitial(isMain) {
		this.preventRightClickOnImg();
		this.closeSidebarOnTapOutside();
		this.setupBackButtonHandler();
		this.detectsScroll(isMain);
	},
	preventRightClickOnImg() {
		document.addEventListener("contextmenu", (element) => {
			if (element.target.matches("img")) element.preventDefault();
		});
	},
	closeSidebarOnTapOutside() {
		const sidebar = document.getElementById("sidebar");
		const openButton = document.getElementById("openMenuButton");
		const openImg = document.getElementById("openMenuImg");

		document.addEventListener("click", (event) => {
			if (!sidebar.classList.contains("activeSidebar")) return;
			if (sidebar.contains(event.target)) return;
			if (event.target === openButton) return;
			if (event.target === openImg) return;

			sidebarMenu.close();
		});
	},
	horizontalSwipe(nodeId, leftToRight, rightToLeft) {
		const node = document.getElementById(nodeId);
		let start = {};

		node.addEventListener("touchstart", (event) => {
			start.x = event.touches[0].clientX;
			start.y = event.touches[0].clientY;
		});
		node.addEventListener("touchend", (event) => {
			const endX = event.changedTouches[0].clientX;
			const differenceX = endX - start.x;
			const thresholdX = 100;

			const swipeLeft = differenceX > thresholdX;
			if (swipeLeft) return rightToLeft();
			if (leftToRight) leftToRight();
		});
		node.addEventListener("touchmove", (event) => {
			const endY = event.changedTouches[0].clientY;
			const differenceY = endY - start.y;
			const thresholdY = 10;

			const largeVerticalSwipe = Math.abs(differenceY) > thresholdY;
			if (largeVerticalSwipe) return;

			(event.preventDefault(), {passive: false, capture: true});
		});
	},
	setupBackButtonHandler() {
		if (!helper.isMobileScreen()) return;
		window.addEventListener("popstate", () => {
			fixedScreen.close();
		});
	},
	detectsScroll(isMain = false) {
		if (!isMain) return;
		const header = document.getElementById("header");

		window.addEventListener("scroll", () => {
			const isScrolled = getScrolled();
			changesBackground(isScrolled);
			togglesWhatsappVisibility(isScrolled);
		});

		function getScrolled() {
			return window.scrollY > 100;
		}
		function changesBackground(isScrolled) {
			isScrolled ? header.classList.add("headerBackground") : header.classList.remove("headerBackground");
		}
		function togglesWhatsappVisibility(isScrolled) {
			const container = document.querySelector(".persistentWhatsapp");
			isScrolled ? container.classList.add("nonOpaque") : container.classList.remove("nonOpaque");
		}
	},
};
