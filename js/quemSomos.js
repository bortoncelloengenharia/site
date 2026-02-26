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

		quemSomos.createAll();
		premios.createAll();
		nossosLideres.createAll();

		siteFooter.createAll();
		eventListeners.createInitial();
	},
};

const quemSomos = {
	createAll() {
		this.createSection();
		this.createImg();
		this.createContent();
	},
	createSection() {
		const divId = "quemSomos";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createImg() {
		const container = document.getElementById("quemSomosContainer");
		const image = imageLibrary.quemSomos.quemSomos;
		const img = build.img(image);
		img.classList.add("boxShadow");

		container.append(img);
	},
	createContent() {
		const container = document.getElementById("quemSomosContainer");

		const contentContainer = document.createElement("div");
		const {header, text} = textLibrary.quemSomos.quemSomos;
		const h2 = build.h2(header);

		const frag = document.createDocumentFragment();
		for (const paragraph of text) {
			const p = build.p(paragraph);
			frag.append(p);
		}

		contentContainer.append(h2, frag);
		container.append(contentContainer);
	},
};

const premios = {
	createAll() {
		this.createSection();
		this.createTopContent();
		this.createBottomContent();
	},
	createSection() {
		const divId = "premios";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createTopContent() {
		const container = document.getElementById("premiosContainer");
		const content = textLibrary.quemSomos.premios.top;

		const topContainer = document.createElement("div");
		topContainer.classList.add("premiosContainerTop");
		const frag = document.createDocumentFragment();
		for (const {header, text, icon} of content) {
			const innerContainer = document.createElement("div");
			const img = build.img(icon);
			const h3 = build.h3(header);
			const p = build.p(text);
			innerContainer.append(img, h3, p);
			frag.append(innerContainer);
		}
		topContainer.append(frag);
		container.append(topContainer);
	},
	createBottomContent() {
		const container = document.getElementById("premiosContainer");
		const content = textLibrary.quemSomos.premios.bottom;

		const bottomContainer = document.createElement("div");
		bottomContainer.classList.add("premiosContainerBottom");
		const frag = document.createDocumentFragment();
		for (const {header, text, textList} of content) {
			const innerContainer = document.createElement("div");
			const h3 = build.h3(header);

			const isSimpleText = text ? true : false;
			const content = isSimpleText ? build.p(text) : build.textList(iconLibrary.internal.checkBranco, textList);
			if (!isSimpleText) content.classList.add("textListContainer", "whiteText");

			innerContainer.append(h3, content);
			frag.append(innerContainer);
		}
		bottomContainer.append(frag);
		container.append(bottomContainer);
	},
};

const nossosLideres = {
	createAll() {
		this.createSection();
		this.createCards();
	},
	createSection() {
		const divId = "nossosLideres";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createCards() {
		const container = document.getElementById("nossosLideresContainer");
		const content = textLibrary.quemSomos.nossosLideres;

		const frag = document.createDocumentFragment();
		for (const {header, subheader, text, image} of content) {
			const innerContainer = document.createElement("div");
			innerContainer.classList.add("boxShadow");
			const img = build.img(image);
			const h2 = build.h2(header);
			const h3 = build.h3(subheader);
			const p = build.p(text);

			innerContainer.append(img, h2, h3, p);
			frag.append(innerContainer);
		}
		container.append(frag);
	},
};
