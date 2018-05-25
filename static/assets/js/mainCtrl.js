
var mainApp = angular.module("mainApp",["ngResource"]);


mainApp.controller("mainCtrl",["$scope","$resource",function ($scope,$resource) {


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

// var deviceListObj = $resource("/api/3d815/paging/2?limit=9&idOffset=&textOffset=");
// $scope.deviceList = deviceListObj.query();
// console.log($scope.deviceList);
var idOffset;
var textOffset;
var hasNext;
jQuery.ajax({
    url:"/api/3d815/paging/2?limit=6&idOffset=&textOffset=",
    contentType: "application/json; charset=utf-8",
    async: false,
    type:"GET",
    success:function(msg) {
        $scope.deviceList = msg.data;
        console.log($scope.deviceList);
        idOffset = msg.nextPageLink.idOffset;
        textOffset = msg.nextPageLink.textOffset;
        hasNext = msg.hasNext;
        console.log(idOffset);
        console.log(textOffset);
        console.log(hasNext);
        for(var i = 0;i<$scope.deviceList.length;i++){

            jQuery("#showDevice").prepend("<tr><td>"+$scope.deviceList[i].id+"</td><td>"+$scope.deviceList[i].name+"</td></tr>")
        }
        nextDevice = $scope.deviceList[$scope.deviceList.length-1];
        
    }
});
jQuery("#next").click(function(){
    if(hasNext == true){
        jQuery.ajax({
            url:"/api/3d815/paging/2?limit=6&idOffset="+idOffset,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(msg) {
                jQuery("#showDevice .info").remove;
                $scope.deviceList = msg.data;
                console.log($scope.deviceList);
                for(var i = 0;i<$scope.deviceList.length;i++){
        
                    jQuery("#showDevice").prepend("<tr class='info'><td>"+$scope.deviceList[i].id+"</td><td>"+$scope.deviceList[i].name+"</td></tr>")
                }
                
            }
        });
    }else{
        alert("当前已是最后一页！")
    }
   
})

}]);




