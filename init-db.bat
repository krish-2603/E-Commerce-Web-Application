@echo off
set "PATH=C:\Users\krish\AppData\Local\nvm\v22.14.0;C:\Users\krish\AppData\Local\Microsoft\WinGet\Packages\Git.MinGit_Microsoft.Winget.Source_8wekyb3d8bbwe\cmd;%PATH%"
cd /d "%~dp0"
echo ========================================================
echo   Initializing Relational Database & Seed Data...
echo ========================================================
node database/setup.js --force
pause
