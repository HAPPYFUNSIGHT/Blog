本文是ES6系列的第二篇，主要介绍ES6中对现有对象方法属性的拓展，先上传送门：

* [1 变量部分](http://www.cnblogs.com/vicfeel/p/5808277.html)
* **[2 现有对象拓展](http://www.cnblogs.com/vicfeel/p/5822068.html)**
* [3 新增数据类型/数据结构](http://www.cnblogs.com/vicfeel/p/5829568.html)
* 4 新的异步编程模式
* 5 类和模块

###1 增加了模板字符串

先看一下，ES6之前我们是如何实现输出模板的：

```js
    document.getElementById('root').innerHTML = "the user name is " + username + "\nthe user age is  " + age;
```

这样通过字符串相加拼接确实挺繁琐的，很容易出错，ES6引入了模板字符串来简化代码，两者输出效果是一样：

```js
    //ES6环境下
    document.getElementById('root').innerHTML = `the user name is ${username}
    the user age is  ${age}`;
```

通过反引号包裹的字符串来声明模板字符串，插入变量直接通过`${变量名}`实现，另外要注意模板字符串中的所有空格和换行都是被保留的。

`${变量名}`中大括号内不仅支持变量名，对于任意的JavaScript表达式也是支持的，例如可以这样用：

```js
    var result =  `my name is ${(function(){return 'vicfeel';})()}`;
```

### 2 数组的拓展

* **Array.from( )，将伪数组对象转换为真正的数组**

什么是伪数组对象？具有数组的结构，但不是数组对象，不能使用数组方法如forEach等，举几个栗子：

```js
    let fakeArr1 = {
        '0':1,
        '1':2,
        '2':3,
        'length':3
    };
    
    function f(){
        let fakeArr2 = arguments;
    }
    
    let fakeArr3 = document.querySelectorAll('div');
    
    //上面三类都是伪数组对象
    'forEach' in fakeArr1; //false
    let arr = Array.from(fakeArr1); //ES5的写法 var arr = Array.slice.call(fakeArr1);
    'forEach' in arr;   //true
    
```

* **Array.find( )，在数组中检索第一个匹配要素**

find()参数为一个函数，设置查找条件，看栗子：

```js
    let arr = [1,3,5,7];
    var result = arr.find(function(value, index, arr){
        return value > 4;
    });
    var result2 = farr.find(function(value, index, arr){
        return value > 10;
    });
    console.log(result); //5
    console.log(result2); //找不到返回undefined;
```

findIndex()方法与find()类似，只不过查找的是序号：

```js
    let arr = [1,3,5,7];
    var result = arr.findIndex(function(value, index, arr){
        return value > 4;
    });
    var result2 = farr.findIndex(function(value, index, arr){
        return value > 10;
    });
    console.log(result); //2
    console.log(result2); //找不到返回-1;
```

* **Array.fill( )，给定一个值来填充数组**

```js
    let arr = [1,2,3];
    arr.fill(5); //[5,5,5]
    
    //fill也可以接收3个参数，第二个和第三个参数分别为填充开始的位置和结束的位置
    let arr2 = [1,2,3,4,5,6];
    arr2.fill(5,1,3); //[1,5,5,4,5,6]
```

###3 函数增加默认参数

ES6之前的函数是无法带有默认参数的，我们通常采用以下方式实现默认参数设置：

```js
    function f(name,age){
        //设置默认值
        name = name || 'defaultName';  
        age = age || 'defaultAge';
    }
```

ES6中提供了新的方法：

```js
    //ES6环境下
    function f(name,age = 23){
        console.log(name + ',' + age);
    }
    f('vicfeel');  //vicfeel,23
```

通过Babel可以将ES6代码转换为浏览器支持ES5代码，这实际上是用ES5来模拟的一个过程，可以帮助我们了解ES6该方法的实现原理：

```js
    //Babel转换后
    function f(name) {
        var age = arguments.length <= 1 || arguments[1] === undefined ? 23 : arguments[1];
    
        console.log(name + ',' + age);
    }
    f('vicfeel'); //vicfeel,23
```

从上面可以看出，如果第二个参数严格等于“===”undefined就使用默认参数，这实际上在原有函数的基础上对形参加了一层**解析赋值**（见[上一篇](http://www.cnblogs.com/vicfeel/p/5808277.html)中的变量解析赋值）。

###4 函数新增rest参数

ES6引入了rest参数（“...变量名”），用于获取函数的多余参数，这样就不需要使用arguments对象了，看个栗子：

```js
    function f(...vals){
        console.log(vals);  //[1,2,3]
    }
    
    f(1,2,3);
```

上例中的vals类型为Array，值为[1,2,3]，可以看成将arguments转换为数组后的结果，而且要比arguments有更高的灵活性，rest参数还可以这样用：

```js
    //ES6环境下
    function f(v,...vals){
        console.log(v);   //'temp'
        console.log(vals); //[1,2,3]
    }
    
    f('temp',1,2,3);
```

```js
    //ES5通过arguments的模拟
    function f(v) {
        console.log(v);
    
        for (var _len = arguments.length, vals = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            vals[_key - 1] = arguments[_key];
        }
    
        console.log(vals);
    }
    
    f('temp', 1, 2, 3);
```

另外在使用rest时要注意的一点，rest参数后不可以再加别的参数：

```js
    function f(...vals,v){ }  //这种方式会报错
```

除了在函数中作为rest参数，`“ ... ”`本身可以作为一个运算符使用，用处与rest参数刚好相反，是将一个数组转为用逗号分隔的参数序列，看看栗子：

```js
    function add(x,y){
       return x + y;
    }
    
    var arr = [23,12];
    add(...arr); //35
    
    Math.max(...[4, 13, 15]) // 等同于Math.max(4, 13, 15);

    //结合rest使用
    function f(...vals){
        vals //[1,2,3]
    }
    
    var arr = [1,2,3];
    f(...arr);
    //当然上面这样用是多次一举，转换为参数再转回来，目的是为了理解两者是互为逆操作的
    
    //其它用法
    var nodeList = document.querySelectorAll('div');
    var array = [...nodeList];
    
    var arr1 = [1,2,3],arr2 = [4,5,6];
    var arr3 = [...arr1,...arr2]; //合并数组，在ES5中我们一般是这样用的arr1.concat(arr2);
```

### 5 增加箭头=>函数

直接用Babel转换“var f = a => b”为ES5看了一下

```js
    //var f = a => b;
    
    var f =function (a) {
      return b;
    };
```

这样一下就明了了，我们可以将箭头函数理解成一种语法糖，是对函数的一种简化，a为参数，b为返回值

看一下复杂的用法：

```js
    //当传入多个参数或对象时，要用（）包裹
    var add = (a,b) => a + b
    //等同于
    var add = function(a,b){ return a + b; }
    
    //传入对象
    var plus = ({name,age}) => name + age;
    var person = {
        name:'Vicfeel',
        age:23
    };
    plus(person); //Vicfeel23
    
```

灵活运用箭头函数，可以简化很多操作：

```js
    let arr1 = [1,2,3,4];
    arr1.map(x => x * x);
    
    const IsEven = x => x % 2 == 0;
    
    let arr2 = [12,2,43,3,18];
    arr2.sort((x,y) => x - y);
```

另外，关于使用箭头函数有一点需要注意的地方：**this对象的指向是可变的，但是在箭头函数中，它是固定的**，我们结合例子看一下：

```js
    var handler = {
      init: function() {
        document.addEventListener('click',
          e => this.doSomething(e), false);
      },
    
      doSomething: function(e) {
        console.log('do something);
      }
    };
```

我们为document绑定了点击事件，回调函数中使用箭头函数，调用handler的doSomething方法，一般的函数在点击执行中this会发生改变，指向document，并报错doSomething未定义，但在箭头函数中this在定义时便是固定的不再改变，将上面的例子转换为ES5看一下：

```js
    //ES5
    var handler = {
        init: function init() {
            var _this = this;
    
            document.addEventListener('click', function (e) {
                return _this.doSomething(e);
            }, false);
        },
    
        doSomething: function doSomething(e) {
            console.log('do something');
        }
    };
```

转换后的ES5代码就清楚地说明了，箭头函数里面根本没有自己的this，而是引用外层的this。

>参考Reference
 [http://www.ecma-international.org/ecma-262/6.0/index.html](http://www.ecma-international.org/ecma-262/6.0/index.html)
 [http://es6.ruanyifeng.com/](http://es6.ruanyifeng.com/) 
 [http://www.cnblogs.com/Wayou/p/es6_new_features.html](http://www.cnblogs.com/Wayou/p/es6_new_features.html)
 [http://www.cnblogs.com/snandy/p/4403111.html](http://www.cnblogs.com/snandy/p/4403111.html)

>博文作者：**vicfeel**
 博文出处：http://www.cnblogs.com/vicfeel
 本文版权归作者和博客园共有，欢迎转载，但须保留此段声明，并给出原文链接，谢谢合作！
 如果阅读了本文章，觉得有帮助，您可以为我的博文点击“推荐一下”！