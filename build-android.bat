@echo off
echo Setting up Java environment for Android build...
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.10
set PATH=%JAVA_HOME%\bin;%PATH%

echo JAVA_HOME set to: %JAVA_HOME%
echo Java version:
java -version

echo Starting Android build...
cd android
gradlew.bat assembleDebug

echo Build completed. APK location:
echo android\app\build\outputs\apk\debug\app-debug.apk
pause