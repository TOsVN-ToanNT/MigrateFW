@echo off
REM setting parameters
SET SERVER=localhost\SQLEXPRESS
SET ACCOUNT=%COMPUTERNAME%\ASPNET

ver | find "6.0" > nul
if %ERRORLEVEL% == 0 SET ACCOUNT=NT AUTHORITY\Network Service

ver | find "6.1" > nul
if %ERRORLEVEL% == 0 SET ACCOUNT=IIS APPPOOL\ASP.NET v4.0

echo %1 IIS ���s���[�U�[�� %ACCOUNT% �ɐݒ肵�܂����B
PAUSE

REM �e�[�u���̍쐬
sqlcmd -S %SERVER% -E -i CreateDatabaseWithTables.sql

%WinDir%\Microsoft.NET\Framework\v4.0.30319\aspnet_regsql -S %SERVER% -E -A mr -d TosAuthenticationSample

REM Membership�f�[�^�̍쐬
sqlcmd -S %SERVER% -E -i CreateMembershipData.sql

REM �����f�[�^�̍쐬
sqlcmd -S %SERVER% -E -i Createma_kengenData.sql

REM �A�v���P�[�V�����f�[�^�x�[�X�̍쐬
sqlcmd -S %SERVER% -E -i CreateDatabase_UITemplateTrainingLab.sql

PAUSE
