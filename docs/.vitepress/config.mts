import { defineConfig } from 'vitepress'
import { SideBarMenu } from '../script/clientSidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CodeVortex",
  description: "代码奇迹：引领未来的编程魔法 🚀✨",
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
  ],
  // base: '/base/',
  // assetsDir: 'static',
  // outDir: "./dist",

  cleanUrls: true,
  markdown: {
    lineNumbers: true
  },
  themeConfig: {

    outline: {
      label: '目录'
    },
    logo: '/static/imgs/logo.png',
    lastUpdated: {
      text: '最后更新时间',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      {
        text: '前端 Coding 🚀',
        items: [
          {
            text: '基本功',
            items: [
              { text: 'JavaScript', link: '/client/js/高阶玩法' },
            ]
          },
          {
            text: '框架',
            items: [
              { text: 'GSAP', link: '/client/gsap/gsap使用' },
              { text: 'AntDesign 源码', link: '/client/ant-design/01-Button' },
            ]
          }
        ]
      },
      {
        text: '后端 Coding 💻',
        items: [
          {
            text: '服务',
            items: [
              { text: 'NodeJs', link: '/server/nodejs/01-快速上手' },
              { text: 'Express', link: '/server/express/01-快速上手.md' },
              { text: 'NestJs', link: '/server/nestjs/01-NestJS使用指南' },
              { text: 'MySql', link: '/server/mysql/01-基础用法' },
              { text: 'Go', link: '/server/go/01-快速开始' }
            ]
          },
        ]
      },
      { text: 'offer 指南 🌌', link: '/offer/network/1.http历史' },
    ],

    sidebar: SideBarMenu,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/lihaichao110' },
      {
        icon: {
          svg: '<svg t="1701064687995" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4020" width="200" height="200"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m259.149-568.883h-290.74a25.293 25.293 0 0 0-25.292 25.293l-0.026 63.206c0 13.952 11.315 25.293 25.267 25.293h177.024c13.978 0 25.293 11.315 25.293 25.267v12.646a75.853 75.853 0 0 1-75.853 75.853h-240.23a25.293 25.293 0 0 1-25.267-25.293V417.203a75.853 75.853 0 0 1 75.827-75.853h353.946a25.293 25.293 0 0 0 25.267-25.292l0.077-63.207a25.293 25.293 0 0 0-25.268-25.293H417.152a189.62 189.62 0 0 0-189.62 189.645V771.15c0 13.977 11.316 25.293 25.294 25.293h372.94a170.65 170.65 0 0 0 170.65-170.65V480.384a25.293 25.293 0 0 0-25.293-25.267z" fill="#C71D23" p-id="4021"></path></svg>'
        },
        link: 'https://gitee.com/li-hai-chao/'
      },
      {
        icon: {
          svg: '<svg t="1701064890518" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1555" width="200" height="200"><path d="M0 0m184.32 0l655.36 0q184.32 0 184.32 184.32l0 655.36q0 184.32-184.32 184.32l-655.36 0q-184.32 0-184.32-184.32l0-655.36q0-184.32 184.32-184.32Z" fill="#111111" p-id="1556"></path><path d="M204.27776 670.59712a246.25152 246.25152 0 0 1 245.97504-245.97504v147.57888a98.49856 98.49856 0 0 0-98.38592 98.38592c0 48.34304 26.14272 100.352 83.54816 100.352 3.81952 0 93.55264-0.88064 93.55264-77.19936V134.35904h157.26592a133.31456 133.31456 0 0 0 133.12 132.99712l-0.13312 147.31264a273.152 273.152 0 0 1-142.62272-38.912l-0.06144 317.98272c0 146.00192-124.24192 224.77824-241.14176 224.77824-131.74784 0.03072-231.1168-106.56768-231.1168-247.92064z" fill="#FF4040" p-id="1557"></path><path d="M164.92544 631.23456a246.25152 246.25152 0 0 1 245.97504-245.97504v147.57888a98.49856 98.49856 0 0 0-98.38592 98.38592c0 48.34304 26.14272 100.352 83.54816 100.352 3.81952 0 93.55264-0.88064 93.55264-77.19936V94.99648h157.26592a133.31456 133.31456 0 0 0 133.12 132.99712l-0.13312 147.31264a273.152 273.152 0 0 1-142.62272-38.912l-0.06144 317.98272c0 146.00192-124.24192 224.77824-241.14176 224.77824-131.74784 0.03072-231.1168-106.56768-231.1168-247.92064z" fill="#00F5FF" p-id="1558"></path><path d="M410.91072 427.58144c-158.8224 20.15232-284.44672 222.72-154.112 405.00224 120.40192 98.47808 373.68832 41.20576 380.70272-171.85792l-0.17408-324.1472a280.7296 280.7296 0 0 0 142.88896 38.62528V261.2224a144.98816 144.98816 0 0 1-72.8064-54.82496 135.23968 135.23968 0 0 1-54.70208-72.45824h-123.66848l-0.08192 561.41824c-0.11264 78.46912-130.9696 106.41408-164.18816 30.2592-83.18976-39.77216-64.37888-190.9248 46.31552-192.57344z" fill="#FFFFFF" p-id="1559"></path></svg>'
        },
        link: 'https://www.douyin.com/search/62078908'
      }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present 李海超'
    },
    search: {
      provider: 'local'
    },

  }
})
