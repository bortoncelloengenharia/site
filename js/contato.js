"use strict";

document.addEventListener("DOMContentLoaded", async () => {
	await loadData();
	meta.onLoad();
	emailJS.init();
	emailJS.onLoad();
});

const emailJS = {
	api: {
		publicKey: "mDrWsV-2nlFChx4PF",
		service: "service_hoh4533",
		template: "template_2bmoozl",
	},
	init() {
		emailjs.init({publicKey: this.api.publicKey});
	},
	onLoad() {
		document.getElementById("contactForm").addEventListener("submit", function (event) {
			event.preventDefault();
			const {service, template} = emailJS.api;
			emailjs.sendForm(service, template, this).then(
				() => {
					faleConosco.emailSuccess();
				},
				(error) => {
					faleConosco.emailFailure();
					console.log(error);
				},
			);
		});
	},
};

const meta = {
	onLoad() {
		this.createAll();
	},
	createAll() {
		persistentWhatsapp.build();
		siteHeader.createAll();
		build.mainContainer();
		sidebarMenu.createAll();

		intro.createAll();
		faleConosco.createAll();
		googleMaps.createAll();

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

		const img = build.img(imageLibrary.contato.intro);
		container.append(img);
	},
	createContent() {
		const parent = document.getElementById("solucoesIntroContainer");
		const container = document.createElement("div");
		container.classList.add("introTextContainer", "solucoesTextContainer");

		const {header, subheader} = textLibrary.contato.intro;
		const h1 = build.h1(header);
		const h2 = build.h2(subheader);
		container.append(h1, h2);
		parent.append(container);
	},
};

const faleConosco = {
	createAll() {
		this.createSection();
		this.createInfo();
		this.createForm();
	},
	createSection() {
		const divId = "faleConosco";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createInfo() {
		const parent = document.getElementById("faleConoscoContainer");
		const container = document.createElement("div");
		const {header, smallHeader, content} = textLibrary.contato.faleConosco;
		const h4 = build.h4(smallHeader);
		const h3 = build.h2(header);
		container.append(h4, h3);

		for (const {
			header,
			subheader: {text: subText, link: subLink},
			text,
			link,
		} of content) {
			const card = document.createElement("div");
			const h3 = build.h3(header);
			const a = build.a(subText, null, subLink);
			const p = build.p(text);
			card.classList.add("contactCard");
			card.append(h3, a, p);
			container.append(card);
		}

		parent.append(container);
	},
	createForm() {
		const parent = document.getElementById("faleConoscoContainer");
		const container = document.createElement("form");
		container.id = "contactForm";
		container.classList.add("contactForm", "boxShadow");
		parent.append(container);

		const {campos, sendButton} = textLibrary.contato.formulário;
		const frag = document.createDocumentFragment();
		for (const {label, id, name, placeholder, type, required, minLength, maxLength, pattern, title} of campos) {
			const labelContainer = document.createElement("div");
			labelContainer.classList.add("formGroup");
			const labelElement = build.label(label);

			const isInput = label !== "Mensagem *";

			const element = isInput ? build.input() : build.textArea();
			!isInput && element.classList.add("messageInput");
			const atributos = {id, name, placeholder, type, required, minLength, maxLength, pattern, title};
			Object.entries(atributos).forEach(([key, value]) => {
				if (!value) return;
				element[key] = value;
			});

			labelContainer.append(labelElement, element);
			frag.append(labelContainer);
		}

		const button = build.button(sendButton.text);
		button.classList.add("buttonStyleBlue");
		button.type = "submit";

		container.append(frag, button);
	},
	emailSuccess() {
		this.createPopup();
		this.popupContent();
		this.clearFormContent();
	},
	emailFailure() {
		this.createPopup();
		this.popupContent(false);
	},
	clearFormContent() {
		document.querySelector("form").reset();
	},
	createPopup() {
		const parent = document.querySelector("body");
		const container = document.createElement("div");
		container.classList.add("emailPopup", "boxShadow");

		const closeButton = build.closeButton();
		closeButton.classList.add("closeButton");
		closeButton.addEventListener("click", () => faleConosco.removePopUp());

		container.append(closeButton);
		parent.append(container);

		this.toggleMainScreenFilter();
	},
	removePopUp() {
		const container = document.querySelector(".emailPopup");
		container.remove();
		this.toggleMainScreenFilter();
	},
	toggleMainScreenFilter() {
		const mainScreen = document.getElementById("body");
		mainScreen.classList.toggle("bodyBefore");
	},
	popupContent(submitSuccessful = true) {
		const container = document.querySelector(".emailPopup");
		const {success, failure} = textLibrary.contato.emailPopup;

		const {header, text, icon} = submitSuccessful === true ? success : failure;
		const img = build.img(icon);
		const h2 = build.h2(header);
		const p = build.p(text);

		container.append(img, h2, p);
	},
};

const googleMaps = {
	createAll() {
		this.createSection();
		this.createMap();
	},
	createSection() {
		const divId = "googleMaps";
		const div = build.sectionDiv(divId);
		div.classList.add(divId);
	},
	createMap() {
		const parent = document.getElementById("googleMapsContainer");
		const iframe = document.createElement("iframe");
		const link = linkLibrary.external.googleMapsEmbed;
		iframe.src = link;
		iframe.classList.add("embeddedMap");
		parent.append(iframe);
	},
};
