select * from ARContactReviews
select * from ARContacts
select * from ICForestPlots where FK_APActorID = 16
select * from APActorReviews
select * from ICForestPlots where ICForestPlotID = 12204

select * from GEStateProvinces
select * from GEDistricts where GEDistrictID = 508
select * from ICForestPlotHistorys
select * from APActors where APActorID = 16
delete APActorReviews where FK_APActorID > =500
Delete APActors where APActorID >= 500
Delete ICForestPlots where FK_APActorID >= 500
select * from APActorRoles
select * from APRoles
select * from GEDistricts

--update APActors set FK_GEDistrictID = (select e.FK_GEDistrictID from GECommunes e where APActors.FK_GECommuneID = e.GECommuneID)
--update APActors set FK_GEStateProvinceID = (select e.FK_GEStateProvinceID from GEDistricts e where APActors.FK_GEDistrictID = e.GEDistrictID)