// Este archivo lo REESCRIBE el contenedor al arrancar, con las
// variables de entorno del servidor (ver docker/entrypoint.sh).
//
// En desarrollo se queda vacío a propósito: ahí la configuración
// sale del archivo .env, como siempre.
window.__ITZABELA_CONFIG__ = {};
