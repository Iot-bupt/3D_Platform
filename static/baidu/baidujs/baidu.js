var tenantId=0;
document.write("<script language=javascript src='../static/baidu/baidujs/upLoadFile.js'><\/script>");
var loc = location.href;
var reqArray=new Array;
var idArray=new Array;
var logArray=new Array;
var lohArray=new Array;
var nameArray=new Array;
var openIfoID;
var siteID;
var adds=[];
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
    var myMark = new BMapLib.MarkerTool(map);
    map.centerAndZoom("北京");         // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    var point=new BMap.Point(116.404, 39.915);
    map.centerAndZoom(point, 12);




//百度地图API功能


/////////////////////////////初始化//////////////////
window.onload=function(){

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
            for (var i = 0; i < req.sites.length; i++) {
                idArray.push(req.sites[i].id);
                logArray.push(req.sites[i].longtitude);
                lohArray.push(req.sites[i].latitude);
                 var date1=new Date(req.sites[i].createdAt);
                 //var time=date.getFullYear()+date.getMonth()+date.getDate();
                 var year=date1.getFullYear();
                 var month=date1.getMonth();
                 var date=date1.getDate();
                //console.log(req.sites[i].id);
                var content =
                    '<div >'+
                    ' <table>'+
                    ' <tr>'+
                    ' <td>'+'用户id:'+'</td>'+
                    '<td>'+req.sites[i].tenantId+
                    '</td>'+
                    '</tr>'+
                    ' <tr>'+
                    ' <td>'+'站点id:'+'</td>'+
                    '<td>'+req.sites[i].id+
                    '</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>'+'名称:'+'</td>'+
                    '<td>'+req.sites[i].name+'</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>'+'经度:'+'</td>'+
                    '<td>'+req.sites[i].longtitude+'</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>'+'纬度:'+'</td>'+
                    '<td>'+req.sites[i].latitude+'</td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td>'+'创建时间:'+'</td>'+
                    '<td>'+year+'-'+month+'-'+date+'</td>'+
                    '</tr>'+

                    '</table> '+'<input type="button" id="addModel" value="上传场景" onclick="addModel()"/>'+'   '
                    +'<input type="button" id="alterSite" value="修改站点" onclick="alterSite()"/>'+'   '
                    +'<a href="/demo" target="_self">'+'进入场景'+'</a>' +
                    '</div>'

                var opts = {
                    width : 250,     // 信息窗口宽度
                    height: 150,     // 信息窗口高度
                    //title : "海底捞王府井店" , // 信息窗口标题
                    enableAutoPan:true,
                    enableMessage:true//设置允许信息窗发送短息

                };
                var point=new BMap.Point(req.sites[i].longtitude,req.sites[i].latitude);
                adds.push(point);
                var marker = new BMap.Marker(point);// 创建标注
                map.addOverlay(marker);
                marker.disableDragging();           // 不可拖拽
                addClickHandler(content,marker);

                function addClickHandler(content,marker){
                    marker.addEventListener("click",function(e){
                        openInfo(content,e)
                        openIfoID=marker;
                        //console.log(openIfoID);
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

                var label = new BMap.Label(req.sites[i].id,{offset:new BMap.Size(20,-10)});
                marker.setLabel(label);




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
                                    }
                                });
                            }
                        }

                    }
                    else if(mymessage==false)
                    {
                        alert('取消');
                    }
                }
            }
        }, complete: function() {
            //请求完成的处理
            alert('连接完成');
            ///////////////////////////列表跳转///////////////////////////////////////
            
            if(loc.indexOf("?listID=")!=-1)
            {
              //console.log(loc);
              //console.log(loc.substr(loc.indexOf("=")+1));
              var id = loc.substr(loc.indexOf("=")+1)//从=号后面的内容
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
  
               // $.ajax({
               //      url:'/api/sites/'+id1,
               //      type:'get',//提交方式
               //      dataType:'JSON',//返回字符串，T大写
               //      success: function(req){
               //          console.log(req);
               //          point=new BMap.Point(req.sites[0].longtitude,req.sites[0].latitude);
               //          map.centerAndZoom(point, 22);

               //      },
               //      error:function(error)
               //      {
               //          alert(error.message);
               //      }
               //  });
            }
        }

    });
}


//////////////////////////添加站点///////////////////
	function markfinish(){
        if(name1.value!=""&&tenantId1.value!=""&&longitude.value!=""&&latitude.value!="")
        {


        map.removeEventListener("click");
        map.removeEventListener("click",getPoint);
        map.setDefaultCursor("url(http://api0.map.bdimg.com/images/openhand.cur) 8 8,default");
		document.getElementById('nav').style.display='none';

        $.ajax({
            url:'/api/sites',
            data:
                {name:name1.value,tenantId:tenantId1.value,longtitude:longitude.value,latitude:latitude.value},
            type:'POST',//提交方式
            dataType:'JSON',//返回字符串，T大写
            success: function(req){
                // for(var i=0;i<reqArray.length;i++)
                // {
                //     idArray[i]=reqArray[i].id;
                //     logArray[i]=reqArray[i].log;
                //     lohArray[i]=reqArray[i].loh;
                //     nameArray[i]=reqArray[i].name;
                // }

                if(req!='')//data.trim 去空格,防止出错
                    alert ("添加成功 ");
                else
                    alert("添加失败");
            },
			error:function(error)
			{
				alert(error.message);
			}
        });
        }

	var opts = {
	  width : 200,     // 信息窗口宽度
	  height: 100,     // 信息窗口高度
	  enableAutoPan:true,    //自动平移
	  //disableAutoPan:true,
	  enableMessage:true//设置允许信息窗发送短息

	};
}

//标注
function mark1()
{
    myDis.close();  //关闭鼠标测距大
    //myMark.open();
    tenantId1.value=tenantId;
    document.getElementById('nav').style.display='block';
    
}

function getPoint(e)
{
    tenantId1.value=tenantId;
    document.getElementById('nav').style.display='block';
    longitude.value=e.point.lng;
    latitude.value=e.point.lat;
}

function mark2()
{
    myDis.close();  //关闭鼠标测距大
    //myMark.open();
    //map.setCursor("url('bird.cur')");
    map.setDefaultCursor("crosshair");
    map.addEventListener("click",getPoint);
    //alert(map.getDefaultCursor());
 }

///////////////////////修改站点//////////////////////////
function alterSite()
{
    document.getElementById('div2').style.display='block';
    for (var i = 0; i < reqArray.length; i++) {
        if ((openIfoID.point.lat == reqArray[i].latitude) && (openIfoID.point.lng == reqArray[i].longtitude)) {
            // console.log(openIfoID);
            // console.log(openIfoID.point.lat);
            siteId=reqArray[i].id;
            siteOldID.value=reqArray[i].id;
            siteOldName.value=reqArray[i].name;}
    }
}

function renameSite() {
    if(siteNewName.value!="")
    {
    $.ajax({
        url: '/api/sitename/' + siteId,
        data:
            {name: siteNewName.value},
        type: 'put',//提交方式
        dataType: 'JSON',//返回字符串，T大写
        success: function (req) {
            document.getElementById('div2').style.display='none';
            if (req != '') {
                alert('修改完成');
            }
            else {
                alert('修改失败');
            }

        },
        error: function (error) {
            alert(error.message);
        }
    });
}
else{}
}

///////////////////////查找站点//////////////////
$(btn).click(function(){
    console.log(idArray)

    var a=idArray.indexOf(parseInt(address.value));
    if(a!=-1)
    {
         //logArray=req.sites[i].longtitude;
         //lohArray=req.sites[i].latitude;
         point=new BMap.Point(logArray[a],lohArray[a]);
         map.centerAndZoom(point, 22);
    }
    else
    {
        alert('没有发现该站点')
    }
    // $.ajax({
    //     url:'/api/sites/'+address.value,
    //     type:'get',//提交方式
    //     dataType:'JSON',//返回字符串，T大写
    //     success: function(req){
    //         if(req.sites[0].tenantId==tenantId)
    //         {
    //             point=new BMap.Point(req.sites[0].longtitude,req.sites[0].latitude);
    //             map.centerAndZoom(point, 22);
    //         }
    //         else
    //         {
    //             alert('没有发现该站点');
    //         }
            
    //     },
    //     error:function(error)
    //     {
    //         alert(error.message);
    //     }
    // });
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

var pullBox = new BMapLib.SearchInRectangle(map,{
    renderOptions:{
        map: map,
        strokeWeight: 2,
        strokeColor: "red",
        opacity: 0.7,
        //followText: "拖拽鼠标搜索"+ keyword +"",
        autoClose: false,
        autoViewport: false,
        panel: "result",
        selectFirstResult: true
    },onSearchComplete: function(){
    alert("1");
    }

});
pullBox.setFillColor("white");
pullBox.setLineStyle("dashed");

// $(searchOn).click(function(){
//     pullBox.open();
// });
// $(searchOff).click(function(){
//     pullBox.close();
// });

var index = 0;
var myGeo = new BMap.Geocoder();



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
    document.getElementById("div1").style.display="block";
    for (var i = 0; i < reqArray.length; i++) {
        if ((openIfoID.point.lat == reqArray[i].latitude) && (openIfoID.point.lng == reqArray[i].longtitude)) {        
            siteId.value=reqArray[i].id;
            }
    }
}

//添加监听事件
var removeMarker = function(e,ee,marker){
    map.removeOverlay(marker);
}

//测量事件监听
map.addEventListener("load",function(){
    myDis.open();  //开启鼠标测距
    //myDis.close();  //关闭鼠标测距大
});

//覆盖物
var overlays=[];
var overlaycomplete=function(e){
    overlays.push(e.overlay);
    console.log(e);
};
var styleOptions = {
    strokeColor:"red",    //边线颜色。
    fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3,       //边线的宽度，以像素为单位。
    strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid' //边线的样式，solid或dashed。
}
var drawingManager = new BMapLib.DrawingManager(map, {
    isOpen: false, //是否开启绘制模式
    enableDrawingTool: true, //是否显示工具栏
    drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(5, 5), //偏离值
    },
    circleOptions: styleOptions, //圆的样式
    polylineOptions: styleOptions, //线的样式
    polygonOptions: styleOptions, //多边形的样式
    rectangleOptions: styleOptions //矩形的样式
});

//添加鼠标绘制工具监听事件，用于获取绘制结果
drawingManager.addEventListener('overlaycomplete', overlaycomplete);
function clearAll() {
    for(var i = 0; i < overlays.length; i++){
        map.removeOverlay(overlays[i]);
    }
    overlays.length = 0
}

//关闭窗口
function closeWin()
{
    document.getElementById("nav").style.display='none';
    map.removeEventListener("click",getPoint);
    map.setDefaultCursor("url(http://api0.map.bdimg.com/images/openhand.cur) 8 8,default");

}

function CloseDiv1()
{
    document.getElementById("div1").style.display="none";
    //document.getElementById("open").style.display="block";
}
function CloseDiv2()
{
    document.getElementById("div2").style.display="none";
    //document.getElementById("open").style.display="block";
}




