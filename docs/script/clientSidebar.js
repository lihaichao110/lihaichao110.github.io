import {walk} from "./utils";

// 首页模块
const homeDir = '../home/toolbox';
export const homeSidebar = walk(homeDir,'零零碎碎');

// javascript模块
const jsDir = '../client/js';
export const jsSidebar = walk(jsDir,'JavaScript');

// gsap模块
const gsapDir = '../client/gsap';
export const gsapSidebar = walk(gsapDir,'GSAP');

// offer-网络
const networkDir = '../offer/network'
export const networkSidebar = walk(networkDir,'网络')

// nodejs
const nodejsDir = '../server/nodejs';
export const nodejsSidebar = walk(nodejsDir,'NodeJs')

// nestjs
const nestjsDir = '../server/nestjs';
export const nestjsSidebar = walk(nestjsDir,'NestJs');
