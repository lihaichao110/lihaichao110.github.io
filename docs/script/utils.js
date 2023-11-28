// const path = require('path');
// const fs = require('graceful-fs');
import * as path from 'path';
import * as fs from 'fs'
// import fs from 'fs';

// {
// 	text: 'a1',
// 	items: [
// 		{ text: 'a1-1', link: '/A/a1/a1-1' },
// 		{ text: 'a1-2', link: '/A/a1/a1-2' },
// 	],
// },

// 动态生成侧边栏函数
export const walk = function (dir, subDir = '') {
  const url = path.join(__dirname, dir)
	let results = [];
	const list = fs.readdirSync(url);
	list.forEach((file) => {
		if (path.extname(file) === '.md') {
			// 类型为文件此操作
			const { name = '' } = path.parse(file)
			const cDir = dir.split('').filter(item => item !== '.').join('')
			const link = `${cDir}/${name}`
			results.push({
				text: name,
				link
			})
		} else {
			results.push({
				text: file,
				collapsed: false,
				items: walk(`${dir}/${file}`)
			})			
		}
	})
	return results
};
