import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));
const webappDir = path.join(root, 'packages/webapp');
const siteDir = path.join(root, 'packages/site');
const distDir = path.join(root, 'dist');

const COMPONENT_NAMES = [
	'top',
	'bottom',
	'footer',
	'navigationbar',
	'styleline',
	'title',
	'bodystart',
];

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
		path.join(siteDir, 'css/cif.1.1.css'),
		path.join(distDir, 'css/cif.1.1.css')
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

		html = html.replaceAll('[gameVersion]', version);

		const outDir = page.dir ? path.join(distDir, page.dir) : distDir;
		fs.mkdirSync(outDir, { recursive: true });
		fs.writeFileSync(path.join(outDir, 'index.html'), html);
	}
}

function main() {
	const webappPkg = JSON.parse(
		fs.readFileSync(path.join(webappDir, 'package.json'), 'utf8')
	);
	const version = webappPkg.version;

	copyAssets();
	buildSite(version);

	console.log(`Build complete → dist/ (game v${version})`);
}

main();
