-- Additive only: create Client Timelog email tables.
-- Does not alter or delete Interns, Timelogs, AspNetUsers, or any existing data.
-- IF NOT EXISTS guards make this safe if tables were already created via db push.

BEGIN TRY
BEGIN TRAN;

IF OBJECT_ID(N'[dbo].[ClientTimelogConfig]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[ClientTimelogConfig] (
        [Id] INT NOT NULL,
        [SemesterLabel] NVARCHAR(64),
        [SemesterEnd] DATETIME,
        [UpdatedAt] DATETIME NOT NULL,
        CONSTRAINT [ClientTimelogConfig_pkey] PRIMARY KEY CLUSTERED ([Id])
    );
END

IF OBJECT_ID(N'[dbo].[ClientTimelogSettings]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[ClientTimelogSettings] (
        [Id] NVARCHAR(128) NOT NULL,
        [ClientUserId] NVARCHAR(128) NOT NULL,
        [Active] BIT NOT NULL CONSTRAINT [ClientTimelogSettings_Active_df] DEFAULT 1,
        [InternIdsJson] NVARCHAR(max),
        [CreatedAt] DATETIME NOT NULL CONSTRAINT [ClientTimelogSettings_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
        [UpdatedAt] DATETIME NOT NULL,
        CONSTRAINT [ClientTimelogSettings_pkey] PRIMARY KEY CLUSTERED ([Id])
    );

    CREATE UNIQUE NONCLUSTERED INDEX [ClientTimelogSettings_ClientUserId_key]
        ON [dbo].[ClientTimelogSettings]([ClientUserId]);

    CREATE NONCLUSTERED INDEX [ClientTimelogSettings_ClientUserId_idx]
        ON [dbo].[ClientTimelogSettings]([ClientUserId]);
END

IF OBJECT_ID(N'[dbo].[ClientTimelogSendLog]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[ClientTimelogSendLog] (
        [Id] NVARCHAR(128) NOT NULL,
        [ClientUserId] NVARCHAR(128) NOT NULL,
        [RecipientEmail] NVARCHAR(256) NOT NULL,
        [ClientName] NVARCHAR(max),
        [CompanyName] NVARCHAR(max),
        [PeriodStart] DATETIME NOT NULL,
        [PeriodEnd] DATETIME NOT NULL,
        [InternCount] INT NOT NULL CONSTRAINT [ClientTimelogSendLog_InternCount_df] DEFAULT 0,
        [RowCount] INT NOT NULL CONSTRAINT [ClientTimelogSendLog_RowCount_df] DEFAULT 0,
        [Status] NVARCHAR(32) NOT NULL,
        [ErrorMessage] NVARCHAR(max),
        [SentByUserId] NVARCHAR(128),
        [SentAt] DATETIME NOT NULL CONSTRAINT [ClientTimelogSendLog_SentAt_df] DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT [ClientTimelogSendLog_pkey] PRIMARY KEY CLUSTERED ([Id])
    );

    CREATE NONCLUSTERED INDEX [ClientTimelogSendLog_ClientUserId_idx]
        ON [dbo].[ClientTimelogSendLog]([ClientUserId]);

    CREATE NONCLUSTERED INDEX [ClientTimelogSendLog_SentAt_idx]
        ON [dbo].[ClientTimelogSendLog]([SentAt]);
END

COMMIT TRAN;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRAN;
    THROW;
END CATCH;
