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
 
if exists (select name from sys.databases where name = 'TosAuthenticationSample')
    drop database [TosAuthenticationSample]
 
declare @device_directory nvarchar(520)
select @device_directory = substring(filename, 1, charindex(N'master.mdf', lower(filename)) - 1)
from master.dbo.sysaltfiles 
where dbid = 1 AND fileid = 1
 
execute ('create database [TosAuthenticationSample] on primary
( name = ''TosAuthenticationSample'', filename = ''' + @device_directory + 'TosAuthenticationSample.mdf'', size = 5120KB, maxsize = unlimited, filegrowth = 1024KB)
log on
( name = ''TosAuthenticationSample_log'', filename = ''' + @device_directory + 'TosAuthenticationSample.ldf'' , size = 1024KB , maxsize = 2048GB , filegrowth = 10%)')
GO

USE [TosAuthenticationSample]
GO

/****** Object:  Table [dbo].[ma_kengen]    Script Date: 2013/08/30 19:56:12 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ma_kengen]') AND type in (N'U'))
DROP TABLE [dbo].[ma_kengen]
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ma_kaisha](
	[cd_kaisha] [decimal](4, 0) NOT NULL,
	[nm_kaisha] [varchar](20) NULL,
 CONSTRAINT [PK_ma_kaisha] PRIMARY KEY CLUSTERED 
(
	[cd_kaisha] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ma_shozoku](
	[cd_shozoku] [numeric](10, 0) NOT NULL,
	[cd_shozoku_oi] [numeric](2, 0) NOT NULL,
	[nm_shozoku] [varchar](50) NULL,
	[cd_kaisha] [decimal](4, 0) NULL,
 CONSTRAINT [PK_ma_shozoku] PRIMARY KEY CLUSTERED 
(
	[cd_shozoku] ASC,
	[cd_shozoku_oi] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ma_shain](
	[cd_shain] [numeric](10) NOT NULL,
	[nm_shain] [varchar](50) NOT NULL,
	[cd_shozoku] [numeric](10, 0) NOT NULL,
	[cd_shozoku_oi] [numeric](2, 0) NOT NULL,
 CONSTRAINT [PK_ma_shain] PRIMARY KEY CLUSTERED 
(
	[cd_shain] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[ma_shain_form](
	[cd_shain] [decimal](10, 0) NOT NULL,
	[nm_shain] [varchar](50) NULL,
	[cd_shozoku] [numeric](10, 0) NULL,
	[cd_shozoku_oi] [numeric](2, 0) NULL,
	[cd_create] [char](10) NULL,
	[dt_create] [datetimeoffset](7) NULL,
	[cd_update] [char](10) NULL,
	[dt_update] [datetimeoffset](7) NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_ma_shain_form] PRIMARY KEY CLUSTERED 
(
	[cd_shain] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
SET ANSI_PADDING OFF
GO

/****** Object:  Table [dbo].[ma_kengen]    Script Date: 2013/08/30 19:56:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[ma_kengen]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[ma_kengen](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[cd_system] [int] NOT NULL,
	[cd_shain] [numeric](10) NOT NULL,
	[cd_ope] [int] NOT NULL,
	[cd_kaisha] [int] NOT NULL,
	[cd_kaiso] [int] NOT NULL,
	[cd_bunrui] [int] NOT NULL,
	[cd_kengen] [int] NOT NULL,
	[no_table] [int] NOT NULL,
	[cd_naiyo] [int] NOT NULL,
	[ymd_create] [datetime] NOT NULL,
	[cd_create_shain] [nvarchar](10) NOT NULL,
	[ymd_update] [datetime] NOT NULL,
	[cd_update_shain] [nvarchar](10) NOT NULL,
	[ts] [timestamp] NOT NULL,
 CONSTRAINT [PK_ma_kengen] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UK_ma_kengen] UNIQUE NONCLUSTERED 
(
	[cd_system] ASC,
	[cd_shain] ASC,
	[cd_ope] ASC,
	[cd_kaisha] ASC,
	[cd_kaiso] ASC,
	[cd_bunrui] ASC,
	[cd_kengen] ASC,
	[no_table] ASC,
	[cd_naiyo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
END
GO
ALTER TABLE [dbo].[ma_kengen] SET (LOCK_ESCALATION = DISABLE)
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[vw_shain_info]
AS
SELECT 
 a.cd_shain
,a.nm_shain
,a.cd_shozoku
,a.cd_shozoku_oi
,b.nm_shozoku
,b.cd_kaisha
,c.nm_kaisha
,ISNULL(e.cd_system, 99010601) AS cd_system
,ISNULL(e.cd_kengen, 1) AS type_kengen
,ISNULL(e.cd_naiyo, 1) AS cd_kengen
FROM ma_shain a with(nolock)
LEFT JOIN ma_kengen e with(nolock)
ON e.cd_shain = a.cd_shain
LEFT JOIN ma_shozoku b with(nolock)
ON a.cd_shozoku = b.cd_shozoku
AND a.cd_shozoku_oi = b.cd_shozoku_oi
LEFT JOIN ma_kaisha c with(nolock)
ON b.cd_kaisha = c.cd_kaisha
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[vw_shain_info_form]
AS
SELECT 
 a.cd_shain
,a.nm_shain
,a.cd_shozoku
,a.cd_shozoku_oi
,CAST(a.cd_shozoku AS VARCHAR(10)) + ' ' + CAST(a.cd_shozoku_oi AS VARCHAR(2))AS cd_shozoku_union
,b.nm_shozoku
,b.cd_kaisha
,c.nm_kaisha
,99010601 AS cd_system
,1 AS type_kengen
,1 AS cd_kengen
,CASE WHEN d.cd_shain IS NULL THEN 0 ELSE 2 END AS kbn_form
,d.cd_create
,d.dt_create
,d.cd_update
,d.dt_update
,d.ts
FROM ma_shain a with(nolock)
LEFT JOIN ma_shozoku b with(nolock)
ON a.cd_shozoku = b.cd_shozoku
AND a.cd_shozoku_oi = b.cd_shozoku_oi
LEFT JOIN ma_kaisha c with(nolock)
ON b.cd_kaisha = c.cd_kaisha
LEFT JOIN ma_shain_form d with(nolock)
ON a.cd_shain = d.cd_shain
UNION
SELECT 
 a.cd_shain
,a.nm_shain
,a.cd_shozoku
,a.cd_shozoku_oi
,CAST(a.cd_shozoku AS VARCHAR(10)) + ' ' + CAST(a.cd_shozoku_oi AS VARCHAR(2))AS cd_shozoku_union
,b.nm_shozoku
,b.cd_kaisha
,c.nm_kaisha
,99010601 AS cd_system
,1 AS type_kengen
,1 AS cd_kengen
,1 AS kbn_form
,a.cd_create
,a.dt_create
,a.cd_update
,a.dt_update
,a.ts
FROM ma_shain_form a with(nolock)
LEFT JOIN ma_shozoku b with(nolock)
ON a.cd_shozoku = b.cd_shozoku
AND a.cd_shozoku_oi = b.cd_shozoku_oi
LEFT JOIN ma_kaisha c with(nolock)
ON b.cd_kaisha = c.cd_kaisha
where NOT EXISTS (SELECT 'A' FROM ma_shain x
				  WHERE x.cd_shain = a.cd_shain)
GO

