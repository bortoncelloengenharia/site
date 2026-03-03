const fs = require("fs");
const path = require("path");

const pastaProjetos = path.join(__dirname, "../data/galeriaDeImagens");
const arquivoSaida = path.join(__dirname, "../data/galeriaDeImagens.json");
const projetosConvertidos = {
	lajes: [],
	caixasDagua: [],
	marquises: [],
	tampas: [],
	outros: [],
};

if (!fs.existsSync(pastaProjetos)) {
	console.log("❌ Pasta ../data/galeriaDeImagens não encontrada em:", pastaProjetos);
	process.exit(0);
}

const arquivos = fs.readdirSync(pastaProjetos).filter((arquivo) => arquivo.endsWith(".md"));

console.log(`📁 Encontrados ${arquivos.length} arquivos .md`);

arquivos.forEach((arquivo, index) => {
	console.log(`\n📄 Processando: ${arquivo}`);

	const caminhoCompleto = path.join(pastaProjetos, arquivo);
	const conteudo = fs.readFileSync(caminhoCompleto, "utf8");

	console.log(`📝 Conteúdo bruto:\n${conteudo}`);

	const frontmatterRegex = /^---\s*\n([\s\S]*?)\n\s*---/;
	const match = conteudo.match(frontmatterRegex);

	if (!match) {
		console.log(`❌ Arquivo ${arquivo} não tem frontmatter válido`);
		return;
	}

	const frontmatter = match[1];
	console.log(`📋 Frontmatter extraído:\n${frontmatter}`);

	// CONVERTER YAML PARA OBJETO
	const projeto = {};

	frontmatter.split("\n").forEach((linha) => {
		// IGNORAR LINHAS VAZIAS
		if (!linha.trim()) return;

		// ENCONTRAR PRIMEIRO ":" PARA SEPARAR CHAVE/VALOR
		const colonIndex = linha.indexOf(":");
		if (colonIndex === -1) return;

		const chave = linha.slice(0, colonIndex).trim();
		let valor = linha.slice(colonIndex + 1).trim();

		// REMOVER ASPAS
		valor = valor.replace(/^["']|["']$/g, "");

		projeto[chave] = valor;
		console.log(`  🔑 ${chave}: ${valor}`);
	});

	// VERIFICAR CAMPOS OBRIGATÓRIOS
	if (!projeto.categoria || !projeto.antes || !projeto.depois) {
		console.log(`❌ Arquivo ${arquivo} não tem campos obrigatórios`);
		console.log("   categoria:", projeto.categoria);
		console.log("   antes:", projeto.antes);
		console.log("   depois:", projeto.depois);
		return;
	}

	// CRIAR OBJETO NO FORMATO DO JSON
	const itemProjeto = {
		antes: {
			src: projeto.antes,
			alt: projeto.alt_antes || `Imagem de ${projeto.categoria} antes`,
		},
		depois: {
			src: projeto.depois,
			alt: projeto.alt_depois || `Imagem de ${projeto.categoria} depois`,
		},
		ordem: parseInt(projeto.ordem) || 99,
	};

	// ADICIONAR À CATEGORIA CORRETA
	if (projetosConvertidos[projeto.categoria]) {
		projetosConvertidos[projeto.categoria].push(itemProjeto);
		console.log(`✅ Adicionado à categoria: ${projeto.categoria}`);
	} else {
		console.log(`⚠️ Categoria desconhecida: ${projeto.categoria}`);
	}
});

// ORDENAR POR ORDEM
Object.keys(projetosConvertidos).forEach((categoria) => {
	projetosConvertidos[categoria].sort((a, b) => a.ordem - b.ordem);
	console.log(`\n📊 ${categoria}: ${projetosConvertidos[categoria].length} projetos`);
});

// SALVAR JSON
fs.writeFileSync(arquivoSaida, JSON.stringify(projetosConvertidos, null, 2));
console.log(`\n✅ Arquivo ${arquivoSaida} gerado com sucesso!`);
