本项目的代码规范都应遵循[Airbnb](https://github.com/airbnb/javascript)标准与
[Vue风格指南](https://cn.vuejs.org/v2/style-guide/)，其中Airbnb标准需严格遵循，否则程序会报错。

此外，还应遵循以下规则：
#### 1.使用BEM规范
使用[BEM](https://www.w3cplus.com/css/bem-definitions.html)规范来组织你的CSS样式。
```html
<!-- bad -->
<ul class="nav">
  <li class="nav-item"></li>
  <li class="nav-item right"></li>
</ul>

<!-- good -->
<ul class="xg-nav">
  <li class="xg-nav__item"></li>
  <li class="xg-nav__item xg-nav__item--right"></li>
</ul>
```

#### 2.使用封装好的BEM Mixin
 写BEM样式时，使用`/theme/mixin/bem.scss`里封装好的mixin。
```css
/* bad */
.block { /* styles */ }
.block__element { /* styles */ }
.block--modifier { /* styles */ }

/* good */
@include b(nav) {
  /* styles */
  @include e(item){
    /* styles */
    @include m(right){
      /* styles */
    }
  }
}
```

#### 3.路由与pages目录结构应对应
在命名路由和pages目录结构时，应该保持路由path与pages下对应的页面路径相对应，以便更快的根据路由定位到具体的页面文件。
```js、
// bad
{
  path: '/homePage',
  name: 'home',
  component: () => import('@/pages/Home/HomePage'),
},

// good
{
  path: '/home',
  name: 'home.index',
  component: () => import('@/pages/Home/Index'),
},

```
