##0 引言##

&nbsp;&nbsp;&nbsp;&nbsp;`专题地图`是突出而深入的表示一种或几种要素或现象，即按照地图主题的要求，集中表示与主题有关内容的地图。专题地图的专题要素多种多样，分类方法也多种多样，根据专题地图表现数据的特点可分为定性专题地图和定量专题地图。`定性专题地图`用于表示种类或名称现象数据的空间分布和定位特征，`定量专题地图`则强调不同位置上空间地理目标的数量特征。

&nbsp;&nbsp;&nbsp;&nbsp;国内已有很多在线专题图制作平台，包括[地图汇](http://www.dituhui.com/)、 [爱地图](http://aimap.dsac.cn/)等，对其专题图类型进行分类整理，可得到以下分类：

&nbsp;&nbsp;&nbsp;&nbsp;| 类型  | 专题图 |
|---|---|
| 定量专题地图  |范围值专题图（分层设色）|
|  |等级符号专题图|
|  |饼状专题图|
|  |柱状专题图|
| 定性专题地图  |分布专题图|
|   |热力专题图|
|   |趋势专题图|

##1 初衷##

&nbsp;&nbsp;&nbsp;&nbsp;HTML5的canvas提供基础的绘制功能，为在线专题图的实现提供了方法（地图汇就是基于canvas开发的相关功能），然而这种方式成本较高，需要自己实现地图渲染、比例尺缩放等一系列功能。

&nbsp;&nbsp;&nbsp;&nbsp;基于[Arcgis API for Javascript](https://developers.arcgis.com/javascript/)二次开发也是一个很好的选择，`ArcGIS API for Javascript`是ESRI基于dojo，采用JavaScript技术实现的调用ArcGIS Server REST API接口的一组脚本,提供了web端地图相关基础功能，在制图方面， [esri/renderers](https://developers.arcgis.com/javascript/3/jsapi/renderer-amd.html)包含地图渲染方式相关的类，可用于范围值、唯一值、热力图等专题图的渲染，但仍存在以下问题：

* 对于柱状图、饼状图、等级符号等专题图，目前版本(4.0)并没有直接的开发接口。
* 图例组件显示内容不能很好的满足专题图要求
* 制作专题图涉及类库较多

&nbsp;&nbsp;&nbsp;&nbsp;鉴于此，基于ArcGIS JS API封装了这套专题图制图类库`OTMaps(Online Themetic Maps)`，并开源出来供大家使用，同时希望使用者积极反馈或一起修改完善。

##2 思路##

&nbsp;&nbsp;&nbsp;&nbsp;实现思路如下图所示：

![](http://images2015.cnblogs.com/blog/976988/201607/976988-20160712100438232-1706072609.png)

&nbsp;&nbsp;&nbsp;&nbsp;各个专题图类的方法相同，都包括draw、clear、setConfig，均继承自OTMap父类，而draw方法则各自实现，同时draw的实现并非是独立的，而有很多重叠的部分，比如柱状专题图可能会用到除了柱子的渲染外，还会用到独立值渲染或者范围值渲染，部分专题图都会用到图例，因为将核心渲染方法封装渲染类中，各个专题图的实现本质上是渲染类中各个组件的调用。

##3 使用##
&nbsp;&nbsp;&nbsp;&nbsp; 项目地址：[https://github.com/Vicfeel/OTMaps/](https://github.com/Vicfeel/OTMaps/)
&nbsp;&nbsp;&nbsp;&nbsp; 效果截图：

&nbsp;&nbsp;&nbsp;&nbsp;![](http://images2015.cnblogs.com/blog/976988/201607/976988-20160712100349561-1834115544.png)
&nbsp;&nbsp;&nbsp;&nbsp;![](http://images2015.cnblogs.com/blog/976988/201607/976988-20160712102703217-1167743538.png)
&nbsp;&nbsp;&nbsp;&nbsp;![](http://images2015.cnblogs.com/blog/976988/201607/976988-20160712102748732-1206071438.png)
&nbsp;&nbsp;&nbsp;&nbsp;![](http://images2015.cnblogs.com/blog/976988/201607/976988-20160712102800217-2032410124.png)


>博文作者：**vicfeel**
 博文出处：**http://www.cnblogs.com/vicfeel**
 本文版权归作者和博客园共有，欢迎转载，但须保留此段声明，并给出原文链接，谢谢合作！
 如果阅读了本文章，觉得有帮助，您可以为我的博文点击“推荐一下”！