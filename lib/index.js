const puppeteer = require("puppeteer");
const marked = require("marked");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const html = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://unpkg.com/github-markdown-css">
    <style>
        .markdown-body {
            color: red;
            width: 90%;
            max-width: 700px;
            margin: 0 auto;
        }
    </style>
</head>

<body class="markdown-body">
    {{fragment}}
</body>

</html>`

// 递归创建目录 同步方法
const mkdirsSync = (dirname) => {
    if (fs.existsSync(dirname)) {
      return true;
    }
  
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
}
module.exports = ({input, output, outputname, width}) => {
    if(typeof input !== 'string') {
        return new Error('input must be file path');
    }
    const filename= path.resolve(input);
    const outputpath= path.resolve(output);

    if(!fs.existsSync(filename)) {
        return new Error('this file is not exist!');
    }
    const stat = fs.statSync(filename);
    if(stat.isDirectory()) {
        return new Error('this md_path is a dir and not a file!');
    }
    let handleoutputName  = outputname;
    const extname = path.extname(handleoutputName);
    if(!extname) {
        handleoutputName = handleoutputName + '.png'
    } else {
        handleoutputName = ['.png', '.jpeg', '.jpg', '.webp'].includes(extname) ? handleoutputName : (path.basename(handleoutputName) + '.png')
    }
    console.log(111, handleoutputName)
    mkdirsSync(outputpath);
    const markdown = fs.readFileSync(filename, 'utf-8');

    const parsemarkdown = marked.parse(markdown);
    const parsehtml = html.replace('{{fragment}}', parsemarkdown);

    (async () => {
        console.log(`${chalk.blue('准备开启无头浏览器 ...')}`)
        const browser = await puppeteer.launch();
        console.log(`${chalk.yellow('无头浏览器已开启 🌟🌟🌟🌟')}`)
        console.log(`${chalk.blue('等待页面启动 ...')}`)
        const page = await browser.newPage();
        console.log(`${chalk.yellow('新页面已开启 🌟🌟🌟🌟')}`)
        console.log(`${chalk.blue('等待图片生成 ...')}`)
        await page.setViewport({width, height: 100});
        await page.setContent(parsehtml);
        await page.screenshot({path: path.join(outputpath, handleoutputName), fullPage: true});
        console.log(`${chalk.yellow('图片已生成 🌟🌟🌟🌟')}`)
        await browser.close();
       })();
}
