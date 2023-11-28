import {walk} from "./utils";

// 前端模块
const webDir = '../client';
export const clientSidebar = walk(webDir,'js');

// offer 指南
const offerDir = '../offer'
export const offerSidebar = walk(offerDir,'js')

// 服务端
const serverDir = '../server';
export const serverSidebar = walk(serverDir,'js')
