@echo off
REM ═══════════════════════════════════════════════════════════════
REM Script para resetear la Base de Datos de SP-ScanPesado
REM Ejecutar como Administrador
REM ═══════════════════════════════════════════════════════════════

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     SP-ScanPesado: Resetear Base de Datos                  ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Solicitar datos de conexión
set /p user="Ingresa usuario MySQL (ej: root): "
if "%user%"=="" set user=root

set /p password="Ingresa contraseña MySQL: "

echo.
echo Selecciona una opción:
echo.
echo 1) Resetear AUTO_INCREMENT (conservar datos)
echo 2) Resetear completo (limpiar todos los datos)
echo 3) Salir
echo.
set /p option="Opción (1-3): "

if "%option%"=="1" goto option1
if "%option%"=="2" goto option2
if "%option%"=="3" goto exit
goto invalid

:option1
echo.
echo ⏳ Ejecutando reset_auto_increment.sql...
mysql -u %user% -p%password% SP < reset_auto_increment.sql
if %errorlevel%==0 (
    echo.
    echo ✅ AUTO_INCREMENT reseteados correctamente
    echo.
    echo Próximos pasos:
    echo 1. Reinicia Spring Boot: mvn spring-boot:run
    echo 2. Actualiza el navegador (F5)
    echo 3. Prueba creando un usuario nuevo
) else (
    echo.
    echo ❌ Error ejecutando el script
    echo Verifica usuario y contraseña
)
goto end

:option2
echo.
echo ⚠️  ADVERTENCIA: Se eliminarán TODOS los datos
set /p confirm="¿Estás seguro? (s/n): "
if /i "%confirm%"=="s" (
    echo.
    echo ⏳ Ejecutando reset_database.sql...
    mysql -u %user% -p%password% SP < reset_database.sql
    if %errorlevel%==0 (
        echo.
        echo ✅ Base de datos reseteada correctamente
        echo.
        echo Datos reiniciados:
        echo - Usuario 1: admin@scanpesado.com / admin123
        echo - Usuario 2: carlos@scanpesado.com / admin123
        echo.
        echo Próximos pasos:
        echo 1. Reinicia Spring Boot: mvn spring-boot:run
        echo 2. Actualiza el navegador (F5)
        echo 3. Prueba con los usuarios reiniciados
    ) else (
        echo.
        echo ❌ Error ejecutando el script
    )
) else (
    echo Operación cancelada
)
goto end

:invalid
echo.
echo ❌ Opción inválida
echo.
goto end

:exit
echo Operación cancelada
goto end

:end
echo.
pause

