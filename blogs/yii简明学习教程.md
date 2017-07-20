# Yii 简明学习教程

Yii是一个基于组件的高性能PHP框架，用于快速开发Web应用程序

## 典型的工作流

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

## 入口脚本`index.php`

```php
<?php
    //定义全局变量
    defined('YII_DEBUG') or define('YII_DEBUG', true);
    defined('YII_ENV') or define('YII_ENV', 'dev');
    //包含yii核心类文件
    require(__DIR__ . '/../vendor/yiisoft/yii2/Yii.php');
    //加载应用配置
    $config = require(__DIR__ . '/../config/web.php');
    //根据配置构建应用主体来处理请求，应用主体构建完成后可以通过Yii::$app来访问
    (new yii\web\Application($config))->run();
?>
```

## 应用配置`config.php`

应用主体的相关配置，可以内部属性可以通过`Yii::$app->attributeName`访问

```php
<?php
$config = [
    'id' => 'basic',  //应用主体ID
    'basePath' => dirname(__DIR__), //应用的根路径
    'language' => 'zh-CN',  //网页语言
    'defaultRoute' => 'post/index',  //默认路由
    'bootstrap' => ['log'],  //自动启动的组件
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
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ]
    ]
];

return $config;
?>
```

## 模型`Model`

模型是MVC架构中的M，由yii\base\Model或其子类（如ActiveRecord)继承而来，是表现业务数据、规则和逻辑的对象

```php
<?php
    class ContactForm extends Model
    {
        //【业务数据】
        public $name;
        public $email;
        public $verifyCode;
        //【业务规则】
        public function rules(){
            return [
                [['name', 'email', ], 'required'],
                ['email', 'email'],
                ['verifyCode', 'captcha'],
            ];
        }
        //指定属性在页面中显示的标签
        public function attributeLabels(){
            return [
                'verifyCode' => '验证码',
            ];
        }
        //【业务逻辑】
        public function contact($email){...}
    }
?>
```

## 控制器`Controller`

控制器是MVC中的C，由yii\base\Controller继承而来，负责处理请求以及生成响应，一个控制器的声明周期如下：

```flow
st=>start: 创建Controller实例
e=>end: 结束
op0=>operation: 执行yii\base\Controller:init()方法
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
    namespace app\controllers;
    use Yii;

    Class SiteController extend Controller{
        //执行过滤
        public function behaviors(){
            return [
                //用户权限
                'access' => [
                    'class' => AccessControl::className(),
                    'only' => ['logout'],
                    'rules' => [
                        [
                            'actions' => ['logout'],
                            'allow' => true,
                            'roles' => ['@'], //@-登录用户，？-未登录用户
                        ],
                    ],
                ],
                //用户行为
                'verbs' => [
                    'class' => VerbFilter::className(),
                    'actions' => [
                        'logout' => ['post'], //登出只允许提交方式为POST
                    ],
                ],
            ];
        }
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
            if ($model->load(Yii::$app->request->post()) && $model->contact(Yii::$app->params['adminEmail'])) {
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

## 视图`View`

视图是MVC架构中的V，用于展示从数据到终端用户的代码

```flow
op1=>operation: 模型(Model)
op2=>operation: 视图模板(小部件)
op3=>operation: 布局(Layout)

op1->op2->op3
```

* **视图模板（视图）**

为包含HTML和展示类PHP代码的PHP脚本

```php
<?php
    <?php
    use yii\helpers\Html;    //HTML帮助类
    use yii\widgets\ActiveForm;  //ActiveForm小部件

    $this->title = 'Contact';
    ?>
    <h1><?= Html::encode($this->title) ?></h1>
    <p>Please fill out the following fields to contact:</p>

    <?php $form = ActiveForm::begin(); ?>
        <?= $form->field($model, 'name') ?>
        <?= $form->field($model, 'email') ?>
        <?= Html::submitButton('Contact') ?>
    <?php ActiveForm::end(); ?>
?>
```

* **布局`layout`**

布局是一种特殊的视图，布局文件代表了多个视图中的公共部分，其中`$this`指向的是`yii\web\view`实例出来的对象，常用方法属性包含

方法/属性|作用
:---:|:---
$title|包含文档标题
beginBody()|body标签开始
endBody()|body标签结束
beginPage()|文档开始
endPage()|文档结束

`$content`为视图模板文件渲染出来的结果

```php
<?php
use yii\helpers\Html;
use app\assets\AppAsset;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>//布局的开始处
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <?= Html::csrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>  //在head标签中调用
</head>

<body>
<?php $this->beginBody() ?> //body开始处
<div class="wrap">
    <div class="container">
        <?= $content ?>   //视图模板替换的位置
    </div>
</div>
<footer class="footer"></footer>
<?php $this->endBody() ?> //body结束处
</body>
</html>
<?php $this->endPage() ?> //布局结束处
?>
```



> **Reference:**
> http://www.yiiframework.com/doc/guide/2.0/zh_cn/index
> http://www.yiichina.com/doc/guide/2.0
> http://www.yiichina.com/doc/api/2.0

>博文作者：**vicfeel**
 博文出处：http://www.cnblogs.com/vicfeel
 本文版权归作者和博客园共有，欢迎转载，但须保留此段声明，并给出原文链接，谢谢合作！
 如果阅读了本文章，觉得有帮助，您可以为我的博文点击“推荐一下”！