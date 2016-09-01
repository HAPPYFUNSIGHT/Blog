本文是ES6系列的第三篇，主要介绍ES6新增的数据类型、数据结构，先上传送门：

* [1 变量部分](http://www.cnblogs.com/vicfeel/p/5808277.html)
* [2 现有对象拓展](http://www.cnblogs.com/vicfeel/p/5822068.html)
* **[3 新增数据类型/数据结构](http://www.cnblogs.com/vicfeel/p/5829568.html)**
* 4 新的异步编程模式
* 5 类和模块

### 1 第七种数据类型Symbol

ES6引入了一种新的原始数据类型Symbol，表示独一无二的值。它是JavaScript语言的第七种数据类型，前六种是：Undefined、Null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。

```js
    let s = Symbol();
    console.log(typeof s); //"symbol"
```

Symbol类型变量通过` Symbol() `方法来构建（不能使用new），另外该方法可以接受一个字符串类型的参数作为该Symbol的**描述**

```js
    let s1 = Symbol('tag');
    let s2 = Symbol('tag');
    
    s1 == s2; //false,参数仅仅作为描述，就算相同描述的两个Symbol也是不同的
```

Symbol类型使用注意：

```js
    let s = Symbol();
    
    "symbol:" + s; //报错，无法和字符串运算
    
    s + 2;  //报错，无法和字符串运算
    
    s1.toString(); //"Symbol(tag)"，Symbol显示转换为字符串类型是可以的
    
    if(s){
        ...         //可以转换为bool
    }
    
```

说了这么多，ES6中引入Symbol到底是用来干嘛呢？

由于任意两个Symbol都是不相等的，这就意味着我们可以将其作为对象的属性名，而不担心属性名重复覆盖原有属性，这在团队开发中是很有用的，举个栗子：

```js
    let attr = Symbol();
    
    //方法1
    let obj = {};
    obj[attr] = 'hello';  
    
    //方法2
    let obj = {
        [attr]: 'hello'
    }
    
    //方法3
    let obj = {};
    Object.defineProperty(a, mySymbol, { value: 'Hello!' });
    
    //上面三种定义属性的方式效果是一样的
    obj[attr]; //"hello"
    
    //方法4
    let obj = {};
    obj.attr = 'hello';
    obj[attr];  //undefined,注意不能使用“.”运算符
```

另外通过Symbol定义的函数是不会被`for...in`等遍历出来的，如果要遍历Symbol属性要使用`Object.getOwnPropertySymbols`来遍历Symbol属性，或使用另一个新的API`Reflect.ownKeys`遍历所有属性（包括Symbol和其它属性），看例子：

```js
    
    var attr1 = Symbol('a1');
    var attr2 = Symbol('a2');
    
    var obj = {
        [attr1]:'hello',
        [attr2]:'world',
        name:'vicfeel'
    };
    
    for(let attr in obj){
        console.log(attr); //name,仅遍历到name属性
    }
    
    Object.getOwnPropertySymbols(obj)；//[Symbol(a1),Symbol(a2)]仅遍历Symbol属性
    
    Reflect.ownKeys(obj);  //[Symbol(a1),Symbol(a2),name]，遍历所有属性

```

### 2 新的数据结构Set

Set数据结构和数组类似，区别在于Set内元素是唯一不重复的,Set函数可以接受一个数组（或类似数组的对象）作为参数，用来初始化，可以通过`add`方法添加元素，看栗子：

```js
   //ES6环境下
   
   //Set的方法
   //Set - 构造函数，参数为一个数组
   let arr = [1,2,3,3,4,4];
   let s = new Set(arr);//Set{1,2,3,4}
   
   //add - 添加一个值,返回结构本身
   s.add(5); //Set{1,2,3,4,5}
   s.add(2); //Set{1,2,3,4,5}
   s.add(6).add(7);//Set{1,2,3,4,5,6,7}
   
   //delete - 删除一个值，返回一个布尔值表明删除是否成功
   s.delete(6); //true,Set{1,2,3,4,5,7}
   
   //has - 判断是否包含该值，返回一个布尔值
   let ok = s.has(6);//false,Set{1,2,3,4,5,7}
   
   //clear - 清空Set
   s.clear();//Set{}
   
   //Set的属性
   s.size; //0,与数组不同set通过size获取大小
   s.add(5);
   s.size; //1
   
```

Set内元素具有唯一性，因此最直观的用途便是数组去重，现在我们可以这样实现数组去重：

```js
    function unique(arr){
        return [...new Set(arr)]; //...运算符参看ES6系列（二）
        
        //或者 return Array.from(new Set(arr));
    }
```

Set是如何界定两元素是否相同呢，我们来测试一下：

```js
    let s = new Set();
    s.add(5);  //Set{5}
    s.add('5');  //Set{5,'5'},不会进行类型转换,是通过"==="而不是“==”
    
    let [n1,n2] = [NaN,NaN];
    s.add(n1);  //Set{5,'5',NaN}
    s.add(n2);  //Set{5,'5',NaN},只有一个NaN表明在Set内NaN是相等的
    
    s.add({});  //Set{5,'5',NaN,{}}
    s.add({});  //Set{5,'5',NaN,{},{}},任意两个对象是不相等的
```

* 我们来简单看一下另一个和Set类似的数据结构WeakSet

WeakSet结构与Set类似，也是不重复的值的集合。但是，它与Set有两个区别。

(1)WeakSet的成员只能是对象，而不能是其他类型的值。

```js
    var ws = new WeakSet();
    ws.add(1)
    // TypeError: Invalid value used in weak set
    ws.add(Symbol())
    // TypeError: invalid value used in weak set
```

(2)WeakSet中的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于WeakSet之中。这个特点意味着，无法引用WeakSet的成员，因此WeakSet是不可遍历的。

### 3 新数据结构Map

map一词本身就有映射的意思，Map数据结构提供了一种完善的键值对结构，之所以称之为完善是相对于之前而言，我们知道JS中的对象Object本身就是一种键值对hash结构,然而这种键值对确是不完善的。

Object中只能将字符串作为键，无法使用对象作为键，Map数据结构的提出就是为了解决这个问题，来看个栗子：

```js
    var a = {};
    var p = {name:'vicfeel'};
    a[p] = 'val';
    a;//Object {[object Object]: "val"},p对象被转换成了字符串“[Object Object]”
```

来看一下Map数据结构的基础用法:

```js
    //构造函数
    var m = new Map();
    var p = {name:'vicfeel'};
    //添加键值对
    m.set(p,'val');
    //获取键值对
    m.get(p); //"val"
    m.get('name'); //undefined
    //返回大小
    m.size; //1
    //重复添加相同键会覆盖先前的
    m.set(p,'newVal');
    m.get(p); //"newVal"
    
    //利用包含键值对的数组初始化Map,相同键后面也会覆盖前面
    var arr = [{'name':'vicfeel'},{'age':23},{'age':25}];
    var m2 = new Map(arr);
    m2.get('age'); //25
    
    //判断是否含有某个键
    m2.has('name');  //true
    //删除某个键
    m2.delete('name');
    m2.has('name'); //false
    
    //清空
    m2.clear();
    m2.size; //0
```

另外，另外Map数据结构也有一个forEach方法用于遍历：

```js
    let m = new Map();
    m.set('name','vicfeel').set('age',25);
    m.forEach(function(val,key,map){
        console.log("Key: %s, Value: %s", key, value);
        //Key: name, Value: vicfeel
        //Key: age, Value: 25
    });
```

### 4 Iterator（遍历器）

虽然本篇博客写的是新的数据类型和数据结构，遍历器并不在此列，将Iterator放在这里是因为其与上面提到的Set、Map联系比较紧，趁热打铁，便在此一起说了。

首先要说明遍历器（Iterator）是一种机制、一种接口，它为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署Iterator接口（ES6规定，默认的Iterator接口部署在数据结构的Symbol.iterator属性），就可以完成遍历操作（即依次处理该数据结构的所有成员）。

ES新提供的遍历方法`for...of`的遍历方式便是自动寻找该对象的Iterator接口,一些数据结构是默认部署Iterator接口的，包括数组、Set和Map结构、伪数组（比如arguments对象、DOM NodeList对象）、后文的Generator对象，以及字符串，因此这些数据结构是可以直接使用for...of进行遍历的，看栗子：

```js
    let arr = [1,2,3];
    for(let item of arr){
        item;
        //1
        //2
        //3
    }
    
    let s = new Set(arr);
    for(let item of s){
        item;
        //1
        //2
        //3
    }
    
    let m = new Map();
    m.set('name'，‘vicfeel');
    m.set('age',23);
    let p = {'width':100,'height':200};
    m.set(p,'val');
    for(let item of m){
        item;
        //["name", "vicfeel"]
        //["age", 23]
        //[{'width':100,'height':200},'val']
    }
    
    let str = 'hello';
    for(let item of str){
        item;
        //'h'
        //'e'
        //...
    }
    
```

对于未部署Iterator接口的结构想要对其使用for...of遍历可自己部署Iterator接口，比如对象Object默认是不部署Iterator接口的，因为系统不知道从哪个属性开始遍历以及按照什么样的次序进行遍历，我们一个对象来看一下如何部署Iterator接口：

```js
    let obj = {
      data: [ 'hello', 'world' ],
      [Symbol.iterator]() {
        const self = this;
        let index = 0;
        return {
          //Iterator通过next()函数进行遍历，直至next函数返回的done值为true
          next() {
            if (index < self.data.length) {
              return {
                value: self.data[index++],
                done: false
              };
            } else {
              return { value: undefined, done: true };
            }
          }
        };
      }
    };
    
    for(let item of obj){
        item;
        //'hello'
        //'world'
    }
```

>参考Reference
 [http://www.ecma-international.org/ecma-262/6.0/index.html](http://www.ecma-international.org/ecma-262/6.0/index.html)
 [http://es6.ruanyifeng.com/](http://es6.ruanyifeng.com/) 
 [http://www.cnblogs.com/Wayou/p/es6_new_features.html](http://www.cnblogs.com/Wayou/p/es6_new_features.html)
 [http://www.cnblogs.com/sker/p/5520518.html](http://www.cnblogs.com/sker/p/5520518.html)

>博文作者：**vicfeel**
 博文出处：http://www.cnblogs.com/vicfeel
 本文版权归作者和博客园共有，欢迎转载，但须保留此段声明，并给出原文链接，谢谢合作！
 如果阅读了本文章，觉得有帮助，您可以为我的博文点击“推荐一下”！