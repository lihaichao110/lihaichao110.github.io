import * as path from "path";
import * as fs from "fs";
const a = [1, 2];
const b = a[Symbol.iterator]();
/**
 * 动态生成侧边栏函数
 * @param {String} dir 目录路径
 * @param {String} subDir 目录的标题名
 */
export const generateSideBarList = function (dir, subDir = "") {
  const url = path.join(__dirname, dir);
  let childList = [];
  const list = fs.readdirSync(url);
  list.forEach((file) => {
    if (path.extname(file) === ".md") {
      // 类型为文件此操作
      const { name = "" } = path.parse(file);
      const cDir = dir
        .split("")
        .filter((item) => item !== ".")
        .join("");
      const link = `${cDir}/${name}`;
      childList.push({
        text: name,
        link,
      });
    }
  });

  const results = [
    {
      text: subDir,
      collapsed: false,
      items: childList,
    },
  ];

  return results;
};
