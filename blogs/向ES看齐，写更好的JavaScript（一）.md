
众所周知，JavaScript作为弱类型语言，一直是精华与糟粕共存，许多“诡异”的地方我们不得不接受并使用。其实ES6（又称ECMAScript 2015）在2015年6月就已经正式发布了，其中提出的很多新的特性让JavaScript更加完善和丰富，对于前端开发者可谓一大福音。

目前各大浏览器的最新版本对ES6的支持度也越来越高，大部分的特性都实现了（ [ES6 支持](kangax.github.io/es5-compat-table/es6/) ）。另外现在也有很多的转换器（如`Babel`)，将ES6和ES7的代码转换为ES5的代码，这就意味着我们现在就可以使用这些新特性应用到我们的项目中去。

本篇对ES6中的关于变量部分的新特性进行介绍,本系列传送门：

* **[1 变量部分](http://www.cnblogs.com/vicfeel/p/5808277.html)**
* [2 现有对象拓展](http://www.cnblogs.com/vicfeel/p/5822068.html)
* [3 新增数据类型/数据结构](http://www.cnblogs.com/vicfeel/p/5829568.html)
* 4 新的异步编程模式
* 5 类和模块

###1 利用let和const引入块级作用域

以往JavaScript是不具有块级作用域的，一个函数才能构成一个作用域,局部变量在整个函数内都是有定义的，举个栗子

```js
    for(var i = 0;i < 10;i++){
    }
    
    console.log(i);  //输出10
```

最后在for循环之后，i变量仅用于for循环，但在却被泄露成全局变量形成变量污染，这就是不合理的地方，**通过ES6中定义的`let`关键字可以形成仅作用于该块作用域的局部变量**，

```js
    //ES6环境下
    for(let i = 0;i < 10;i++){
    }
    
    console.log(i);  //输出ReferenceError(未定义)
```

利用Babel将这段ES6代码转换为ES5代码后，实际上是对ES5的代码对其原理进行模拟达到一致的效果，因此可以帮助我们的理解：

```js
    //Babel转换后
    for (var _i = 0; _i < 10; _i++) {
    }

    console.log(i); //输出ReferenceError(未定义)
```

可以看到，对于let声明的局部变量，如果外部有相同定义，会通过添加下划线将其转换为另外的变量，表达意思就是let将该变量仅在该块作用域内可用。

再举个栗子:

```js
    var a = [];
    for (var i = 0; i < 3; i++) {
      a[i] = function () {
        console.log(i);
      };
    }
    a[1](); //输出3
    a[2](); //输出3
```

上面的代码的三次循环中i始终为同一个变量，值最后为3。a数组中的函数读到的i也是这个值，因此都是输出3，这跟我们想要的结果并不一致。而利用let这个新特性可以很好的解决这个问题:

```js
    //ES6环境
    var a = [];
    for (let i = 0; i < 3; i++) {
      a[i] = function () {
        console.log(i);
      };
    }
    a[1](); //输出1
    a[2](); //输出2
```

```js
    //Babel转换后
    var a = [];
    var _loop = function _loop(i) {
        a[i] = function () {
            console.log(i);
        };
    };
    
    for (var i = 0; i < 3; i++) {
        _loop(i);
    }
    a[1](); //输出1
    a[2](); //输出2
```

这次转换后稍微变得复杂了一些，实际上是新定义一个函数，将循环变量i作为参数传进去，可以这样理解ES6中代码通过let将三次循环中的i固定于各自的块作用域中，互不干扰。

另外关于let要注意的几点：

```js
    console.log(a);   //输出ReferenceError(未定义)，let声明的变量不会变量提升，这也是规范我们的代码先声明后使用。
    let a = 3;    
    let a = 4;     //错误，let声明的变量不能重复定义
```

总之，用let让我们的代码更加规范避免了很多问题，因此尽可能使用let代替var.

* **与`let`类似`const`也能形成块作用域，不同点在于const声明的变量为常量，不可改变**

举个栗子：

```js
    if(true){
        const MAX = 999;
        MAX = 3;  //报错："MAX" is read-only
    }
    console.log(MAX);//输出ReferenceError(未定义)
    
```

可以看出const也形成块级作用域，而且值不可改变，有一点要注意的是不能改变的是const类型变量存储的东西，举个栗子更好理解：

```js
    const person = {};
    person.name = 'vicfeel';  //正确，person存储的是指向该对象的地址，对象内容可以改变
    person = {};  //报错："person" is read-only，该地址不能改变
```

### 2 变量解析与赋值

以往多个变量的赋值我们使用如下的方式：

```js
    var a = 1;
    var b = 2;
    var c = 3;
    
    var d = 4,e = 5,f = 5;
```

ES6中增加一种更便捷的多变量赋值方法：

```js
    var [a,b,c] = [1,2,3];
```

系统会自动对数组内元素进行对应赋值，也就是说我们也可以用这种方式来进行变量的声明：

```js
    //ES6环境下
    var arr = [1,2,3];
    var [a,b,c] = arr;
```

我们用Babel看一下是如何模拟的：

```js
    //Babel转换后
    var _ref = [1, 2，3];
    var a = _ref[0];
    var b = _ref[1];
    var c = _ref[2];
```

可以看到是通过数组下标依次向后赋值，下面我对多种情况进行了赋值测试：

```js
    {
        //数量不对应
        let [a,b,c] = [1,2];
        console.log(a);  //1
        console.log(b);  //2
        console.log(c);  //undefined
        //按照上面babel转换的理解，c = _ref[2]不存在该要素因此c为undefined
    }
    {
        //多层数组
        let [a,[b,c],d] = [1,[2,3],4];
        console.log(a);  //1
        console.log(b);  //2
        console.log(c);  //3
        console.log(d);  //4
    }
    {
        //多层不对应
        let [a,[b,c],d] = [1,[2],3];
        console.log(a);  //1
        console.log(b);  //2
        console.log(c);  //undefined
        console.log(d);  //3
    }
    {
        //对应值非数组
        let [a,b,c] = 1;  //报错
        let [a,b,c] = false;  //报错,等号右边必须为可遍历对象
    }
```

了解映射的原理之后，一个很好的应用场景就是交换数值，现在可以这样简单的实现：

```js
    //ES6环境下
    let [x,y] = [0,1];
    [x,y] = [y,x]; 
```

* **除此之外，ES6还在映射赋值中加入了默认值**

```js
//ES6环境下
let [a, b = 2,c] = [1]; //y无对应值时，默认值则为2
console.log(a);  //1
console.log(b);  //2
console.log(c);  //undefined
```

看一下ES5的模拟

```js
//Babel转换后
var _ref = [1];
var a = _ref[0];
var _ref$ = _ref[1];
var b = _ref$ === undefined ? 2 : _ref$; //通过‘===’严格等于判断是否为undefined，是的话采用默认值
var c = _ref[2];   //所以是undefined
```


* **针对对象的映射赋值**

直接看栗子：

```js
    //ES6环境下
    var { oA, oB } = { oA: "a", oB: "b" };
    console.log(oA); //"a"
    console.log(oB); //"b"
```

看一下ES5的模拟

```js
    //Babel转换后
    var _oA$oB = { oA: "aaa", oB: "bbb" };
    var oA = _oA$oB.oA;   //原来是通过同名属性进行对应
    var oB = _oA$oB.oB;
    
    console.log(oA);
    console.log(oB);
```

了解了对应的原理之后，我们再做一下其它情况的测试：

```js
    {
        //顺序改变
        var { oA, oB } = { oB: "a", oA: "b" };
        console.log(oA); //"b"
        console.log(oB); //"a"
    }
    {
        //数量不对应
        var { oA, oB } = { oA: "a"};
        console.log(oA); //"a"
        console.log(oB); //undefined,等号右边对象找不到oB属性
    }
```

掌握这种方法，可以简化很多之前操作，如获取一个对象的某些属性，可以通过以下方式：

```js
    //ES6环境下
    var person = {
       name:'Vicfeel',
       age:'23',
       sex:'Male'
    }
    
    let {name,age,sex} = person;
    
    console.log(name);//Vicfeel
    console.log(age); //23
    console.log(sex); //Male
```

>参考Reference
 [http://www.ecma-international.org/ecma-262/6.0/index.html](http://www.ecma-international.org/ecma-262/6.0/index.html)
 [http://es6.ruanyifeng.com/](http://es6.ruanyifeng.com/) 
 [http://www.cnblogs.com/Wayou/p/es6_new_features.html](http://www.cnblogs.com/Wayou/p/es6_new_features.html)
 [http://www.cnblogs.com/snandy/archive/2015/05/10/4485832.html](http://www.cnblogs.com/snandy/archive/2015/05/10/4485832.html)
 

>博文作者：**vicfeel**
 博文出处：http://www.cnblogs.com/vicfeel
 本文版权归作者和博客园共有，欢迎转载，但须保留此段声明，并给出原文链接，谢谢合作！
 如果阅读了本文章，觉得有帮助，您可以为我的博文点击“推荐一下”！