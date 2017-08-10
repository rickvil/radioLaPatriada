/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
stationName = "FMLaPatriadaDemo";

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		var program_name = '';
		if(device.platform == "Android") {
			app.clearNotification();
		}

		if(device.platform == "Android") {
		// Android customization
			cordova.plugins.backgroundMode.setDefaults({
				title  : 'FM La Patriada Demo',
				ticker : 'FM La Patriada Demo',
				text   : '',
				isPublic: true
			});

				app.clearNotification();
			// Enable background mode
			cordova.plugins.backgroundMode.enable();
		}

		// Override back button
		document.addEventListener("backbutton", ShowExitDialog, false);
		$('.play-button').on('tap', onTapPlayHandler);
		function onTapPlayHandler() {
			$(this).find('.glyph-icon').addClass('blink');
		}

		$('.links').on('tap', onTapHandler);
		function onTapHandler() {
			$(this).find('.glyph-icon').addClass('blink');
			setTimeout(function(){ $('div').removeClass('blink');}, 2000);
		}

		// Dialog box when back button is pressed
		function ShowExitDialog() {
			navigator.notification.confirm(
				("Desea salir?"), // message
				alertexit, // callback
				'FM La Patriada Demo', // title
				['Sí', 'No'] // buttonName
			);
		}

		// Call exit function
		function alertexit(button){
			if(button=="1" || button==1){
				//device.exitApp();
				app.clearNotification();
				navigator.app.exitApp();
			}
		}

		// Server to fetch config (background image and streamURL) from
		var url = 'http://www.fmlapatriada.com.ar/aplicacion/url_streaming/config.json';

		// Fetch the config

		$.ajaxSetup({
			timeout: 3000,
			retryAfter:7000
		});

		function getConfig(){
			console.log("getConfig: ", new Date());
			console.log("getConfig");
			$.ajax({
				url: url,
				global: false,
				type: "GET",
				dataType: "json",
				async:true
			})
			.success(function(data){
				appSetup(data);
			})
			.error(function(){
				setTimeout (getConfig, $.ajaxSetup().retryAfter);
			});
		}

		function appSetup(config) {
			// Set streamURL as a global variable to be used by player
			if (config.streamURL) {
				window.streamURL = config.streamURL;
			}
			//if (config.facebook) {
			//	window.facebook = config.facebook;
			//}
			//if (config.twitter) {
			//	window.twitter = config.twitter;
			//}
			//if (config.web) {
			//	window.web = config.web;
			//}
			//if (config.email) {
			//	window.email = config.email;
			//}
			//setBackgroundImage(config.image);
			//if (config.logourl) {
			//	setLogoImage(config.logourl);
			//}

			$("#wrapper").css("display", "block");
			$("#loading").css("display", "none");
		}

		getConfig();

		// Set background image
		function setBackgroundImage(url) {
			//$("html").css({'background-image':"url('"+url+"')"});
		}

		function setLogoImage(url) {
			//$(".logo").attr('src', url);
		}

		function setStreamURL(url) {
			if (url) {
				window.streamURL = url;
			}
		}
	},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    notificationCallback: function () {
    },
    showNotification: function() {
        cordova.plugins.notification.local.schedule({
            id: 1,
            text: app.program_name,
            autoClear: false,
            ongoing: true,
            icon: 'res://drawable/icon.png',
            sound: null,
            data: { test: 1 }
        });
    },
    updateNotification: function(text) {
        app.program_name = text;
        cordova.plugins.notification.local.update({
            id: 1,
            text: text,
            json: { updated: true }
        });
    },
    clearNotification: function() {
        cordova.plugins.notification.local.clear(1, this.notificationCallback);
    },
    audioToggle: function() {
		console.log("............ in audioToggle()");
		if(device.platform == "iOS") {
			player = html5audio;
			console.log("html5audio PLAYER: " + window.streamURL);
		} else {
			player = mediaAudio;
			console.log("mediaPlugin PLAYER: " + window.streamURL);
		}
		if (isPlaying || isStarting) {
			player.stop();
		} else {
			player.play();
		}
    },
    socialLink: function() {
	    alert($(this));
    }
};

function showPicDefault() {
	var imageDefault = 'img/portada-programacion/default.png';
	$(".program-image").attr("src", imageDefault);
	$(".program-image").css("visibility", "visible");
	$(".main-container-brand").css("visibility", "hidden");
}

function showPicProgramacion(pathImage){
	console.log("showPicProgramacion: ", pathImage);
	$(".program-image").attr("src", pathImage);
	$(".program-image").css("visibility", "visible");
	$(".main-container-brand").css("visibility", "visible");
}

function searchImagePrograming(){
	var date = new Date;
	var hora = date.getHours();
	if (horaPicNow != null && (hora >= horaPicNow.horaInicio && hora < horaPicNow.horaFin)){
		console.log("Mantenemos la imagen");
	}else{
		listProgramming.forEach(function(program, index) {

			if (hora >= program.horaInicio){
				if (program.horaFin != null && hora < program.horaFin){
					showPicProgramacion(program.imagen);
					horaPicNow = {};
					horaPicNow.horaInicio = program.horaInicio;
					horaPicNow.horaFin = program.horaFin;
				}
				else{
					showPicDefault();
				}
			}
		});
	}
}

function existPicHours(pathPic) {
	var existPicHours = false;
	$.ajax({
		url: pathPic,
		success: function(data){
			console.log('exists: ', pathPic);
			existPicHours = true;
		},
		error: function(data){
			console.log('does not exist: ', pathPic);
			existPicHours = false;
		},
		async: false
	});
	return existPicHours;
}

function parseHours(hora){
	if (hora.toString().length == 1){
		hora = '0' + hora.toString();
	}
	return hora;
}

function generatePathImage(dia, hora){
	hora = parseHours(hora);
	return 'http://www.fmlapatriada.com.ar/aplicacion/imagenes/'+'0' + dia + '.' + hora + '.jpg';
}

function mappearProgramacion(){
	var date = new Date;
	var dia = date.getDay();
	var pathImage = '';
	var hayProgramaAnterior = false;
	var listaDeProgramas = [];
	var indice = 0;
	for (var hora=0; hora < 24; hora++) {
		pathImage = generatePathImage(dia, hora);
		if(existPicHours(pathImage)){
			var programacion = {};
			programacion.horaInicio = hora;
			programacion.horaFin = null;
			programacion.imagen = pathImage;
			listaDeProgramas.push(programacion);
			if (!hayProgramaAnterior){
				hayProgramaAnterior = true;
			}else{
				var indiceX = indice - 1;
				var elemtnetoAnterior = listaDeProgramas[indiceX];
				elemtnetoAnterior.horaFin = hora;
			}
			indice++;
		}
	}

	if (indice != 0){
		var ultimoElemento = listaDeProgramas[indice - 1];
		ultimoElemento.horaFin = ultimoElemento.horaInicio + 1;
	}

	return listaDeProgramas;
}

function getProgramInfo() {
	if (listProgramming.length == 0){
		listProgramming = mappearProgramacion();
		showPicDefault();
	}else{
		searchImagePrograming()
	}

	//if(window.isPlaying == false) {
	//	return;
	//}

	//if(isPlaying) {
	//	var url = window.server + "/" + stationName + "/now_playing.json?"+Math.random();
	//	console.log("getProgramInfo url : " + url);
	//	$.getJSON(url, function(data) {
    //
	//		if(data.name) {
	//			$('#name').html(data.name);
	//			$('#program-name').css("visibility", "visible");
	//			if(app.program_name != data.name) {
	//				cordova.plugins.backgroundMode.configure({text: data.name});
	//				app.updateNotification(data.name);
	//			}
	//		} else {
	//			$('#program-name').css("visibility", "hidden");
	//		}
    //
	//		if(data.presenter) {
	//				$('#presenter').html(data.presenter);
	//				$('#program-presenter').css("visibility", "visible");
	//		} else {
	//				$('#program-presenter').css("visibility", "hidden");
	//		}
    //
	//		if(data.show_labels) {
	//			$('.infopanel-label').css("display", "inline");
	//		} else {
	//			$('.infopanel-label').css("display", "none");
	//		}
    //
	//		if(data.image.length > 0) {
	//			var image = data.image_url;
	//			$(".program-image").attr("src", image);
	//			$(".program-image").css("visibility", "visible");
	//		}
    //
	//		$(".program-info").css("visibility", "visible");
	//		$(".infopanel-container").css("visibility", "visible");
	//	});
	//}
}


function loadProgramacion() {
	showPicDefault();
	listProgramming = mappearProgramacion();
	searchImagePrograming()
}

// Check for program info changes
var checkInterval = 1;
var timerUnit = 60000;
var interval = setInterval(getProgramInfo, timerUnit * checkInterval);
var listProgramming = [];
var horaPicNow = null;

function hideProgramInfo() {
	$(".infopanel-container").css("visibility", "hidden");
	$(".program-info").css("visibility", "hidden");
	//$(".program-image").css("visibility", "hidden");
	$('#program-name').css("visibility", "hidden");
	$('#program-presenter').css("visibility", "hidden");
}

function buildContact(contact) {
	if(contact.indexOf("http://") == 0) {
		return contact;
	} else {
		return "mailto:" + contact;
	}
}