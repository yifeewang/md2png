#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require("inquirer");
const md2Png = require("../lib/index");
const pkg = require("../package.json");

// program
//   .version(pkg.version)
//   .usage("<input output command>")
//   .option('-o, --output <output>', '请输入md文件输出路径')
//   .option('-w, --width <width>', '请输入生成图片宽度')
//   .parse(process.argv) || program.help()

// const options = program.opts();

inquirer.prompt([
    { type: 'input', name: 'input', message: 'md路径' },
    { type: 'input', name: 'output', message: '输出图片路径' },
    { type: 'input', name: 'outputname', message: '输出图片名称' },
    { type: 'number', name: 'width', message: 'Image width' },
  ]).then(answer => {

    const {input, output, width, outputname} = answer

    md2Png({input, output, width, outputname}) // 调用模块实现功能
  })
