CREATE TABLE [dbo].[ICForestPlotHistorys]
(
[ICForestPlotHistoryID] [int] NOT NULL,
[AAStatus] [varchar] (10)  NULL,
[AACreatedUser] [nvarchar] (50)  NULL,
[AAUpdatedUser] [nvarchar] (50)  NULL,
[AACreatedDate] [datetime] NULL,
[AAUpdatedDate] [datetime] NULL,
[GEProvinceCode] [varchar] (50)  NULL,
[GEDistrictCode] [varchar] (50)  NULL,
[GECommuneCode] [varchar] (50)  NULL,
[GECompartmentCode] [varchar] (50)  NULL,
[GESubCompartmentCode] [varchar] (50)  NULL,
[GEPlotCode] [varchar] (50)  NULL,
[GEParcelCode] [varchar] (50)  NULL,
[ICForestPlotHistoryVillage] [nvarchar] (200)  NULL,
[ICForestPlotHistoryArea] [decimal] (18, 5) NULL,
[ICForestTypeCode] [varchar] (50)  NULL,
[ICForestOrgCode] [varchar] (50)  NULL,
[ICTreeSpecCode] [varchar] (50)  NULL,
[ICForestPlotHistoryPlantingYear] [int] NULL,
[ICForestPlotHistoryAvgYearCanopy] [int] NULL,
[ICForestPlotHistoryVolumnPerHa] [decimal] (18, 5) NULL,
[ICForestPlotHistoryVolumnPerPlot] [decimal] (18, 5) NULL,
[APActorCode] [varchar] (50)  NULL,
[FK_APActorID] [int] NULL,
[ICLandUseCertCode] [varchar] (50)  NULL,
[ICConflictSitCode] [varchar] (50)  NULL,
[ICForestPlotHistoryLandUseTerune] [int] NULL,
[FK_GECommuneID] [int] NULL,
[FK_GECompartmentID] [int] NULL,
[FK_GEDistrictID] [int] NULL,
[FK_GEStateProvinceID] [int] NULL,
[FK_GESubCompartmentID] [int] NULL,
[FK_ICForestOrgID] [int] NULL,
[FK_ICTreeSpecID] [int] NULL,
[FK_ICLandUseCertID] [int] NULL,
[FK_ICForestCertID] [int] NULL,
[ICForestPlotHistoryReliability] [nvarchar] (100)  NULL,
[FK_GEForestProtectionDepartmentID] [int] NULL,
[FK_GEPeoplesCommitteeID] [int] NULL,
[ICForestPlotHistoryLatestReviewDate] [datetime] NULL,
[FK_APFormisActorID] [int] NULL,
[ICForestPlotHistoryFormisUUID] [varchar] (50)  NULL,
[ICForestPlotHistoryLocationLatitude] [decimal] (22, 18) NULL,
[ICForestPlotHistoryLocationLongitude] [decimal] (22, 18) NULL,
[ICForestPlotHistoryPlantingDate] [datetime] NULL,
[FK_ICForestPlotID] int null
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ICForestPlotHistorys] ADD CONSTRAINT [PK_ICForestPlotHistorys] PRIMARY KEY CLUSTERED  ([ICForestPlotHistoryID]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [idx_ICForestPlotHistorys_GECommuneID_ICTreespecID_GECompartmentID_GESubCompartmentID_ICForestPlotHistoryPlantingYear] ON [dbo].[ICForestPlotHistorys] ([FK_GECommuneID], [FK_ICTreeSpecID], [FK_GECompartmentID], [FK_GESubCompartmentID], [ICForestPlotHistoryPlantingYear]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [idx_ICForestPlotHistorys_GECommuneID] ON [dbo].[ICForestPlotHistorys] ([FK_GECommuneID]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [idx_ICPlots_GECommuneID] ON [dbo].[ICForestPlotHistorys] ([FK_GECommuneID]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [idx_ICForestPlotHistorys_GECommuneID_ICTreespecID] ON [dbo].[ICForestPlotHistorys] ([FK_GECommuneID], [FK_ICTreeSpecID]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [idx_ICForestPlotHistorys_GECommuneID_ICTreespecID_GECompartmentID_GESubCompartmentID] ON [dbo].[ICForestPlotHistorys] ([FK_GECommuneID], [FK_ICTreeSpecID], [FK_GECompartmentID], [FK_GESubCompartmentID]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [idx_ICPlots_GEStateProvinceID_GEDistrictID_GECommuneID] ON [dbo].[ICForestPlotHistorys] ([FK_GEStateProvinceID], [FK_GEDistrictID], [FK_GECommuneID]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [idx_ICPlots_GEStateProvinceID_GEDistrictID] ON [dbo].[ICForestPlotHistorys] ([FK_GEStateProvinceID], [FK_GEDistrictID]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [idx_ICPlots_GEStateProvinceID] ON [dbo].[ICForestPlotHistorys] ([FK_GEStateProvinceID]) ON [PRIMARY]
GO
CREATE NONCLUSTERED INDEX [idx_ICForestPlotHistorys_ICForestPlotHistoryLatestReviewDate] ON [dbo].[ICForestPlotHistorys] ([ICForestPlotHistoryLatestReviewDate]) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ICForestPlotHistorys] WITH NOCHECK ADD CONSTRAINT [FK_ICForestPlotHistorys_GECompartments] FOREIGN KEY ([FK_GECompartmentID]) REFERENCES [dbo].[GECompartments] ([GECompartmentID])
GO
ALTER TABLE [dbo].[ICForestPlotHistorys] WITH NOCHECK ADD CONSTRAINT [FK_ICForestPlotHistorys_GEDistricts] FOREIGN KEY ([FK_GEDistrictID]) REFERENCES [dbo].[GEDistricts] ([GEDistrictID])
GO
ALTER TABLE [dbo].[ICForestPlotHistorys] WITH NOCHECK ADD CONSTRAINT [FK_ICForestPlotHistorys_GEStateProvinces] FOREIGN KEY ([FK_GEStateProvinceID]) REFERENCES [dbo].[GEStateProvinces] ([GEStateProvinceID])
GO
ALTER TABLE [dbo].[ICForestPlotHistorys] WITH NOCHECK ADD CONSTRAINT [FK_ICForestPlotHistorys_GESubCompartments] FOREIGN KEY ([FK_GESubCompartmentID]) REFERENCES [dbo].[GESubCompartments] ([GESubCompartmentID])
GO
ALTER TABLE [dbo].[ICForestPlotHistorys] WITH NOCHECK ADD CONSTRAINT [FK_ICForestPlotHistorys_ICForestCerts] FOREIGN KEY ([FK_ICForestCertID]) REFERENCES [dbo].[ICForestCerts] ([ICForestCertID])
GO
ALTER TABLE [dbo].[ICForestPlotHistorys] WITH NOCHECK ADD CONSTRAINT [FK_ICForestPlotHistorys_ICForestOrgs] FOREIGN KEY ([FK_ICForestOrgID]) REFERENCES [dbo].[ICForestOrgs] ([ICForestOrgID])
GO
ALTER TABLE [dbo].[ICForestPlotHistorys] WITH NOCHECK ADD CONSTRAINT [FK_ICForestPlotHistorys_ICTreeSpecs] FOREIGN KEY ([FK_ICTreeSpecID]) REFERENCES [dbo].[ICTreeSpecs] ([ICTreeSpecID])
GO
ALTER TABLE [dbo].[ICForestPlotHistorys] WITH NOCHECK ADD CONSTRAINT [FK_ICForestPlotHistorys_ICForestPlots] FOREIGN KEY ([FK_ICForestPlotID]) REFERENCES [dbo].[ICForestPlots] ([ICForestPlotID])
GO

ALTER TABLE ICForestPlotHistorys
ADD [FK_ADuserID] int NULL,
[ICForestPlotHistoryCreatedDate] [datetime] NULL

ALTER TABLE [dbo].[ICForestPlotHistorys] WITH NOCHECK ADD CONSTRAINT [FK_ICForestPlotHistorys_ADusers] FOREIGN KEY ([FK_ADuserID]) REFERENCES [dbo].[ADusers] ([ADUserID])
GO