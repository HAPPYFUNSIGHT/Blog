# Yii 简明学习教程

Yii是一个基于组件的高性能PHP框架，用于快速开发Web应用程序（下面内容基于Yii 1.1）

## 1. 典型的工作流

![请求声明周期图](https://raw.githubusercontent.com/Vicfeel/MDPhotos/master/YiiLearn/yiiLife.png)

1. 用户向**入口脚本**`index.php`发起请求
2. 入口脚本加载**应用配置**`config.php`并创建一个**应用主体**
3. 应用主体通过请求组件`Request`解析请求的路由
4. 根据解析结果去创建**控制器**实例去处理请求
——————————————————————————————————————
5. 控制器创建一个**动作**实例并针对操作执行过滤器
6. 若任一过滤器返回失败，则动作取消
7. 若所有过滤器返回成功，则动作执行
8. 动作加载一个**数据模型**，可能会从数据库中读取数据
9. 动作将渲染的**视图**，并加载的数据模型作为属性传递给它
10. 渲染结果返回给响应组件`Response`
11. 响应组件发送渲染结果给用户浏览器

## 2. 入口脚本`index.php`

```php
<?php
    /// 定义全局变量，在生产环境中请删除此行
    defined('YII_DEBUG') or define('YII_DEBUG',true);
    // 包含Yii引导文件
    require_once('path/to/yii/framework/yii.php');
    // 读取配置文件
    $configFile='path/to/config/file.php';
    // 创建一个应用实例并执行
    Yii::createWebApplication($configFile)->run();
?>
```

## 3. 应用配置`config.php`

应用主体的相关配置，可以内部属性可以通过`Yii::app()->attributeName`访问

```php
<?php
$config = [
    'id' => 'basic',  //应用主体ID
    'basePath' => dirname(__DIR__), //应用的根路径
    'language' => 'zh-CN',  //网页语言
    'defaultRoute' => 'post/index',  //默认路由
    'components' => [   //注册组件
        'db'=>array(
            'class' => 'system.db.CDbConnection',
            'connectionString' => 'mysql:host=mysql56.rdsm1whs0okm6y4.rds.bj.baidubce.com;dbname=crowd_test',
            'emulatePrepare' => true,
            'username' => 'crowdtest',
            'password' => 'unittest_sdcqa',
            'charset' => 'utf8',
        ),
        'fixture' => array(
            'class' => 'crowdtest.tests.test.CDbFixtureManager',
            'basePath' => dirname(__FILE__) . '/../fixtures/',
        ),
    ]
];

return $config;
?>
```

## 4. 模型`Model`

模型是MVC架构中的M，由CModel或其子类（如CActiveRecord、CFormModel)继承而来，是表现业务数据、规则和逻辑的对象,表单模型(CFormModel)用于保持从用户的输入获取的数据, 这些数据经常被获取，使用，然后丢弃。Active Record (AR) 是一种用于通过面向对象的风格抽象化数据库访问的设计模式。

```php
<?php
    class ContactForm extends CFormModel
    {
        //【业务数据】
        public $name;
        public $email;
        public $verifyCode;
        //【业务规则】
        // array('AttributeList', 'Validator', 'on'=>'ScenarioList', ...附加选项)
        // Validator: required,email,length,captcha,url,boolean等等
        public function rules(){
            return array(
                    array('name,email','required'),
                    array('email','email'),
                    array('name', 'length', 'min'=>3, 'max'=>12),
                    array('verifyCode','captcha'),
                );
            ];
        }
        //属性在页面中的显示内容
        public function attributeLabels()
        {
            return array(
                'name' => '姓名'
            );
        }
        //【业务逻辑】
        public function contact($email){
        }
    }
?>
```

## 5. 数据库操作(DAO/ActiveRecord)

数据访问对象（DAO） 对访问存储在不同数据库管理系统（DBMS）中的数据提供了一个通用的API。

```
    $connection=Yii::app()->db;//CDbConection实例，代表一个数据库连接
    $command=$connection->createCommand($sql)  //CDbCommand实例，代表Sql指令
    $command->bindValue();  //绑定变量
    $command->query();  //执行查询
    $command->queryRow(); //执行查询并返回结果中的第一行
    $command->execute(); //执行操作，删除、新增等
```

Active Record(AR)是一个流行的对象-关系映射(ORM)技术,通过面向对象的方式来操纵数据库，大大提高了代码的可维护性，每个 AR类代表一个数据表，数据表的列在 AR 类中体现为类的属性，一个 AR 实例则表示表中的一行。

```php
<?php
    class User extends CActiveRecord
    {
        //Required，返回一个此类可调用的实例
        public static function model($className=__CLASS__)
        {
            return parent::model($className);
        }
        //设置数据库中对应的数据表
        public function tableName()
        {
            return 'tbl_post';
        }
        //不同表之间的关联关系
        //BELONGS_TO 属于 1：n
        //HAS_MANY  有多个  m:1
        //HAS_ONE   有一个  1:1
        //MANY_MANY 多对多  m:n
        public function relations(){
            return array(
                'article'=>array(self::HAS_MANY, 'Article', 'user_id'),
            );
        }
        public function myfunc(){
            //CURD
        }
    }
?>
```

* 增加(Create)

  ```php
  <?php
      $model = new User();
      $model->name = "Lee";
      $model->age = "18";
      //save中会自动执行rules中的规则检查，根据检查结果返回true或者false
      if($model->save()){
            #code
      }
  ?>
  ```

* 查询(research)

```php
<?php
    // 查找满足指定条件的结果中的第一行
    $user=User::model()->find($condition,$params);
    $user = User::model()->find("name=:name",array(':name'=>$name));
    // 查找具有指定主键值的那一行
    $user=User::model()->findByPk($userID,$condition,$params);
    // 查找具有指定属性值的行
    $user=User::model()->findByAttributes($attributes,$condition,$params);
    // 通过指定的 SQL 语句查找结果中的第一行
    $user=User::model()->findBySql($sql,$params);

    //通过构建CDbCriteria实例完成更复杂的操作
    $criteria=new CDbCriteria;
    $criteria->select='email';  // 只选择 'email' 列
    $criteria->condition='user_id=:user_id';
    $criteria->params=array(':user_id'=>$id);
    $user=User::model()->find($criteria); // $params 不需要了
?>
```

* 更新(update)

```php
<?php
    $user=User::model()->findByPk(3);
    $user->username='newName';
    $user->save(); // 将更改保存到数据库
?>
```

* 删除(Delete)

```php
<?php
    $user=User::model()->findByPk(10); // 假设有一个用户，其 ID 为 10
    $user->delete(); // 从数据表中删除此行

    User::model()->deleteAll("type='test'");
?>
```

* 关联查询

```php
<?php
    //懒加载,使用该属性再取回
    $user=User::model()->findByPk(1);
    $user->article;
    //渴求加载，一次性取回
    $user=User::model()->with('article')->findAll();
?>
```

## 6. 控制器`Controller`

控制器是MVC中的C，由CController继承而来，负责处理请求以及生成响应，一个控制器的声明周期如下：

```flow
st=>start: 创建Controller实例
e=>end: 结束
op0=>operation: 执行CController:init()方法
op1=>operation: 确定操作ID创建操作(默认操作/独立操作/内联操作/异常)
op2=>operation: 依次调用应用主体、模块、控制器的beforeAction()方法
op3=>operation: 控制器执行操作(请求数据解析和填入到操作参数)
op4=>operation: 依次调用应用主体、模块、控制器的afterAction()方法
op5=>operation: 应用主体获取操作结果并赋值给响应

st->op0->op1->op2->op3->op4->op5->e
```

一个简单的控制器文件如下所示，主要由执行过滤和一系列动作组成。

```php
<?php
    Class SiteController extend CController{
        //执行过滤
        public function filters(){...}
        //指定一些通用的action
        public function actions(){...}
        public function actionIndex(){...}
        public function actionLogin(){...}
        public function actionContact()
        {
            //设置对应layout布局，不需要时将该值设为false，默认view/layouts/main.php
            $this->layout = 'newLayout';
            //构建模型实例
            $model = new ContactForm();
            //根据POST的内容渲染视图
            if ($model->load(Yii::app()->request->post()) && $model->contact(Yii::app()->params['adminEmail'])) {
                Yii::$app->session->setFlash('contactFormSubmitted');
                return $this->refresh();
            }
            return $this->render('contact', [
                'model' => $model,
            ]);
        }
    }
?>
```

## 7. 视图`View`

视图是MVC架构中的V，用于展示从数据到终端用户的代码

视图方面推荐[Smarty3](https://www.smarty.net/docs/zh_CN/)，比原生View要简洁高效很多，相关教程后续加上。

> **Reference:**
> http://www.yiiframework.com/doc/guide/1.1/zh_cn/index
> http://www.yiichina.com/doc/api/1.1

>博文作者：**vicfeel**
 博文出处：http://www.cnblogs.com/vicfeel
 本文版权归作者和博客园共有，欢迎转载，但须保留此段声明，并给出原文链接，谢谢合作！
 如果阅读了本文章，觉得有帮助，您可以为我的博文点击“推荐一下”！