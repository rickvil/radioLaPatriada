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
stationName = "FMLaPatriada";

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
				title  : 'FM La Patriada',
				ticker : 'FM La Patriada',
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
				'FM La Patriada', // title
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
		var url = window.server + '/url_streaming/config.json?t='+(new Date()).getTime();

		// Fetch the config

		$.ajaxSetup({
			timeout: 3000,
			retryAfter:7000
		});

		function getConfig(){
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

			$("#wrapper").css("display", "block");
			$("#loading").css("display", "none");
		}

		function getProgramListDay(){
			var date = new Date();
			var day = date.getDay();
			var urlProgramDay = window.server + '/imagenes/0' + day + '.json?t='+(new Date()).getTime();

			$.ajax({
				url: urlProgramDay,
				global: false,
				type: "GET",
				dataType: "json",
				async:true
			})
			.success(function(data){
				mappearProgramacion(data);
			})
			.error(function(){
				setTimeout (getProgramListDay, $.ajaxSetup().retryAfter);
			});
		}

        function getConfigButton(){
            var urlConfigButton = window.server + '/boton/button.json?t='+(new Date()).getTime();

            $.ajax({
                url: urlConfigButton,
                global: false,
                type: "GET",
                dataType: "json",
                async:true
            })
			.success(function(data){
                setValueButtonCustom(data);
			})
			.error(function(){
				setTimeout (getConfigButton, $.ajaxSetup().retryAfter);
			});
        }

        showPicDefault();
		getConfig();
		getProgramListDay();
        getConfigButton();
	},
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
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
		if(device.platform == "iOS") {
			player = html5audio;
		} else {
			player = mediaAudio;
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
    var pathImageDefaultServer = window.server + '/imagenes/default.png?t='+(new Date()).getTime();

    if (existPicHours(pathImageDefaultServer)){
        imageDefault = pathImageDefaultServer;
    }

    $(".program-image").attr("src", imageDefault);
    $("#fondoSmall").attr("src", imageDefault);

    $(".program-image").css("visibility", "visible");
    $(".main-container-brand").css("visibility", "hidden");
}

function showPicProgramacion(pathImage){
// quitando el siguiende if-else, se podria optimizar mas aun la carga de la imagen

	var tmpPathImage = pathImage + '?t=' + (new Date()).getTime();

	if (existPicHours(tmpPathImage)){
		$(".program-image").attr("src", tmpPathImage);
		$(".program-image").css("visibility", "visible");
		$(".main-container-brand").css("visibility", "visible");
	}else{
		showPicDefault();
	}
}

function searchImagePrograming(){
	var date = new Date();
	var hora = date.getHours();
	if (horaPicNow != null && (hora >= horaPicNow.horaIni && hora < horaPicNow.horaFin)){
		console.log("Mantenemos la imagen");
	}else{
		horaPicNow = {};
		listProgramming.forEach(function(program, index) {
			if (hora >= program.horaIni && hora < program.horaFin) {
				horaPicNow.imagen = program.imagen;
				horaPicNow.horaIni = program.horaIni;
				horaPicNow.horaFin = program.horaFin;
			}
		});

		if (horaPicNow.imagen != undefined){
			showPicProgramacion(horaPicNow.imagen);
		}else{
			showPicDefault();
		}
	}
}

function existPicHours(pathPic) {
	var existPicHours = false;
	$.ajax({
		url: pathPic,
		success: function(data){
			if (data != undefined){
				existPicHours = true;
			}else{
				existPicHours = false;
			}
		},
		error: function(data){
			existPicHours = false;
		},
		async: false
	});
	return existPicHours;
}

function mappearProgramacion(data){
	var listaDeProgramas  = data.programacion;

	listaDeProgramas.forEach(function(program, index) {
		var programacion = {};
		programacion.horaIni = parseInt(program.horaIni);
		programacion.horaFin = parseInt(program.horaFin);
		programacion.imagen = program.imagen;
		listProgramming.push(programacion);
	});
}

function setValueButtonCustom(data){

    btnCustomVisible = data.visible;
    btnCustomColor = data.color;
    btnCustomTitle = data.title;
    window.btnCustomLink = data.link;

	if (btnCustomVisible == "true"){
        $('.main-container-brand').remove();
        $('#btnCustom').css("visibility", "visible");
        $('#btnCustom').css("background-color", btnCustomColor);
        $('#btnCustom').text(btnCustomTitle);
	} else {
        $('.main-container-custom').remove();
        $('#btnCustom').css("visibility", "hidden");
	}
}

function getProgramInfo() {
	if(window.isPlaying == false) {
		return;
	}

	if(isPlaying) {
		if (listProgramming.length == 0){
			showPicDefault();
		}else{
			searchImagePrograming();
		}
	}
}

// Check for program info changes
var checkInterval = 1;
var timerUnit = 60000;
var interval = setInterval(getProgramInfo, timerUnit * checkInterval);
var listProgramming = [];
var horaPicNow = null;

var btnCustomVisible = 'false';
var btnCustomColor = '';
var btnCustomTitle = '';

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

function expiraDemo() {
	var diaDeHoy = new Date();
	var diaDeVencimiento = new Date();
	diaDeVencimiento.setDate(27);
	diaDeVencimiento.setMonth(7);
	diaDeVencimiento.setYear(2017);

	if (diaDeHoy >= diaDeVencimiento){
		$('#name').html("EL TIEMPO DE PRUEBA DE LA APP HA TERMINADO");
		$('#program-name').css("visibility", "visible");
		$('#presenter').html("contactese con el Admin: rickvil.jujuy@gmail.com");
		$('#program-presenter').css("visibility", "visible");
	}
}