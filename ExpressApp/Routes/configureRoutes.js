const path = require('path');

const angular1SinglePage = path.join(__dirname, '../../', 'Build', 'Angular1', 'index.html');
const buildDirectory = path.join(__dirname, '../../', 'Build');
const commonDirectory = path.join(buildDirectory, 'Common');

module.exports = app => {
    
    app.get('/Angular1/*.txt', (req, res) => {
        let filename = path.basename(req.url);
       res.sendFile(path.join(commonDirectory, filename)); 
    });
    
    app.get('/Angular1/css/*.css', (req, res) => {
        let filename = path.basename(req.url);
       res.sendFile(path.join(commonDirectory, 'css', filename)); 
    });
    
    app.get('/Angular1/js/app.min.js', (req, res) => {
       res.sendFile(path.join(buildDirectory, 'Angular1', 'js', 'app.min.js'));               
    });
    
    app.get('/Angular1*', (req, res) => {
        res.sendFile(angular1SinglePage);
    });
    
    
};