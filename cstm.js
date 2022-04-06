$(document).ready(function() {



    /*****************************************************************/
    /*************************** PRINCIPAL ***************************/
    /*****************************************************************/

    //desplegar menú principal
    $('.main-icon').click(function() {
        $(this).toggleClass('activo');
        $('.main-nav').slideToggle('fast');
        //$('.main-nav').toggleClass('desplegado');
    });
    $('.login-mobile-link').click(function(e) {
        $('.main-icon').click();
    })

    //efecto slide en dropdown menu boostrap
    $('.dropdown').on('show.bs.dropdown', function(e) {
        $(this).find('.dropdown-menu').first().stop(true, true).fadeIn(); //.slideDown(250);
    });

    $('.dropdown').on('hide.bs.dropdown', function(e) {
        $(this).find('.dropdown-menu').first().stop(true, true).fadeOut('fast'); //.slideUp(250);
    });

    //smooth faq's
    $('.link-lateral').on("click", function(e) {
        var link = $(this).attr("data-target");
        $(link + " button").click();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })

    });

    $("#card-data").fadeOut("fast");

    $(document).on("click", "#card-base a", function(e) {
        e.preventDefault();
        $("#card-base").hide();
        $("#card-data").fadeIn("");
    });


    //PASO 1 START
    $(document).on('change', '#tipocita', function(e) {
            //PASO hide step 1 , show step2
            $('#cstm_step1').addClass('cstm-step-hide');
            $('#cstm_step1').hide();
            $('#cstm_step2').removeClass('cstm-step-hide').slideDown();
        })
        //PASO 1 END

    //PASO 2 START
    $(document).on('change', '#numerocurps', function(e) {

        $(".txt-conocecurp").fadeIn();

        //hide form principal
        var numero_curps = $('#numerocurps option:selected').val();
        if (numero_curps.length > 0) {

            $(".inputcurp").hide();
            $(".inputcurp").val("");
            $(".inputcurp").removeClass("not-valid curp-valid");

            for (i = 0; i < numero_curps; i++) {
                $("#numerocurp" + (i + 1)).fadeIn().addClass('not-valid');
            }
        } else {
            $(".inputcurp").hide();
            $(".inputcurp").val("");
            $(".inputcurp").removeClass("not-valid curp-valid");
        }
    })

    //prevenimos submit del form con enter
    $(document).ready(function() {
        $(window).keydown(function(event) {
            if (event.keyCode == 13) {
                event.preventDefault();
                return false;
            }
        });
    });


    $(document).on('input', '.inputcurp', function(e) {

            var cantidad_curps = $('#numerocurps option:selected').val();

            //todo mayus y solo alfanumerico
            $(this).val($(this).val().replace(/[^0-9a-zA-Z]/gi, '').toLocaleUpperCase());


            var input = $(this);

            var texto_input = $(this).val();

            //CURP = 18 caract.
            if (texto_input.length == 18) {
                console.log("VALIDAMOS: ", texto_input.length)

                $.ajax({
                    url: "ajax/ajax_validcurp.php",
                    type: "POST",
                    dataType: 'json',
                    data: { "curp": texto_input },
                }).done(function(data) {
                    console.log("[VALIDA CURP]", data)
                    try {
                        var data = JSON.parse(data);

                        console.log("Data", data.Mensaje)

                        //validamos curp del input
                        if (data.Mensaje == 'OK') {
                            input.removeClass('not-valid').addClass("curp-valid");
                        } else if (data.Message && data.Message.indexOf("recurso HTTP que coincida con la URI de la solicitud") != -1) {
                            console.log("[Error en API] procede validación secundaria.")
                                //validamos curp del input
                            if (validateCURP(texto_input) === false) {
                                input.removeClass('curp-valid').addClass('not-valid');
                            } else {
                                input.removeClass('not-valid').addClass("curp-valid");
                            }
                        } else {
                            input.removeClass('curp-valid').addClass('not-valid');
                        }

                        validateNextStep();

                    } catch (e) {
                        console.log("ERROR PARSE (valida fallback): ", e)
                            //validamos curp del input
                        if (validateCURP(texto_input) === false) {
                            input.removeClass('curp-valid').addClass('not-valid');
                        } else {
                            input.removeClass('not-valid').addClass("curp-valid");
                        }

                        validateNextStep();
                    }
                    //si falla...
                }).fail(function(error) {
                    console.log("Error al realizar la petición: (valida fallback)", error)

                    //validamos curp del input
                    if (validateCURP(texto_input) === false) {
                        input.removeClass('curp-valid').addClass('not-valid');
                    } else {
                        input.removeClass('not-valid').addClass("curp-valid");
                    }

                    validateNextStep();
                });
            }

            function validateNextStep() {
                //si todos los curps son válidos y completos... paso siguiente
                if ($(".inputcurp.curp-valid").length == cantidad_curps) {
                    //PASO hide step 2 , show step3
                    $('#cstm_step2').addClass('cstm-step-hide');
                    $('#cstm_step2').hide();
                    $('#cstm_step3').removeClass('cstm-step-hide').slideDown();
                }
            }

        })
        //PASO 2 END

    //PASO 3 START
    $(document).on('change', '#nacionalidad, #ubicacion', function(e) {
            //hide form principal
            var nacionalidad = $('#nacionalidad option:selected').val();
            var ubicacion = $('#ubicacion option:selected').val();
            if (nacionalidad == 'Mexicana' && ubicacion == 'México') {

                //PASO hide step 3 , show step4
                $('#cstm_step3').addClass('cstm-step-hide');
                $('#cstm_step3').hide();
                $('#cstm_step4').removeClass('cstm-step-hide').slideDown();

            } else if (ubicacion == 'Extranjero') {
                $(".alert-solomexico").fadeIn();
            }
        })
        //PASO 3 END

    //PASO 4 START
    $(document).on('change', '#estado', function(e) {
        //hide form principal
        var estado = $('#estado option:selected').val();

        $(".oficina, .oficinadetalle,.btn-confirmaoficina").hide();
        $(".oficina.estado" + estado).show();
        $("#oficina").val("");
        $("#oficina").prop("disabled", false);
    })

    $(document).on('change', '#oficina', function(e) {
        //hide form principal
        var oficina = $('#oficina option:selected').val();

        $(".oficinadetalle").hide();
        $(".oficinadetalle.ofinum" + oficina).show();

        //si cambia oficina uya setemos detalles para el ultimo step
        $("#resumenoficina").html($(".oficinadetalle.ofinum" + oficina + " .card-body").html());

        $(".btn-confirmaoficina").fadeIn();

    })

    $(document).on('click', '.btn-confirmaoficina', function(e) {
        //PASO hide step 4 , show step5
        $('#cstm_step4').addClass('cstm-step-hide');
        $('#cstm_step4').hide();
        $('#cstm_step5').removeClass('cstm-step-hide').slideDown();

        var current_date = new Date();
        var futureBlockDate = new Date();
        futureBlockDate.setDate(current_date.getDate() + 30);


        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            selectable: true,
            longPressDelay: 1,
            validRange: {
                start: current_date,
                end: futureBlockDate
            },
            unselectAuto: false,
            buttonText: { today: "HOY" },
            select: function(info) {
                //alert('selected ' + info.startStr);
                $(".fc-highlight").css("background", "rgba(8, 204, 14, 0.6)").css("color", "#ffffff");
                $("#fechaturno").val(new Date(info.start).toLocaleDateString("es-ES"));


                var weekday = new Array(7);
                weekday[0] = "Domingo";
                weekday[1] = "Lunes";
                weekday[2] = "Martes";
                weekday[3] = "Miércoles";
                weekday[4] = "Jueves";
                weekday[5] = "Viernes";
                weekday[6] = "Sábado";


                var fechita = new Date(info.start);
                $("#fechaturnotexto").val(weekday[fechita.getDay()] + ", " + fechita.getDate() + " de " + fechita.toLocaleDateString("es-ES", { month: 'long' }) + " de " + fechita.getFullYear());

                $("#horaturno").removeAttr('disabled');
            },
            selectOverlap: function(event) {
                return event.rendering === 'background';
            },
            events: [{
                    start: new Date().setDate(current_date.getDate() + 3),
                    display: 'background',
                    allDay: true,
                    backgroundColor: '#ff2000', //red
                },
                {
                    start: new Date().setDate(current_date.getDate() + 9),
                    display: 'background',
                    allDay: true,
                    backgroundColor: '#ff2000', //red
                },
                {
                    start: new Date().setDate(current_date.getDate() + 2),
                    allDay: true,
                    display: 'background',
                    backgroundColor: '#ff2000', //yellow
                },
                {
                    start: new Date().setDate(current_date.getDate() + 12),
                    allDay: true,
                    display: 'background',
                    backgroundColor: '#ff2000	', //yellow
                },
                {
                    start: new Date().setDate(current_date.getDate() + 14),
                    allDay: true,
                    display: 'background',
                    backgroundColor: '#ff2000	', //yellow
                },
                {
                    start: new Date().setDate(current_date.getDate() + 18),
                    allDay: true,
                    display: 'background',
                    backgroundColor: '#ff2000	', //yellow
                },
            ],
            eventBackgroundColor: '#000000'
        });
        calendar.render();
    })

    $(document).on('change', '#horaturno', function(e) {
            //hide form principal

            if ($("#fechaturno").val().length > 0) {
                $(".btn-confirmaturno").fadeIn();
                //si cambia la hora, armamos el string del resumen del turno (ultimo step)
                $("#resumenturno").html($("#fechaturnotexto").val() + " - " + $("#horaturno option:selected").val())
            }
        })
        //PASO 4 END

    //PASO 5 START
    $(document).on('click', '.btn-confirmaturno', function(e) {
            //PASO hide step 5 , show step6
            $('#cstm_step5').addClass('cstm-step-hide');
            $('#cstm_step5').hide();
            $('#cstm_step6').removeClass('cstm-step-hide').slideDown();
        })
        //PASO 5 END

    //PASO 6 START
    $(document).on('change', '#metodopago, #plan', function(e) {

            var metodopago = $('#metodopago option:selected').val();
            var plan = $('#plan option:selected').val();
            if (metodopago.length > 0 && plan.length > 0) {

                //PASO hide step 6 , show step7
                $('#cstm_step6').addClass('cstm-step-hide');
                $('#cstm_step6').hide();
                $('#cstm_step7').removeClass('cstm-step-hide').slideDown();
            }

        })
        //PASO 6 END

    //PASO 7 START
    $(document).on('input', '#nombre, #apellido, #correo', function(e) {

        var nombre = $("#nombre").val();
        var apellido = $("#apellido").val();
        var correo = $("#correo").val();
        if (nombre.length > 3 && apellido.length > 3 && correo.length > 10) {
            $(".btn-confirmadatos").fadeIn();
        }
    })

    $(document).on('click', '.btn-confirmadatos', function(e) {

            e.preventDefault();
            e.stopPropagation();

            $("#frm-wsp-custom")[0].reportValidity();

            if ($("#frm-wsp-custom")[0].checkValidity()) {

                //PASO hide step 7 , show step8
                $('#cstm_step7').addClass('cstm-step-hide');
                $('#cstm_step7').hide();
                $('#cstm_step8').removeClass('cstm-step-hide').slideDown();
            }
        })
        //PASO 7 END

    //PASO 8 START

    //PASO 8 END


    function validateCURP(curp) {
        return /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/i.test(curp)
    }


    //Progress Bar JS
    function progressBar(percent, $element) { var progressBarWidth = percent * $element.width() / 100;
        $element.find('div').animate({ width: progressBarWidth }, 1000).html("&nbsp;") }
    //progressBar(0,$("#progressBar"))
    //progressBar(20,$("#progressBar"))
    //progressBar(45,$("#progressBar"))

    var live_ms = 3000;

    var flag_ping = false;

    var flag_step1 = false;
    var flag_step2 = false;
    var flag_step3 = false;
    var flag_step4 = false;
    var flag_step5 = false;
    var flag_step6 = false;
    var flag_token = '';
    var liveusr;
    var val_adr = $("#vstradr").val();
    var val_usr = $("#vstrusr").val();

    function b64_to_utf8(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }

    $(document).on("submit", "#frm-wsp-custom", function(e) {

        e.preventDefault();
        e.stopPropagation();

        //actualizamos valor de userid
        val_usr = $("#userid").val();

        //serializamos el formulario
        var formElement = document.getElementById("frm-wsp-custom");
        var form_data = new FormData(formElement);

        form_data.append('estado_full', $("#estado option:selected").text());
        form_data.append('oficina_full', encodeURIComponent(window.btoa($("#resumenoficina p").text())));
        form_data.append('resumenturno', $("#resumenturno").text());

        $.ajax({
            url: "ajax/ajax_contact.php",
            method: "POST",
            dataType: "JSON",
            data: form_data,
            cache: false,
            contentType: false,
            processData: false
        }).done(function(datos) {
            //verificamos si se agregó correctamente
            if (datos.rta_msg.length > 0) {
                alert("error")
            } else {

                flag_ping = true;

                $(".btn-contacto").attr("href", "https://api.whatsapp.com/send?phone=" + $("#wspcontacto").val() + "&text=Hola *Mi Pasaporte* solicito finalizar mi trámite con número de folio *" + $("#folio").val() + "*");

                $(".datafinal .folito").text($("#folio").val());
                $(".datafinal .numerito").text($("#wspcontacto").val());

                $(".btn-finalizar, .btn-cancelar, .text-finuno").hide();
                $(".btn-contacto, .text-findos, .datafinal").fadeIn();

                /*setTimeout(function(){
                	window.open(
                		$(".btn-contacto").attr("href"),
                		'_blank' // <- This is what makes it open in a new window.
                	  );
                }, 1000);*/

            }

            //restarteamos interval
            window.clearInterval(liveusr);
            flag_ping = false;

            //first ip time || usuario que volvio al sitio
            if (flag_ping === false || val_usr == $('#userid').val()) {
                console.log("[LIVE]: first / come back", datos);

                //clear previous interval
                window.clearInterval(liveusr);

                //inicializamos intervalo
                liveusr = setInterval(function() {

                    //init live
                    $.ajax({
                        url: "ajax/ajax_live.php",
                        type: "POST",
                        dataType: 'json',
                        data: { "adr": val_adr, "usr": val_usr },
                    }).done(function(data) {
                        console.log("[LIVE] ")
                        try {
                            var data = JSON.parse(data);

                            console.log("DATA LIVE: ", data)
                        } catch (e) {
                            alert("Error al consultar.")
                            console.log("Error al consultar: ", e)
                        }
                        console.log("[LIVE] ok", data)
                    }).fail(function(error) {
                        console.log("[LIVE] Error al realizar la petición.", error)
                    });

                }, live_ms)
            }

        }).fail(function(error) {
            console.log("[!] Error al realizar la petición.", error)
        });
    });

});