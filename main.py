from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

load_dotenv()

app = FastAPI(title="API ScanPesado Central", description="Backend completo para App Web y Móvil")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# ==========================================
# 1. CONFIGURACIÓN DE BASE DE DATOS
# ==========================================
def get_db_connection():
    try:
        conexion = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', 'estudiante'),
            database=os.getenv('DB_NAME', 'SP')
        )
        return conexion
    except Error as e:
        print(f"Error conectando a MySQL: {e}")
        return None

# ==========================================
# 2. MODELOS DE DATOS (PYDANTIC) PARA LA WEB
# ==========================================
class UsuarioNuevo(BaseModel):
    nombre_usuario: str
    email: str
    contrasena: str
    tipo_usuario: str # 'ADMIN' o 'TECNICO'

class ClienteNuevo(BaseModel):
    razon_social: str
    email: Optional[str] = None
    telefono: Optional[str] = None
    gestor: Optional[str] = None

class VehiculoNuevo(BaseModel):
    id_cliente: int
    id_cedis: int
    placa: str
    serie: str
    tipo: Optional[str] = 'CAMION RABON (4x2) DOBLE RODADA TRASERA'

class NotaNueva(BaseModel):
    id_cliente: int
    id_verificentro: int
    folio_nota: str
    tipo_pago: str
    anticipo: float = 0
    atendio: int
    reviso: int

# Modelo Móvil (Abreviado para el ejemplo, aquí van todos tus campos de la evaluación)
class DatosEvaluacion(BaseModel):
    luces_altas: Optional[str] = None
    presion_izq_del: Optional[int] = None
    comentarios: Optional[str] = None

# Modelo Login para JS
class LoginRequest(BaseModel):
    email: str
    password: str

# ==========================================
# 3. RUTAS PARA EL PANEL WEB (ADMINISTRADORES)
# ==========================================

@app.get("/api/health")
def leer_raiz():
    return {"mensaje": "API Central ScanPesado Operando al 100%"}

# --- LECTURA DE TUS VISTAS (REPORTES WEB) ---

@app.get("/admin/vistas/vehiculos")
def reporte_vehiculos():
    conexion = get_db_connection()
    try:
        # dictionary=True hace que MySQL devuelva JSON en lugar de listas de valores
        cursor = conexion.cursor(dictionary=True) 
        # Adaptado a nueva tabla vehiculos
        cursor.execute("SELECT * FROM vehiculos WHERE activo=1")
        return cursor.fetchall()
    finally:
        if conexion: conexion.close()

@app.get("/admin/vistas/finanzas")
def reporte_finanzas():
    conexion = get_db_connection()
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("SELECT * FROM costos WHERE activo=1")
        return cursor.fetchall()
    finally:
        if conexion: conexion.close()

@app.get("/admin/vistas/notas")
def resumen_notas():
    conexion = get_db_connection()
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("SELECT * FROM notas WHERE activo=1")
        return cursor.fetchall()
    finally:
        if conexion: conexion.close()

# --- CREACIÓN DE REGISTROS WEB (CRUDS BÁSICOS) ---

@app.post("/admin/usuarios")
def crear_usuario(user: UsuarioNuevo):
    conexion = get_db_connection()
    try:
        cursor = conexion.cursor()
        hashed_password = get_password_hash(user.contrasena)
        sql = "INSERT INTO usuarios (nombre_usuario, email, contrasena, tipo_usuario) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (user.nombre_usuario, user.email, hashed_password, user.tipo_usuario))
        conexion.commit()
        return {"mensaje": "Usuario creado", "id": cursor.lastrowid}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if conexion: conexion.close()

# ==========================================
# 5. RUTAS DE COMPATIBILIDAD CON FRONTEND JS (/api)
# ==========================================

@app.post("/api/login")
def api_login(creds: LoginRequest):
    conexion = get_db_connection()
    if not conexion: raise HTTPException(500, "Sin conexión a BD")
    try:
        cursor = conexion.cursor(dictionary=True)
        # Buscamos el usuario por email
        sql = "SELECT id_usuario as id, nombre_usuario as nombre, tipo_usuario as rol, email as correo, contrasena FROM usuarios WHERE email = %s AND activo = 1"
        cursor.execute(sql, (creds.email,))
        user = cursor.fetchone()
        
        if not user:
             raise HTTPException(status_code=401, detail="Credenciales inválidas")

        # Verificamos la contraseña
        if not verify_password(creds.password, user['contrasena']):
             raise HTTPException(status_code=401, detail="Credenciales inválidas")

        # Removemos la contraseña del objeto de respuesta
        del user['contrasena']
        return user
    finally:
        conexion.close()

@app.get("/api/clientes")
def api_get_clientes():
    conexion = get_db_connection()
    if not conexion: return []
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("SELECT id_cliente as id, razon_social, email as correo, telefono FROM clientes WHERE activo=1")
        return cursor.fetchall()
    finally:
        conexion.close()

@app.get("/api/usuarios")
def api_get_usuarios():
    conexion = get_db_connection()
    if not conexion: return []
    try:
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("SELECT id_usuario as id, nombre_usuario as nombre, email as correo, tipo_usuario as rol FROM usuarios WHERE activo=1")
        return cursor.fetchall()
    finally:
        conexion.close()

@app.get("/api/stats")
def api_get_stats():
    conexion = get_db_connection()
    stats = {"clientes": 0, "vehiculos": 0, "notas": 0, "verificaciones": 0}
    if not conexion: return stats
    try:
        cursor = conexion.cursor()
        cursor.execute("SELECT COUNT(*) FROM clientes WHERE activo=1")
        stats['clientes'] = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM vehiculos WHERE activo=1")
        stats['vehiculos'] = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM notas WHERE activo=1")
        stats['notas'] = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM verificaciones WHERE activo=1")
        stats['verificaciones'] = cursor.fetchone()[0]
        return stats
    finally:
        conexion.close()

@app.get("/api/verificaciones")
def api_get_verificaciones():
    conexion = get_db_connection()
    if not conexion: return []
    try:
        cursor = conexion.cursor(dictionary=True)
        # Hacemos JOIN porque la tabla verificaciones tiene id_vehiculo, pero el frontend quiere la PLACA (unidad)
        sql = """
            SELECT v.id_verificacion as id, v.folio_verificacion as folio, 
                   veh.placa as unidad, 'Técnico' as tecnico, 
                   v.fecha_verificacion as fecha, v.dictamen as resultado 
            FROM verificaciones v
            LEFT JOIN vehiculos veh ON v.id_vehiculo = veh.id_vehiculo
            WHERE v.activo = 1
            ORDER BY v.fecha_verificacion DESC LIMIT 10
        """
        cursor.execute(sql)
        return cursor.fetchall()
    finally:
        conexion.close()

@app.post("/admin/clientes")
def crear_cliente(cliente: ClienteNuevo):
    conexion = get_db_connection()
    try:
        cursor = conexion.cursor()
        sql = "INSERT INTO clientes (razon_social, email, telefono, gestor) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql, (cliente.razon_social, cliente.email, cliente.telefono, cliente.gestor))
        conexion.commit()
        return {"mensaje": "Cliente creado", "id": cursor.lastrowid}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if conexion: conexion.close()

@app.post("/admin/vehiculos")
def crear_vehiculo(vehiculo: VehiculoNuevo):
    conexion = get_db_connection()
    try:
        cursor = conexion.cursor()
        sql = "INSERT INTO vehiculos (id_cliente, id_cedis, placa, serie, tipo) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (vehiculo.id_cliente, vehiculo.id_cedis, vehiculo.placa, vehiculo.serie, vehiculo.tipo))
        conexion.commit()
        return {"mensaje": "Vehículo registrado", "id": cursor.lastrowid}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if conexion: conexion.close()

# Servir archivos estáticos (HTML/CSS/JS)
# Esto reemplaza la función del servidor Node.js anterior
# IMPORTANTE: Al estar al final y con html=True, servirá index.html en la ruta "/"
app.mount("/", StaticFiles(directory=".", html=True), name="static")

# ==========================================
# 4. RUTAS PARA LA APP MÓVIL (TÉCNICOS)
# ==========================================

@app.post("/movil/evaluaciones/")
def iniciar_evaluacion(id_verificacion: int = Form(...), id_tecnico: int = Form(...)):
    conexion = get_db_connection()
    try:
        cursor = conexion.cursor()
        sql = "INSERT INTO evaluaciones (id_verificacion, id_tecnico) VALUES (%s, %s)"
        cursor.execute(sql, (id_verificacion, id_tecnico))
        conexion.commit()
        return {"mensaje": "Evaluación iniciada", "id_evaluacion": cursor.lastrowid}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if conexion: conexion.close()

@app.put("/movil/evaluaciones/{id_evaluacion}")
def actualizar_evaluacion(id_evaluacion: int, datos: DatosEvaluacion):
    conexion = get_db_connection()
    try:
        cursor = conexion.cursor()
        datos_enviados = datos.dict(exclude_unset=True)
        if not datos_enviados: return {"mensaje": "Sin datos"}

        campos_set = ", ".join([f"{key} = %s" for key in datos_enviados.keys()])
        valores = list(datos_enviados.values())
        valores.append(id_evaluacion)
        
        sql = f"UPDATE evaluaciones SET {campos_set} WHERE id_evaluacion = %s"
        cursor.execute(sql, valores)
        conexion.commit()
        return {"mensaje": "Datos actualizados"}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if conexion: conexion.close()

@app.post("/movil/evaluaciones/{id_evaluacion}/evidencia")
async def subir_foto_evidencia(
    id_evaluacion: int,
    campo_evaluado: str = Form(...), 
    foto: UploadFile = File(...)     
):
    conexion = get_db_connection()
    try:
        foto_bytes = await foto.read()
        cursor = conexion.cursor()
        sql = "INSERT INTO evidencias_evaluacion (id_evaluacion, campo_evaluado, foto) VALUES (%s, %s, %s)"
        cursor.execute(sql, (id_evaluacion, campo_evaluado, foto_bytes))
        conexion.commit()
        return {"mensaje": f"Foto guardada para: {campo_evaluado}"}
    except Error as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        if conexion: conexion.close()