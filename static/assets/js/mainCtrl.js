
var mainApp = angular.module("mainApp",["ngResource"]);


mainApp.controller("mainCtrl",["$scope","$resource",function ($scope,$resource) {

//============设备列表动画============
jQuery("#searchDevice").on("focus",function(){
    jQuery("#searchDeviceDiv").css("opacity","1");
});
jQuery("#searchDevice").on("blur",function(){
    jQuery("#searchDeviceDiv").css("opacity","0.2");
});
jQuery("#allDevice").mouseover(function(){
    jQuery("#allDevice").css({"background-color":"rgba(49, 47, 47, 1)","color":"#5087c3"});
    jQuery(".button").css("opacity","1");
});
jQuery("#allDevice").mouseout(function(){
    jQuery("#allDevice").css({"background-color":"rgba(255,255,255,0.1)","color":"#305680"});
    jQuery(".button").css("opacity","0.2");
});
//==================================



var idOffset;//用于查找下一页
var textOffset;//用于查找下一页
var hasNext;//判断是否存在下一页
var preDeviceId = [];//用于查找上一页
var preDeviceName = [];//用于查找上一页
var pageNum = 1;//记录当前页面

//默认设备列表
jQuery.ajax({
    url:"/api/3d815/paging/2?limit=6&idOffset=&textOffset=",
    contentType: "application/json; charset=utf-8",
    async: false,
    type:"GET",
    success:function(msg) {
        if(msg.data.length != 0){
            $scope.deviceList = msg.data;
            // console.log($scope.deviceList);
            idOffset = msg.nextPageLink.idOffset;
            textOffset = msg.nextPageLink.textOffset;
            hasNext = msg.hasNext;
            // console.log(idOffset);
            // console.log(textOffset);
            // console.log(hasNext);
            preDeviceId.push(idOffset);
            preDeviceName.push(textOffset);
        }
    }
});

// 下一页
$scope.nextPage = function(){
    console.log(hasNext);
    if(hasNext){
        jQuery.ajax({
            url:"/api/3d815/paging/2?limit=6&idOffset="+idOffset+"&textOffset="+textOffset,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(msg) { 
                console.log("/api/3d815/paging/2?limit=6&idOffset="+idOffset+"&textOffset="+textOffset);
                jQuery("#showDevice tr").remove(); 
                pageNum++;  
                $scope.deviceList = msg.data;
                if( msg.hasNext == true){
                    idOffset = msg.nextPageLink.idOffset;
                    textOffset = msg.nextPageLink.textOffset;
                    hasNext = msg.hasNext;
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);
                    console.log($scope.deviceList);
                }else{
                    hasNext = msg.hasNext;
                    
                }
            },
            error:function(err){
                toastr.warning("当前已是最后一页！");
            }
        });
    }else{
        toastr.warning("当前已是最后一页！");
    }
}

//上一页
$scope.prePage = function(){
    if(pageNum == 1){
        toastr.warning("当前已是第一页！");
    }
    else if(pageNum == 2){
        jQuery.ajax({
            url:"/api/3d815/paging/2?limit=6&idOffset=&textOffset=",
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(msg) {
                pageNum--;
                if(msg.data.length != 0){
                    jQuery("#showDevice tr").remove();  
                    $scope.deviceList = msg.data;
                    console.log($scope.deviceList);
                    idOffset = msg.nextPageLink.idOffset;
                    textOffset = msg.nextPageLink.textOffset;
                    hasNext = msg.hasNext;
                    console.log(idOffset);
                    console.log(textOffset);
                    console.log(hasNext);
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);
                }
            }
        }); 
    }else{
        jQuery.ajax({
            url:"/api/3d815/paging/2?limit=6&idOffset="+preDeviceId[pageNum-3]+"&textOffset="+preDeviceName[pageNum-3],
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(msg) { 
                pageNum--;
                jQuery("#showDevice tr").remove();   
                $scope.deviceList = msg.data;
                console.log($scope.deviceList);
                idOffset = msg.nextPageLink.idOffset;
                textOffset = msg.nextPageLink.textOffset;
                hasNext = msg.hasNext;
                console.log(idOffset);
                console.log(textOffset);
                console.log(hasNext);
                preDeviceId.push(idOffset);
                preDeviceName.push(textOffset);
                
            }
        });
    }
}

// 搜索
$scope.searchDeviceInfo = function(){
    var temp= window.location.search;
    var tenantId = temp.split("=");
    console.log(tenantId[1]);
    tenantId[1] = 2;//用于测试
    var textSearch = jQuery("#searchDevice").val();
    if(textSearch == ""){
        jQuery.ajax({
            url:"/api/3d815/paging/2?limit=6&idOffset=&textOffset=",
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(msg) {
                if(msg.data.length != 0){
                    $scope.deviceList = msg.data;
                    // console.log($scope.deviceList);
                    idOffset = msg.nextPageLink.idOffset;
                    textOffset = msg.nextPageLink.textOffset;
                    hasNext = msg.hasNext;
                    // console.log(idOffset);
                    // console.log(textOffset);
                    // console.log(hasNext);
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);
                }
            }
        });
    }else{
        jQuery.ajax({
            url:"/api/3d815/search/"+tenantId[1]+"?limit=1000&textSearch="+textSearch,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(msg) {
                jQuery("#showDevice tr").remove();
                console.log(msg.res.data);
               $scope.deviceList = msg.res.data;
            }
        });
    }
   
}

//选中设备信息展示
$scope.show = function(data){
    $scope.deviceInfo = data;
    console.log($scope.deviceInfo);
    $scope.id = data.id;
    $scope.name = data.name;
    $scope.manufacture = data.manufacture;
    $scope.parentDeviceId = data.parentDeviceId;
    $scope.status = data.status;
    $scope.location = data.location;
    $scope.deviceType = data.deviceType;
    $scope.model = data.model;
}


}]);




