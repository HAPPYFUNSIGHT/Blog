#Mysql安装配置教程（Mac）

##1 下载安装Mysql

[官网下载地址](https://dev.mysql.com/downloads/mysql/)

![mysql下载](https://raw.githubusercontent.com/Vicfeel/MDPhotos/master/Mysql/mysqlDownload.png)

* 下载dmg文件后，傻瓜式一路点下去

* 安装完成后打开系统偏好，在最下方找到Mysql

![系统偏好](https://raw.githubusercontent.com/Vicfeel/MDPhotos/master/Mysql/preference.png)

* 可以在这里设置启动/关闭Mysql服务，或勾选开机自动启动,此处先关闭MySQL服务

![开启服务](https://raw.githubusercontent.com/Vicfeel/MDPhotos/master/Mysql/startMysql.png)

##2 修改默认root数据库密码

* 开启终端并输入`sudo /usr/local/mysql/bin/mysqld_safe --skip-grant-tables`,接着输入用户密码

* 另外打开一个终端,输入`sudo /usr/local/mysql/bin/mysql -u root`,输入密码后会进入`mysql>`输入界面

* 输入指令`UPDATE mysql.user SET authentication_string=PASSWORD('新密码') WHERE User='root';`并回车，修改密码完成

* 输入`FLUSH PRIVILEGES;`并回车

* 输入`\q`回车，关闭两个终端

##3 安装mysql图形化界面-phpmyadmin

phpmyadmin是非常常用的mysql图形化管理软件，[官网下载地址](https://www.phpmyadmin.net/downloads/)

* 下载并解压至web根目录

我用的是Apache，web根目录在`/Library/WebServer/Documents/`，重命名文件夹为`phpmyadmin`

* 打开终端,进入到该目录下，依次输入以下指令，复制并修改配置文件

```
//进入安装目录
cd phpmyadmin
//拷贝配置文件
sudo cp config.sample.inc.php config.inc.php
//利用vim修改配置文件
sudo vim config.inc.php
```

在文件中找到`$cfg['Servers'][$i]['host']`将其值从`localost`修改为`127.0.0.1`即可

* 在浏览器中打开地址`http://localhost/phpmyadmin`即可以进入管理界面

* 登录用户名为`root`，密码为之前修改的新密码
![登录界面](https://raw.githubusercontent.com/Vicfeel/MDPhotos/master/Mysql/login.png)
![登录成功](https://raw.githubusercontent.com/Vicfeel/MDPhotos/master/Mysql/loginSuccess.png)