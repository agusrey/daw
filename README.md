Trabajo práctico de Desarrollo de Aplicaciones Web
==================================================

Esta es la primera versión del trabajo práctico final de la materia Desarrollo de Aplicaciones Web de la Maestría de Internet de las cosas.

Este trabajo toma como base lo publicado por Agustín Bassi en la página www.gotoiot.com respecto de una aplicación web full-stack.

La aplicación funciona dentro de un contenedor Docker, por lo que será necesario instalar Docker. También será necesario instalar Docker compose, que es una herramienta para manejar múltiples contenedores Docker, nos permite configurar las variables de entorno y desplegar el funcionamiento de varios contenedores en simultáneo según lo especificado en el archivo de texto docker-compose.yml .


# Instalación
1) Instalar Docker y Docker Compose:
Seguir las instrucciones de instalación de https://www.gotoiot.com/pages/articles/docker_installation_linux/index.html

2) Descargar el repositorio del TP:
En este repo se encuentra los archivos de la aplicación web https://github.com/agusrey/daw.git

3) Ejecutar el comando docker-compose up
Al ejecutarse este comando, Docker Compose descarga las imágenes de los contenedores que están especificadas en docker-compose.yml e iniciará los servicios. En este caso en particular las imágenes descargadas son:
    Compilador typescript: harmish/typescript
    Base de datos:  mysql:5.7
    PHP:    phpmyadmin/phpmyadmin
    NodeJS: abassi/nodejs-server:10.0-dev

4) Para llamar a la aplicación abrir un navegador (por ejemplo Chrome) y abrir la url http://localhos:8000

# Implementación

Para el Frontend se utilizó la biblioteca de estilo Materialize y se codificó en Typescript y HTML.
En el Backend se utilizó NodeJs que es un motor de ejecución de código JavaScript en backend, y la biblioteca Express JS que facilita los métodos HTTP que se usaron en este TP.

Al abrir la url, el Frontend despliega una lista de dispositivos. El archivo device.ts contiene el array JSon con los dispositivos y sus características. Los datos se recuperan con la ayuda de la biblioteca NodeJS y un comando HTTP del tipo GET.
En esta implementación se caracterizaron 5 tipos de dispositivos:
    0: Lámpara tipo on/off 
    1: Lámpara dimerizable
    2: Velador tipo on/off
    3: Velador dimerizable
    4: Persiana regulable
En la lista se observa el ícono y el control correspondiente (on/off o deslizable) según el tipo de dispositivo.

Al actuar sobre el control se puede encender o apagar (on/off) o definir el porcentaje de accionamiento entre 0 y 100%. El nuevo valor se envía mediante un comando HTTP del tipo POST a los distintos endpoints para que el backend los almacene en la memoria. Si bien se podía persistir la información con mysql, no se utilizó dado que es un tema que aún no se trató en la maestría. Se muestra en pantalla el respose del Post con el JSon del dispositivo actualizado.

Además se agregaron botones para agregar, modificar y borrar dispositivos.
Solo se implementó la posibilidad de borrar, el POST procesado por el Backend quita de la lista el dispositivo en cuestión. Una vez realizada la acción de borrar, se ejecuta el comando location.reload() para refrescar la página y actualizar el listado de dispositivos en pantalla.

En los casos nuevo dispositivo y editar dispositivo, solo se dejó planteado. No me fue posible resolver un método de ingresar la información (por mi falta de conocimientos en HTML).

## Licencia 📄

Este proyecto está bajo Licencia ([MIT](https://choosealicense.com/licenses/mit/)). Podés ver el archivo [LICENSE.md](LICENSE.md) para más detalles sobre el uso de este material.

**Copyright © Agustín Rey - 2021**
