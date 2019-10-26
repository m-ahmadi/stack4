const { relative } = require('path');
const { writeFileSync } = require('fs');

const temps = ''+
'<script src="{{root}}js/_templates.js"></script>\n'+
'<script src="{{root}}js/_partials.js"></script>\n';

const modulepreloadPlugin = {
	name: 'modulepreload',
	generateBundle(options, bundle) {
		const paths = Object.keys(bundle['main.tmp.js'].modules).map( i => relative('./public', i).replace(/\\/g, '/') );
		const modulepreloads = paths.map(i => `<link rel="modulepreload" href="{{root}}${i}" />`).join('\n');
		const app = paths.map(i => `<script type="module" src="{{root}}${i}"></script>`).join('\n');
		writeFileSync('./html/link-modulepreload/main.handlebars', modulepreloads);
		writeFileSync('./html/script-app/main.handlebars', temps + app);
		delete bundle['main.tmp.js']; // prevent creation of bundle
	}
};

export default {
  input: 'public/js/main.js',
  output: {
		file: 'public/js/main.tmp.js',
    format: 'esm'
  },
	plugins: [ modulepreloadPlugin ]
}