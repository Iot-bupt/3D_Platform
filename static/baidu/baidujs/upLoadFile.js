////////////////////上传文件/////////////////////

function fileSelected() {  
var file = document.getElementById('fileToUpload').files[0];  
if (file) {  
  var fileSize = 0;
  if(file.size>1024*1024*200)
  {
    alert('请上传小于200M文件')
  } 
  // else
  // ｛
  // //   if (file.size > 1024 * 1024)  
  // //   {
  // //     fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';  
  // //   }
    
  // // else 
  // // {
  // //   fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
  // // } 
     
  //   ｝ 
  //modelName.value=file.name;
  $("#modelName").val(file.name);
  
  
}  
}  
function uploadFile() { 
//$('#addSences').modal('show'); 
var fd = new FormData();  
fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);  
var xhr = new XMLHttpRequest();  
xhr.upload.addEventListener("progress", uploadProgress, false);  
xhr.addEventListener("load", uploadComplete, false);  
xhr.addEventListener("error", uploadFailed, false);  
xhr.addEventListener("abort", uploadCanceled, false);  
xhr.open("POST", "/api/uploadScene");//修改成自己的接口  
xhr.send(fd);  
} 
//上传进度 
function uploadProgress(evt) {  
if (evt.lengthComputable) {  
  var percentComplete = Math.round(evt.loaded * 100 / evt.total);
  var pg=document.getElementById('progressNumber');  
  //console.log(percentComplete);
  //document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%'; 
      if(pg.value!=100) pg.value=percentComplete.toString();//进度条
      else pg.value=0; 
}  
else {  
  // document.getElementById('progressNumber').innerHTML = 'unable to compute'; 
    alert('无法上传');
}  
}  
function uploadComplete(evt) {  
/* 服务器端返回响应时候触发event事件*/  
alert(evt.target.responseText); 
$('#addSences').modal('hide');
//document.getElementById("div1").style.display="none"; 
}  
function uploadFailed(evt) {  
alert("There was an error attempting to upload the file.");  
}  
function uploadCanceled(evt) {  
alert("The upload has been canceled by the user or the browser dropped the connection.");  
}  
