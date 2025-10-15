USE [TosAuthenticationSample]
GO

USE [TosAuthenticationSample]
GO

INSERT INTO [dbo].[ma_kaisha] ([cd_kaisha],[nm_kaisha]) VALUES(1,'株式会社トウ・ソリューションズ')
GO
INSERT INTO [dbo].[ma_shozoku] ([cd_shozoku],[cd_shozoku_oi],[nm_shozoku],[cd_kaisha])
     VALUES (1,1,'グループシステム部',1)
GO

INSERT INTO [dbo].[ma_shain] ([cd_shain], [nm_shain], [cd_shozoku],[cd_shozoku_oi])
     VALUES ('99991', '長尾　春香', 1 ,1)
GO


SET IDENTITY_INSERT [dbo].[ma_kengen] ON

--下記のSQL文中の「ログインID」を自身のログインIDを設定して下さい。
--INSERT [dbo].[ma_kengen] ([id], [cd_system], [cd_shain], [cd_ope], [cd_kaisha], [cd_kaiso], [cd_bunrui], [cd_kengen], [no_table], [cd_naiyo], [ymd_create], [cd_create_shain], [ymd_update], [cd_update_shain]) VALUES (1, 1, N'ログインID', 1, 1, 1, 1, 1, 1, 1, CAST(0x0000A20000735B40 AS DateTime), N'ログインID', CAST(0x0000A20000735B40 AS DateTime), N'ログインID')
--GO

SET IDENTITY_INSERT [dbo].[ma_kengen] OFF
GO