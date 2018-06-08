
var mainApp = angular.module("mainApp",["ngResource"]);


mainApp.controller("mainCtrl",["$scope","$resource",function($scope,$resource){

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

/*动态显示左侧箭头
    jQuery("#arrow").mouseover(function(){
        jQuery("#arrow").css({"margin-left":"-10px"});
    })
    jQuery("#arrow").mouseout(function(){
        jQuery("#arrow").css({"margin-left":"-60px"});
    })
    jQuery('#arrow').css({'display':'none'});
    */


    //显示初始化
    jQuery('#showDeviceInfo').css({'display':'none'});
    jQuery('#addModel').css({'display':'none'});
    jQuery('#backList').css({'display':'none'});
    jQuery('#updatePosition').css({'display':'none'});


    jQuery("#searchBanner").animate({width:"470px"},500);//初始显示搜索框
    jQuery("#iconSpan").css("display","block");
    jQuery("#searchDeviceDiv").css("opacity","0.2");



//==================================
$scope.changeIcon = function(){
    
    if(jQuery("#icon").attr("class") == "fa fa-angle-double-down"){
        jQuery("#allDevice").slideDown();
        jQuery("#icon").attr("class","fa  fa-angle-double-up");
        
    }else{
        jQuery("#allDevice").slideUp();
        jQuery("#icon").attr("class","fa fa-angle-double-down");
    }
   
}
    /*
$scope.packSearchMenu = function(){
    if(jQuery("#packUp").attr("class") == "fa fa-angle-double-left"){
        jQuery("#iconSpan").css("display","none");
        jQuery("#searchDeviceDiv").css("opacity","0");
        jQuery("#searchBanner").animate({width:"0px"},500);
        jQuery("#packUp").attr("class","fa fa-angle-double-right");
        jQuery("#allDevice").slideUp();
        jQuery("#icon").attr("class","fa fa-angle-double-down");


    }else{
        jQuery("#iconSpan").css("display","block");
        jQuery("#searchDeviceDiv").css("opacity","0.2");
        jQuery("#searchBanner").animate({width:"470px"},500);
        jQuery("#packUp").attr("class","fa fa-angle-double-left");
    }
} */
    // $scope.changeIcon = function(){
    //     if(jQuery("#icon").attr("class") == "fa fa-angle-double-down"){
    //         jQuery("#icon").attr("class","fa  fa-angle-double-up");
    //     }else{
    //         jQuery("#icon").attr("class","fa fa-angle-double-down");
    //     }

    // }


    var idOffset;//用于查找下一页
    var textOffset;//用于查找下一页
    var hasNext;//判断是否存在下一页
    var preDeviceId = [];//用于查找上一页
    var preDeviceName = [];//用于查找上一页
    var pageNum = 1;//记录当前页面


    //当前场景下的id：/api/3d815/siteDevicePaging/2/133?limit=6&idOffset=&textOffset=
//默认设备列表/api/3d815/paging/2?limit=6&idOffset=&textOffset=
    jQuery.ajax({
        url:"/api/3d815/siteDevicePaging/2/133?limit=6&idOffset=&textOffset=",
        contentType: "application/json; charset=utf-8",
        async: false,
        type:"GET",
        success:function(msg) {
            //console.log(msg);
            if(msg.data.length != 0){
                $scope.deviceList = msg.data;
                //console.log($scope.deviceList);
                //console.log($scope.deviceList.length);
                if($scope.deviceList.length>=6){
                    idOffset = msg.nextPageLink.idOffset;//用于查找下一页
                    textOffset = msg.nextPageLink.textOffset;//用于查找下一页
                    hasNext = msg.hasNext;//判断是否存在下一页
                    //console.log(idOffset);
                    //console.log(textOffset);
                    //console.log(hasNext);
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);
                }
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

/*搜索
$scope.searchDeviceInfo = function(){
    var temp= window.location.search;
    var tenantId = temp.split("=");
    console.log(tenantId[1]);
    tenantId[1] = 2;//用于测试
    var textSearch = jQuery("#searchDevice").val();
    if(jQuery("#allDevice").css("display") == "none"){
        jQuery("#allDevice").slideDown();
        jQuery("#icon").attr("class","fa  fa-angle-double-up");
    }
    if(textSearch === ""){
        //显示下方所有设备列表，从第一页开始
        // $scope.reShowList = function(){
        pageNum = 1;
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
    }

    }*/

/*搜索*/
    $scope.searchDeviceInfo = function(){
        jQuery('#backList').css({'display':''});
        var temp= window.location.search;
        var tenantId = temp.split("=");
        console.log(tenantId[1]);
        tenantId[1] = 2;//用于测试
        var textSearch = jQuery("#searchDevice").val();
        if(jQuery("#allDevice").css("display") == "none"){
            jQuery("#allDevice").slideDown();
            jQuery("#icon").attr("class","fa  fa-angle-double-up");
        }
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
                    if($scope.deviceList.length<7){
                        hasNext=false;
                        pageNum == 1;
                    }
                }
            });
        }

    }


//点击x按钮消失
    $scope.closeDeviceList = function(){
        jQuery('#allDevice').css({'display':'none'});
        jQuery('#showDeviceInfo').css({'display':'none'});
    }

    $scope.closeDeviceInfo = function(){
        jQuery('#showDeviceInfo').css({'display':'none'});
        jQuery('#addModel').css({'display':'none'});
    }

    $scope.closeAddModel = function(){
        jQuery('#addModel').css({'display':'none'});
    }

    $scope.arrowHidden = function(){
        jQuery('#arrow').css({'display':'none'});
        jQuery('#allDevice').css({'display':''});
    }
    $scope.closeUpdate = function(){
        jQuery('#updatePosition').css({'display':'none'});
    }

//选中设备信息展示
    $scope.show = function(data){
        $scope.deviceInfo = data;
        //console.log($scope.deviceInfo);
        $scope.id = data.id;
        $scope.name = data.name;
        $scope.manufacture = data.manufacture;
        $scope.parentDeviceId = data.parentDeviceId;
        $scope.status = data.status;
        $scope.location = data.location;
        $scope.deviceType = data.deviceType;
        $scope.model = data.model;
        jQuery('#showDeviceInfo').css({'display':''});
    }

//点击添加模型显示框
    $scope.addModel = function(){
        jQuery('#addModel').css({'display':''});
        jQuery('#updatePosition').css({'display':'none'});
    }

    //更新位置
    $scope.update = function(){
        jQuery('#addModel').css({'display':'none'});
        jQuery('#updatePosition').css({'display':''});
    }

    var flag = 0;
    $scope.lookAt = function(id) {
        
        var dModel = [];
        $.ajax({
            url:'/api/dModel/getSitedModelByDid/'+id,
            type:'GET',
            async:false,
            success: function(res){
                dModel = res.dModels;
            },
            error: function(e){
                alert("获取该设备模型失败"+e.message);
            }
        });
        var position = JSON.parse(dModel[0].location).position;
        switch (flag)
        {
            case 0:
                camera.position.set(position.x+6.0,position.y,position.z);
                camera.lookAt(position.x,position.y,position.z);
                
                flag+=1;
                break;
            case 1:
                camera.position.set(position.x,position.y,position.z-6.0);
                camera.lookAt(position.x,position.y,position.z);
                
                flag+=1;
                break;
            case 2:
                camera.position.set(position.x-6.0,position.y,position.z);
                camera.lookAt(position.x,position.y,position.z);
                
                flag+=1;
                break;
            case 3:
                camera.position.set(position.x,position.y,position.z+6.0);
                camera.lookAt(position.x,position.y,position.z);
                
                flag=0;
                break;
            default:
                flag = 0;
        }
        
        
    }




    //返回设备列表首页
    $scope.backList = function () {
        jQuery.ajax({
            url:"/api/3d815/siteDevicePaging/2/133?limit=6&idOffset=&textOffset=",
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(msg) {
                if(msg.data.length != 0){
                    $scope.deviceList = msg.data;
                    if($scope.deviceList.length>=6){
                        idOffset = msg.nextPageLink.idOffset;//用于查找下一页
                        textOffset = msg.nextPageLink.textOffset;//用于查找下一页
                        hasNext = msg.hasNext;//判断是否存在下一页
                        preDeviceId.push(idOffset);
                        preDeviceName.push(textOffset);

                    }
                }
            }
        });
        jQuery('#backList').css({'display':'none'});
    }

    /*给当前租户，当前设备场景创建模型*/
    $scope.submitModel = function(){
        //console.log($scope.deviceInfo.id);
        //console.log($scope.deviceInfo.name);//均能正常获得；
        //var x = Number(jQuery("#xValue").val());
        //var y = Number(jQuery("#yValue").val());
        //var z = Number(jQuery("#zValue").val());
        //console.log(x);
        var JSONBody = {
            position:{
                x:Number(jQuery("#xValue").val()),
                y:Number(jQuery("#yValue").val()),
                z:Number(jQuery("#zValue").val())
            },
            scale:{
                x:Number(jQuery("#xScaleValue").val()),
                y:Number(jQuery("#yScaleValue").val()),
                z:Number(jQuery("#zScaleValue").val())
            },
            rotation:{
                x:Math.PI/2,
                y:Math.PI/2,
                z:Number(jQuery("#zRotationValue").val())
            }
        }
        console.log(JSONBody);

        jQuery.ajax({
            url: '/api/dModel/createModel/2/133',
            dataType: 'json',
            method: 'POST',
            data: {
                "deviceId": $scope.deviceInfo.id,
                "location": JSON.stringify(JSONBody),
                "name": $scope.deviceInfo.name,
                "dModelUrl": "sensor_center.stl"
            },
            success:function(res){
                //$("#addModel").modal("hide");
                //location.reload();
                console.log(res);
            },
            error:function(){
                alert("创建失败！");
            }
        });

    }
/*
* var JSONBody = {
            "deviceId": $scope.deviceInfo.id,
            "location": 'x:'+x+',y:'+y+',z:'+z,
            "name": $scope.deviceInfo.name,
            "dModelUrl": ""
        }
        console.log(JSONBody);
        var Body = JSON.stringify(JSONBody);
        console.log(Body);

        '{position:{x:'+ JSONBody.position.x+',y:'+JSONBody.position.y+',z:'+JSONBody.position.z+'}，'+
                            'scale:{x:'+JSONBody.scale.x+',y:'+JSONBody.scale.y+',z:'+JSONBody.scale.z+'}，'+
                            'rotation:{x:'+JSONBody.rotation.x+',y:'+JSONBody.rotation.y+',z:'+JSONBody.rotation.z+'}}',

/*重置参数*/
    $scope.reSet = function(){
        jQuery('#xValue').val("");
        jQuery('#yValue').val("");
        jQuery('#zValue').val("");
        jQuery('#xScaleValue').val("");
        jQuery('#yScaleValue').val("");
        jQuery('#zScaleValue').val("");
        jQuery('#xRotationValue').val("");
        jQuery('#yRotationValue').val("");
        jQuery('#zRotationValue').val("");
    }

    /*删除模型*/
    $scope.delModel = function(){
        console.log($scope.deviceInfo);
        var deviceId = $scope.deviceInfo.id;
        console.log(deviceId);
        jQuery.ajax({
            url: '/api/dModel/dModelDelete/'+deviceId,
            dataType: 'json',
            method: 'DELETE',
            success:function(res){
                console.log(res);
                //alert("ssss");
                $("#deleteModel").modal("hide");
                location.reload();
            },
            error:function(){
                alert("已无模型！");
            }
        });
    }




//初始化显示默认模型jQuery-ui
    jQuery("#tabs").tabs();
    //拖动框
    jQuery("#addModel").draggable();
    jQuery("#updatePosition").draggable();
    jQuery("#showDeviceInfo").draggable();

}]);
