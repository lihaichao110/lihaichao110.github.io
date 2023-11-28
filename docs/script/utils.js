import * as path from 'path';
import * as fs from 'fs'

// 动态生成侧边栏函数
export const walk = function (dir, subDir = '') {
  const url = path.join(__dirname, dir)
	let childList = [];
	const list = fs.readdirSync(url);
	list.forEach((file) => {
		if (path.extname(file) === '.md') {
			// 类型为文件此操作
			const { name = '' } = path.parse(file)
			const cDir = dir.split('').filter(item => item !== '.').join('')
			const link = `${cDir}/${name}`
			childList.push({
				text: name,
				link
			})
		} 
		// else {
		// 	results.push({
		// 		text: file,
		// 		collapsed: false,
		// 		items: walk(`${dir}/${file}`)
		// 	})			
		// }
	})

	const results = [
		{
			text: subDir,
			collapsed: false,
			items: childList
		}
	]

	return results
};
