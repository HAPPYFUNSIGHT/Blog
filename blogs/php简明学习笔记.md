#PHP 学习笔记

###1.变量

```php
   <?php
        //变量声明（php变量无需单独创建，变量会在第一次赋值时创建）
        $a = 1;
        
        //弱类型（php变量会根据其值自动转换为相应的数据类型）
        $a = "a";
        $A = 2.0;
        
        //命名规则（大小写敏感，建议采用小驼峰方式并增加三字节的类型前缀）
        $strName = "张伟佩";
        $intAge = 24;
        
        //作用域 
        function sayHi(){
            $strLocal = "小明";
            echo $strName." say hi";  // say hi
            echo $strLocal." say hi"; // 小明 say hi
            //Global作用域只能在函数外进行访问，若在函数内访问可以通过以下两种方式
            //1.在变量前加global关键字
            global $strName;
            echo $strName." say hi";  // 张伟佩 say hi
            //2.通过数组$GLOBALS[index],该数组已键值对形式存放了所有全局变量
            echo $GLOBALS['intAge'];  //24
        }
        sayHi();
   ?>
```

###2.运算符

* 常规运算符

  ```
     = + - * / % += *= ++ --
  ```

* 字符加`.` 

```php
    <?php
        //字符连接符
        $str1 = "hello";
        echo $str1." world"; //hello world
        //a.=b 即 a = a.b
        $str2 = " world";
        $str1.=$str2;   //$str1 = $str1.$str2;
        echo $str1; //hello world
    ?>
```

* 比较运算符

```php
    <?php
        $a = "1";
        $b = 1;
        //“==” 判断两个变量数值是否相等 
        var_dump($a == $b);  //bool(true)
        //“===”判断两个变量数值和类型是否都一致
        var_dump($a === $b); //bool(false)
        
        //由于php变量具有弱类型，两变量若类型不同，比较时具有一定规则
        //first 存在bool的都转为bool，true > false
        var_dump(true > 0);  //bool(true)
        //next 存在数字，均转为数字
        var_dump("12" > 2);   //bool(true)
        var_dump(1 > "a");    //bool(true)  
        var_dump('f' > 2);    //bool(false)
        //next 均为数字字符串则转为数字比较
        var_dump("12" > "110"); //bool(fase)
        //last 按字符串比较
        var_dump("a1" < "b");  //false
    ?>
```

###3.数组

```php
    <?php
        //数组声明通过array关键词，除定义常规数组外还可以通过=>来声明键值对数组
        $arrCars = array("bmw","volvo","audi","volvo");
        $arrAges = array("Peter"=>"35","Ben"=>"37","Joe"=>"43");
        //数组遍历
        //1.for
        for($i = 0;$i < count($arrCar);$i++){
            echo $arrCar[$i];
        }
        //2.foreach
        foreach($arrCars as $car){
            echo $car;
        }
        foreach($arrAges as $key => $value){
            echo $key."'s age is ".$value;
        }
        //3.指针
        reset($arrAges);
        while(list($key,$val)= each($arrAges)) {
            echo "$key=> $val<br />";
        }
        
        //常用数组方法
        count($arrCar); //返回数组大小,4
        sort($arrCar);  //排序,按元素内容正向排序,【"audi","bmw","volvo","volvo"】
        usort($arrCar,"mySortFunc");  //根据自定义函数进行排序
        array_unique($arrCar);  //移除重复元素,【"audi","bmw","volvo"】
        array_push($arrCar,"tesla"); //入栈元素,【"audi","bmw","volvo","tesla"】
        array_shift($arrCar);   //删除并返回数组首个元素,【"bmw","volvo","tesla"】
        array_map("myMapFunc",$arrCar);   //对数组内每个元素执行自定义函数
    ?>
```

###4.字符串函数

* **strlen(str)** 返回字符串str长度

```php
   <?php
        $strName = "HelloWorld";
        echo strlen(strName);   //10
    ?>
```

* **strpos(str,subStr)** 返回子串subStr在str的位置

```php
   <?php
        $strName = "Hello World";
        echo strpos(strName,"World");   //6
    ?>
```

* **explode()** 将字符串转换为数组

```php
    <?php
        $arrWords = explode(" ","Hello World");
        var_dump($arrWords);    //array(0 => "Hello",1 => "World")
        //implode与explode相对，将数组转换为字符串，别名join
        echo implode(" ",$arrWords);  //"Hello World"
    ?>
```

* **strcmp($str1,$str2)** 比较两字符串的大小

```php
    <?php
        $str1 = "hello";
        $str2 = "world";
        if(strcmp($str1,$str2) > 0)
          echo "$str1大于$str2";
    ?>
```

###5.类与对象

```php
    <?php
        //通过Class关键字声明类，封装了相关的成员属性和方法
        Class Person{
            //类的属性
            public $name;
            //类构造函数
            function __construct($n){
                $this->name = $n;
            }
            //【public】公有方法，在各个位置均可访问
            public function sayHi(){
                echo "hi,my name is ".$this->name;
            }
            //【private】私有方法，只有在本类中访问
            private function temp(){
                echo "here in Person";
            }
        }
        //子类(通过extends关键字继承父类中修饰符为public和protected的属性和方法，php中为单继承，父类仅有一个)
        Class Programmer extends Person{
            public $type;
            //当子类中可以声明与父类中同名的方法，该方法具有与父类不同的功能，称为重载
            function __construct($n,$t){
                //当需要调用父类中方法时，通过parent::funcName来访问 
                parent::__construct($n);
                //$this是类中自带的指针，指向当前调用该方法的对象
                $this->type = $t;
            }
            public function sayType()
            {
                echo "I'm a ".$this->type;
            }
        }
        //通过new关键字声明子类对象
        $objPgm = new Programmer("zhangweipei","rd");
        //调用父类继承的方法
        $objPgm->sayHi();   //hi,my name is zhangweipei
        //调用自身方法
        $objPgm->sayType(); //I'm a rd
        //父类中private方法无法被继承，因此下面调用报错
        $objPgm->temp();    //Fatal error
    ?>
```

###6.魔术方法

在类中具有“魔术功能”的一些特定方法称为魔术方法，通常以`__`开头，常见的魔术方法除上面见到的`__construct`外还有`__set、__get、__call`等

 方法        |说明     |     语法      
 :----:|:---:|:-----
 __construct   |构造函数,创建对象时 |`public void __construct (mixed $value)`
 __set      |在给不可访问属性赋值时  |`public void __set ( string $name , mixed $value ) `
 __get      |读取不可访问属性的值时  |`public mixed __get ( string $name)` 
 __call     |在对象中调用一个不可访问方法时   |`public mixed __call ( string $name , array $arguments )`     


```php
    <?php
        Class Person{
            private $name = "defalutName";
        
            public function sayHi(){
                echo "hi,my name is ".$this->name."\n";
            }

            private function temp(){
                echo "Inside in Person";
            }
            //在给不可访问属性赋值时
            public function __set($name , $value){
                echo "you're setting ".$name." to ".$value."\n";
            }
            //读取不可访问属性的值时
            public function __get($name){
                echo "you're getting ".$name."\n";
            }
            //在对象中调用一个不可访问方法时
            public function __call($name , $arguments)
            {
                echo "you're calling function ".$name." with arguments ".implode(",", $arguments)."\n";
            }
        }

        $objP = new Person();
        echo $objP->name;           //you're getting name
        $objP->sayHi();             //hi,my name is defalutName

        $objP->name = "Lee";        //you're setting name to Lee
        $objP->temp("arg1","arg2"); //you're calling function temp with arguments arg1,arg2
        
    ?>
```

###7.文件操作

```php
    <?php
        //打开文件,第一个参数为文件路径，第二个为打开模式，
        //常见的打开模式有r只读、w只写、r只写（追加）、x只写（文件不存在时不新建）、r+读写等
        $fileHandle = fopen("test.txt","a+");
        //全读
        $strContent = fread($fileHandle,filesize("test.txt"));
        //逐行读
        while(!feof($fileHandle)){
            $strLine = fgets($fileHandle);
        }
        //写文件
        fwrite($fileHandle,"hello world\n");
        //关闭文件
        fclose($fileHandle);
        
    ?>
```

###8.异常处理

当异常发生时，若未被捕获或执行相应处理将导致严重错误而中断程序，通过异常处理方法可以捕获异常并执行相应的逻辑

```php
<?php
     //handleArr方法仅接受array类型的参数，否则便抛出异常
     function handleArr($arr)
     {
        if(!is_array($arr)){
            //Exception为php内置的异常类，接受两个参数，第一个为错误信息，第二个为错误代码
            //也自定义继承系统Exception类的异常类，然后在catch中调用自定义方法
            throw new Exception("param is not array", 1);
        }
        # some code handle with arr
     }
     try {
        $intTemp = 1;
        //传入整形参数，触发异常
        handleArr($intTemp);  
     } 
     //捕捉异常
     catch (Exception $e) {
        //Exception中的常用方法有
        echo $e->getCode();  //返回错误代码
        echo $e->getMessage(); //返回错误信息
        echo $e->getFile();  //返回代码文件的完整路径
        echo $e->getLine();  //返回代码文件中产生异常的代码行号
     }
?>
```

###9.系统变量 

变量|说明
:---:|:---
$GLOBALS|全局作用域中可用的变量
$_SERVER|服务器及执行环境的信息
$_GET|通过 URL 参数传递给当前脚本的变量的数组
$_POST|通过Post方式传递给当前脚本的变量的数组
$_COOKIE|通过 HTTP Cookies 方式传递给当前脚本的变量的数组

>博文作者：**vicfeel**
 博文出处：http://www.cnblogs.com/vicfeel
 本文版权归作者和博客园共有，欢迎转载，但须保留此段声明，并给出原文链接，谢谢合作！
 如果阅读了本文章，觉得有帮助，您可以为我的博文点击“推荐一下”！
