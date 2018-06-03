


if (!Detector.webgl) Detector.addGetWebGLMessage();
   var addmodel = new AddModel();
    
    var camera, scene, renderer,
        bulbLight, bulbMat, ambientLight,
        object, loader, stats,firstScene,orbitctr;

    THREE.DRACOLoader.setDecoderPath('../draco_decoder.js');
    THREE.DRACOLoader.setDecoderConfig( { type: 'js' } );
    THREE.DRACOLoader.getDecoderModule();
    var dracoLoader = new THREE.DRACOLoader();

    var ballMat, cubeMat, floorMat;
    var newcontrols;
    var objects = [];
    var transformcontrol;
    var boxmesh2;
    var temp, isdb;
    
    var bulbLuminousPowers = {
        "110000 lm (1000W)": 110000,
        "3500 lm (300W)": 3500,
        "1700 lm (100W)": 1700,
        "800 lm (60W)": 800,
        "400 lm (40W)": 400,
        "180 lm (25W)": 180,
        "20 lm (4W)": 20,
        "Off": 0
    };
    // ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
    var hemiLuminousIrradiances = {
        "0.0001 lx (Moonless Night)": 0.0001,
        "0.002 lx (Night Airglow)": 0.002,
        "0.5 lx (Full Moon)": 0.5,
        "3.4 lx (City Twilight)": 3.4,
        "50 lx (Living Room)": 50,
        "100 lx (Very Overcast)": 100,
        "350 lx (Office Room)": 350,
        "400 lx (Sunrise/Sunset)": 400,
        "1000 lx (Overcast)": 1000,
        "18000 lx (Daylight)": 18000,
        "50000 lx (Direct Sun)": 50000,
    };
    var fogColor = {
        '红色': 0xff0000,
        '黄色': 0xffff00,
        '绿色': 0x00ff00
    }
    var params = {
        near: 1,
        far: 20,
        fogColor: Object.keys(fogColor)[0],
        "雾浓度": 0.02,
        shadows: false,
        exposure: 0.68,
        opacity:0.7,
        bulbPower: Object.keys(bulbLuminousPowers)[2],
        hemiIrradiance: Object.keys(hemiLuminousIrradiances)[3]
    };
    var sceneCtrl = {
        "旋转-y":0,
        "缩放":0.5,
    };
    var newcontrols = {

        "清除物体": function() {
            objects.forEach(function(e) {
                scene.remove(e);
            });
            objects = [];
        },
        "上传设备模型": function() {
            window.open("/demoupload", "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=yes, scrollbars=no, resizable=no, copyhistory=yes, width=400, height=360")
        }  //upload/upload.html,原来.open()中的内容
    };

    var transfctrl = {
        "轨道控件": function(){
            var controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.maxPolarAngle = Math.PI * 9 / 20;
            // controls.target.set(0, 2, 0);
            controls.update();
        },
        "轨迹球控件": function(){   //未搞定
            var trballctr = new THREE.TrackballControls( camera );
                trballctr.rotateSpeed = 1.0;
                trballctr.zoomSpeed = 1.2;
                trballctr.panSpeed = 0.8;

                trballctr.noZoom = false;
                trballctr.noPan = false;

                trballctr.staticMoving = true;
                trballctr.dynamicDampingFactor = 0.3;

                trballctr.keys = [ 65, 83, 68 ];

                trballctr.addEventListener( 'change', render );

        },
        "行走漫游": function(){   //未搞定
            var pointerLock = new THREE.PointerLockControls( camera );
                scene.add( pointerLock.getObject() );
                var onKeyDown = function ( event ) {

					switch ( event.keyCode ) {

						case 38: // up
						case 87: // w
							moveForward = true;
							break;

						case 37: // left
						case 65: // a
							moveLeft = true; break;

						case 40: // down
						case 83: // s
							moveBackward = true;
							break;

						case 39: // right
						case 68: // d
							moveRight = true;
							break;

						case 32: // space
							if ( canJump === true ) velocity.y += 350;
							canJump = false;
							break;

					}

				};

				var onKeyUp = function ( event ) {

					switch( event.keyCode ) {

						case 38: // up
						case 87: // w
							moveForward = false;
							break;

						case 37: // left
						case 65: // a
							moveLeft = false;
							break;

						case 40: // down
						case 83: // s
							moveBackward = false;
							break;

						case 39: // right
						case 68: // d
							moveRight = false;
							break;

					}

				};

				document.addEventListener( 'keydown', onKeyDown, false );
				document.addEventListener( 'keyup', onKeyUp, false );
        },
    };
    function setPosAndShade(obj) {
        /*obj.position.set(
         Math.random() * 20 - 45,
         40,
         Math.random() * 20 - 5
         );*/
        obj.position.set(0, 0, 0);
        obj.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
        obj.castShadow = true;
    }
    var raycaster = new THREE.Raycaster();
    var craycaster = new THREE.Raycaster();    //用于坐标的拾取
    var mouse = new THREE.Vector2();
    var clock = new THREE.Clock();
    init();
    animate();
    //tips and show tips
    var ToolTip = {
        init: function() {
            var tempDiv = document.createElement("div");
            document.body.insertBefore(tempDiv, document.body.childNodes[0]);
            tempDiv.id = "tip";
            tempDiv.style.display = "none";
            tempDiv.style.position = "absolute";
            tempDiv.style.color = "#fff";
            tempDiv.style.borderRadius = 2 + "px";
            tempDiv.style.padding = 2 + "px";
            tempDiv.style.backgroundColor = "rgba(0,0,0,0.4)";
        },
        showtip: function(mouse, cont) {
            jqq("tip").innerHTML = "<p>" + cont + "</p>";
            jqq("tip").style.left = mouse.clientX + 10 + "px";
            jqq("tip").style.top = mouse.clientY - 10 + "px";
            jqq("tip").style.zIndex = "10";
            jqq("tip").style.display = "block";
        },
        hidetip: function() {
            jqq("tip").style.display = "none";
        }
    }
    var jqq = function(str) {
        return document.getElementById(str);
    }
    ToolTip.init();
    //
    function init() {
        var container = document.getElementById('container');
        // stats = new Stats();
        // container.appendChild(stats.dom);
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.x = 0;
        camera.position.z = 15;
        camera.position.y = 8;
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0xffffff, 0);
        //半光
        hemiLight = new THREE.HemisphereLight(0x363636, 0x363636, 0.5);
        scene.add(hemiLight);

        var ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);
        //坐标辅助
        var axes = new THREE.AxisHelper(100);
        scene.add(axes);
        
        //地板
        floorMat = new THREE.MeshStandardMaterial({
            roughness: 0.8,
            color: 0xffffff,
            metalness: 0.2,
            bumpScale: 0.0005,
        });
        //点光源设置
        var floorGeometry = new THREE.PlaneBufferGeometry(60, 60);
        var floorMesh = new THREE.Mesh(floorGeometry, floorMat);
        floorMesh.receiveShadow = true;
        floorMesh.rotation.x = -Math.PI / 2.0;
        scene.add(floorMesh);
        var bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
        var bulbLight = new THREE.PointLight(0xffee88, 999, 100, 2);
        var bulbMat = new THREE.MeshStandardMaterial({
            emissive: 0xffffee,
            emissiveIntensity: 100,
            color: 0xffffff
        });
        bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
        bulbLight.position.set(0, 4, 0);
        bulbLight.castShadow = true;
        scene.add(bulbLight);
        /* 第二个点光源 */
        var bulbGeometry2 = new THREE.SphereGeometry(0.02, 16, 8);
        var bulbLight2 = new THREE.PointLight(0xffee88, 999, 100, 2);
        var bulbMat2 = new THREE.MeshStandardMaterial({
            emissive: 0xffffee,
            emissiveIntensity: 100,
            color: 0xffffff
        });
        bulbLight2.add(new THREE.Mesh(bulbGeometry2, bulbMat2));
        bulbLight2.position.set(-15, 4, 0);
        bulbLight2.castShadow = true;
        scene.add(bulbLight2);
        /* 第三个点光源 */
        var bulbGeometry3 = new THREE.SphereGeometry(0.02, 16, 8);
        var bulbLight3 = new THREE.PointLight(0xffee88, 999, 100, 2);
        var bulbMat3 = new THREE.MeshStandardMaterial({
            emissive: 0xffffee,
            emissiveIntensity: 100,
            color: 0xffffff
        });
        bulbLight3.add(new THREE.Mesh(bulbGeometry3, bulbMat3));
        bulbLight3.position.set(10, 4, 0);
        bulbLight3.castShadow = true;
        scene.add(bulbLight3);

        //渲染器设置
        renderer = new THREE.WebGLRenderer();
        renderer.physicallyCorrectLights = true;
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.shadowMap.enabled = true;
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        renderer.setClearColor(0x363636);  /*设置环境的背景色 */

        //轨道控件
        // orbitctr = new THREE.OrbitControls(camera, renderer.domElement);
        // orbitctr.maxPolarAngle = 2*Math.PI;
        // // controls.target.set(0, 2, 0);
        // orbitctr.minDistance = 0;
        // orbitctr.maxDistance = 1000;
        

        //改变模型形状
        transformcontrol = new THREE.TransformControls(camera, renderer.domElement);
        //transformcontrol.addEventListener('change', render);
        scene.add(transformcontrol);

        //加载实验室模型
        var onProgress = function(xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                var process_loading = 'Loading Models:'+Math.round(percentComplete, 2) + '%';
                document.getElementById('Loading').innerHTML = process_loading;
                console.log(process_loading);
                if(percentComplete == 100){
                document.getElementById('Loading').style.display = 'none';
            }
            }
        };
        var onError = function(xhr) {};

        dracoLoader.load( 'static/gis_815/models/mydrc/lab_524drc.drc', function ( geometry ) {

        geometry.computeVertexNormals();

        var material = new THREE.MeshStandardMaterial( { vertexColors: THREE.VertexColors } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        //mesh.material.side = THREE.DoubleSide;

        mesh.scale.x = 0.5;
        mesh.scale.y = 0.5;     /*  改变几何的比例*/ 
        mesh.scale.z = 0.5;
        mesh.position.x = 5;
        mesh.position.y = 2;     /*  改变几何的比例*/ 
        mesh.position.z = 0;
        mesh.material.transparent = true;
        mesh.material.opacity = params.opacity;
        // console.log(mesh.getWorldPosition());
        firstScene = mesh;
        scene.add( mesh );

        // Release the cached decoder module.
        THREE.DRACOLoader.releaseDecoderModule();
        },onProgress, onError);

        //
        window.addEventListener('resize', onWindowResize, false);
        renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
        renderer.domElement.addEventListener('dblclick', onDocumentDbclick, false);
        

        var gui = new dat.GUI();
        gui.add(params, 'exposure', 0, 1);
        gui.add(params, 'opacity', 0, 1);
        effectController = {
            shininess: 40.0
        }

        // h = gui.addFolder("雾颜色");
        // h.add(params, "fogColor", Object.keys(fogColor));
        // gui.add(params, '雾浓度', 0, 0.1);

        //控制方式
        var transctrl = gui.addFolder("场景控制方式");
        transctrl.add(transfctrl,"轨道控件");
        transctrl.add(transfctrl,'轨迹球控件');
        transctrl.add(transfctrl,'行走漫游');
        //场景模型控制
        var scectr = gui.addFolder("场景模型变换");
        scectr.add(sceneCtrl,"旋转-y",0, 2*Math.PI);
        scectr.add(sceneCtrl,"缩放",0,5);

        gui.add(newcontrols, '清除物体');
        gui.add(newcontrols, '上传设备模型');
        gui.open();
        
    }
    var baseColor = 0xFF0000;
    var foundColor = 0x12C0E3;
    var intersectColor = 0x00D66B;
    var intersected;


        //fun2cgq('sensor_center.stl',-10.37, 6.90, 15.16,"开关1开_uid1_on");
        //fun2cgq('sensor_center.stl',-10.37, 6.90, 14.16,"开关1关_uid1_off");
        //fun2cgq('sensor_center.stl',0.0, 4.228, -6.5,"窗帘1开_uid3_on");
        //fun2cgq('sensor_center.stl',-1.0, 4.228, -6.5,"窗帘1关_uid3_off");
        //fun2cgq('sensor_center.stl',0.0,4.96,18,"温湿2_uid4");
        
        addmodel.addAllModel(133);    //加载场景ID133的所有设备模型
        
        
        


    function onDocumentDbclick(event){
        event.preventDefault(); 
        var vector = new THREE.Vector3();//三维坐标对象 
        vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 ); 
        vector.unproject( camera ); 
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize()); 
        var intersects = raycaster.intersectObjects(scene.children); 
        if (intersects.length > 0) 
        { var selected = intersects[0];//取第一个物体 
            var str = "x坐标:"+selected.point.x.toFixed(6) 
                + "<br>"+"y坐标:"+selected.point.y.toFixed(6)+"<br>"+"z坐标:"+selected.point.z.toFixed(6);
            document.getElementById('coords').innerHTML = str; 
            document.getElementById('coords').style.display = '';
            console.log(intersects.length); 
            
        }
        
        
    
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        //var octreeObjects;
        var numObjects;
        //var numFaces = 0;
        var intersections;
        intersections = raycaster.intersectObjects(objects);
        numObjects = objects.length;
        //numFaces = totalFaces;
        
        //console.log("dijichangdu :"+intersections.length)
        if (intersections.length > 0) {
                var name_uid =  intersections[0].object.tooltip;
                var nameUid =  name_uid.split("_");
                console.log('名字:'+nameUid[0]);
                if(nameUid[0].indexOf("窗帘")!=-1){
                    getAjax("/api/3d815/controlCurtain/"+nameUid[1]+'?turn='+nameUid[2], function(response) {
                         
                         console.log('窗帘结果:'+response);
                         if (response.indexOf("on")!=-1){
                            params.exposure = 0.81;
                         }else if (response.indexOf("off")!=-1){
                             params.exposure = 0.68
                         }else {
                             alert("控制失败！"+response);
                         }
                    });
                }else if (nameUid[0].indexOf("开关")!=-1){
                    getAjax("/api/3d815/controlSwitch/"+nameUid[1]+'?turn='+nameUid[2], function(response) {
                         
                         console.log('开关结果:'+response);
                         if (response.indexOf("on")!=-1){
                            params.exposure = 0.81;
                         }else if (response.indexOf("off")!=-1){
                             params.exposure = 0.68
                         }else {
                             alert("控制失败！"+response);
                         }
                        });
                }
                 }
        
        
    }

    function onDocumentMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        //var octreeObjects;
        var numObjects;
        //var numFaces = 0;
        var intersections;
        intersections = raycaster.intersectObjects(objects);
        numObjects = objects.length;
        //numFaces = totalFaces;
        //console.log(intersections.length)
        if (intersections.length > 0) {
            if (intersected != intersections[0].object) {
                if (intersected) intersected.material.color.setHex(baseColor);
                /*console.log(event.clientX); console.log(event.clientY);
                 */
                intersected = intersections[0].object;
                intersected.material.color.setHex(intersectColor);
                //window.addEventListener('keydown', changeMode);

                var name_uid =  intersected.tooltip;
                var nameUid =  name_uid.split("_");
//                var temp ;
               if(nameUid[0].indexOf("开关")!=-1){
                   ToolTip.showtip(event, nameUid[0]+":");
               }else if(nameUid[0].indexOf("窗帘")!=-1){
                   ToolTip.showtip(event, nameUid[0]+":");
               }
                else{
                   getAjax("/api/3d815/getdata/"+nameUid[1], function(response) {
                       var data = JSON.parse(response);
                       var temp = (parseFloat((data.res[1].value))/100).toFixed(2);
                       var humidity = parseFloat(data.res[0].value).toFixed(2);
                       console.log(temp);
                       ToolTip.showtip(event, nameUid[0]+"<br>temp:"+temp+"℃<br>humitity:"+humidity);
                   });
               }


            }
            document.body.style.cursor = 'pointer';
        } else if (intersected) {
            intersected.material.color.setHex(baseColor);
            intersected = null;
            document.body.style.cursor = 'auto';
            transformcontrol.detach();
            ToolTip.hidetip();
        }
    }
    function alt() {
        window.open("./camera/camera.html", "_blank", "toolbar=no, location=no, directories=no, status=no, menubar=yes, scrollbars=no, resizable=no, copyhistory=yes, width=920, height=500")
    }
    function changeMode() {
        switch (event.keyCode) {
            case 81: // Q
                transformcontrol.setMode("translate");
                break;
            case 87: // W
                transformcontrol.setMode("rotate");
                break;
            case 69: // E
                transformcontrol.setMode("scale");
                break;
        }
    }
    function onWindowResize() {   //屏幕自适应
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    //
    function animate() {   //递归渲染
        requestAnimationFrame(animate);
        render();
    }
    var previousShadowMap = false;
    function render() {   //渲染
        renderer.toneMappingExposure = Math.pow(params.exposure, 5.0); // to allow for very bright scenes.
        renderer.shadowMap.enabled = params.shadows;
        if (firstScene !== undefined){        //控制调节场景模型透明度,旋转,缩放
            firstScene.material.opacity = params.opacity;
            firstScene.rotation.y = sceneCtrl["旋转-y"];
            var _scale = sceneCtrl["缩放"];
            firstScene.scale.x = _scale;
            firstScene.scale.y = _scale;
            firstScene.scale.z = _scale;
        }

        //bulbLight.castShadow = params.shadows;
        if (params.shadows !== previousShadowMap) {

            floorMat.needsUpdate = true;
            //previousShadowMap = params.shadows;
        }
        //if (params.fogColor !== previousFogColor) {
        /*if (temp > 35) { scene.fog = new THREE.FogExp2(fogColor[params.fogColor], params["雾浓度"]); } else scene.fog.density = 0;
         */
        //scene.fog = new THREE.FogExp2(fogColor[params.fogColor], params["雾浓度"]);
        /*for (var i = 1; i < intersects.length; i++) {
         console.log(intersects[i].object);
         intersects[i].object.addEventListener("click", function(event) {
         alert(i);
         })
         //intersects[i].object.material.color.set(0xff0000);
         }*/
        //scene.fog = new THREE.Fog(fogColor[params.fogColor], params.near, params.far);
        //} else scene.fog.density = params["雾浓度"];
        //scene.fog.color = "#ff0"; //fogColor[params.fogColor];
        //bulbLight.power = bulbLuminousPowers[params.bulbPower];
        //bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow(0.02, 2.0); // convert from intensity to irradiance at bulb surface
        //hemiLight.intensity = hemiLuminousIrradiances[params.hemiIrradiance];
        //hemiLight.intensity = 0.5;
        var time = Date.now() * 0.0005;
        var delta = clock.getDelta();
        renderer.render(scene, camera);
        // stats.update();
    }
    function randomvalue() {
        if (temp == undefined) {
            return 15.5;
        } else return Math.ceil(Math.random() * 10) + 15.5;
    }
    var fog = {
        scenefog: null,
        twinkleWarning: function(scene) {
            scene.fog = new THREE.FogExp2(0xffff00, 0.02);
            this.scenefog = setInterval(function() {
                var density = scene.fog.density
                if (density !== 0) {
                    scene.fog.density = 0;
                } else scene.fog.density = 0.02;
            }, 800);
        },
        clear: function(scene) {
            clearInterval(this.scenefog);
            scene.fog.density = 0;
        }
    }
    function createXMLHTTPRequest() {   //用于在后台与服务器交换数据
        //1.创建XMLHttpRequest对象
        //这是XMLHttpReuquest对象无部使用中最复杂的一步
        //需要针对IE和其他类型的浏览器建立这个对象的不同方式写不同的代码
        var xmlHttpRequest;
        if (window.XMLHttpRequest) {
            //针对FireFox，Mozillar，Opera，Safari，IE7，IE8
            xmlHttpRequest = new XMLHttpRequest();
            //针对某些特定版本的mozillar浏览器的BUG进行修正
            if (xmlHttpRequest.overrideMimeType) {
                xmlHttpRequest.overrideMimeType("text/xml");
            }
        } else if (window.ActiveXObject) {
            //针对IE6，IE5.5，IE5
            //两个可以用于创建XMLHTTPRequest对象的控件名称，保存在一个js的数组中
            //排在前面的版本较新
            var activexName = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
            for (var i = 0; i < activexName.length; i++) {
                try {
                    //取出一个控件名进行创建，如果创建成功就终止循环
                    //如果创建失败，回抛出异常，然后可以继续循环，继续尝试创建
                    xmlHttpRequest = new ActiveXObject(activexName[i]);
                    if (xmlHttpRequest) {
                        break;
                    }
                } catch (e) {}
            }
        }
        return xmlHttpRequest;
    }
    function getAjax(url, fn) {
        var xhr = createXMLHTTPRequest();
        if (xhr) {
            xhr.open("GET", url, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        fn(xhr.responseText);
                    } else {
                        //alert("error");
                    }
                }
            }
            xhr.send(null);
        }
    }