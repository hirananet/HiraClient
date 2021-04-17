# HiraClient

Segunda versión de HiraClient, cliente de IRC para web y desktop

## Parametría disponible:

chat=CANAL; unirse a este canal
embedded=yes; modo embebido forzado
nick=NICK; nick inicial
connect=yes; autoconectar
skin=dark|light|custom;

## Comandos desktop unicamente

En pestaña server:

/log_route

para ver los logs y

/log_route /nueva/ruta

para establecer una nueva ruta

## Comandos generales:

/query usuario
abre un chat con ese usuario.

/clear
borra el historico de un canal.

/stop
(para animación de evento)

/hc join #channel
para unir el hira client a un canal.

/hc owners
para ver la lista de usuarios habilitados

/hc #canal userNick r RangoNombre #aaa
da a un user el rango en un canal, RangoNombre es el nombre del rango y #aaa es el color en hexadecimal.

/hc userNick g RangoNombre #aaa
de un rango en todos los canales a un userNick (solo para owners).

/hc avatar http://image.png
cambia tu avatar por el de la url.
