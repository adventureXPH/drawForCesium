var center = [110.98, 30.83];
var timer = null;
var viewer = null;
var scene = null;
var canvas = null;
var clock = null;
var camera = null;

$(function () {
    $(document).ready(function () {
        initialGlobeView();
        initDrawHelper();
    });
    
    function initialGlobeView() {
		viewer = new Cesium.Viewer('cesiumContainer', {
				imageryProvider : Cesium.createTileMapServiceImageryProvider({
								url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
					}),
				baseLayerPicker : false,
				geocoder : false
		});     
    }
    
    function initDrawHelper() {
    	$("#toolbar").html("");
        $("#loggingText").html("");
        var drawHelper = new DrawHelper(viewer);
        var scene = viewer.scene;
        var toolbar = drawHelper.addToolbar(document.getElementById("toolbar"), {
            buttons: ['marker', 'polyline', 'polygon', 'circle', 'extent',"tailedAttackArrow"]
        });
        toolbar.addListener('markerCreated', function (event) {
            loggingMessage('Marker created at ' + event.position.toString());
            // create one common billboard collection for all billboards
            var b = new Cesium.BillboardCollection();
            scene.primitives.add(b);
            var billboard = b.add({
                show: true,
                position: event.position,
                pixelOffset: new Cesium.Cartesian2(0, 0),
                eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
                horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                scale: 1.0,
                image: './images/glyphicons_242_google_maps.png',
                color: new Cesium.Color(1.0, 1.0, 1.0, 1.0)
            });
            billboard.setEditable();
        });
        toolbar.addListener('polylineCreated', function (event) {
            loggingMessage('Polyline created with ' + event.positions.length + ' points');
            var polyline = new DrawHelper.PolylinePrimitive({
                positions: event.positions,
                width: 5,
                geodesic: true
            });
            scene.primitives.add(polyline);
            polyline.setEditable();
            polyline.addListener('onEdited', function (event) {
                loggingMessage('Polyline edited, ' + event.positions.length + ' points');
            });

        });
        toolbar.addListener('polygonCreated', function (event) {
            loggingMessage('钳击箭头');
            var polygon = new DrawHelper.PolygonPrimitive({
                positions: event.positions,
                custom:event.custom,
                material: Cesium.Material.fromType(Cesium.Material.ColorType)
            });
            scene.primitives.add(polygon);
            polygon.setEditable();
            polygon.addListener('onEdited', function (event) {
            	loggingMessage('钳击箭头');
            });

        });
        toolbar.addListener('tailedAttackCreated', function (event) {
            loggingMessage('攻击箭头');
            var polygon = new DrawHelper.TailedAttackPrimitive({
                positions: event.positions,
                custom:event.custom,
                material: Cesium.Material.fromType(Cesium.Material.ColorType)
            });
            scene.primitives.add(polygon);
            polygon.setEditable();
            polygon.addListener('onEdited', function (event) {
            	loggingMessage('攻击箭头');
            });

        });
        toolbar.addListener('circleCreated', function (event) {
            loggingMessage('Circle created: center is ' + event.center.toString() + ' and radius is ' + event.radius.toFixed(1) + ' meters');
            var circle = new DrawHelper.CirclePrimitive({
                center: event.center,
                radius: event.radius,
                material: Cesium.Material.fromType(Cesium.Material.RimLightingType)
            });
            scene.primitives.add(circle);
            circle.setEditable();
            circle.addListener('onEdited', function (event) {
                loggingMessage('Circle edited: radius is ' + event.radius.toFixed(1) + ' meters');
            });
        });
        toolbar.addListener('extentCreated', function (event) {
            var extent = event.extent;
            loggingMessage('箭头创建');
            var extentPrimitive = new DrawHelper.ExtentPrimitive({
                extent: extent,
                material: Cesium.Material.fromType(Cesium.Material.ColorType)
            });
            scene.primitives.add(extentPrimitive);
            extentPrimitive.setEditable();
            extentPrimitive.addListener('onEdited', function (event) {
            	 loggingMessage('箭头创建');
            });
        });

        var logging = document.getElementById('loggingText');
        function loggingMessage(message) {
            logging.innerHTML = message;
        }
    }
});
