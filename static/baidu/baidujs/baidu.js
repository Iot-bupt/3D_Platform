var loc = location.href;
var tenantId
if((loc.indexOf("?id=")!=-1)&&(loc.indexOf("#listID*")!=-1))
{
    tenantId=loc.substring(loc.indexOf('=')+1,loc.indexOf('#'));
}


else if(loc.indexOf("?id=")!=-1)
            {
              var id = loc.substr(loc.indexOf("=")+1)//从=号后面的内容
              tenantId=id
            }
console.log(tenantId)
document.write("<script language=javascript src='../static/baidu/baidujs/upLoadFile.js'><\/script>");
var index = 0;
var myGeo = new BMap.Geocoder();
var reqArray=new Array;
var idArray=new Array;
var logArray=new Array;
var lohArray=new Array;
var nameArray=new Array;
var openIfoID;
var content;
var siteID;
var adds=[];
var markers=[];
var overlays=[];
var a;
var date1 
var year
var month
var date
var marker
var drawingManager
var biaozhi;
    var map = new BMap.Map("allmap");    // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);  // 初始化地图,设置中心点坐标和地图级别
    //添加地图类型控件
    map.addControl(new BMap.MapTypeControl({
        anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
        mapTypes:[
            BMAP_NORMAL_MAP,
            BMAP_HYBRID_MAP,
            BMAP_SATELLITE_MAP,
        ]}));

    //添加比例尺等控件
    var top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
    var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
    //var top_right_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
    map.addControl(top_left_control);
    map.addControl(top_left_navigation);
    //map.addControl(top_right_navigation);

    var myDis = new BMapLib.DistanceTool(map);
    //var myMark = new BMapLib.MarkerTool(map);
    map.centerAndZoom("北京");         // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    var point=new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 12);

    //覆盖物
var overlaycomplete=function(e){
    overlays.push(e.overlay);
    //console.log(e);
};
var styleOptions = {
    strokeColor:"red",    //边线颜色。
    fillColor:"",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}
drawingManager = new BMapLib.DrawingManager(map, {
    isOpen: false, //是否开启绘制模式
    enableDrawingTool: false, //是否显示工具栏
    drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(5, 5), //偏离值
    },
    circleOptions: styleOptions, //圆的样式
    polylineOptions: styleOptions, //线的样式
    polygonOptions: styleOptions, //多边形的样式
    rectangleOptions: styleOptions //矩形的样式
});

//百度地图API功能
function addClickHandler(content,marker){

    marker.addEventListener("click",function(e){
        openInfo(content,e)
        openIfoID=marker;
        //console.log(openIfoID);
        //console.log(content);
        }
    );
    var markerMenu=new BMap.ContextMenu();
    markerMenu.addItem(new BMap.MenuItem('删除',removeMarker.bind(marker)));
    marker.addContextMenu(markerMenu);
}

function openInfo(content,e){
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
    map.openInfoWindow(infoWindow,point); //开启信息窗口
}

//////////////////////////////删除站点//////////////////////////////
                function removeMarker(e,ee,marker){
                    var mymessage=confirm("确认删除站点？");
                    if(mymessage==true)
                    {
                        console.log(marker.point);
                        for(var i=0;i<reqArray.length;i++)
                        {
                            if((marker.point.lat==reqArray[i].latitude)&& (marker.point.lng==reqArray[i].longtitude))
                            {
                                map.removeOverlay(marker);
                                //alert(reqArray[i].id);
                                $.ajax({
                                    url:'/api/sites/'+reqArray[i].id,
                                    type:'DELETE',//提交方式
                                    dataType:'JSON',//返回字符串，T大写
                                    success: function(req)
                                    {
                                        if(req!='')
                                        {
                                            alert('删除成功');
                                        }
                                        else
                                        {
                                            alert('删除失败');
                                        }

                                    },
                                    error:function(error)
                                    {
                                        alert(error.message);
                                    },
                                    complete:function()
                                    {
                                        getSites();
                                    }
                                });
                            }
                        }

                    }
                    else if(mymessage==false)
                    {
                       
                    }
                }
var opts = {
    width : 250,     // 信息窗口宽度
    height: 150,     // 信息窗口高度
    //title : "海底捞王府井店" , // 信息窗口标题
    enableAutoPan:true,
    enableMessage:true//设置允许信息窗发送短息

};

function addContent(tenantId,id,name,longtitude,latitude,year,month,date)
{
        var content =
                    '<div >'+
                    ' <table>'+
                    ' <tr>'+
                    ' <td>'+'用户id:'+'</td>'+
                    '<td>'+tenantId+
                    '</td>'+
                    '</tr>'+
                    ' <tr>'+
                    ' <td>'+'站点id:'+'</td>'+
                    '<td>'+id+
                    '</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>'+'名称:'+'</td>'+
                    '<td>'+name+'</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>'+'经度:'+'</td>'+
                    '<td>'+longtitude+'</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>'+'纬度:'+'</td>'+
                    '<td>'+latitude+'</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>'+'创建时间:'+'</td>'+
                    '<td>'+year+'-'+month+'-'+date+'</td>'+
                    '</tr>'+

                    '</table> '+'<input type="button" id="addModel" value="上传场景" onclick="addModel()" />'+'   '
                    +'<input type="button" id="alterSite" value="修改站点" onclick="alterSite()"/>'+'   '
                    +'<a href="/demo" target="_self">'+'进入场景'+'</a>' +
                    '</div>'

                    return content;
}
function addMarkers(id,longtitude,latitude)
{
                var point=new BMap.Point(longtitude,latitude);
                adds.push(point);
                var marker = new BMap.Marker(point);// 创建标注
                markers.push(marker);
                map.addOverlay(marker);
                marker.disableDragging();           // 不可拖拽
                //addClickHandler(content,marker);
                var label = new BMap.Label(id,{offset:new BMap.Size(20,-10)});
                marker.setLabel(label);
                return marker;
}

function getSites()
{
    $.ajax({
        url: '/api/tenantsites/'+tenantId,
        type: 'get',
        async : false,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        error:function(){
            alert('失败');
        },
        success: function(req) {
            //请求成功时处理
            idArray=[];
            logArray=[];
            lohArray=[];
            nameArray=[];
            reqArray=req.sites;
            for (var i = 0; i < req.sites.length; i++) {
                idArray.push(req.sites[i].id);
                logArray.push(req.sites[i].longtitude);
                lohArray.push(req.sites[i].latitude);
                nameArray.push(req.sites[i].name);
                date1=new Date(req.sites[i].createdAt);
                year=date1.getFullYear();
                month=date1.getMonth()+1;
                date=date1.getDate();
                //console.log(req.sites[i].id);
        }
        }
    });
}
/////////////////////////////初始化//////////////////
window.onload=
function (){
    $.ajax({
        url: '/api/tenantsites/'+tenantId,
        type: 'get',
        async : false,
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',

        error:function(){
            alert('失败');
        },
        success: function(req) {
            console.log(req.sites);
            //请求成功时处理
            reqArray=req.sites;
            idArray=[];
            logArray=[];
            lohArray=[];
            nameArray=[];
            for (var i = 0; i < req.sites.length; i++) {
                idArray.push(req.sites[i].id);
                logArray.push(req.sites[i].longtitude);
                lohArray.push(req.sites[i].latitude);
                nameArray.push(req.sites[i].name);
                 var date1=new Date(req.sites[i].createdAt);
                 var year=date1.getFullYear();
                 var month=date1.getMonth()+1;
                 var date=date1.getDate();
                var content =addContent(tenantId,req.sites[i].id,req.sites[i].name,req.sites[i].longtitude,req.sites[i].latitude,year,month,date)
                 var marker =addMarkers(req.sites[i].id,req.sites[i].longtitude,req.sites[i].latitude)
                 //console.log(addContent())
                 addClickHandler(content,marker);

            }
        }, complete: function() {
            // console.log(markers)
            // var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
            //请求完成的处理
            alert('连接完成');
            ///////////////////////////列表跳转///////////////////////////////////////
            
            if(loc.indexOf("#listID*")!=-1)
            {
              var id = loc.substr(loc.indexOf("*")+1)//从=号后面的内容
              //alert(id.charAt(7));
               var a=idArray.indexOf(parseInt(id));
                if(a!=-1)
                {
                     point=new BMap.Point(logArray[a],lohArray[a]);
                     map.centerAndZoom(point, 22);
                }
                else
                {
                    alert('跳转失败');
                }
            }
        }

    });
}
//////////////////////////添加站点///////////////////
	function markfinish(){
        if($.inArray($('#name1').val(), nameArray)==-1)
        {
        if(name1.value!=""&&tenantId1.value!=""&&longitude.value!=""&&latitude.value!="")
        {
        map.removeEventListener("click");
        map.removeEventListener("click",getPoint);
        map.setDefaultCursor("url(http://api0.map.bdimg.com/images/openhand.cur) 8 8,default");
		//document.getElementById('nav').style.display='none';
        $('#addSites').modal('hide');
        $.ajax({
            url:'/api/sites',
            data:
                {name:$("#name1").val(),tenantId:tenantId,longtitude:$("#longitude").val(),latitude:$("#latitude").val()},
            type:'POST',//提交方式
            dataType: 'json',
            success: function(req){
                 getSites();
                if(req!='')//data.trim 去空格,防止出错
                 { getSites();
                // var date1=new Date(req.createdAt);
                //  //var time=date.getFullYear()+date.getMonth()+date.getDate();
                //  var year=date1.getFullYear();
                //  var month=date1.getMonth();
                //  var date=date1.getDate()+1;
                 var content =addContent(tenantId,req.id,req.name,req.longtitude,req.latitude,year,month,date)
                 var marker =addMarkers(req.id,req.longtitude,req.latitude)
                 //addMarkers(req.id,req.longtitude,req.latitude)
                 //console.log(addContent())
                 addClickHandler(content,marker);
                 //addMarkers(tenantId,req.id,req.name,req.longtitude,req.latitude,year,month,date)        
                    alert ("添加成功 ");}
                else
                    {alert("添加失败");}
            },
			error:function(error)
			{
				alert(error.message);
			},
            complete:function()
            {
               getSites();
            }
        });
        }
    }
    else
    {
        alert('该站点名已存在')
    }
}

//标注
function mark1()
{
    if(myDis.open())
    {
    	myDis.close();  //关闭鼠标测距大
    }
    console.log(drawingManager._isOpen)
    if(drawingManager._isOpen)
    {
    	drawingManager.close();
    }
    $('#tenantId1').val(tenantId);
    //document.getElementById('nav').style.display='block';
    $('#addSites').modal('show');  
}

function getPoint(e)
{
   $('#tenantId1').val(tenantId);
   $('#longitude').val(e.point.lng);
   $('#latitude').val(e.point.lat);
    $('#addSites').modal('show');
    //document.getElementById('nav').style.display='block';
   // longitude.value=e.point.lng;
    //latitude.value=e.point.lat;
}

function mark2()
{
    if(myDis.open())
    {
    	myDis.close();  //关闭鼠标测距大
    }
    if(drawingManager._isOpen)
    {
    	drawingManager.close();
    }
    map.setDefaultCursor("crosshair");
    map.addEventListener("click",getPoint);
    //alert(map.getDefaultCursor());
 }

///////////////////////修改站点//////////////////////////

function alterSite()
{
    //getSites();
    $('#renameSite').modal('show')
    for (var i = 0; i < reqArray.length; i++) {
        if ((openIfoID.point.lat == reqArray[i].latitude) && (openIfoID.point.lng == reqArray[i].longtitude)) {
            a=i;
            marker=openIfoID;
            // date1=new Date(reqArray[i].createdAt);
            // var year=date1.getFullYear();
            //      var month=date1.getMonth()+1;
            //      var date=date1.getDate();
            // console.log(openIfoID);
            // console.log(openIfoID.point.lat);
            siteId=reqArray[i].id;
            $('#siteOldID').val(reqArray[i].id);
            $('#siteOldName').val(reqArray[i].name);
            //siteOldID.value=reqArray[i].id;
            //siteOldName.value=reqArray[i].name;
            }
    }
}

function renameSite() {
    if($.inArray($('#siteNewName').val(), nameArray)==-1)
    {
       if($('#siteNewName').val()!="")
    {
    $.ajax({
        url: '/api/sitename/' + siteId,
        data:
            {name:$('#siteNewName').val()},
        type: 'put',//提交方式
        dataType: 'JSON',//返回字符串，T大写
        success: function (req) {
            console.log(req)
            //document.getElementById('div2').style.display='none';
            $('#renameSite').modal('hide')
            if (req != '') {
                alert('修改完成');
                getSites();
            }
            else {
                alert('修改失败');
            }

        },
        error: function (error) {
            alert(error.message);
        },
        complete:function()
        {
            map.removeOverlay(marker);
            var content =addContent(tenantId,reqArray[a].id,reqArray[a].name,reqArray[a].longtitude,reqArray[a].latitude,year,month,date);
            map.addOverlay(marker);
            marker.disableDragging();           // 不可拖拽
            addClickHandler(content,marker);
            var label = new BMap.Label(siteId,{offset:new BMap.Size(20,-10)});
            marker.setLabel(label);
        }
    });
}
else{} 
    }
else{
    alert('该站点名已存在');
}

    
}

///////////////////////查找站点//////////////////
$(btn).click(function(){
    //console.log(nameArray)
//console.log($.inArray(address.value, nameArray));
    // var a=nameArray.indexOf(address.value);
    // if(a!=-1)
    // {
    //      //logArray=req.sites[i].longtitude;
    //      //lohArray=req.sites[i].latitude;
    //      point=new BMap.Point(logArray[a],lohArray[a]);
    //      map.centerAndZoom(point, 22);
    // }
    // else
    // {
    //     alert('没有发现该站点')
    // }
    $.ajax({
        url:'/api/sites/'+$(address).val(),
        type:'get',//提交方式
        dataType:'JSON',//返回字符串，T大写
        success: function(req){
            console.log(req.sites)
            
            if(req.sites=='')
            {
                alert('该站点不存在');
            }
            else if(req.sites[0].tenantId==tenantId)
            {
                
                point=new BMap.Point(req.sites[0].longtitude,req.sites[0].latitude);
                map.centerAndZoom(point, 22);
            }
            else
            {
                alert('没有发现该站点');
            }
            
        },
        error:function(error)
        {
            alert(error.message);
        }
    });
});

///////////////////三级地图加载/////////////////
function loadPlace(longitude, latitude, level) {
                if (parseFloat(longitude) > 0 || parseFloat(latitude) > 0) {
                    level = level || 13;
                    //绘制地图
                    var point = new BMap.Point(longitude, latitude); //地图中心点
                    map.centerAndZoom(point, level); // 初始化地图,设置中心点坐标和地图级别。
                }
            }

function bdGEO(){
    var pt = adds[index];
    geocodeSearch(pt);
    index++;
}
function geocodeSearch(pt){
    if(index < adds.length-1){
        setTimeout(window.bdGEO,400);
    }
    myGeo.getLocation(pt, function(rs){
        var addComp = rs.addressComponents;
        document.getElementById("result").innerHTML += index + ". " +adds[index-1].lng + "," + adds[index-1].lat + "："  + "商圈(" + rs.business + ")  结构化数据(" + addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber + ")<br/><br/>";
    });
}

//添加模型
function addModel()
{
    //document.getElementById("div1").style.display="block";
    $('#addSences').modal('show');
    for (var i = 0; i < reqArray.length; i++) {
        if ((openIfoID.point.lat == reqArray[i].latitude) && (openIfoID.point.lng == reqArray[i].longtitude)) {        
            //siteId.value=reqArray[i].id;
            $('#siteId').val(reqArray[i].id);
            }
    }
}

//测量事件监听
map.addEventListener("load",function(){
    myDis.open();  //开启鼠标测距
    //myDis.close();  //关闭鼠标测距大
});

//关闭窗口
function closeWin()
{
    //document.getElementById("nav").style.display='none';
    $('#addSites').modal('hide');
    map.removeEventListener("click",getPoint);
    map.setDefaultCursor("url(http://api0.map.bdimg.com/images/openhand.cur) 8 8,default");

}

//////拉框//////
function draw() {
    if(myDis.open())
    {
        myDis.close();  //关闭鼠标测距大
    }
    if(biaozhi==1)
    {
        $("#myTable2  tr:not(:first)").empty("");
        biaozhi=0;
    }

drawingManager.open()
//添加鼠标绘制工具监听事件，用于获取绘制结果
drawingManager.addEventListener('overlaycomplete', overlaycomplete);

drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
}

/////////面积测量////////
function areaMeasure()
{
    if(myDis.open())
    {
        myDis.close();  //关闭鼠标测距大
    }
    drawingManager.open()
    drawingManager.enableCalculate()
//添加鼠标绘制工具监听事件，用于获取绘制结果
drawingManager.addEventListener('overlaycomplete', overlaycomplete);

drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
}

/////////////地点搜索//////
function G(id) {
        return document.getElementById(id);
    }
    // 定义一个控件类,即function
    function ZoomControl() {
        this.defaultAnchor = BMAP_ANCHOR_TOP_RIGHT;
        this.defaultOffset = new BMap.Size(10, 10);
    }
 
    // 通过JavaScript的prototype属性继承于BMap.Control
    ZoomControl.prototype = new BMap.Control();
 
    // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
    // 在本方法中创建个p元素作为控件的容器,并将其添加到地图容器中
    ZoomControl.prototype.initialize = function(map){
      // 创建一个DOM元素
      var p = document.createElement("p");
      p.innerHTML = '<p id="r-result"><input type="text" id="suggestId" class="form-control" placeholder="请输入地点" size="20"  style="width:200px; font-size:15px;" /></p><p id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></p>';
 
      // 添加DOM元素到地图中
      map.getContainer().appendChild(p);
      // 将DOM元素返回
      return p;
    }
 
    // 创建控件
    var myZoomCtrl = new ZoomControl();
    // 添加到地图当中
    map.addControl(myZoomCtrl);
 
 
    var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {"input" : "suggestId"
        ,"location" : map
    });
 
    ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
    var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }
        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
 
        value = "";
        if (e.toitem.index > -1) {
            _value = e.toitem.value;
            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        }
        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
        G("searchResultPanel").innerHTML = str;
    });
 
    var myValue;
    ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
    var _value = e.item.value;
        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
 
        setPlace();
    });
 
    function setPlace(){
        //map.clearOverlays();    //清除地图上所有覆盖物
        function myFun(){
            var placeLocal = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(placeLocal, 22);
            //map.addOverlay(new BMap.Marker(placeLocal));    //添加标注
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
          onSearchComplete: myFun
        });
        local.search(myValue);
    }

function clearAll() {
    //$("#myTable2  tr:not(:first)").empty("");
    //var drawingManager = new BMapLib.DrawingManager(map);
    biaozhi=1;
    drawingManager.close();
    for(var i = 0; i < overlays.length; i++){
        map.removeOverlay(overlays[i]);
    }
    overlays.length = 0
}

function deviceSearch()
{
  var input = document.getElementById("searchDevice");
  var filter = input.value.toUpperCase();//转换为大写
  var table = document.getElementById("myTable2");
  var tr = table.getElementsByTagName("tr");
  // 循环表格每一行，查找匹配项
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[3];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}

function lookSiteList()
{
    location.href="/sitesList?id="+tenantId;
}

function measure(){
	myDis.open();           
    if(drawingManager._isOpen)
    {
    	drawingManager.close();
    }
}

