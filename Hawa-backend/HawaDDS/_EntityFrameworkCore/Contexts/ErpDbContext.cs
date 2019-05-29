using _Entities.AA;
using _Entities.AD;
using _Entities.AP;
using _Entities.AR;
using _Entities.GE;
using _Entities.IC;
using _EntityFrameworkCore.AuditLog;
using _EntityFrameworkCore.Audits;

using Microsoft.EntityFrameworkCore;

namespace _EntityFrameworkCore.Contexts
{
    public class ErpDbContext : BysDbContext
    {
        public ErpDbContext(DbContextOptions<ErpDbContext> options, IAuditHelper auditHelper)
            : base(options, auditHelper)
        {
        }

        #region Master
        public DbSet<ADUser> ADUsers { get; set; }

        public DbSet<AAColumnAlia> AAColumnAlias { get; set; }

        public DbSet<ADConfigValue> ADConfigValues { get; set; }
        #endregion

        #region AD
        public DbSet<ADAuditLog> ADAuditLogs { get; set; }

        public DbSet<ADUserToken> ADUserTokens { get; set; }

        public DbSet<ADUserGroup> ADUserGroups { get; set; }

        public DbSet<ADUserGroupMember> ADUserGroupMembers { get; set; }

        public DbSet<ADPrivilege> ADPrivileges { get; set; }

        public DbSet<ADPrivilegeUserGroup> ADPrivilegeUserGroups { get; set; }

        public DbSet<ADFeedback> ADFeedbacks { get; set; }
        #endregion

        #region AR
        public DbSet<ARContact> ARContacts { get; set; }

        public DbSet<ARContactType> ARContactTypes { get; set; }

        public DbSet<ARContactReview> ARContactReviews { get; set; }

        public DbSet<ARContactForestCommuneGroup> ARContactForestCommuneGroups { get; set; }

        public DbSet<ARNotification> ARNotifications { get; set; }
        #endregion

        #region GE
        public DbSet<GEStateProvince> GEStateProvinces { get; set; }

        public DbSet<GEDistrict> GEDistricts { get; set; }

        public DbSet<GECommune> GECommunes { get; set; }

        public DbSet<GECompartment> GECompartments { get; set; }

        public DbSet<GESubCompartment> GESubCompartments { get; set; }

        public DbSet<GEForestProtectionDepartment> GEForestProtectionDepartments { get; set; }

        public DbSet<GEPeoplesCommittee> GEPeoplesCommittees { get; set; }
        #endregion

        #region AP
        public DbSet<APActorType> APActorTypes { get; set; }

        public DbSet<APActor> APActors { get; set; }

        public DbSet<APActorReview> APActorReviews { get; set; }

        public DbSet<APRole> APRoles { get; set; }

        public DbSet<APActorRole> APActorRoles { get; set; }
        #endregion

        #region IC
        public DbSet<ICTreeSpec> ICTreeSpecs { get; set; }

        public DbSet<ICLandUseCert> ICLandUseCerts { get; set; }

        public DbSet<ICForestCert> ICForestCerts { get; set; }

        public DbSet<ICForestPlot> ICForestPlots { get; set; }

        public DbSet<ICTreeSpecGroup> ICTreeSpecGroups { get; set; }

        public DbSet<ICTreeSpecGroupItem> ICTreeSpecGroupItems { get; set; }

        public DbSet<ICPlot> ICPlots { get; set; }

        public DbSet<ICForestPlotHistory> ICForestPlotHistorys { get; set; }
        #endregion
    }
}