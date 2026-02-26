"use strict";

document.addEventListener("DOMContentLoaded", async () => {
	await loadData();
	meta.onLoad();
});

const meta = {
	onLoad() {
		this.createAll();
		helper.scrollToHash();
	},
	createAll() {
		persistentWhatsapp.build();
		siteHeader.createAll();
		build.mainContainer();
		sidebarMenu.createAll();

		intro.createAll();
		sistemas.createAll();
		locaisDeAplicacao.createAll();
		tampas.createAll();
		laudosTecnicos.createAll();

		siteFooter.createAll();
		eventListeners.createInitial();
	},
};

const intro = {
	createAll() {
		this.createSection();
		this.createImage();
		this.createContent();
	},
	createSection() {
		const divId = "solucoesIntro";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createImage() {
		const parent = document.getElementById("solucoesIntroContainer");
		const container = document.createElement("div");
		container.classList.add("introImgContainer", "imgFilter", "imgFilterSmall", "solucoesImageContainer");

		parent.append(container);

		const img = build.img(imageLibrary.solucoes.intro);
		container.append(img);
	},
	createContent() {
		const parent = document.getElementById("solucoesIntroContainer");
		const container = document.createElement("div");
		container.classList.add("introTextContainer", "solucoesTextContainer");

		const {header, subheader} = textLibrary.solucoes.intro;
		const h1 = build.h1(header);
		const h2 = build.h2(subheader);
		container.append(h1, h2);
		parent.append(container);
	},
};

const sistemas = {
	createAll() {
		this.createSection();
		this.createCards();
	},
	createSection() {
		const divId = "sistemas";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createCards() {
		const container = document.getElementById("sistemasContainer");
		const {header, content} = textLibrary.solucoes.sistemasImpermeabilizantes;
		const h2 = build.h2(header);

		const frag = document.createDocumentFragment();
		const cardContainer = document.createElement("div");
		cardContainer.classList.add("sistemasCardContainer");
		for (const {header, text, span: spanText, spanLink, icon} of content) {
			const card = document.createElement("div");
			card.classList.add("boxShadow");

			const subheaderContainer = document.createElement("div");
			const img = build.img(icon);
			const h3 = build.h3(header);
			subheaderContainer.append(img, h3);

			const p = build.p(text);
			const a = build.a(spanText, null, spanLink);
			p.append(a);

			card.append(subheaderContainer, p);
			cardContainer.append(card);
			frag.append(cardContainer);
		}
		container.append(h2, frag);
	},
};

const locaisDeAplicacao = {
	createAll() {
		this.createSection();
		this.createCards();
	},
	createSection() {
		const divId = "locaisDeAplicacao";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createCards() {
		const container = document.getElementById("locaisDeAplicacaoContainer");
		const {header, subheader, content} = textLibrary.solucoes.locaisDeAplicacao;
		const h2 = build.h2(header);
		const h4 = build.h4(subheader);

		const frag = document.createDocumentFragment();
		const cardContainer = document.createElement("div");
		cardContainer.classList.add("locaisDeAplicacaoCardContainer");
		for (const {header, subheader, text, icon} of content) {
			const card = document.createElement("div");
			card.classList.add("locaisDeAplicacaoCard");

			const container = document.createElement("div");
			const img = build.img(icon);
			const h2 = build.h2(header);
			container.append(img, h2);
			const p = build.p(text);

			const h3 = build.h3(subheader);
			card.append(container, h3, p);
			cardContainer.append(card);
			frag.append(cardContainer);
		}
		container.append(h4, h2, frag);
	},
};

const tampas = {
	createAll() {
		this.createSection();
		this.createContent();
	},
	createSection() {
		const divId = "tampas";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createContent() {
		const container = document.getElementById("tampasContainer");
		const {
			image,
			header,
			subheader,
			text,
			textList,
			button: {text: buttonText, link},
		} = textLibrary.solucoes.tampas;

		const img = build.img(image);
		img.classList.add("boxShadow");

		const textContainer = document.createElement("div");
		const h3 = build.h3(subheader);
		const h2 = build.h2(header);
		const p = build.p(text);
		const list = build.textList(iconLibrary.internal.check, textList);
		const a = build.a(buttonText, null, link);
		a.classList.add("buttonStyleBlue");

		textContainer.append(h3, h2, p, list, a);

		container.append(img, textContainer);
	},
};

const laudosTecnicos = {
	createAll() {
		this.createSection();
		this.createHeader();
		this.createLaudos();
		this.createVantagens();
	},
	createSection() {
		const divId = "laudosTecnicos";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createHeader() {
		const parent = document.getElementById("laudosTecnicosContainer");
		const {header} = textLibrary.solucoes.laudosTecnicos.top;
		const h2 = build.h2(header);
		parent.append(h2);
	},
	createLaudos() {
		const parent = document.getElementById("laudosTecnicosContainer");
		const container = document.createElement("div");
		container.classList.add("laudosCardContainer");
		parent.append(container);

		const {content} = textLibrary.solucoes.laudosTecnicos.top;
		for (const {header, subheader, text} of content) {
			const card = document.createElement("div");
			card.classList.add("laudosCard", "boxShadow");
			const headerContainer = document.createElement("div");
			const h2 = build.h2(header);
			const h3 = build.h3(subheader);
			headerContainer.append(h2, h3);

			const p = build.p(text);
			card.append(headerContainer, p);
			container.append(card);
		}
	},
	createVantagens() {
		const parent = document.getElementById("laudosTecnicosContainer");
		const container = document.createElement("div");
		container.classList.add("vantagensContainer");
		parent.append(container);

		const content = textLibrary.solucoes.laudosTecnicos.bottom;
		for (const {header, text} of content) {
			const card = document.createElement("div");
			const h3 = build.h3(header);
			const img = iconLibrary.internal.check;
			const textList = build.textList(img, text);

			card.append(h3, textList);
			container.append(card);
		}
	},
};
