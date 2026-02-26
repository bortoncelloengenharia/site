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
		persistentWhatsapp.build();
		siteHeader.createAll();
		build.mainContainer();
		sidebarMenu.createAll();

		header.createAll();
		imagens.createAll();

		siteFooter.createAll();
		eventListeners.createInitial();
	},
};

const header = {
	createAll() {
		this.createSection();
		this.createHeader();
	},
	createSection() {
		const divId = "imagensHeader";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createHeader() {
		const container = document.getElementById("imagensHeaderContainer");
		const {header, subheader, buttons} = textLibrary.imagens;
		const h2 = build.h2(header);
		const h3 = build.h3(subheader);

		const buttonContainer = document.createElement("div");
		buttonContainer.classList.add("imagensButtonContainer");
		for (const [index, {text, link, filtro}] of buttons.entries()) {
			const button = build.button(text, null, link);
			const isFirst = index === 0;
			const className = isFirst ? "buttonStyleBlue" : "buttonStyleWhite";
			button.classList.add(className, "blueBorder", "filterButton");

			// Adiciona o atributo data-filtro do textLibrary
			if (filtro) {
				button.dataset.filtro = filtro;
			}

			buttonContainer.append(button);
		}

		container.append(h2, h3, buttonContainer);
	},
};

const imagens = {
	CATEGORIAS: {
		TODAS: "todas",
		LAJES: "lajes",
		CAIXAS_DAGUA: "caixasDagua",
		MARQUISES: "marquises",
		TAMPAS: "tampas",
	},
	createAll() {
		this.createSection();
		this.createCards();
		this.inicializarFiltros();
		this.verificarFiltroInicial();
	},
	createSection() {
		const divId = "galeriaDeImagens";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createCards() {
		const tiposDeImagens = imageLibrary.imagens;
		for (const imagens of Object.keys(tiposDeImagens)) {
			this.createCard(imagens, tiposDeImagens[imagens]);
		}
	},
	createCard(categoria, imagens) {
		const container = document.getElementById("galeriaDeImagensContainer");
		for (const {antes, depois} of imagens) {
			const card = document.createElement("div");
			card.classList.add("imageCard", "boxShadow", "visible");
			card.dataset.categoria = categoria;

			const imageContainer = document.createElement("div");
			const imgAntes = build.img(antes);
			const imgDepois = build.img(depois);
			const imgSlider = document.createElement("div");
			imageContainer.classList.add("imageCardContainer");
			imgAntes.classList.add("unselectable");
			imgDepois.classList.add("unselectable", "after");
			imgSlider.classList.add("imageCardSlider");

			const cardLabel = document.createElement("div");
			cardLabel.classList.add("imageCardLabel");
			const pAntes = build.p("Antes");
			const pDepois = build.p("Depois");
			cardLabel.append(pAntes, pDepois);

			imageContainer.append(imgAntes, imgDepois, imgSlider);
			card.append(imageContainer, cardLabel);
			container.append(card);

			this.inicializarDrag(imageContainer, imgSlider, imgDepois);
		}
	},
	inicializarDrag(container, slider, afterImage) {
		let isDragging = false;
		let containerRect;
		let isHorizontalDrag = false;
		let startX = 0;
		let startY = 0;

		const updateSliderPosition = (clientX) => {
			containerRect = container.getBoundingClientRect();
			let relativeX = (clientX - containerRect.left) / containerRect.width;
			relativeX = Math.max(0, Math.min(1, relativeX));

			const sliderPosition = relativeX * 100;
			slider.style.left = `${sliderPosition}%`;

			const clipPathValue = relativeX * 100;
			afterImage.style.clipPath = `inset(0 0 0 ${clipPathValue}%)`;
		};

		const startDrag = (e) => {
			if (e.type === "touchstart") {
				startX = e.touches[0].clientX;
				startY = e.touches[0].clientY;
				isHorizontalDrag = false;
			}

			isDragging = true;

			container.classList.add("dragging");
			slider.classList.add("dragging");

			const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;

			updateSliderPosition(clientX);

			document.addEventListener("mousemove", onDrag);
			document.addEventListener("touchmove", onDrag, {passive: false});
			document.addEventListener("mouseup", stopDrag);
			document.addEventListener("touchend", stopDrag);
		};

		const onDrag = (e) => {
			if (!isDragging) return;

			if (e.type === "touchmove") {
				const currentX = e.touches[0].clientX;
				const currentY = e.touches[0].clientY;

				const diffX = Math.abs(currentX - startX);
				const diffY = Math.abs(currentY - startY);

				// Decide se é drag horizontal
				if (!isHorizontalDrag) {
					if (diffX > diffY && diffX > 5) {
						isHorizontalDrag = true;
					} else {
						// gesto vertical → libera scroll
						return;
					}
				}

				// Só bloqueia scroll depois de confirmar drag horizontal
				e.preventDefault();
				updateSliderPosition(currentX);
				return;
			}

			// Mouse (desktop)
			e.preventDefault();
			updateSliderPosition(e.clientX);
		};

		const stopDrag = () => {
			if (!isDragging) return;

			isDragging = false;
			isHorizontalDrag = false;

			container.classList.remove("dragging");
			slider.classList.remove("dragging");

			document.removeEventListener("mousemove", onDrag);
			document.removeEventListener("touchmove", onDrag);
			document.removeEventListener("mouseup", stopDrag);
			document.removeEventListener("touchend", stopDrag);
		};

		container.addEventListener("mousedown", startDrag);
		container.addEventListener("touchstart", startDrag, {passive: false});

		slider.addEventListener("mousedown", startDrag);
		slider.addEventListener("touchstart", startDrag, {passive: false});

		const initPosition = () => {
			const rect = container.getBoundingClientRect();
			const middleX = rect.left + rect.width / 2;
			updateSliderPosition(middleX);
		};

		requestAnimationFrame(() => {
			initPosition();
		});

		window.addEventListener("resize", () => {
			if (!isDragging) {
				const currentLeft = parseFloat(slider.style.left);

				if (!isNaN(currentLeft)) {
					const relativeX = currentLeft / 100;
					const rect = container.getBoundingClientRect();
					const clientX = rect.left + relativeX * rect.width;
					updateSliderPosition(clientX);
				}
			}
		});
	},
	inicializarFiltros() {
		const buttons = document.querySelectorAll(".filterButton");
		for (const button of buttons) {
			button.addEventListener("click", (event) => {
				event.preventDefault();
				const {filtro: categoria} = event.currentTarget.dataset;
				if (categoria) this.filtrarImagens(categoria);
			});
		}

		const primeiroBotao = document.querySelector(".filterButton");
		if (!primeiroBotao) return;
		if (!primeiroBotao.dataset.filtro) return;

		this.filtrarImagens(primeiroBotao.dataset.filtro);
	},
	filtrarImagens(categoria) {
		const todas = this.CATEGORIAS.TODAS;
		toggleButtonStyle();
		toggleCardVisibility();

		function toggleButtonStyle() {
			const buttons = document.querySelectorAll(".filterButton");
			const whiteStyle = "buttonStyleWhite";
			const blueStyle = "buttonStyleBlue";
			buttons.forEach((button) => {
				button.classList.remove(blueStyle);
				button.classList.add(whiteStyle);
			});
			const activeButton = document.querySelector(`[data-filtro="${categoria}"]`);
			if (activeButton) {
				activeButton.classList.remove(whiteStyle);
				activeButton.classList.add(blueStyle);
			}
		}
		function toggleCardVisibility() {
			const cards = document.querySelectorAll(".imageCard");
			cards.forEach((card) => {
				const {categoria: cardCategoria} = card.dataset;
				const sameCategory = categoria === todas || cardCategoria === categoria;
				const hiddenClass = "hidden";
				const visibleClass = "visible";

				if (sameCategory) {
					card.classList.remove(hiddenClass);
					card.classList.add(visibleClass);
					return;
				}

				card.classList.remove(visibleClass);
				card.classList.add(hiddenClass);
			});
		}
	},
	extrairFiltroDaURL() {
		const hash = window.location.hash.substring(1);
		const mapeamento = {
			lajes: this.CATEGORIAS.LAJES,
			marquises: this.CATEGORIAS.MARQUISES,
			caixasdagua: this.CATEGORIAS.CAIXAS_DAGUA,
			tampas: this.CATEGORIAS.TAMPAS,
			todas: this.CATEGORIAS.TODAS,
		};
		const filtroNormalizado = hash.toLowerCase().replace(/'/g, "").replace(/\s+/g, "");

		if (mapeamento[filtroNormalizado]) return mapeamento[filtroNormalizado];
		return null;
	},
	verificarFiltroInicial() {
		const filtro = this.extrairFiltroDaURL();
		if (!filtro) return;

		this.filtrarImagens(filtro);
	},
};
