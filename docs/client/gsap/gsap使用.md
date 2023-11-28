# gsap
## 安装方法
```bash
或 npm install gsap
或 yarn add gsap
```

## 使用方法
```js
import gsap from 'gsap'

// 当前元素，设置从哪里来
gsap.from('.box',
  { 
    y: 100,
    duration: 2,
    opacity: 0
  }
)

// 设置到哪里去
gsap.to('.box', {
  x: 500,
  duration: 2
})

// 从哪里到哪里
gsap.fromTo(
  { x: 500, duration: 2 }, 
  { x: 0 }
)
```

## 时间线使用方法
```js
// 可以设置多个元素的执行时机
const t = gsap.timeline()
// 第三个参数数字。简单理解，1秒后执行
t.to('.box3', { x: 100, duration: 2 }, 1)
// 第三个参数 < 符号。简单理解，上个动画开始，我也开始，默认是 > 上一个执行完我在执行。
t.to('.box1', { x: 200, duration: 2 }, '<')
// 第三个参数 +=1。简单理解，上个动画执行完后 +=1 秒后，我在开始。
t.to('.box2', { x: 300, duration: 2 }, '+=1')
// 第三个参数 -=1。简单理解，上个动画结束前 -=1 秒后，我在开始。
// t.to('.box2', { x: 300, duration: 2 }, '-=1')
t.addLabel("step2", 3)
.to('.box1', { x: 100, duration: 2 }, 'step2')
.to('.box1', { x: 100, duration: 2 }, 'step2+=2')
```

## ScrollTrigger 滚动插件
```js
ScrollTrigger.create({
  // 触发元素
  trigger: '.box3',
  // 开始位置
  start: 'top top',
  // 结束位置
  end: '+=500',
  // 设置元素动画
  animation: gsap.timeline().to('.box3', { x: 500 }),
  // 动画跟滚动条进度绑定到一起
  scrub: true,
  // 显示开始、结束标注位置
  markers: true,
  // 执行到当前元素是，锁定当前元素
  pin: true
})
```