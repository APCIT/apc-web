-- Additive only: add Interns.HeadshotId for Azure blob headshot uploads.
-- Does not alter or delete existing columns or data.
-- IF COL_LENGTH guard makes this safe if the column was already added.

BEGIN TRY
BEGIN TRAN;

IF COL_LENGTH(N'dbo.Interns', N'HeadshotId') IS NULL
BEGIN
    ALTER TABLE [dbo].[Interns]
    ADD [HeadshotId] NVARCHAR(max) NULL;
END

COMMIT TRAN;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRAN;
    THROW;
END CATCH;
