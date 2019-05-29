ALTER TABLE dbo.ICForestPlots
ADD ICForestPlotPlantingDate [DATETIME] NULL

DECLARE @dem INT = 1
DECLARE @temp TABLE(
 datemin INT,
 id INT,
 stt int
) 
INSERT INTO @temp
        SELECT ICForestPlotPlantingYear, ICForestPlotID, ROW_NUMBER() OVER (ORDER BY ICForestPlotID) FROM dbo.ICForestPlots WHERE ICForestPlotPlantingYear > 0
WHILE @dem < 410844
BEGIN
 UPDATE dbo.ICForestPlots SET ICForestPlotPlantingDate = DATEFROMPARTS((SELECT datemin FROM @temp WHERE stt = @dem),ROUND((RAND()*(12-2+1)+1), 0),ROUND((RAND()*(20-5+1)+5), 0)) WHERE ICForestPlotID = (SELECT id FROM @temp WHERE stt = @dem)
 SET @dem = @dem + 1 ;
END