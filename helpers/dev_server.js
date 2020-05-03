const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const express = require('express');
const app = express();
const reload = require('reload');

app.set('port', process.env.PORT || 3000)

const server = http.createServer(app)

reload(app).then(reloadReturned => {
    app.get('*', (req, res) => {
        console.log('GET ' + req.url);
        let file = req.url.split('?')[0];
        if (file === '/') {
            file = 'index.html';
        }
        if (fs.existsSync(path.join(process.cwd(),'src', file + '.html'))) {
            file = file + '.html';
        }
        if (file.indexOf('/vendor') === 0) {
            res.sendFile(path.join(process.cwd(),file));
        } else {
            if (fs.existsSync(path.join(process.cwd(),'src',file))) {
                switch (path.extname(path.join(process.cwd(),'src',file))) {
                    case '.html':
                    case '.xml':
                    case '.webmanifest':
                        const production = (code) => { return '' }
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
                        const vendor = fileName => `/vendor/${fileName}?v=${
                            crypto
                            .createHash('md5')
                            .update(fs.readFileSync(path.join(process.cwd(),'vendor',fileName)))
                            .digest('hex')
                        }`;
                        const reload = '<script src="/reload/reload.js"></script>';
                        let tpl = eval('`' + fs.readFileSync(path.join(process.cwd(),'src',file)) + '`');
                        res.send(tpl);
                        break;
                    default:
                        res.sendFile(path.join(process.cwd(),'src',file));
                }
            } else {
                res.sendStatus(404);
            }
        }
    });
    
    fs.watch(path.join(process.cwd(),'src'), { recursive: true }, () => {
        console.log('RELOADING');
        reloadReturned.reload();
    });
    server.listen(app.get('port'), () => {
      console.log('Web server listening on port ' + app.get('port'))
    })
  }).catch(function (err) {
    console.error('Reload could not start, could not start server/sample app', err)
  })