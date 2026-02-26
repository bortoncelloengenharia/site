"use strict";

window.iconLibrary = {};
window.imageLibrary = {};
window.linkLibrary = {};
window.contactLibrary = {};
window.textLibrary = {};

async function loadData() {
	const [icons, images, imageGalery, links, contacts, texts] = await Promise.all([
		fetch("data/icon.json").then((response) => response.json()),
		fetch("data/image.json").then((response) => response.json()),
		fetch("data/galeriaDeImagens.json").then((response) => response.json()),
		fetch("data/link.json").then((response) => response.json()),
		fetch("data/contact.json").then((response) => response.json()),
		fetch("data/text.json").then((response) => response.json()),
	]);

	iconLibrary = resolver.resolveDeep(icons);
	imageLibrary = resolver.resolveDeep(images);
	imageLibrary.imagens = resolver.resolveDeep(imageGalery);
	linkLibrary = resolver.resolveDeep(links);
	contactLibrary = resolver.resolveDeep(contacts);
	textLibrary = resolver.resolveDeep(texts);
}

/* 
O resolver é uma função para transformar $ref {link} que vêm do JSON em referências reais.
Objeto criado com ajuda de GenAI.
 */
const resolver = {
	refRoots: {
		linkLibrary: () => window.linkLibrary,
		iconLibrary: () => window.iconLibrary,
		imageLibrary: () => window.imageLibrary,
		contactLibrary: () => window.contactLibrary,
		textLibrary: () => window.textLibrary,
	},
	resolveDeep(value, path = "") {
		const isObject = value && typeof value === "object";
		const isArray = Array.isArray(value);

		// array
		if (isArray) return value.map((v, i) => this.resolveDeep(v, `${path}[${i}]`));

		// objeto com $ref (com ou sem modificadores)
		if (isObject && "$ref" in value) return this.resolveRefObject(value, path);

		// objeto genérico
		if (isObject) {
			return Object.fromEntries(
				Object.entries(value).map(([k, v]) => [k, this.resolveDeep(v, path ? `${path}.${k}` : k)]),
			);
		}

		// primitivo
		return value;
	},
	resolveRef(path) {
		const [rootKey, ...rest] = path.split(".");
		const root = this.refRoots[rootKey]?.();

		if (!root) throw new Error(`Ref root inválido: ${rootKey}`);

		return rest.reduce((acc, key) => {
			if (acc == null) throw new Error(`Caminho inválido em $ref: ${path}`);
			return acc[key];
		}, root);
	},
	resolveRefObject(object, path) {
		const base = this.resolveRef(object.$ref);

		// Se não houver modificadores, retorna o valor direto
		const hasModifiers = "hash" in object || "query" in object;
		if (!hasModifiers) return base;

		// A partir daqui, exige string
		if (typeof base !== "string") throw new Error(`$ref com modificadores precisa resolver para string em ${path}`);

		let result = base;
		if (object.hash) {
			result += `#${object.hash}`;
		}

		return result;
	},
};
