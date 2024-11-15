import NProgress from 'nprogress'

import 'nprogress/nprogress.css'

NProgress.configure({
  // 指定进度条的最小百分比。默认值为0，取值范围为0到1之间的任意数字。
  minimum: 0.1,
  // 定义进度条的HTML模板。可以使用特定的占位符来插入进度条元素和旋转加载器元素。默认模板为'<div class="bar" role="bar"></div><div class="spinner" role="spinner"></div>'。
  // template: '',
  // 指定进度条动画的缓动函数。
  easing: 'ease',
  // 指定进度条动画的速度，以毫秒为单位。
  speed: 500,
  // 指示是否启用涓流模式。涓流模式表示进度条在页面加载时自动增加进度，而不是通过手动调用NProgress方法来增加进度。默认值为false。
  trickle: true,
  // 指定涓流模式下进度条的增加速度，以毫秒为单位。
  trickleSpeed: 200,
  // 指示是否显示旋转加载器。
  showSpinner: true,
  // 指定进度条的父元素选择器。
  // parent: '',
  // 指定进度条的定位方式。默认值为'translate3d'，表示使用CSS的translate3d来定位。
  // positionUsing: '',
  // 指定进度条元素的选择器。可以使用CSS选择器来选择进度条元素。默认值为'.bar'。
  // barSelector: '',
  // 指定旋转加载器元素的选择器。可以使用CSS选择器来选择加载器元素。默认值为'.spinner'。
  // spinnerSelector: ''
})

export { NProgress }
