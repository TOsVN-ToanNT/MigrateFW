USE [master]
GO

DECLARE @proc smallint
DECLARE sysproc_cur CURSOR FAST_FORWARD FOR
 SELECT spid FROM master..sysprocesses WITH(NOLOCK)
OPEN sysproc_cur
FETCH NEXT FROM sysproc_cur INTO @proc
WHILE (@@FETCH_STATUS <> -1)
BEGIN
   EXEC('KILL ' + @proc)
   FETCH NEXT FROM sysproc_cur INTO @proc
END
CLOSE sysproc_cur
DEALLOCATE sysproc_cur
 
if exists (select name from sys.databases where name = 'UITemplateTrainingLab')
    drop database [UITemplateTrainingLab]
 
declare @device_directory nvarchar(520)
select @device_directory = substring(filename, 1, charindex(N'master.mdf', lower(filename)) - 1)
from master.dbo.sysaltfiles 
where dbid = 1 AND fileid = 1
 
execute ('create database [UITemplateTrainingLab] on primary
( name = ''UITemplateTrainingLab'', filename = ''' + @device_directory + 'UITemplateTrainingLab.mdf'', size = 5120KB, maxsize = unlimited, filegrowth = 1024KB)
log on
( name = ''UITemplateTrainingLab_log'', filename = ''' + @device_directory + 'UITemplateTrainingLab.ldf'' , size = 1024KB , maxsize = 2048GB , filegrowth = 10%)')

GO
ALTER DATABASE [UITemplateTrainingLab] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [UITemplateTrainingLab].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [UITemplateTrainingLab] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET ARITHABORT OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [UITemplateTrainingLab] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [UITemplateTrainingLab] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [UITemplateTrainingLab] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [UITemplateTrainingLab] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET  ENABLE_BROKER 
GO
ALTER DATABASE [UITemplateTrainingLab] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [UITemplateTrainingLab] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [UITemplateTrainingLab] SET  MULTI_USER 
GO
ALTER DATABASE [UITemplateTrainingLab] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [UITemplateTrainingLab] SET DB_CHAINING OFF 
GO
ALTER DATABASE [UITemplateTrainingLab] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [UITemplateTrainingLab] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
USE [UITemplateTrainingLab]
GO
/****** Object:  Table [dbo].[Buhin]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Buhin](
	[cd_buhin] [int] NOT NULL,
	[nm_buhin] [nvarchar](50) NULL,
	[kin_shiire] [int] NULL,
	[nm_tani] [nvarchar](4) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NULL,
 CONSTRAINT [PK_Buhin] PRIMARY KEY CLUSTERED 
(
	[cd_buhin] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[BuhinCalendar]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BuhinCalendar](
	[no_buhin_calendar] [int] IDENTITY(1,1) NOT NULL,
	[cd_buhin] [int] NOT NULL,
	[dt_sakusei] [datetimeoffset](7) NOT NULL,
	[nm_komoku] [nvarchar](200) NULL,
	[su_suryo] [int] NULL,
	[kin_shiire_tanka] [decimal](18, 2) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NULL,
 CONSTRAINT [PK_BuhinCalendar] PRIMARY KEY CLUSTERED 
(
	[no_buhin_calendar] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[FixedKentosho]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FixedKentosho](
	[no_kento] [int] IDENTITY(1,1) NOT NULL,
	[no_fixed] [int] NOT NULL,
	[no_komoku] [int] NULL,
	[nm_komoku] [nvarchar](200) NULL,
	[su_suryo] [int] NULL,
	[kin_shiire_tanka] [decimal](18, 2) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NULL,
	[cd_buhin] [int] NOT NULL,
 CONSTRAINT [PK_FixedKentosho] PRIMARY KEY CLUSTERED 
(
	[no_kento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[FixedMitsumori]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FixedMitsumori](
	[no_fixed] [int] IDENTITY(1,1) NOT NULL,
	[nm_fixed] [nvarchar](200) NULL,
	[cd_torihiki] [int] NOT NULL,
	[cd_shiharai] [int] NULL,
	[nm_hinmei] [nvarchar](200) NULL,
	[biko] [nvarchar](200) NULL,
	[flg_del] [bit] NOT NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NULL,
 CONSTRAINT [PK_FixedMitsumori] PRIMARY KEY CLUSTERED 
(
	[no_fixed] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Kentosho]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Kentosho](
	[no_kento] [int] IDENTITY(1,1) NOT NULL,
	[no_mitsumori] [int] NOT NULL,
	[no_komoku] [int] NULL,
	[nm_komoku] [nvarchar](200) NULL,
	[su_suryo] [int] NULL,
	[kin_shiire_tanka] [decimal](18, 2) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NULL,
	[cd_buhin] [int] NOT NULL,
 CONSTRAINT [PK_Kentosho] PRIMARY KEY CLUSTERED 
(
	[no_kento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Mitsumori]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Mitsumori](
	[no_mitsumori] [int] IDENTITY(1,1) NOT NULL,
	[cd_torihiki] [int] NOT NULL,
	[cd_shiharai] [int] NULL,
	[nm_hinmei] [nvarchar](200) NULL,
	[biko] [nvarchar](200) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NULL,
	[flg_del] [bit] NOT NULL,
 CONSTRAINT [PK_Mitsumori] PRIMARY KEY CLUSTERED 
(
	[no_mitsumori] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[MitsumoriDirect]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MitsumoriDirect](
	[no_mitsumori] [int] NOT NULL,
	[cd_torihiki] [int] NOT NULL,
	[cd_shiharai] [int] NULL,
	[nm_hinmei] [nvarchar](200) NULL,
	[biko] [nvarchar](200) NULL,
	[flg_del] [bit] NOT NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NULL,
 CONSTRAINT [PK_MitsumoriDirect] PRIMARY KEY CLUSTERED 
(
	[no_mitsumori] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[News]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[News](
	[no_news] [int] IDENTITY(1,1) NOT NULL,
	[nm_title] [nvarchar](255) NULL,
	[nm_content] [nvarchar](4000) NULL,
	[dt_news] [datetimeoffset](7) NOT NULL,
	[level] [nvarchar](10) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NULL,
 CONSTRAINT [PK_News] PRIMARY KEY CLUSTERED 
(
	[no_news] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ShiharaiJoken]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ShiharaiJoken](
	[cd_shiharai] [int] IDENTITY(1,1) NOT NULL,
	[nm_joken_shiharai] [nvarchar](80) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NULL,
 CONSTRAINT [PK_ShiharaiJoken] PRIMARY KEY CLUSTERED 
(
	[cd_shiharai] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Shinsei]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Shinsei](
	[no_system] [int] IDENTITY(1,1) NOT NULL,
	[su_machi] [int] NOT NULL,
	[su_zumi] [int] NOT NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.Shinsei] PRIMARY KEY CLUSTERED 
(
	[no_system] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Tenpu]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tenpu](
	[no_tenpu] [int] IDENTITY(1,1) NOT NULL,
	[no_mitsumori] [int] NOT NULL,
	[nm_file] [nvarchar](255) NULL,
	[file] [image] NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NULL,
 CONSTRAINT [PK_Tenpu] PRIMARY KEY CLUSTERED 
(
	[no_tenpu] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Torihiki]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Torihiki](
	[cd_torihiki] [int] NOT NULL,
	[nm_torihiki] [nvarchar](100) NULL,
	[nm_torihiki_en] [nvarchar](50) NULL,
	[kbn_konyu] [nvarchar](1) NULL,
	[nm_jusho] [nvarchar](160) NULL,
	[no_yubin] [nvarchar](8) NULL,
	[no_tel] [nvarchar](12) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NULL,
 CONSTRAINT [PK_Torihiki] PRIMARY KEY CLUSTERED 
(
	[cd_torihiki] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tr_torihiki_buhin]    Script Date: 2015/11/26 9:59:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[tr_torihiki_buhin](
	[dt_nohin] [datetimeoffset](7) NOT NULL,
	[cd_torihiki] [int] NOT NULL,
	[cd_buhin] [int] NOT NULL,
	[nm_buhin] [varchar](50) NULL,
	[su_yotei] [decimal](10, 2) NULL,
	[su_jisseki] [decimal](10, 2) NULL,
	[su_hiritsu_yotei] [decimal](10, 2) NULL,
	[su_hiritsu_jisseki] [decimal](10, 2) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NULL,
 CONSTRAINT [PK_tr_torihiki_buhin] PRIMARY KEY CLUSTERED 
(
	[dt_nohin] ASC,
	[cd_torihiki] ASC,
	[cd_buhin] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
INSERT [dbo].[Buhin] ([cd_buhin], [nm_buhin], [kin_shiire], [nm_tani], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (1, N'停止レバー　近接センサー', 10900, N'個', NULL, NULL, NULL, NULL)
INSERT [dbo].[Buhin] ([cd_buhin], [nm_buhin], [kin_shiire], [nm_tani], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (2, N'マウントチェーン', 262400, N'本',NULL, NULL, NULL, NULL)
INSERT [dbo].[Buhin] ([cd_buhin], [nm_buhin], [kin_shiire], [nm_tani], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (3, N'ロックスプリング（N600）', 960, N'個',NULL, NULL, NULL, NULL)
INSERT [dbo].[Buhin] ([cd_buhin], [nm_buhin], [kin_shiire], [nm_tani], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (4, N'PF2.5　シートパッキン　(EPDM)(図番7-A)', 270, N'枚', NULL, NULL, NULL, NULL)
INSERT [dbo].[Buhin] ([cd_buhin], [nm_buhin], [kin_shiire], [nm_tani], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (5, N'扉用パッキン', 21000, N'式', NULL, NULL, NULL, NULL)
INSERT [dbo].[Buhin] ([cd_buhin], [nm_buhin], [kin_shiire], [nm_tani], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (6, N'導電率計検出器　インデュマックス　H', 146850, N'個', NULL, NULL, NULL, NULL)
INSERT [dbo].[Buhin] ([cd_buhin], [nm_buhin], [kin_shiire], [nm_tani], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (7, N'H318-15T　ナイロン　キャップ', 700, N'個',NULL, NULL, NULL, NULL)
INSERT [dbo].[Buhin] ([cd_buhin], [nm_buhin], [kin_shiire], [nm_tani], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (8, N'オーリング', 200, N'個',NULL, NULL, NULL, NULL)
INSERT [dbo].[Buhin] ([cd_buhin], [nm_buhin], [kin_shiire], [nm_tani], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (9, N'スイングベンドパッキン　φ３８', 540, N'個',NULL, NULL, NULL, NULL)
INSERT [dbo].[Buhin] ([cd_buhin], [nm_buhin], [kin_shiire], [nm_tani], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (10, N'絶縁ブロック（右）', 7800, N'式',NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[FixedMitsumori] ON 

INSERT [dbo].[FixedMitsumori] ([no_fixed], [nm_fixed], [cd_torihiki], [cd_shiharai], [nm_hinmei], [biko], [flg_del], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (1, N'定型1', 598400, 1, N'停止レバー　近接センサー', NULL, 0, NULL, NULL, NULL, NULL)
INSERT [dbo].[FixedMitsumori] ([no_fixed], [nm_fixed], [cd_torihiki], [cd_shiharai], [nm_hinmei], [biko], [flg_del], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (2, N'定型2', 598400, 2, N'マウントチェーン', NULL, 0, NULL, NULL, NULL, NULL)
INSERT [dbo].[FixedMitsumori] ([no_fixed], [nm_fixed], [cd_torihiki], [cd_shiharai], [nm_hinmei], [biko], [flg_del], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (3, N'定型3', 598400, 3, N'マウントチェーン', NULL, 0, NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[FixedMitsumori] OFF
SET IDENTITY_INSERT [dbo].[Mitsumori] ON 

INSERT [dbo].[Mitsumori] ([no_mitsumori], [cd_torihiki], [cd_shiharai], [nm_hinmei], [biko], [dt_create], [cd_create], [dt_update], [cd_update], [flg_del]) VALUES (1, 598400, 1, N'停止レバー　近接センサー', '備考1', NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Mitsumori] ([no_mitsumori], [cd_torihiki], [cd_shiharai], [nm_hinmei], [biko], [dt_create], [cd_create], [dt_update], [cd_update], [flg_del]) VALUES (2, 598400, 2, N'マウントチェーン', '備考2', NULL, NULL, NULL, NULL, 0)
INSERT [dbo].[Mitsumori] ([no_mitsumori], [cd_torihiki], [cd_shiharai], [nm_hinmei], [biko], [dt_create], [cd_create], [dt_update], [cd_update], [flg_del]) VALUES (3, 598400, 3, N'マウントチェーン', NULL, NULL, NULL, NULL, NULL, 0)
SET IDENTITY_INSERT [dbo].[Mitsumori] OFF
INSERT [dbo].[MitsumoriDirect] ([no_mitsumori], [cd_torihiki], [cd_shiharai], [nm_hinmei], [biko], [flg_del], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (1, 598400, 1, N'停止レバー　近接センサー', NULL, 0, NULL, NULL, NULL, NULL)
INSERT [dbo].[MitsumoriDirect] ([no_mitsumori], [cd_torihiki], [cd_shiharai], [nm_hinmei], [biko], [flg_del], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (2, 598400, 2, N'マウントチェーン', NULL, 0, NULL, NULL, NULL, NULL)
INSERT [dbo].[MitsumoriDirect] ([no_mitsumori], [cd_torihiki], [cd_shiharai], [nm_hinmei], [biko], [flg_del], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (3, 598400, 3, N'マウントチェーン',NULL, 0, NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[News] ON 

INSERT [dbo].[News] ([no_news], [nm_title], [nm_content], [dt_news], [level], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (1, N'システム停止のお知らせ1', N'1月31日（土） 20:00 ~ 22:00 の間、システムメンテナンスのためシステムの利用ができなくなります。ご不便をお掛け致しますがご了承のほどよろしくお願いいたします。', getdate(), N'danger', NULL, NULL, NULL, NULL)
INSERT [dbo].[News] ([no_news], [nm_title], [nm_content], [dt_news], [level], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (2, N'年末システム停止のお知らせ2', N'12月30日（月） 20:00 ~ 12月31日（火）10:00 の間、システムメンテナンスのためシステムの利用ができなくなります。ご不便をお掛け致しますがご了承のほどよろしくお願いいたします。', getdate(), N'danger', NULL, NULL, NULL, NULL)
INSERT [dbo].[News] ([no_news], [nm_title], [nm_content], [dt_news], [level], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (3, N'警告3', N'12月30日（月） 20:00 ~ 12月31日（火）10:00 の間、システムメンテナンスのためシステムの利用ができなくなります。ご不便をお掛け致しますがご了承のほどよろしくお願いいたします。', getdate(), N'warning', NULL, NULL, NULL, NULL)
INSERT [dbo].[News] ([no_news], [nm_title], [nm_content], [dt_news], [level], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (4, N'お知らせ4', N'12月30日（月） 20:00 ~ 12月31日（火）10:00 の間、システムメンテナンスのためシステムの利用ができなくなります。ご不便をお掛け致しますがご了承のほどよろしくお願いいたします。', getdate(), N'info', NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[News] OFF
SET IDENTITY_INSERT [dbo].[ShiharaiJoken] ON 

INSERT [dbo].[ShiharaiJoken] ([cd_shiharai], [nm_joken_shiharai], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (1, N'月末締め翌月末振込み', NULL, NULL, NULL, NULL)
INSERT [dbo].[ShiharaiJoken] ([cd_shiharai], [nm_joken_shiharai], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (2, N'月末締め翌月末現金払い', NULL, NULL, NULL, NULL)
INSERT [dbo].[ShiharaiJoken] ([cd_shiharai], [nm_joken_shiharai], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (3, N'20日締め翌月10日現金振込み', NULL, NULL, NULL, NULL)
INSERT [dbo].[ShiharaiJoken] ([cd_shiharai], [nm_joken_shiharai], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (4, N'20日締め翌月末払い', NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[ShiharaiJoken] OFF
SET IDENTITY_INSERT [dbo].[Shinsei] ON 

INSERT [dbo].[Shinsei] ([no_system], [su_machi], [su_zumi], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (1, 11, 12, NULL, NULL, NULL, NULL)
INSERT [dbo].[Shinsei] ([no_system], [su_machi], [su_zumi], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (2, 21, 22, NULL, NULL, NULL, NULL)
INSERT [dbo].[Shinsei] ([no_system], [su_machi], [su_zumi], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (3, 31, 32, NULL, NULL, NULL, NULL)
SET IDENTITY_INSERT [dbo].[Shinsei] OFF
INSERT [dbo].[Torihiki] ([cd_torihiki], [nm_torihiki], [nm_torihiki_en], [kbn_konyu], [nm_jusho], [no_yubin], [no_tel], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (598400, N'株式会社オイシス　明石工場', NULL, N'0', N'兵庫県明石市大久保町松陰２４６', N'6740053', N'078-936-3851', NULL, NULL, NULL, NULL)
INSERT [dbo].[Torihiki] ([cd_torihiki], [nm_torihiki], [nm_torihiki_en], [kbn_konyu], [nm_jusho], [no_yubin], [no_tel], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (598401, N'株式会社スピナ', NULL, N'0', N'兵庫県神戸市西区上新地３－８－１', N'6512411', N'078-967-4447', NULL, NULL, NULL, NULL)
INSERT [dbo].[Torihiki] ([cd_torihiki], [nm_torihiki], [nm_torihiki_en], [kbn_konyu], [nm_jusho], [no_yubin], [no_tel], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (598402, N'兵神装備株式会社　本社', NULL, N'1', N'兵庫県神戸市兵庫区御崎本町１－１－５４', N'6520852', N'078-652-1111', NULL, NULL, NULL, NULL)
INSERT [dbo].[Torihiki] ([cd_torihiki], [nm_torihiki], [nm_torihiki_en], [kbn_konyu], [nm_jusho], [no_yubin], [no_tel], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (598403, N'ヨシナカ産業株式会社', NULL, N'0', N'福島県伊達郡国見町藤田駅前', N'9691761', NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Torihiki] ([cd_torihiki], [nm_torihiki], [nm_torihiki_en], [kbn_konyu], [nm_jusho], [no_yubin], [no_tel], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (598404, N'株式会社寺岡精工', NULL, N'1', N'東京都品川区大崎２－３－１３', N'1410032', N'03-3491-6663', NULL, NULL, NULL, NULL)
INSERT [dbo].[Torihiki] ([cd_torihiki], [nm_torihiki], [nm_torihiki_en], [kbn_konyu], [nm_jusho], [no_yubin], [no_tel], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (598405, N'東洋石油株式会社', NULL, N'1', N'東京都千代田区内幸町１－３－１', N'1000011', NULL,  NULL, NULL, NULL, NULL)
INSERT [dbo].[Torihiki] ([cd_torihiki], [nm_torihiki], [nm_torihiki_en], [kbn_konyu], [nm_jusho], [no_yubin], [no_tel], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (598406, N'日豊食品工業株式会社', NULL, N'0', N'熊本県下益城郡城南町築地６２４－１９', N'8614212', N'0964-28-7071', NULL, NULL, NULL, NULL)
INSERT [dbo].[Torihiki] ([cd_torihiki], [nm_torihiki], [nm_torihiki_en], [kbn_konyu], [nm_jusho], [no_yubin], [no_tel], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (598407, N'株式会社サンバラ', NULL, N'0', N'福岡県久留米市三潴町田川７８７－１', N'8300102', NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Torihiki] ([cd_torihiki], [nm_torihiki], [nm_torihiki_en], [kbn_konyu], [nm_jusho], [no_yubin], [no_tel], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (598408, N'株式会社後藤孵卵場　ゴトウたまごセンター', NULL, N'0', N'岐阜県各務原市須衛町４－２９１', N'5090108', NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[Torihiki] ([cd_torihiki], [nm_torihiki], [nm_torihiki_en], [kbn_konyu], [nm_jusho], [no_yubin], [no_tel], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (598409, N'小川たまご株式会社', NULL, N'0', N'茨城県小美玉市中延字池向２２６０', N'3113422', NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598400, 1, N'停止レバー　近接センサー', CAST(0.00 AS Decimal(10, 2)), CAST(0.00 AS Decimal(10, 2)), CAST(5.00 AS Decimal(10, 2)), CAST(4.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598400, 2, N'マウントチェーン', CAST(20.00 AS Decimal(10, 2)), CAST(1.00 AS Decimal(10, 2)), CAST(0.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598400, 3, N'ロックスプリング（N600）', CAST(30.00 AS Decimal(10, 2)), CAST(15.00 AS Decimal(10, 2)), CAST(0.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598401, 1, N'停止レバー　近接センサー', CAST(7.00 AS Decimal(10, 2)), CAST(8.00 AS Decimal(10, 2)), NULL, NULL,  NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598401, 2, N'マウントチェーン', CAST(20.00 AS Decimal(10, 2)), CAST(2.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598401, 3, N'ロックスプリング（N600）', CAST(30.00 AS Decimal(10, 2)), CAST(16.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598402, 1, N'停止レバー　近接センサー', CAST(30.00 AS Decimal(10, 2)), CAST(3.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598402, 2, N'マウントチェーン', CAST(20.00 AS Decimal(10, 2)), CAST(3.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598403, 1, N'停止レバー　近接センサー', CAST(20.00 AS Decimal(10, 2)), CAST(4.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598403, 3, N'ロックスプリング（N600）', CAST(2.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598404, 1, N'停止レバー　近接センサー', CAST(10.00 AS Decimal(10, 2)), CAST(5.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598404, 2, N'マウントチェーン', CAST(20.00 AS Decimal(10, 2)), CAST(5.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598404, 3, N'ロックスプリング（N600）', CAST(40.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598408, 1, N'停止レバー　近接センサー', CAST(10.00 AS Decimal(10, 2)), CAST(9.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598408, 2, N'マウントチェーン', CAST(20.00 AS Decimal(10, 2)), CAST(9.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598408, 3, N'ロックスプリング（N600）', CAST(30.00 AS Decimal(10, 2)), CAST(23.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598409, 1, N'停止レバー　近接センサー', CAST(10.00 AS Decimal(10, 2)), CAST(10.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598409, 2, N'マウントチェーン', CAST(20.00 AS Decimal(10, 2)), CAST(10.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D973A0B1C02 AS DateTimeOffset), 598409, 3, N'ロックスプリング（N600）', CAST(30.00 AS Decimal(10, 2)), CAST(24.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D983A0B1C02 AS DateTimeOffset), 598400, 1, N'停止レバー　近接センサー', CAST(1.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D983A0B1C02 AS DateTimeOffset), 598401, 1, N'停止レバー　近接センサー', CAST(2.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D983A0B1C02 AS DateTimeOffset), 598402, 1, N'停止レバー　近接センサー', CAST(3.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D983A0B1C02 AS DateTimeOffset), 598403, 1, N'停止レバー　近接センサー', CAST(4.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL, NULL)
INSERT [dbo].[tr_torihiki_buhin] ([dt_nohin], [cd_torihiki], [cd_buhin], [nm_buhin], [su_yotei], [su_jisseki], [su_hiritsu_yotei], [su_hiritsu_jisseki], [dt_create], [cd_create], [dt_update], [cd_update]) VALUES (CAST(0x07001882BA7D983A0B1C02 AS DateTimeOffset), 598404, 1, N'停止レバー　近接センサー', CAST(5.00 AS Decimal(10, 2)), NULL, NULL, NULL, NULL, NULL, NULL, NULL)

USE [master]
GO
ALTER DATABASE [UITemplateTrainingLab] SET  READ_WRITE 
GO
