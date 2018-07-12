var loc = location.href;
var tenantId
if(loc.indexOf("?id=")!=-1)
            {
              var id = loc.substr(loc.indexOf("=")+1)//从=号后面的内容
              tenantId=id
            }
console.log(tenantId)
var siteId1
var siteId2
var idArray=[];
var nameArray=[];
var deviceID;
var siteID;
var str
var rowIdx
var idOffset;//用于查找下一页
var textOffset;//用于查找下一页
var hasNext;//判断是否存在下一页
var preDeviceId = [];//用于查找上一页
var preDeviceName = [];//用于查找上一页
var pageNum = 1;//记录当前页面
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
            //console.log(req.sites);
            //console.log(req.data);
            //请求成功时处理
            idArray=[];
            nameArray=[];
            reqArray=req.data;
            for (var i = 0; i < req.sites.length; i++) {
                idArray.push(req.sites[i].id);
                nameArray.push(req.sites[i].name);
               }
           }

       });

init();
function init()
{
    //默认设备列表
jQuery.ajax({
    url:"/api/3d815/paging/"+tenantId+"?limit=9&idOffset=&textOffset=",
    contentType: "application/json; charset=utf-8",
    async: false,
    type:"GET",
    success:function(req) {
        if(req.data.length != 0){
           showTable(req)
             console.log(req);
             if(req.nextPageLink!=null)
             {
                idOffset = req.nextPageLink.idOffset;
                textOffset = req.nextPageLink.textOffset;
                hasNext = req.hasNext;
                // console.log(idOffset);
                // console.log(textOffset);
                // console.log(hasNext);
                preDeviceId.push(idOffset);
                preDeviceName.push(textOffset);
             }
            
        }
    }
});
}

// 下一页
function nextPage(){
    console.log(hasNext);
    if(hasNext){
        jQuery.ajax({
            url:"/api/3d815/paging/"+tenantId+"?limit=9&idOffset="+idOffset+"&textOffset="+textOffset,
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(req) { 
                console.log("/api/3d815/paging/"+tenantId+"?limit=9&idOffset="+idOffset+"&textOffset="+textOffset);
                pageNum++;  
                showTable(req)
                if( req.hasNext == true){
                    idOffset = req.nextPageLink.idOffset;
                    textOffset = req.nextPageLink.textOffset;
                    hasNext = req.hasNext;
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);
                    //console.log($scope.deviceList);
                }else{
                    hasNext = req.hasNext;
                    
                }
            },
            error:function(err){
                alert("当前已是最后一页！");
            }
        });
    }else{
        alert("当前已是最后一页！");
    }
    
   
}

//上一页
function prePage(){
    if(pageNum == 1){
        alert("当前已是第一页！");
    }
    else if(pageNum == 2){
        jQuery.ajax({
            url:"/api/3d815/paging/"+tenantId+"?limit=9&idOffset=&textOffset=",
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(req) {
                pageNum--;
                if(req.data.length != 0){

                    showTable(req)
                    idOffset = req.nextPageLink.idOffset;
                    textOffset = req.nextPageLink.textOffset;
                    hasNext = req.hasNext;
                    preDeviceId.push(idOffset);
                    preDeviceName.push(textOffset);
                }
            }
        }); 
    }else{
        jQuery.ajax({
            url:"/api/3d815/paging/"+tenantId+"?limit=9&idOffset="+preDeviceId[pageNum-3]+"&textOffset="+preDeviceName[pageNum-3],
            contentType: "application/json; charset=utf-8",
            async: false,
            type:"GET",
            success:function(req) { 
                pageNum--;
                showTable(req);
                idOffset = req.nextPageLink.idOffset;
                textOffset = req.nextPageLink.textOffset;
                hasNext = req.hasNext;
                //console.log(idOffset);
                //console.log(textOffset);
                //console.log(hasNext);
                preDeviceId.push(idOffset);
                preDeviceName.push(textOffset);
                
            }
        });
    }
}


function siteDistribute()
{
  $.ajax({
        url: '/api/assignDevice/site',
        type: 'POST',
        // async : false,
        data:
                {"id":deviceID,"tenantId":tenantId, "name":deviceName,"siteId":idArray[nameArray.indexOf($('#siteId2 option:selected') .text())]},
        dataType: 'json',
        // contentType: 'application/json;charset=UTF-8',
        error:function(){
            alert('失败');
        },
        success: function(req) {
            //console.log(req);
            //请求成功时处理
            alert('分配成功')
            var tableObj = document.getElementById("myTable1");
            //获取表格中的所有行      
            var rows = tableObj.getElementsByTagName("tr");
            var td = rows[rowIdx].getElementsByTagName("td");
            //console.log(rows[rowIdx].getElementsByTagName("td"))
            td[5].innerHTML=nameArray[idArray.indexOf(parseInt(req.siteId))]
         }  
       });

}


function showTable(req)
{
                $("#myTable1  tr:not(:first)").empty(""); 
                for (var i = 0; i < req.data.length; i++) {
                var table = document.getElementById("myTable1");
                var row = table.insertRow(i+1);
                row.id = (i + 1);
                var cell0 = row.insertCell(0);
                var cell1 = row.insertCell(1);
                var cell2 = row.insertCell(2);
                var cell3 = row.insertCell(3);
                var cell4 = row.insertCell(4);
                var cell5 = row.insertCell(5);
                var cell6 = row.insertCell(6);

                cell0.innerHTML = '<td >'+req.data[i].id+'</td>' ;
                cell1.innerHTML = req.data[i].tenantId;
                cell2.innerHTML = req.data[i].customerId;
                cell3.innerHTML = req.data[i].name;
                cell4.innerHTML = req.data[i].parentDeviceId;
                if(req.data[i].siteId==null)
                {
                    cell5.innerHTML ="未分配";
                }
                else
                {
                    cell5.innerHTML = nameArray[idArray.indexOf(req.data[i].siteId)]
                }
                cell6.innerHTML =  '<a onclick=look();><img style="width:30px;" src="../static/baidu/img/read.png" alt="查看" title="查看"/></a>'+'&nbsp;&nbsp;&nbsp;&nbsp;'+
                    '<a onclick=distributeSite();><img style="width:30px;" src="../static/baidu/img/xiugai.png" alt="分配站点" title="分配站点"/></a>'+'&nbsp;&nbsp;&nbsp;&nbsp;'+
                     '<a onclick=delectSite();><img style="width:30px;" src="../static/baidu/img/schu.png" alt="取消站点" title="取消站点"/></a>'
               }
}

function distributeSite()
{
   $('#addSites').modal('show');
    var tableObj = document.getElementById("myTable1");
    //获取表格中的所有行      
    var rows = tableObj.getElementsByTagName("tr");
    //给tr绑定click事件
    for( i in rows)
    {
      rows[i].onclick = rowClick;
    }
  
  function rowClick(e)
  {
    var td = this.getElementsByTagName("td");
    rowIdx = $(td).parent()[0].rowIndex ;
    //alert("第 " + rowIdx + " 行");
    //console.log(rowIdx)
    deviceID=td[0].innerText;
    deviceName=td[3].innerText;
    $('#deviceName').val(td[3].innerText);
    $('#tenantId1').val(tenantId);
  for (i=0;i < idArray.length; i++) {
   document.getElementById("siteId2").options[i] = new Option(nameArray[i],i);
   }
}
}   

function delectSite()
{
   var mymessage=confirm("确认删除站点？");
                    if(mymessage==true)
                    {
                        var tableObj = document.getElementById("myTable1");
                        //获取表格中的所有行      
                        var rows = tableObj.getElementsByTagName("tr");
                        //给tr绑定click事件
                        for( i in rows)
                        {
                          rows[i].onclick = rowClick;
                        }                      
                      function rowClick(e)
                      {
                        var td = this.getElementsByTagName("td");
                        rowIdx = $(td).parent()[0].rowIndex ;
                        console.log(rowIdx)
                    $.ajax({
                        url: '/api/assignDevice/site',
                        type: 'POST',
                        // async : false,
                        data:
                                {"id":td[0].innerText,"tenantId":tenantId, "name":td[3].innerText,"siteId":null},
                        dataType: 'json',
                        // contentType: 'application/json;charset=UTF-8',
                        error:function(){
                            alert('失败');
                        },
                        success: function(req) {
                            //console.log(req);
                            //请求成功时处理
                            alert('取消成功')
                            var tableObj = document.getElementById("myTable1");
                            //获取表格中的所有行      
                            var rows = tableObj.getElementsByTagName("tr");
                            var td = rows[rowIdx].getElementsByTagName("td");
                            //console.log(rows[rowIdx].getElementsByTagName("td"))
                            td[5].innerHTML="未分配"
                         }  
                       });
                ////删除对应场景模型
                     $.ajax({
                        url: '/api/dModel/dModelDelete/'+td[0].innerHTML,
                        type: 'DELETE',
                        async : false,
                        dataType: 'json',
                        error:function(){
                            alert('失败');
                        },
                        success: function(req) {
                            console.log(req);
                         }  
                       });
}
                    }
                    else if(mymessage==false)
                    {
                       
                    }
    
}  

function deviceSearch() {
    if($("#searchValue").val()!='')
    {
        jQuery.ajax({
                url:"/api/3d815/search/"+tenantId+"?limit=1000&textSearch="+$("#searchValue").val(),
                contentType: "application/json; charset=utf-8",
                async: false,
                type:"GET",
                success:function(req) {
                    showTable(req.res)
                }
            });
    }

}

// ///////////////文本框-表格搜索/////////////
function deviceSearch1() 
{
  // var input = document.getElementById("searchValue");
  // var filter = input.value.toUpperCase();//转换为大写
  // var table = document.getElementById("myTable1");
  // var tr = table.getElementsByTagName("tr");

  // for (var i = 0; i < tr.length; i++) {
  //   //td = tr[i].getElementsByTagName("td")[0];
  //   if (filter=='') {
  //     //if (filter==parseInt(td.innerHTML.toUpperCase())) {
  //       tr[i].style.display = "";
  //     } 
  //   } 
  init();
}

////////////跳转///////
function look()
{
        var tableObj = document.getElementById("myTable1");
        //获取表格中的所有行      
        var rows = tableObj.getElementsByTagName("tr");
        //给tr绑定click事件
        for(var i in rows){
          rows[i].onclick = rowClick;
        }
      
      function rowClick(e){ 
        //alert(this.rowIndex); //显示所点击的行的索引
        //console.log(this );
        var td = this.getElementsByTagName("td");
        if(td[5].innerHTML=="未分配")
        {
            alert('该设备没有分配站点')
        }
         else
         {
            location.href="/baidu?id="+tenantId+"&listID="+idArray[nameArray.indexOf(td[5].innerHTML)]
         }
      }         
}

function lookMap()
{
    location.href="/baidu?id="+tenantId;
}

// function deviceSearch2() {
//   // 声明变量
//   var input = document.getElementById("searchValue");
//   var filter = input.value.toUpperCase();//转换为大写
//   var table = document.getElementById("myTable1");
//   var tr = table.getElementsByTagName("tr");
//   // 循环表格每一行，查找匹配项
//   for (i = 0; i < tr.length; i++) {
//     td = tr[i].getElementsByTagName("td")[3];
//     if (td) {
//       if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
//         tr[i].style.display = "";
//       } else {
//         tr[i].style.display = "none";
//       }
//     } 
//   }
// }

//     $.ajax({
//         url: 'api/3d815/paging/2?limit=90&idOffset=&textOffset=',
//         type: 'get',
//         async : false,
//         dataType: 'json',
//         contentType: 'application/json;charset=UTF-8',

//         error:function(){
//             alert('失败');
//         },
//         success: function(req) {
//             //console.log(req.data);
//             //请求成功时处理
//             reqArray=req.data;
//             for (var i = 0; i < req.data.length; i++) {
//                 var table = document.getElementById("myTable1");
//                 var row = table.insertRow(i+1);
//                 row.id = (i + 1);
//                 var cell0 = row.insertCell(0);
//                 var cell1 = row.insertCell(1);
//                 var cell2 = row.insertCell(2);
//                 var cell3 = row.insertCell(3);
//                 var cell4 = row.insertCell(4);
//                 var cell5 = row.insertCell(5);
//                 var cell6 = row.insertCell(6);

//                 cell0.innerHTML = '<td id=row.id>'+req.data[i].id+'</td>' ;
//                 cell1.innerHTML = req.data[i].tenantId;
//                 cell2.innerHTML = req.data[i].customerId;
//                 cell3.innerHTML = req.data[i].name;
//                 cell4.innerHTML = req.data[i].parentDeviceId;
//                 cell5.innerHTML = '未分配';
//                 // cell6.innerHTML = '';
//                 cell6.innerHTML =  '<a onclick=look();><img src="../static/baidu/img/read.png" alt="查看" title="查看"/></a>'+
//                     '<a onclick=distributeSite();><img src="../static/baidu/img/xiugai.png" alt="分配站点" title="分配站点"/></a>'
  
//                }
//            }
//        });
 





// 
// 







// 搜索
// $scope.searchDeviceInfo = function(){
//     var temp= window.location.search;
//     var tenantId = temp.split("=");
//     console.log(tenantId[1]);
//     tenantId[1] = 2;//用于测试
//     var textSearch = jQuery("#searchDevice").val();
//     if(textSearch == ""){
//         jQuery.ajax({
//             url:"/api/3d815/paging/2?limit=6&idOffset=&textOffset=",
//             contentType: "application/json; charset=utf-8",
//             async: false,
//             type:"GET",
//             success:function(msg) {
//                 if(msg.data.length != 0){
//                     $scope.deviceList = msg.data;
//                     // console.log($scope.deviceList);
//                     idOffset = msg.nextPageLink.idOffset;
//                     textOffset = msg.nextPageLink.textOffset;
//                     hasNext = msg.hasNext;
//                     // console.log(idOffset);
//                     // console.log(textOffset);
//                     // console.log(hasNext);
//                     preDeviceId.push(idOffset);
//                     preDeviceName.push(textOffset);
//                 }
//             }
//         });
//     }else{
//         jQuery.ajax({
//             url:"/api/3d815/search/"+tenantId[1]+"?limit=1000&textSearch="+textSearch,
//             contentType: "application/json; charset=utf-8",
//             async: false,
//             type:"GET",
//             success:function(msg) {
//                 jQuery("#showDevice tr").remove();
//                 console.log(msg.res.data);
//                $scope.deviceList = msg.res.data;
//             }
//         });
//     }
   
// }
//     $.ajax({
//         url: '/api/tenantsites/'+tenantId,
//         type: 'get',
//         async : false,
//         dataType: 'json',
//         contentType: 'application/json;charset=UTF-8',

//         error:function(){
//             alert('失败');
//         },
//         success: function(req) {
//             console.log(req.sites);
                
                

// // var cell1 = row.insertCell(0);
// // var cell2 = row.insertCell(1);

// // cell1.innerHTML = "NEW CELL1";
// // cell2.innerHTML = "NEW CELL2";
//             //请求成功时处理
//             reqArray=req.sites;
//             for (var i = 0; i < req.sites.length; i++) {
//                 var date1=new Date(req.sites[i].createdAt);
//                 //var time=date.getFullYear()+date.getMonth()+date.getDate();
//                 var year=date1.getFullYear();
//                 var month=date1.getMonth();
//                 var date=date1.getDate();
                
//                 table = document.getElementById("myTable");
//                 row = table.insertRow(i+1);
//                 row.id = (i + 1);
//                 cell0 = row.insertCell(0);
//                 cell1 = row.insertCell(1);
//                 cell2 = row.insertCell(2);
//                 cell3 = row.insertCell(3);
//                 cell4 = row.insertCell(4);
//                 cell5 = row.insertCell(5);
//                 cell6 = row.insertCell(6);
//                 cell7 = row.insertCell(7);

//                 //b.innerHTML = '<select id="S'+ (rowlen + 1) +'"><option selected id="Sales">Sales</option><option id="Purchases">Purchases</option><option id="Stock(openning)">Stock(opening)</option><option id="Stock(closing)">Stock(closing)</option></select>';
//                 cell0.innerHTML = '<td id=row.id>'+req.sites[i].id+'</td>' ;
//                 cell1.innerHTML = req.sites[i].name;
//                 cell2.innerHTML = req.sites[i].tenantId;
//                 cell3.innerHTML = innerHTML=req.sites[i].longtitude;
//                 cell4.innerHTML = innerHTML=req.sites[i].latitude;
//                 cell5.innerHTML = year+'-'+month+'-'+date;
//                 cell6.innerHTML = '';
//                 cell7.innerHTML = 
                
//                     '<a onclick=look();><img src="../static/baidu/img/read.png" alt="查看" title="查看"/></a>'+
//                     '<a onclick=a1();><img src="../static/baidu/img/xiugai.png" alt="修改" title="修改"/></a>'+
//                     '<a onclick=removeMarker1();><img src="../static/baidu/img/schu.png" alt="删除" title="删除"/></a>';
                


//                }


// var theTable = document.getElementById("myTable");          
// var totalPage = document.getElementById("spanTotalPage");     
// var pageNum = document.getElementById("spanPageNum");     
    
// var spanPre = document.getElementById("spanPre");     
// var spanNext = document.getElementById("spanNext");     
// var spanFirst = document.getElementById("spanFirst");     
// var spanLast = document.getElementById("spanLast");     
    
// var totalPaget = document.getElementById("spanTotalPaget");     
// var pageNumt = document.getElementById("spanPageNumt");     
    
// // var spanPret = document.getElementById("spanPret");     
// // var spanNextt = document.getElementById("spanNextt");     
// // var spanFirstt = document.getElementById("spanFirstt");     
// // var spanLastt = document.getElementById("spanLastt");     
    
// var numberRowsInTable = theTable.rows.length;     
// var pageSize = 12;     
// var page = 1;     
    
// //下一页     
// function next(){     
    
//     hideTable();     
         
//     var currentRow = pageSize * page;     
//     var maxRow = currentRow + pageSize;     
//     if ( maxRow > numberRowsInTable ) maxRow = numberRowsInTable;     
//     for ( var i = currentRow; i< maxRow; i++ ){     
//         theTable.rows[i].style.display = '';     
//     }     
//     page++;     
         
//     if ( maxRow == numberRowsInTable ) { nextText(); lastText(); }     
//     showPage();     
//     preLink();     
//     firstLink();     
// }     
    
// //上一页     
// function pre(){     
    
//     hideTable();     
         
//     page--;     
         
//     currentRow = pageSize * page;     
//     maxRow = currentRow - pageSize;     
//     if ( currentRow > numberRowsInTable ) currentRow = numberRowsInTable;     
//     for ( var i = maxRow; i< currentRow; i++ ){     
//         theTable.rows[i].style.display = '';     
//     }     
         
         
//     if ( maxRow == 0 ){ preText(); firstText(); }     
//     showPage();     
//     nextLink();     
//     lastLink();     
// }     
    
// //第一页     
// function first(){     
//     hideTable();     
//     page = 1;     
//     for ( var i = 0; i<pageSize; i++ ){     
//         theTable.rows[i].style.display = '';     
//     }     
//     showPage();     
         
//     preText();     
//     nextLink();     
//     lastLink();     
// }     
    
// //最后一页     
// function last(){     
//     hideTable();     
//     page = pageCount();     
//     currentRow = pageSize * (page - 1);     
//     for ( var i = currentRow; i<numberRowsInTable; i++ ){     
//         theTable.rows[i].style.display = '';     
//     }     
//     showPage();     
         
//     preLink();     
//     nextText();     
//     firstLink();     
// }     
    
// function hideTable(){     
//     for ( var i = 0; i<numberRowsInTable; i++ ){     
//         theTable.rows[i].style.display = 'none';     
//     }     
// }     
    
// function showPage(){     
//     pageNum.innerHTML = page;     
//     //pageNumt.innerHTML = page;     
// }     
    
// //总共页数     
// function pageCount(){     
//     var count = 0;     
//     if ( numberRowsInTable%pageSize != 0 ) count = 1;      
//     return parseInt(numberRowsInTable/pageSize) + count;     
// }     
    
// //显示链接     
// function preLink(){ spanPre.innerHTML = "<a href='javascript:pre();'>上一页</a>";}     
// function preText(){ spanPre.innerHTML = "上一页";  }     
    
// function nextLink(){ spanNext.innerHTML = "<a href='javascript:next();'>下一页</a>";}     
// function nextText(){ spanNext.innerHTML = "下一页"; }     
    
// function firstLink(){ spanFirst.innerHTML = "<a href='javascript:first();'>第一页</a>"; }     
// function firstText(){ spanFirst.innerHTML = "第一页"; }     
    
// function lastLink(){ spanLast.innerHTML = "<a href='javascript:last();'>最后一页</a>"; }     
// function lastText(){ spanLast.innerHTML = "最后一页"; }     
    
// //隐藏表格     
// function hide(){     
//     for ( var i = pageSize; i<numberRowsInTable; i++ ){     
//         theTable.rows[i].style.display = 'none';     
//     }     
         
//     totalPage.innerHTML = pageCount();     
//     pageNum.innerHTML = '1';     
         
//     // totalPaget.innerHTML = pageCount();     
//     // pageNumt.innerHTML = '1';     
         
//     nextLink();     
//     lastLink();     
// }     
    
// hide();     
//            }
//            });


    
    
//}
// function rename()
// {
//     document.getElementById('div2').style.display='block';
//     var tableObj = document.getElementById("myTable");
//             //获取表格中的所有行      
//         var rows = tableObj.getElementsByTagName("tr");
         
//         //给tr绑定click事件
//         for(var i in rows)
//         {
//           rows[i].onclick = rowClick;
//         }
      
//       function rowClick(e){ 

//         var td = this.getElementsByTagName("td");
//             siteOldID.value=td[0].innerHTML;
//             siteOldName.value=td[1].innerHTML;
//             siteId1=td[0].innerHTML;
//     //alert(siteId1);
// }
// }

// //////////////////修改站点/////////////////
// function renameSite1() {
//     if(siteNewName.value!="")
//     {
//     $.ajax({
//         url: '/api/sitename/' + siteId1,
//         data:
//             {name: siteNewName.value},
//         type: 'put',//提交方式
//         dataType: 'JSON',//返回字符串，T大写
//         success: function (req) {
//             if (req) {
//                 alert('修改完成');
//             }
//             else {
//                 alert('修改失败');
//             }
//         document.getElementById('div2').style.display='none';
//         },
//         error: function (error) {
//             alert('error.message');
//             console.log(error.message);
//         }
//     });
// }
//     else{}
// }

// //////////////////删除站点//////////////////
// function removeMarker1(){
//                     var mymessage=confirm("确认删除站点？");
//                     if(mymessage==true)
//                     {
                        
//                         var tableObj = document.getElementById("myTable");
//                         //获取表格中的所有行      
//                     var rows = tableObj.getElementsByTagName("tr");
         
//                             //给tr绑定click事件
//                             for(var i in rows)
//                             {
//                               rows[i].onclick = rowClick;
//                             }
                          
//                           function rowClick(e){ 
//                             var td = this.getElementsByTagName("td");
//                                 siteId2=td[0].innerHTML;
//                                 alert(siteId2);
                    
//                             }
//                                 $.ajax({
//                                     url:'/api/sites/'+siteId2,
//                                     type:'DELETE',//提交方式
//                                     //dataType:'JSON',//返回字符串，T大写
//                                     success: function(req)
//                                     {
//                                         if(req!='')
//                                         {
//                                             alert('删除成功');
//                                         }
//                                         else
//                                         {
//                                             alert('删除失败');
//                                         }

//                                     },
//                                     error:function(error)
//                                     {
//                                         console.log(error)
//                                         alert('接口调用失败');
//                                     }
//                                 });
                            
                        

//                     }
//                     else if(mymessage==false)
//                     {
//                         alert('取消');
//                     }
                
// }

///////////////////按键-表格搜索///////////////
// function siteSearch() {
//   // 声明变量
//   //var input, filter, table, tr, td, i;
//   var input = document.getElementById("searchValue");
//   var filter = input.value.toUpperCase();//转换为大写
//   var table = document.getElementById("myTable");
//   var tr = table.getElementsByTagName("tr");
//   // 循环表格每一行，查找匹配项
//   for (var i = 0; i < tr.length; i++) {
//     if(filter=='')
//     {
//         //alert("1") 
//          tr[i].style.display = "";
//     }
//     else
//     {
//        td = tr[i].getElementsByTagName("td")[0];
//     if (td) {
//       if (filter==parseInt(td.innerHTML.toUpperCase())) {
//         tr[i].style.display = "";
//       } else {
//         tr[i].style.display = "none";
//       }
//     }  
//     }
    
//   }
// }



  // for (var i = 0; i < tr.length; i++) {
  //   if(filter=='')
  //   {
  //       //alert("1") 
  //        tr[i].style.display = "";
  //   }
  //   else
  //   {
  //      td = tr[i].getElementsByTagName("td")[3];
  //   if (td) {
  //     if (filter==parseInt(td.innerHTML.toUpperCase())) {
  //       tr[i].style.display = "";
  //     } else {
  //       tr[i].style.display = "none";
  //     }
  //   }  
  //   }
    
  // }



// function CloseDiv1()
// {
//     document.getElementById("div1").style.display="none";
//     //document.getElementById("open").style.display="block";
// }
// function CloseDiv2()
// {
//     document.getElementById("div2").style.display="none";
//     //document.getElementById("open").style.display="block";
// }