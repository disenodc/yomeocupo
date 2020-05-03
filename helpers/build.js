const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const child_process = require('child_process');
const CleanCSS = require('clean-css');
const minify = require('html-minifier').minify;
const SVGO = require('svgo');
const svgo = new SVGO({});
const UglifyJS = require('uglify-js');

const project = require(path.join(process.cwd(),'package.json')).name;
console.log('Building project', project);

try {
    child_process.execSync(`rm -rf ${path.join(process.cwd(),project)}`)
} catch(e) {}
console.log('mkdir',path.join(process.cwd(),project));
fs.mkdirSync(path.join(process.cwd(),project));

const production = (code) => { return code }

const build_hash = (new Date()).getTime();
const image = fileName => `/images/${fileName}?v=${
    crypto
    .createHash('md5')
    .update(fs.readFileSync(path.join(process.cwd(),'src','images',fileName)))
    .digest('hex')
}`;
const js = fileName => `/js/${fileName}?v=${
    crypto
    .createHash('md5')
    .update(fs.readFileSync(path.join(process.cwd(),'src','js',fileName)))
    .digest('hex')
}`;
const vendor = fileName => `/js/${fileName}?v=${
    crypto
    .createHash('md5')
    .update(fs.readFileSync(path.join(process.cwd(),'vendor',fileName)))
    .digest('hex')
}`;
const reload = '';

const copyRecursive = (folder) => {
    const files = fs.readdirSync(path.join(process.cwd(),'src',folder));
    files.forEach( file => {
        const stats = fs.statSync(path.join(process.cwd(),'src',folder,file));
        if (stats.isDirectory()) {
            if (!fs.existsSync(path.join(process.cwd(),project,folder,file))) {
                console.log('mkdir',path.join(process.cwd(),project,folder,file));
                fs.mkdirSync(path.join(process.cwd(),project,folder,file));
            }
            copyRecursive(`${folder}/${file}`);
        } else {
            switch (path.extname(path.join(process.cwd(),project,folder,file))) {
                case '.css':
                    console.log('CleanCSS', path.join(process.cwd(),project,folder,file));
                    const css = new CleanCSS({level: 2}).minify(fs.readFileSync(path.join(process.cwd(),'src',folder,file)));
                    if (css.errors.length) {
                        console.error('ERRORS:',css.errors);
                    }
                    if (css.warnings.length) {
                        console.log('WARNINGS:',css.warnings);
                    }
                    fs.writeFileSync(path.join(process.cwd(),project,folder,file),css.styles);
                    break;
                case '.js':
                    console.log('UglifyJS', path.join(process.cwd(),project,folder,file));
                    const jsc = UglifyJS.minify(" \n" + fs.readFileSync(path.join(process.cwd(),'src',folder,file)), {
                        warnings: true
                    });
                    if (jsc.error) {
                        console.error('ERRORS:',jsc.error);
                    }
                    if (jsc.warning) {
                        console.log('WARNINGS:',jsc.warning);
                    }
                    fs.writeFileSync(path.join(process.cwd(),project,folder,file),jsc.code);
                    break;
                case '.svg':
                    console.log('Svgo', path.join(process.cwd(),project,folder,file));
                    svgo.optimize(fs.readFileSync(path.join(process.cwd(),'src',folder,file)), { path: path.join(process.cwd(),'src',folder,file) }).then((result) => {
                        fs.writeFileSync(path.join(process.cwd(),project,folder,file),result.data);
                    });
                    break;
                case '.html':
                case '.xml':
                    console.log('Eval', path.join(process.cwd(),project,folder,file));
                    const tpl = minify(eval('`' + fs.readFileSync(path.join(process.cwd(),'src',file)) + '`'),{
                        collapseWhitespace: true,
                        removeComments: true,
                        removeOptionalTags: true,
                        removeRedundantAttributes: true,
                        removeScriptTypeAttributes: true,
                        removeTagWhitespace: true,
                        minifyCss: true,
                        minifyJs: true
                    });
                    fs.writeFileSync(path.join(process.cwd(),project,folder,file),tpl);
                    break;
                case '.webmanifest':
                    console.log('Manifest', path.join(process.cwd(),project,folder,file));
                    const manifest = JSON.parse(eval('`' + fs.readFileSync(path.join(process.cwd(),'src',file)) + '`'));
                    fs.writeFileSync(path.join(process.cwd(),project,folder,file),JSON.stringify(manifest));
                    break;
                case '.raw':
                        console.log('Copying', path.join(process.cwd(),project,folder,file.replace('.raw','')));
                        fs.copyFileSync(path.join(process.cwd(),'src',folder,file),path.join(process.cwd(),project,folder,file.replace('.raw','')));
                    break;
                default:
                    console.log('Copying', path.join(process.cwd(),project,folder,file));
                    fs.copyFileSync(path.join(process.cwd(),'src',folder,file),path.join(process.cwd(),project,folder,file));
            }
            
        }
    })
}

copyRecursive('');

const files = fs.readdirSync(path.join(process.cwd(),'vendor'));
files.forEach( file => {
    console.log('Copying', path.join(process.cwd(),project,'js',file));
    fs.copyFileSync(path.join(process.cwd(),'vendor',file),path.join(process.cwd(),project,'js',file));
})
