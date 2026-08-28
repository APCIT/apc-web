BEGIN TRY

BEGIN TRAN;

-- CreateSchema
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'dbo') EXEC sp_executesql N'CREATE SCHEMA [dbo];';

-- CreateTable
CREATE TABLE [dbo].[__MigrationHistory] (
    [MigrationId] NVARCHAR(150) NOT NULL,
    [ContextKey] NVARCHAR(300) NOT NULL,
    [Model] VARBINARY(max) NOT NULL,
    [ProductVersion] NVARCHAR(32) NOT NULL,
    CONSTRAINT [PK_dbo.__MigrationHistory] PRIMARY KEY CLUSTERED ([MigrationId],[ContextKey])
);

-- CreateTable
CREATE TABLE [dbo].[Applicants] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [FirstName] NVARCHAR(max),
    [LastName] NVARCHAR(max),
    [Email] NVARCHAR(max),
    [Major] NVARCHAR(max),
    [Minor] NVARCHAR(max),
    [Level] NVARCHAR(max),
    [GradDate] DATETIME NOT NULL,
    [ResumeId] NVARCHAR(max),
    [Semester] NVARCHAR(max),
    [Comment] NVARCHAR(max),
    [School] NVARCHAR(max),
    [DateApplied] DATETIME NOT NULL CONSTRAINT [DF__Applicant__DateA__6E01572D] DEFAULT 1900-01-01T00:00:00.000,
    [ForeignLanguage] NVARCHAR(max),
    [ContactName] NVARCHAR(max),
    [ContactRelationship] NVARCHAR(max),
    [ContactPhone] NVARCHAR(max),
    [Street] NVARCHAR(max),
    [City] NVARCHAR(max),
    [Zip] NVARCHAR(max),
    [Apt] NVARCHAR(max),
    [State] NVARCHAR(max),
    [Phone] NVARCHAR(max),
    [Birmingham] BIT NOT NULL CONSTRAINT [DF__Applicant__Birmi__3E1D39E1] DEFAULT 0,
    [Mobile] BIT NOT NULL CONSTRAINT [DF__Applicant__Mobil__40058253] DEFAULT 0,
    [Montgomery] BIT NOT NULL CONSTRAINT [DF__Applicant__Montg__40F9A68C] DEFAULT 0,
    [Tuscaloosa] BIT NOT NULL CONSTRAINT [DF__Applicant__Tusca__41EDCAC5] DEFAULT 0,
    [Huntsville] BIT NOT NULL CONSTRAINT [DF__Applicant__Hunts__42E1EEFE] DEFAULT 0,
    [InterviewStatus] BIT NOT NULL CONSTRAINT [DF__Applicant__Inter__43D61337] DEFAULT 0,
    [Dob] DATETIME NOT NULL CONSTRAINT [DF__Applicants__Dob__4D5F7D71] DEFAULT 1900-01-01T00:00:00.000,
    [CallBack] BIT NOT NULL CONSTRAINT [DF__Applicant__CallB__73852659] DEFAULT 0,
    [CallBackDate] DATETIME NOT NULL CONSTRAINT [DF__Applicant__CallB__74794A92] DEFAULT 1900-01-01T00:00:00.000,
    [Skills] NVARCHAR(max) CONSTRAINT [DF__Applicant__Skill__3FD07829] DEFAULT '',
    [PrevIntern] BIT NOT NULL CONSTRAINT [DF__Applicant__PrevI__52E34C9D] DEFAULT 0,
    [Note] NVARCHAR(max),
    [Preference] NVARCHAR(max),
    [BlueSprings] BIT NOT NULL CONSTRAINT [DF__Applicant__BlueS__6B79F03D] DEFAULT 0,
    [HearAboutUs] NVARCHAR(max),
    [AnnistonGadsden] BIT NOT NULL CONSTRAINT [DF_Applicants_AnnistonGadsden] DEFAULT 0,
    [Dothan] BIT NOT NULL CONSTRAINT [DF_Applicants_Dothan] DEFAULT 0,
    [ValidEmp] BIT NOT NULL CONSTRAINT [Applicants_ValidEmp_df] DEFAULT 0,
    CONSTRAINT [PK_dbo.Applicants] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Archives] (
    [Id] NVARCHAR(128) NOT NULL,
    [Name] NVARCHAR(max),
    [UploadDate] DATETIME NOT NULL,
    [Uploader] NVARCHAR(max),
    CONSTRAINT [PK_dbo.Archives] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[AspNetRoles] (
    [Id] NVARCHAR(128) NOT NULL,
    [Name] NVARCHAR(256) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [RoleNameIndex] UNIQUE NONCLUSTERED ([Name])
);

-- CreateTable
CREATE TABLE [dbo].[AspNetUserClaims] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [UserId] NVARCHAR(128) NOT NULL,
    [ClaimType] NVARCHAR(max),
    [ClaimValue] NVARCHAR(max),
    CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[AspNetUserLogins] (
    [LoginProvider] NVARCHAR(128) NOT NULL,
    [ProviderKey] NVARCHAR(128) NOT NULL,
    [UserId] NVARCHAR(128) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED ([LoginProvider],[ProviderKey],[UserId])
);

-- CreateTable
CREATE TABLE [dbo].[AspNetUserRoles] (
    [UserId] NVARCHAR(128) NOT NULL,
    [RoleId] NVARCHAR(128) NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED ([UserId],[RoleId])
);

-- CreateTable
CREATE TABLE [dbo].[AspNetUsers] (
    [Id] NVARCHAR(128) NOT NULL,
    [FirstName] NVARCHAR(max),
    [LastName] NVARCHAR(max),
    [Email] NVARCHAR(256),
    [EmailConfirmed] BIT NOT NULL,
    [PasswordHash] NVARCHAR(max),
    [SecurityStamp] NVARCHAR(max),
    [PhoneNumber] NVARCHAR(max),
    [PhoneNumberConfirmed] BIT NOT NULL,
    [TwoFactorEnabled] BIT NOT NULL,
    [LockoutEndDateUtc] DATETIME,
    [LockoutEnabled] BIT NOT NULL,
    [AccessFailedCount] INT NOT NULL,
    [UserName] NVARCHAR(256) NOT NULL,
    [CompanyId] INT NOT NULL,
    CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [UserNameIndex] UNIQUE NONCLUSTERED ([UserName])
);

-- CreateTable
CREATE TABLE [dbo].[ClassRegs] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [DateApplied] DATETIME NOT NULL,
    [Class] NVARCHAR(max),
    [FirstName] NVARCHAR(max),
    [LastName] NVARCHAR(max),
    [Email] NVARCHAR(max),
    [Phone] NVARCHAR(max),
    [Company] NVARCHAR(max),
    [JobTitle] NVARCHAR(max),
    CONSTRAINT [PK_dbo.ClassRegs] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Companies] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(max),
    [Abbreviation] NVARCHAR(max),
    [County] NVARCHAR(max),
    CONSTRAINT [PK_dbo.Companies] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Interns] (
    [Id] NVARCHAR(128) NOT NULL,
    [CWID] NVARCHAR(max),
    [Major] NVARCHAR(max),
    [Minor] NVARCHAR(max),
    [Level] NVARCHAR(max),
    [GradDate] DATETIME NOT NULL,
    [ResumeId] NVARCHAR(max),
    [ContactName] NVARCHAR(max) CONSTRAINT [DF__Interns__Contact__5AEE82B9] DEFAULT '',
    [ContactRelationship] NVARCHAR(max) CONSTRAINT [DF__Interns__Contact__5BE2A6F2] DEFAULT '',
    [ContactPhone] NVARCHAR(max) CONSTRAINT [DF__Interns__Contact__5CD6CB2B] DEFAULT '',
    [School] NVARCHAR(max),
    [MentorName] NVARCHAR(max),
    [MentorPhone] NVARCHAR(max),
    [MentorEmail] NVARCHAR(max),
    [Street] NVARCHAR(max),
    [City] NVARCHAR(max),
    [Zip] NVARCHAR(max),
    [Apt] NVARCHAR(max),
    [Wage] FLOAT(53) NOT NULL CONSTRAINT [DF__Interns__Wage__17F790F9] DEFAULT 0,
    [Semester] DATETIME NOT NULL CONSTRAINT [DF__Interns__Semeste__18EBB532] DEFAULT 1900-01-01T00:00:00.000,
    [State] NVARCHAR(max),
    [Phone] NVARCHAR(max),
    [Dob] DATETIME NOT NULL CONSTRAINT [DF__Interns__Dob__4E53A1AA] DEFAULT 1900-01-01T00:00:00.000,
    [HoursThisWeek] FLOAT(53) NOT NULL CONSTRAINT [DF__Interns__HoursTh__607251E5] DEFAULT 0,
    [TStreet] NVARCHAR(max),
    [TCity] NVARCHAR(max),
    [TState] NVARCHAR(max),
    [TZip] NVARCHAR(max),
    [TApt] NVARCHAR(max),
    [ImpactCalcId] NVARCHAR(max),
    [MidSemReportId] NVARCHAR(max),
    [PresentationId] NVARCHAR(max),
    [Note] NVARCHAR(max),
    [MentorTitle] NVARCHAR(max),
    [Department] NVARCHAR(max),
    [Hometown] NVARCHAR(max),
    [HearAboutUs] NVARCHAR(max),
    CONSTRAINT [PK_dbo.Interns] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[PastInterns] (
    [CWID] NVARCHAR(max),
    [FirstName] NVARCHAR(max),
    [LastName] NVARCHAR(max),
    [Major] NVARCHAR(max),
    [Semester] DATETIME NOT NULL,
    [Company] NVARCHAR(max),
    [School] NVARCHAR(max),
    [Wage] FLOAT(53) NOT NULL,
    [Id] INT NOT NULL IDENTITY(1,1),
    [HrsWorked] FLOAT(53) NOT NULL CONSTRAINT [DF__PastInter__HrsWo__282DF8C2] DEFAULT 0,
    [MentorName] NVARCHAR(max),
    [MentorPhone] NVARCHAR(max),
    [MentorEmail] NVARCHAR(max),
    [ImpactCalcId] NVARCHAR(max),
    [MidSemReportId] NVARCHAR(max),
    [PresentationId] NVARCHAR(max),
    [Note] NVARCHAR(max),
    [Street] NVARCHAR(max),
    [City] NVARCHAR(max),
    [State] NVARCHAR(max),
    [Zip] NVARCHAR(max),
    [Apt] NVARCHAR(max),
    [GradDate] DATETIME NOT NULL CONSTRAINT [DF__PastInter__GradD__7908F585] DEFAULT 1900-01-01T00:00:00.000,
    [Phone] NVARCHAR(max),
    [Email] NVARCHAR(max),
    [MentorTitle] NVARCHAR(max),
    [Level] NVARCHAR(max),
    [Minor] NVARCHAR(max),
    [Hometown] NVARCHAR(max),
    [HearAboutUs] NVARCHAR(max),
    CONSTRAINT [PK_dbo.PastInterns] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Presentations] (
    [Id] NVARCHAR(128) NOT NULL,
    [Name] NVARCHAR(max),
    [Semester] DATETIME NOT NULL,
    [UploadDate] DATETIME NOT NULL,
    [Uploader] NVARCHAR(max),
    [Company] NVARCHAR(max),
    CONSTRAINT [PK_dbo.Presentations] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Services] (
    [Id] INT NOT NULL IDENTITY(1,1),
    [Company_Id] INT,
    [TypeOfService] NVARCHAR(max),
    [County] NVARCHAR(max),
    [StaffMember] NVARCHAR(max),
    [StartDate] DATETIME NOT NULL CONSTRAINT [DF__Projects__StartD__324172E1] DEFAULT 1900-01-01T00:00:00.000,
    [EndDate] DATETIME NOT NULL CONSTRAINT [DF__Projects__EndDat__3335971A] DEFAULT 1900-01-01T00:00:00.000,
    [Season] NVARCHAR(max),
    [NumberEmployeesTrained] INT NOT NULL CONSTRAINT [DF__Projects__Number__3429BB53] DEFAULT 0,
    [FieldStaff] INT NOT NULL CONSTRAINT [DF__Projects__FieldS__351DDF8C] DEFAULT 0,
    [Completed] BIT NOT NULL CONSTRAINT [DF__Projects__Comple__361203C5] DEFAULT 0,
    [NumberInterns] INT NOT NULL CONSTRAINT [DF__Services__Number__45544755] DEFAULT 0,
    [Certificate] BIT NOT NULL,
    CONSTRAINT [PK_dbo.Services] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[Timelogs] (
    [Id] NVARCHAR(128) NOT NULL,
    [Start] DATETIME NOT NULL,
    [End] DATETIME NOT NULL,
    [Description] NVARCHAR(max),
    [Intern_Id] NVARCHAR(128),
    [Lunch] FLOAT(53) NOT NULL CONSTRAINT [DF__Timelogs__Lunch__65F62111] DEFAULT 0,
    CONSTRAINT [PK_dbo.Timelogs] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[WorkSchedules] (
    [Id] NVARCHAR(128) NOT NULL,
    [Start] DATETIME NOT NULL,
    [End] DATETIME NOT NULL,
    [Intern_Id] NVARCHAR(128),
    [Start2] DATETIME NOT NULL CONSTRAINT [DF__WorkSched__Start__0EF836A4] DEFAULT 1900-01-01T00:00:00.000,
    [End2] DATETIME NOT NULL CONSTRAINT [DF__WorkSchedu__End2__0FEC5ADD] DEFAULT 1900-01-01T00:00:00.000,
    CONSTRAINT [PK_dbo.WorkSchedules] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[PastTimelogs] (
    [Id] NVARCHAR(128) NOT NULL,
    [Start] DATETIME NOT NULL,
    [End] DATETIME NOT NULL,
    [Lunch] FLOAT(53) NOT NULL,
    [Description] NVARCHAR(max),
    [Approved] BIT NOT NULL,
    [PastInternId] INT NOT NULL,
    CONSTRAINT [PK_dbo.PastTimelogs] PRIMARY KEY CLUSTERED ([Id])
);

-- CreateTable
CREATE TABLE [dbo].[ImpactTotals] (
    [Id] NVARCHAR(128) NOT NULL,
    [InternId] NVARCHAR(128) NOT NULL,
    [IncreasedSales] FLOAT(53),
    [RetainedSales] FLOAT(53),
    [JobsCreated] FLOAT(53),
    [NumberJobsCreated] INT,
    [JobsRetained] FLOAT(53),
    [NumberJobsRetained] INT,
    [CostAvoidanceGovtFines] FLOAT(53),
    [TimeCostReduction] FLOAT(53),
    [Investments] FLOAT(53),
    [AvoidedInvestments] FLOAT(53),
    [UpdatedAt] DATETIME NOT NULL,
    CONSTRAINT [ImpactTotals_pkey] PRIMARY KEY CLUSTERED ([Id]),
    CONSTRAINT [ImpactTotals_InternId_key] UNIQUE NONCLUSTERED ([InternId])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserClaims]([UserId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserLogins]([UserId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_RoleId] ON [dbo].[AspNetUserRoles]([RoleId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserRoles]([UserId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_CompanyId] ON [dbo].[AspNetUsers]([CompanyId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Id] ON [dbo].[Interns]([Id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Company_Id] ON [dbo].[Services]([Company_Id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Intern_Id] ON [dbo].[Timelogs]([Intern_Id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_Intern_Id] ON [dbo].[WorkSchedules]([Intern_Id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [IX_PastInternId] ON [dbo].[PastTimelogs]([PastInternId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ImpactTotals_InternId_idx] ON [dbo].[ImpactTotals]([InternId]);

-- AddForeignKey
ALTER TABLE [dbo].[AspNetUserClaims] ADD CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AspNetUserLogins] ADD CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AspNetUserRoles] ADD CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[AspNetRoles]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AspNetUserRoles] ADD CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[AspNetUsers]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AspNetUsers] ADD CONSTRAINT [FK_dbo.AspNetUsers_dbo.Companies_CompanyId] FOREIGN KEY ([CompanyId]) REFERENCES [dbo].[Companies]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Interns] ADD CONSTRAINT [FK_dbo.Interns_dbo.AspNetUsers_Id] FOREIGN KEY ([Id]) REFERENCES [dbo].[AspNetUsers]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Services] ADD CONSTRAINT [FK_dbo.Projects_dbo.Companies_Company_Id] FOREIGN KEY ([Company_Id]) REFERENCES [dbo].[Companies]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Timelogs] ADD CONSTRAINT [FK_dbo.Timelogs_dbo.Interns_Intern_Id] FOREIGN KEY ([Intern_Id]) REFERENCES [dbo].[Interns]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[WorkSchedules] ADD CONSTRAINT [FK_dbo.WorkSchedules_dbo.Interns_Intern_Id] FOREIGN KEY ([Intern_Id]) REFERENCES [dbo].[Interns]([Id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[PastTimelogs] ADD CONSTRAINT [FK_dbo.PastTimelogs_dbo.PastInterns_PastInternId] FOREIGN KEY ([PastInternId]) REFERENCES [dbo].[PastInterns]([Id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ImpactTotals] ADD CONSTRAINT [ImpactTotals_InternId_fkey] FOREIGN KEY ([InternId]) REFERENCES [dbo].[Interns]([Id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
