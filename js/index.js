"use strict";

document.addEventListener("DOMContentLoaded", async () => {
	await loadData();
	meta.onLoad();
});

const meta = {
	onLoad() {
		this.createAll();
	},
	createAll() {
		const isMain = true;
		persistentWhatsapp.build(isMain);
		siteHeader.createAll(isMain);
		build.mainContainer();
		sidebarMenu.createAll();

		intro.createAll();
		areasDeAplicacao.createAll();
		entendaComoFunciona.createAll();
		diferenciais.createAll();
		clientes.createAll();
		nossoTrabalho.createAll();

		siteFooter.createAll();
		eventListeners.createInitial(isMain);
	},
};

const intro = {
	createAll() {
		this.createSection();
		this.createIntroCards();
		this.createSwiper();
	},
	createSection() {
		const divId = "intro";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createIntroCards() {
		const parent = document.getElementById("introContainer");
		const container = document.createElement("div");
		container.id = "bannersContainer";
		container.classList.add("bannersContainer");

		parent.append(container);

		const banners = imageLibrary.home.intro;
		for (const banner of Object.keys(banners)) {
			this.createBannerContainer(banner, container);
			this.createImg(banner);
			this.createContent(banner);
		}
	},
	createBannerContainer(banner, wrapper) {
		const slide = document.createElement("div");
		slide.id = `${banner}BannerContainer`;
		slide.classList.add("swiperSlide");

		wrapper.append(slide);
	},
	createImg(banner) {
		const container = document.getElementById(`${banner}BannerContainer`);
		const imgContainer = document.createElement("div");
		imgContainer.classList.add("introImgContainer", "imgFilter");

		const img = build.img(imageLibrary.home.intro[banner]);
		imgContainer.append(img);
		container.append(imgContainer);
	},
	createContent(banner) {
		const {
			header,
			subheader,
			button: {text, icon, link},
		} = textLibrary.home.intro[banner];
		const parent = document.getElementById(`${banner}BannerContainer`);
		const container = document.createElement("div");
		container.classList.add("introTextContainer");
		const h1 = build.h1(header);
		const h2 = build.h2(subheader);

		const button = build.a(text, icon, link);
		button.classList.add("buttonStyleWhite");

		container.append(h1, h2, button);
		parent.append(container);
	},
	createSwiper() {
		const parent = document.getElementById("introContainer");
		const container = document.createElement("div");
		container.classList.add("swiperContainer");

		this.initCarousel();

		const leftArrow = this.createArrowButton("left");
		const rightArrow = this.createArrowButton("right");
		container.append(leftArrow, rightArrow);
		parent.append(container);
	},
	createArrowButton(direction) {
		const button = document.createElement("button");
		button.classList.add("arrow");
		if (direction === "left") button.classList.add("arrowLeft");
		button.dataset.carouselControl = "true";
		button.setAttribute("aria-label", `Slide ${direction === "left" ? "anterior" : "próximo"}`);
		button.addEventListener("click", () => this.onArrowClick(direction));
		return button;
	},
	initCarousel() {
		this.currentIndex = 1;
		const bannersContainer = document.getElementById("bannersContainer");
		bannersContainer.dataset.index = this.currentIndex;

		const firstClone = bannersContainer.firstChild.cloneNode(true);
		const lastClone = bannersContainer.lastChild.cloneNode(true);

		bannersContainer.prepend(lastClone);
		bannersContainer.append(firstClone);

		this.setBannerParameters();
		this.initAccessibility();
	},
	updateCarousel(index) {
		this.currentIndex += index;
		bannersContainer.dataset.index = this.currentIndex;

		this.setBannerParameters(this.currentIndex);
	},
	setBannerParameters() {
		const bannersContainer = document.getElementById("bannersContainer");
		const {children} = bannersContainer;

		Object.entries(children).forEach(([index, banner]) => {
			banner.dataset.index = index;
			banner.style.transition = "transform 0.5s ease";
			setTransform(banner);
		});

		function setTransform(banner) {
			const index = document.getElementById("bannersContainer").dataset.index;
			const value = 100 * Number(index) * -1;
			banner.style.transform = `translateX(${value}%)`;
		}
	},
	onArrowClick(side) {
		const bannersContainer = document.getElementById("bannersContainer");
		if (bannersContainer.dataset.animating === "1") return;
		bannersContainer.dataset.animating = "1";

		const direction = side === "right" ? 1 : -1;
		intro.updateCarousel(direction);

		bannersContainer.addEventListener(
			"transitionend",
			() => {
				bannersContainer.dataset.animating = "0";
				intro.updateSlideAccessibility();
				if (this.isFirstOrLast()) this.processFirstOrLast();
			},
			{once: true},
		);
	},
	isFirstOrLast() {
		const bannersContainer = document.getElementById("bannersContainer");
		const maxIndex = bannersContainer.children.length - 1;
		const index = this.currentIndex;

		if (index !== 0 && index !== maxIndex) return false;

		return true;
	},
	processFirstOrLast() {
		const bannersContainer = document.getElementById("bannersContainer");
		const banners = [...bannersContainer.children];

		const {currentIndex} = this;

		// Último índice, clone do primeiro
		if (currentIndex !== 0) {
			banners.forEach((banner) => (banner.style.transition = "none"));
			banners.forEach((banner) => (banner.style.transform = "translateX(-100%)"));
			this.currentIndex = 1;
			return;
		}
		// Primeiro índice, clone do último
		if (currentIndex === 0) {
			banners.forEach((banner) => (banner.style.transition = "none"));
			banners.forEach((banner) => (banner.style.transform = "translateX(-400%)"));
			this.currentIndex = 4;
			return;
		}
	},
	initAccessibility() {
		const bannersContainer = document.getElementById("bannersContainer");
		const allFocusables = bannersContainer.querySelectorAll("a, button");
		allFocusables.forEach((element) => element.setAttribute("tabindex", "-1"));
		this.updateSlideAccessibility();
	},
	updateSlideAccessibility() {
		const bannersContainer = document.getElementById("bannersContainer");
		const slides = [...bannersContainer.children];

		slides.forEach((slide, index) => {
			const isActive = index === this.currentIndex;
			slide.setAttribute("aria-hidden", !isActive);
			const focusables = slide.querySelectorAll("a, button");

			focusables.forEach((element) => {
				if (element.dataset.carouselControl === "true") return;
				if (!isActive) return element.setAttribute("tabindex", "-1");
				element.removeAttribute("tabindex");
			});
		});
	},
};

const areasDeAplicacao = {
	createAll() {
		this.createSection();
		this.createHeader();
		this.createButtons();
	},
	createSection() {
		const divId = "areasDeAplicacao";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createHeader() {
		const div = document.getElementById("areasDeAplicacaoContainer");
		const {smallHeader, header} = textLibrary.home.areasDeAplicacao;
		const h4 = build.h4(smallHeader);
		const h2 = build.h2(header);
		div.append(h4, h2);
	},
	createButtons() {
		const div = document.getElementById("areasDeAplicacaoContainer");
		const container = document.createElement("div");
		container.classList.add("cartaoContainer");
		for (const {text, icon, link} of textLibrary.home.areasDeAplicacao.buttons) {
			const a = build.a(text, icon, link, false, true);
			a.classList.add("cartaoAplicacao");
			container.append(a);
		}
		div.append(container);
	},
};

const entendaComoFunciona = {
	createAll() {
		this.createSection();
		this.createImage();
		this.createText();
	},
	createSection() {
		const divId = "entendaComoFunciona";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createImage() {
		const container = document.getElementById("entendaComoFuncionaContainer");
		const img = build.img(imageLibrary.home.entendaComoFunciona.droplet, "boxShadow");
		container.append(img);
	},
	createText() {
		const container = document.getElementById("entendaComoFuncionaContainer");
		const div = document.createElement("div");

		const {smallHeader, header, text, button} = textLibrary.home.entendaComoFunciona;
		const h4 = build.h4(smallHeader);
		const h2 = build.h2(header);
		const p = build.p(text);

		const {text: buttonText, link} = button;
		const a = build.a(buttonText, null, link);
		a.classList.add("buttonStyleBlue");

		div.append(h4, h2, p, a);
		container.append(div);
	},
};

const diferenciais = {
	createAll() {
		this.createSection();
		this.createHeader();
		this.createCards();
	},
	createSection() {
		const divId = "diferenciais";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createHeader() {
		const container = document.getElementById("diferenciaisContainer");
		const {smallHeader, header} = textLibrary.home.diferenciais;
		const h4 = build.h4(smallHeader);
		const h2 = build.h2(header);

		container.append(h4, h2);
	},
	createCards() {
		const container = document.getElementById("diferenciaisContainer");
		const cardContainer = document.createElement("div");
		cardContainer.classList.add("cartaoDiferencialContainer");
		const {cards} = textLibrary.home.diferenciais;
		for (const {header, text, icon} of cards) {
			const card = document.createElement("div");
			const img = build.img(icon);
			const h3 = build.h3(header);
			const p = build.p(text);

			card.append(img, h3, p);
			cardContainer.append(card);
		}
		container.append(cardContainer);
	},
};

const clientes = {
	createAll() {
		this.createSection();
		this.createHeader();
		this.createCards();
	},
	createSection() {
		const divId = "clientes";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createHeader() {
		const div = document.getElementById("clientesContainer");
		const {header, smallHeader} = textLibrary.home.clientes;
		const h4 = build.h4(smallHeader);
		const h2 = build.h2(header);

		div.append(h4, h2);
	},
	createCards() {
		const div = document.getElementById("clientesContainer");
		const container = document.createElement("div");
		container.classList.add("cartaoClientes");
		const {clientes} = imageLibrary;

		for (const {src, alt} of clientes) {
			const card = document.createElement("div");
			const img = build.img({src, alt});

			card.append(img);
			container.append(card);
		}

		div.append(container);
	},
};

const nossoTrabalho = {
	createAll() {
		this.createSection();
		this.createHeader();
		this.createPictures();
	},
	createSection() {
		const divId = "nossoTrabalho";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createHeader() {
		const div = document.getElementById("nossoTrabalhoContainer");
		const {smallHeader, header} = textLibrary.home.nossoTrabalho;
		const h4 = build.h4(smallHeader);
		const h2 = build.h2(header);

		div.append(h4, h2);
	},
	createPictures() {
		const div = document.getElementById("nossoTrabalhoContainer");
		const container = document.createElement("div");
		container.classList.add("cartoesTrabalho");
		const {cards} = textLibrary.home.nossoTrabalho;

		for (const {text, before, after, link} of cards) {
			const card = document.createElement("a");
			const h3 = build.h3(text);
			const imgBefore = build.img(before);
			const imgAfter = build.img(after);
			card.classList.add("boxShadow");
			card.href = link;
			card.append(h3, imgBefore, imgAfter);
			container.append(card);
		}

		div.append(container);
	},
};
