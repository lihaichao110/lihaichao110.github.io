import { generateSideBarList } from "./utils";

/** 侧边栏对应的目录 */
export const SideBarMenu = {
  // 首页模块
  '/home/toolbox': generateSideBarList('../home/toolbox','零零碎碎'),
  // javascript模块
  '/client/js': generateSideBarList('../client/js','JavaScript'),
  // gsap模块
  '/client/gsap': generateSideBarList('../client/gsap','GSAP'),
  // AntDesign 源码
  '/client/ant-design': generateSideBarList('../client/ant-design','AntDesign 源码'),
  // offer-网络
  '/offer/network': generateSideBarList('../offer/network','网络'),
  // nodejs
  '/server/nodejs': generateSideBarList('../server/nodejs','NodeJs'),
  // express
  '/server/express': generateSideBarList('../server/express','Express'),
  // nestjs
  '/server/nestjs': generateSideBarList('../server/nestjs','NestJs'),
  // mysql
  '/server/mysql': generateSideBarList('../server/mysql','MySql'),
}