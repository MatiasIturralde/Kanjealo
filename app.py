"""
================================================================================
KANJEALO V5 - BACKEND EN JAVASCRIPT / LIVE SERVER
================================================================================
ESTADO ACTUAL: Este archivo app.py se encuentra TEMPORALMENTE DESACTIVADO.
El proyecto ha sido migrado a JavaScript Vanilla para ejecutarse de forma directa
con Live Server (http://127.0.0.1:5500/) sin necesidad de entorno Python.

¿CÓMO EJECUTAR EL PROYECTO AHORA?

Opción A - Con VS Code Live Server (Recomendado):
  1. Abrí esta carpeta en Visual Studio Code.
  2. Hacé clic derecho en 'index.html' -> "Open with Live Server".
  3. La aplicación se abrirá en http://127.0.0.1:5500/index.html lista para usar.

Opción B - Con Node.js:
  1. Ejecutá 'npm start' en la terminal.
  2. Abrí http://127.0.0.1:5500 en tu navegador.
================================================================================
"""

import sys

def main():
    print("=" * 75)
    print(" AVISO: app.py está temporalmente desactivado.")
    print(" Kanjealo V5 ahora funciona con JavaScript Vanilla y Live Server.")
    print("=" * 75)
    print("\nPara usar el proyecto:")
    print("1. Abrí 'index.html' con la extensión Live Server de VS Code (puerto 5500)")
    print("2. O ejecutá en consola: npm start\n")
    print("URL local: http://127.0.0.1:5500/")
    print("=" * 75)

if __name__ == "__main__":
    main()

# ==============================================================================
# CÓDIGO PYTHON ORIGINAL PRESERVADO COMO REFERENCIA HISTÓRICA:
# ==============================================================================
# import os, secrets, sqlite3, hashlib, hmac, json
# from datetime import datetime, timedelta
# from functools import wraps
# from pathlib import Path
# from urllib.parse import urlencode
# import requests
# from flask import Flask, abort, flash, g, redirect, render_template, request, session, url_for, send_file
# from werkzeug.security import check_password_hash, generate_password_hash
# ... (Migrado a static/kanjealo.js y server.js)
