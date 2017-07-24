#张伟佩串讲遗留问题整理

###1.php单双引号的区别

`””` 双引号里面的字段会经过编译器解释，然后再当作HTML代码输出。
`‘‘` 单引号里面的不进行解释，直接输出。
所以如果内部只有纯字符串的时候,用单引号(速度快),内部有别的东西(如变量)的时候,用双号引更好点。

###2.数组的集合操作

* **array_merge**

合并一个或多个数组。一个数组中的值附加在前一个数组的后面，返回作为结果的数组（数字键名会被重新编号）

```php
    <?php
        $arr1 = array(5,"Lee"=>23,3);
        $arr2 = array("Ming"=>13,9,8);
        $result = array_merge($arr1,$arr2); //Array([0] => 5  [Lee] => 23  [1] => 3  [Ming] => 13  [2] => 9 [3] => 8)
        //用 + 运算符。如果两个被合并的数组含有相同的key，则保留第一个，忽略后边的
        $result = $arr1+$arr2; //Array([0] => 5  [Lee] => 23  [1] => 3  [Ming] => 13)
    ?>
```

* **array_diff**

返回一个数组，该数组包括了所有在 array1 中但是不在任何其它参数数组中的值

| 方法 | 描述 |
| ------------- | ------------- |
| array_diff | 比较值 |
| array_diff_key | 比较键 |
| array_diff_assoc | 键和值都比较 |
| array_udiff | 用自定义回调函数来比较,类似的还有`array_diff_ukey,array_diff_uassoc` |

* **array_intersect**

返回一个数组，该数组包括了既在 array1 中又在任何其它参数数组中的值

| 方法 | 描述 |
| ------------- | ------------- |
| array_intersect | 比较值 |
| array_intersect_key | 比较键 |
| array_intersect_assoc | 键和值都比较 |
| array_uintersect | 用自定义回调函数来比较,类似的还有`array_intersect_ukey,array_intersect_uassoc` |

###3.数组中如何判断某个key或value是否存在

* **判断key是否存在使用**

1.`array_key_exists($key,$array)`

2.`isset($array[$key])`

若存在，则返回`true`

* **判断value是否存在**

`in_array($value,$array,true)`参数true来指定是否使用严格判断`===`是否存在，默认为false

###4.php中json处理方法

| 函数 | 说明 |
| ------------- | ------------- |
| json_encode($arr,[$option]) | 对php变量进行编码返回json字符串,option指定编码规则，为JSON_HEX_TAG、JSON_UNESCAPED_UNICODE等常量 |
| json_decode($json,[$assoc]) | 对json字符串进行解码，若$assoc为true返回数组，否则返回对象(默认) |

###5.php中获取到$_POST的值

通过`$_POST`中存放了post方式提交的键值对元素，即可直接通过`$_POST['username']`来获取。

然而对于整个json包作为post的数据体，而不是key=value形式的情况，通过`$_POST`或`$_REQUEST`是无法访问到的，有两种方式来访问。

* 1.通过`$GLOBALS['HTTP_RAW_POST_DATA']`来访问

这是由于php中默认只识别application/x-www.form-urlencoded标准的数据类型，对于text /xml 、soap 或者 application/octet-stream 之类的内容无法解析都交给`$GLOBALS['HTTP_RAW_POST_DATA']`来接受。

* 2.通过`php://input`

```
file_get_contents("php://input")
```

`php://input` 允许读取 POST 的原始数据。和 `$GLOBALS['HTTP_RAW_POST_DATA']`相比内存压力较小，并且不需要任何特殊的 php.ini 设置，缺点在于不能用于 `enctype="multipart/form-data`。

###6.php日期相关的方法

php中用`date()`函数对日期或时间进行格式化，语法为

`date(format,[timestamp])`

其中timestamp为时间戳，默认为当前时间,format为输出个数

| 字符 | 含义 |
| ------------- | ------------- |
| d | 日（01-31）  |
| m | 月(01-12) |
| Y | 年(四位) |
| l | 周里的某天 |
| h | 小时 |
| i | 分钟 |
| s | 秒 |
| a | am或pm |

```
<?php
    //设置默认时区
    date_default_timezone_set("Asia/Shanghai");
    echo "当前时间是 " . date("Y-m-d h:i:sa");  //当前时间是 2017-7-24 05:07:48pm
    
    //使用字符串来创建日期
    $d=strtotime("10:38pm April 15 2015");
    echo "创建日期 " . date("Y-m-d h:i:sa", $d);//创建日期 2015-04-15 10:38:00pm
?>
```

###7.php处理中文字符串的方法，如何计算中文字符串长度

处理中文字符串时，采用已`mb_`开头的字符串函数，如`mb_strlen、mb_substr`等，
其中`mb_strlen`方法可用来计算中文字符串长度,语法为

```
    int mb_strlen ( string $str [, string $encoding ] )
```

`mb_strlen`和`strlen`函数的用法类似，返回给定的字符串 string 的长度，其中encoding参数为字符编码，例如得到UTF-8的字符串$str长度，可以用`mb_strlen($str,'UTF-8')`。如果省略第二个参数，则会使用PHP的内部编码。内部编码可以通过 `mb_internal_encoding()`函数得到。

###8.yii `$command->execute()` 返回值， `$command->queryXX()`当查询结果为空时的返回值

`execute`返回类型为interger，即执行后影响的数据表中行数

`queryXX`返回类型为Array，当查询结果为空时，返回一个空的Array

###9.如何避免多人同时修改同一条记录的AR的不同字段时发生误操作

通过update()或updateAll()方法更新，更新时在参数中传入一个attribute数组，数组为需要更新的字段，通过指定字段更新的方式来避免多人同时操作时的误操作。

###10.bindParam() 和 bindValue()区别

方法 bindParam() 和 bindValue() 非常相似，区别有以下两点。

* 第一个区别

前者使用一个PHP变量绑定参数，而后者使用一个值。所以使用bindParam是第二个参数只能用变量名，而不能用变量值，而bindValue至可以使用具体值。

```php
<?php
    $command = $connect->createCommand("select * from User where user_id=:id");
    $id = 14;
    $command->bindParam(":id",$id); //正确
    $command->bindParam(":id",$id); //错误
    $command->bindValue(":id",$id); //正确
    $command->bindValue(":id",14);  //正确
?>
```

* 第二个区别

前者绑定的为参数，后者绑定的为值，有点类似传址和传值的区别，即bindParam绑定后参数改变，绑定sql语句也会改变，而bindValue中sql为第一次绑定的那个值，参数改变对它无影响。
另外对于那些内存中的大数据块参数，处于性能的考虑，应优先使用`bindParam`。
