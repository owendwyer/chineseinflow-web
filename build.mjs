import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
const webappDir = path.join(root, 'packages/webapp');
const siteDir = path.join(root, 'packages/site');
const distDir = path.join(root, 'dist');
const SITE_URL = 'https://www.chineseinflow.com';

const COMPONENT_NAMES = [
	'top',
	'bottom',
	'footer',
	'navigationbar',
	'styleline',
	'title',
	'bodystart',
];

function escapeHtml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('"', '&quot;')
		.replaceAll('<', '&lt;');
}

function pageUrl(page) {
	return `${SITE_URL}${page.path}`;
}

function renderJsonLd(page) {
	if (page.path === '/') {
		const graph = {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'WebSite',
					name: 'Chinese In Flow',
					url: SITE_URL + '/',
					description: page.description,
					inLanguage: 'en',
				},
				{
					'@type': 'WebApplication',
					name: 'Chinese In Flow',
					url: SITE_URL + '/',
					description: page.description,
					applicationCategory: 'EducationalApplication',
					operatingSystem: 'Web browser',
					offers: {
						'@type': 'Offer',
						price: '0',
						priceCurrency: 'USD',
					},
				},
			],
		};
		return `<script type="application/ld+json">${JSON.stringify(graph)}</script>`;
	}

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: page.title,
		description: page.description,
		url: pageUrl(page),
		isPartOf: {
			'@type': 'WebSite',
			name: 'Chinese In Flow',
			url: SITE_URL + '/',
		},
		inLanguage: 'en',
	};
	return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

function renderSeo(page) {
	let seo = fs.readFileSync(path.join(siteDir, 'components/seo.html'), 'utf8');
	seo = seo.replaceAll('[pageTitle]', escapeHtml(page.title));
	seo = seo.replaceAll('[pageDescription]', escapeHtml(page.description));
	seo = seo.replaceAll('[pageUrl]', pageUrl(page));
	seo = seo.replaceAll('[jsonLd]', renderJsonLd(page));
	return seo;
}

function copyDir(src, dest) {
	fs.mkdirSync(dest, { recursive: true });
	for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
		const srcPath = path.join(src, entry.name);
		const destPath = path.join(dest, entry.name);
		if (entry.isDirectory()) {
			copyDir(srcPath, destPath);
		} else {
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

function copyAssets() {
	console.log('Copying assets to dist/...');
	fs.rmSync(distDir, { recursive: true, force: true });

	copyDir(path.join(webappDir, 'js'), path.join(distDir, 'js'));
	copyDir(path.join(webappDir, 'res'), path.join(distDir, 'res'));
	copyDir(path.join(webappDir, 'fonts'), path.join(distDir, 'fonts'));

	fs.mkdirSync(path.join(distDir, 'css'), { recursive: true });
	fs.copyFileSync(
		path.join(siteDir, 'css/cif.1.2.css'),
		path.join(distDir, 'css/cif.1.2.css')
	);
	fs.copyFileSync(path.join(siteDir, 'favicon.ico'), path.join(distDir, 'favicon.ico'));
	fs.copyFileSync(path.join(root, 'CHANGELOG.md'), path.join(distDir, 'CHANGELOG.md'));
}

function buildSite(version) {
	console.log('Building site pages...');
	const pages = JSON.parse(fs.readFileSync(path.join(siteDir, 'pages.json'), 'utf8'));
	const components = Object.fromEntries(
		COMPONENT_NAMES.map((name) => [
			name,
			fs.readFileSync(path.join(siteDir, 'components', `${name}.html`), 'utf8'),
		])
	);

	for (const page of Object.values(pages)) {
		let html = fs.readFileSync(path.join(siteDir, 'pages', page.htmlSrc), 'utf8');

		for (const [name, content] of Object.entries(components)) {
			html = html.replaceAll(`[${name}]`, content);
		}

		html = html.replaceAll('[seo]', renderSeo(page));
		html = html.replaceAll('[gameVersion]', version);

		const outDir = page.dir ? path.join(distDir, page.dir) : distDir;
		fs.mkdirSync(outDir, { recursive: true });
		fs.writeFileSync(path.join(outDir, 'index.html'), html);
	}
}

function buildSitemap(pages) {
	const today = new Date().toISOString().slice(0, 10);
	const urls = Object.values(pages)
		.map((page) => {
			const priority = page.sitemapPriority || '0.5';
			return `  <url>
    <loc>${pageUrl(page)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
		})
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobots() {
	return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function main() {
	const pages = JSON.parse(fs.readFileSync(path.join(siteDir, 'pages.json'), 'utf8'));
	const webappPkg = JSON.parse(
		fs.readFileSync(path.join(webappDir, 'package.json'), 'utf8')
	);
	const version = webappPkg.version;

	copyAssets();
	buildSite(version);

	fs.writeFileSync(path.join(distDir, 'sitemap.xml'), buildSitemap(pages));
	fs.writeFileSync(path.join(distDir, 'robots.txt'), buildRobots());

	console.log(`Build complete → dist/ (game v${version})`);
}

main();
