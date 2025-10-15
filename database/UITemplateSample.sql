USE [master]
GO

if exists (select name from sys.databases where name = 'UITemplateSample')
    drop database [UITemplateSample]
 
declare @device_directory nvarchar(520)
select @device_directory = substring(filename, 1, charindex(N'master.mdf', lower(filename)) - 1)
from master.dbo.sysaltfiles 
where dbid = 1 AND fileid = 1
 
execute ('create database [UITemplateSample] on primary
( name = ''UITemplateSample'', filename = ''' + @device_directory + 'UITemplateSample.mdf'', size = 5120KB, maxsize = unlimited, filegrowth = 1024KB)
log on
( name = ''UITemplateSample_log'', filename = ''' + @device_directory + 'UITemplateSample.ldf'' , size = 1024KB , maxsize = 2048GB , filegrowth = 10%)')

GO
/*
CREATE DATABASE [UITemplateSample] ON  PRIMARY 
( NAME = N'UITemplateSample', FILENAME = N'D:\DATA\UITemplateSample.mdf' , SIZE = 4352KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'UITemplateSample_log', FILENAME = N'D:\DATA\UITemplateSample_1.ldf' , SIZE = 1856KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
*/

IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [UITemplateSample].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [UITemplateSample] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [UITemplateSample] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [UITemplateSample] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [UITemplateSample] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [UITemplateSample] SET ARITHABORT OFF 
GO
ALTER DATABASE [UITemplateSample] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [UITemplateSample] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [UITemplateSample] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [UITemplateSample] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [UITemplateSample] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [UITemplateSample] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [UITemplateSample] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [UITemplateSample] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [UITemplateSample] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [UITemplateSample] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [UITemplateSample] SET  DISABLE_BROKER 
GO
ALTER DATABASE [UITemplateSample] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [UITemplateSample] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [UITemplateSample] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [UITemplateSample] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [UITemplateSample] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [UITemplateSample] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [UITemplateSample] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [UITemplateSample] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [UITemplateSample] SET  MULTI_USER 
GO
ALTER DATABASE [UITemplateSample] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [UITemplateSample] SET DB_CHAINING OFF 
GO
ALTER DATABASE [UITemplateSample] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [UITemplateSample] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
USE [UITemplateSample]
GO
/****** Object:  Table [dbo].[Buhin]    Script Date: 2015/09/30 15:54:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Buhin](
	[cd_buhin] [int] NOT NULL,
	[nm_buhin] [nvarchar](50) NULL,
	[kin_shiire] [decimal](18, 2) NULL,
	[nm_tani] [nvarchar](4) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.Buhin] PRIMARY KEY CLUSTERED 
(
	[cd_buhin] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[BuhinCalendar]    Script Date: 2015/09/30 15:54:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[BuhinCalendar](
	[no_buhin_calendar] [int] IDENTITY(1,1) NOT NULL,
	[cd_buhin] [int] NOT NULL,
	[dt_sakusei] [datetime] NOT NULL,
	[nm_komoku] [nvarchar](200) NULL,
	[su_suryo] [int] NULL,
	[kin_shiire_tanka] [decimal](18, 2) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.BuhinCalendar] PRIMARY KEY CLUSTERED 
(
	[no_buhin_calendar] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[FixedKentosho]    Script Date: 2015/09/30 15:54:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FixedKentosho](
	[no_kento] [int] IDENTITY(1,1) NOT NULL,
	[no_fixed] [int] NOT NULL,
	[no_komoku] [int] NULL,
	[cd_buhin] [int] NOT NULL,
	[nm_komoku] [nvarchar](200) NULL,
	[su_suryo] [int] NULL,
	[kin_shiire_tanka] [decimal](18, 2) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.FixedKentosho] PRIMARY KEY CLUSTERED 
(
	[no_kento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[FixedMitsumori]    Script Date: 2015/09/30 15:54:40 ******/
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
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.FixedMitsumori] PRIMARY KEY CLUSTERED 
(
	[no_fixed] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Kentosho]    Script Date: 2015/09/30 15:54:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Kentosho](
	[no_kento] [int] IDENTITY(1,1) NOT NULL,
	[no_mitsumori] [int] NOT NULL,
	[no_komoku] [int] NULL,
	[cd_buhin] [int] NOT NULL,
	[nm_komoku] [nvarchar](200) NULL,
	[su_suryo] [int] NULL,
	[kin_shiire_tanka] [decimal](18, 2) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.Kentosho] PRIMARY KEY CLUSTERED 
(
	[no_kento] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ma_maker]    Script Date: 2015/09/30 15:54:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ma_maker](
	[cd_maker] [decimal](2, 0) NOT NULL,
	[nm_maker] [varchar](20) NULL,
 CONSTRAINT [PK_ma_maker] PRIMARY KEY CLUSTERED 
(
	[cd_maker] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO
/****** Object:  Table [dbo].[Mitsumori]    Script Date: 2015/09/30 15:54:40 ******/
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
	[flg_del] [bit] NOT NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.Mitsumori] PRIMARY KEY CLUSTERED 
(
	[no_mitsumori] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[MitsumoriDirect]    Script Date: 2015/09/30 15:54:40 ******/
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
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.MitsumoriDirect] PRIMARY KEY CLUSTERED 
(
	[no_mitsumori] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[News]    Script Date: 2015/09/30 15:54:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[News](
	[no_news] [int] IDENTITY(1,1) NOT NULL,
	[nm_title] [nvarchar](255) NULL,
	[nm_content] [nvarchar](4000) NULL,
	[dt_news] [datetime] NOT NULL,
	[level] [nvarchar](10) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.News] PRIMARY KEY CLUSTERED 
(
	[no_news] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Product]    Script Date: 2015/09/30 15:54:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Product](
	[dt_product] [datetime] NOT NULL,
	[su_shukka] [int] NOT NULL,
	[su_keikaku] [int] NOT NULL,
	[su_jisseki] [int] NOT NULL,
	[su_zaiko] [int] NOT NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_create] [nvarchar](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[cd_update] [nvarchar](10) NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.Product] PRIMARY KEY CLUSTERED 
(
	[dt_product] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[ShiharaiJoken]    Script Date: 2015/09/30 15:54:40 ******/
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
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.ShiharaiJoken] PRIMARY KEY CLUSTERED 
(
	[cd_shiharai] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Shinsei]    Script Date: 2015/09/30 15:54:40 ******/
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
/****** Object:  Table [dbo].[Tenpu]    Script Date: 2015/09/30 15:54:40 ******/
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
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.Tenpu] PRIMARY KEY CLUSTERED 
(
	[no_tenpu] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[Torihiki]    Script Date: 2015/09/30 15:54:40 ******/
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
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_dbo.Torihiki] PRIMARY KEY CLUSTERED 
(
	[cd_torihiki] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tr_yotei_nonyu]    Script Date: 2015/09/30 15:54:40 ******/
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
/****** Object:  Index [IX_no_fixed]    Script Date: 2015/09/30 15:54:40 ******/
CREATE NONCLUSTERED INDEX [IX_no_fixed] ON [dbo].[FixedKentosho]
(
	[no_fixed] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_no_mitsumori]    Script Date: 2015/09/30 15:54:40 ******/
CREATE NONCLUSTERED INDEX [IX_no_mitsumori] ON [dbo].[Kentosho]
(
	[no_mitsumori] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		nagao.h
-- Create date: 2018/08/07
-- Description:	SKIP/TOP/AllCountを適用したデータ取得ストアドプロシージャ
-- =============================================
CREATE PROCEDURE [dbo].[sp_SelectMitsumori]
    @cd_shiharai int,
	@cd_torihiki int,
	@nm_hinmei NVARCHAR(100),
	@skip int,
	@top int,
	@AllCount int output
AS
BEGIN
	SET NOCOUNT ON;
DECLARE @from int;
DECLARE @to int;
SET @from = @skip + 1;
SET @to = @skip + @top; 

-- 全件数のカウント
	SELECT
		@AllCount = COUNT(*)
	FROM Mitsumori
	WHERE 1 = 1
	AND ((@cd_shiharai IS NOT NULL AND cd_shiharai = @cd_shiharai) OR @cd_shiharai IS NULL)
	AND ((@cd_torihiki IS NOT NULL AND cd_torihiki = @cd_torihiki) OR @cd_torihiki IS NULL)
	AND ((@nm_hinmei IS NOT NULL AND nm_hinmei like N'%' + @nm_hinmei + N'%') OR @nm_hinmei IS NULL)

-- @SKIP, @TOPで指定されたカウント分
	SELECT
		no_mitsumori
		,cd_torihiki
		,cd_shiharai
		,nm_hinmei
		,biko
		,flg_del
		,dt_create
		,cd_create
		,dt_update
		,cd_update
		,ts	
	FROM (
		SELECT
			ROW_NUMBER() OVER(ORDER BY no_mitsumori) as RN
			,no_mitsumori
			,cd_torihiki
			,cd_shiharai
			,nm_hinmei
			,biko
			,flg_del
			,dt_create
			,cd_create
			,dt_update
			,cd_update
			,ts	
		FROM Mitsumori
		WHERE 1 = 1
		AND ((@cd_shiharai IS NOT NULL AND cd_shiharai = @cd_shiharai) OR @cd_shiharai is NULL)
		AND ((@cd_torihiki IS NOT NULL AND cd_torihiki = @cd_torihiki) OR @cd_torihiki is NULL)
		AND ((@nm_hinmei IS NOT NULL AND nm_hinmei like '%' + @nm_hinmei + '%') OR @nm_hinmei is NULL)
	) A
	WHERE (@from IS NOT NULL AND A.RN BETWEEN @from AND @to) OR @from IS NULL
	ORDER BY A.no_mitsumori

END
GO


USE [master]
GO
ALTER DATABASE [UITemplateSample] SET  READ_WRITE 
GO
