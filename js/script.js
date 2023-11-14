if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js')
            .then(function (registration) {
                // Registro ok
                console.log('El registro del ServiceWorker fue exitoso, tiene el siguiente alcance: ', registration.scope);
                // console.log(registration);
            })
            .catch(function (err) {
                // registro falló :(
                console.log('El registro del ServiceWorker falló: ', err);
            });

        // Demorar el pop up del permiso para notificar
        if (window.Notification && Notification.permission !== 'denied') {
            setTimeout(function () {
                Notification.requestPermission();
            }, 10000);

            var noti = new Notification("titulo", {
                body: "Soy una notificacion",
                icon: "android-icon-192x192.png",
                image: "https://cdn.akamai.steamstatic.com/steam/apps/2141910/capsule_616x353.jpg?t=1697070931",
                badge: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvywGPax9oaCFHKkTXC8rrR9MZMGcHzq3XuVseKT1jrxkoGaqK"
            });
        }

        //detectar estado de conexion

        (function () {
            var header = document.querySelector(".encabezado"),
                metaTema = document.querySelector("meta[name=theme-color]");


            function estado(e) {
                console.log(e.type) //type es una propiedad que devuelve el estado

                if (navigator.onLine) {
                    metaTema.setAttribute("content", "#00ff00")
                    header.classList.remove("offline")

                    alert("Hay red");

                } else {
                    metaTema.setAttribute("content", "##D90000")
                    header.classList.add("offline")

                    alert("Sin red");
                }

            }//fin estado

            if (!navigator.onLine) {
                estado(this)
            }
            window.addEventListener("online", estado);
            window.addEventListener("offline", estado);


        })();

        //API Share
        (function () {

            document.querySelector('.share').addEventListener('click', function () {

                if (navigator.share) {
                    navigator.share({
                        title: 'PWA APIS',
                        text: 'Ejemplo de api share ',
                        url: 'https://mtg-finder.netlify.app/',
                    })
                        .then(function () {
                            console.log("Se compartió")

                        })
                        .catch(function (error) {
                            console.log(error)


                        })
                }
            });

        })()

    }); //load

}

//funcion anónima auto-ejecutable. Todo lo que hay dentro está aislado del resto del código de la página. Agregar a pantalla de inicio
(function () {

    var aviso;

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        aviso = e;
        console.log(aviso)

        showAddToHomeScreen();

    });

    function showAddToHomeScreen() {
        var showAlerts = document.querySelector(".agregar-alerta");
        if (showAlerts != undefined) {
            showAlerts.style.display = "flex";
            showAlerts.addEventListener("click", addToHomeScreen);
        }
    }

    function addToHomeScreen() {
        var showAlerts = document.querySelector(".agregar-alerta");
        showAlerts.style.display = 'none';

        if (aviso) {
            aviso.prompt();
            aviso.userChoice
                .then(function (choiceResult) {

                    if (choiceResult.outcome === 'accepted') {
                        console.log('El usuario acepto las notis');
                    } else {
                        console.log('El usuario rechazó las notis');
                    }

                    aviso = null;

                });

        }

    }

    showAddToHomeScreen();

})(); //Ejecutamos la función


