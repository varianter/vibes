﻿// <auto-generated />
using System;
using Database.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Database.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    partial class ApplicationContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("CompetenceConsultant", b =>
                {
                    b.Property<string>("CompetencesId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("ConsultantId")
                        .HasColumnType("int");

                    b.HasKey("CompetencesId", "ConsultantId");

                    b.HasIndex("ConsultantId");

                    b.ToTable("CompetenceConsultant");
                });

            modelBuilder.Entity("Core.DomainModels.Absence", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("ExcludeFromBillRate")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("OrganizationId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId");

                    b.ToTable("Absence");
                });

            modelBuilder.Entity("Core.DomainModels.Competence", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Competence");

                    b.HasData(
                        new
                        {
                            Id = "frontend",
                            Name = "Frontend"
                        },
                        new
                        {
                            Id = "backend",
                            Name = "Backend"
                        },
                        new
                        {
                            Id = "design",
                            Name = "Design"
                        },
                        new
                        {
                            Id = "project-mgmt",
                            Name = "Project Management"
                        });
                });

            modelBuilder.Entity("Core.DomainModels.Consultant", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Degree")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DepartmentId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("GraduationYear")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<int?>("TransferredVacationDays")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("DepartmentId");

                    b.ToTable("Consultant");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Degree = "Master",
                            DepartmentId = "trondheim",
                            Email = "j@variant.no",
                            GraduationYear = 2019,
                            Name = "Jonas",
                            StartDate = new DateTime(2020, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        });
                });

            modelBuilder.Entity("Core.DomainModels.Customer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("OrganizationId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId");

                    b.ToTable("Customer");
                });

            modelBuilder.Entity("Core.DomainModels.Department", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<int?>("Hotkey")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("OrganizationId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId");

                    b.ToTable("Department");

                    b.HasData(
                        new
                        {
                            Id = "trondheim",
                            Name = "Trondheim",
                            OrganizationId = "variant-as"
                        });
                });

            modelBuilder.Entity("Core.DomainModels.Engagement", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CustomerId")
                        .HasColumnType("int");

                    b.Property<bool>("IsBillable")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("State")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId");

                    b.ToTable("Project");
                });

            modelBuilder.Entity("Core.DomainModels.Organization", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("HasVacationInChristmas")
                        .HasColumnType("bit");

                    b.Property<double>("HoursPerWorkday")
                        .HasColumnType("float");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("NumberOfVacationDaysInYear")
                        .HasColumnType("int");

                    b.Property<string>("UrlKey")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Organization");

                    b.HasData(
                        new
                        {
                            Id = "variant-as",
                            Country = "norway",
                            HasVacationInChristmas = true,
                            HoursPerWorkday = 7.5,
                            Name = "Variant AS",
                            NumberOfVacationDaysInYear = 25,
                            UrlKey = "variant-as"
                        });
                });

            modelBuilder.Entity("Core.DomainModels.PlannedAbsence", b =>
                {
                    b.Property<int>("AbsenceId")
                        .HasColumnType("int");

                    b.Property<int>("ConsultantId")
                        .HasColumnType("int");

                    b.Property<int>("Week")
                        .HasColumnType("int");

                    b.Property<double>("Hours")
                        .HasColumnType("float");

                    b.HasKey("AbsenceId", "ConsultantId", "Week");

                    b.HasIndex("ConsultantId");

                    b.ToTable("PlannedAbsence");
                });

            modelBuilder.Entity("Core.DomainModels.Staffing", b =>
                {
                    b.Property<int>("EngagementId")
                        .HasColumnType("int");

                    b.Property<int>("ConsultantId")
                        .HasColumnType("int");

                    b.Property<int>("Week")
                        .HasColumnType("int");

                    b.Property<double>("Hours")
                        .HasColumnType("float");

                    b.HasKey("EngagementId", "ConsultantId", "Week");

                    b.HasIndex("ConsultantId");

                    b.ToTable("Staffing");
                });

            modelBuilder.Entity("Core.DomainModels.Vacation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ConsultantId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("ConsultantId");

                    b.ToTable("Vacation");
                });

            modelBuilder.Entity("CompetenceConsultant", b =>
                {
                    b.HasOne("Core.DomainModels.Competence", null)
                        .WithMany()
                        .HasForeignKey("CompetencesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Core.DomainModels.Consultant", null)
                        .WithMany()
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Core.DomainModels.Absence", b =>
                {
                    b.HasOne("Core.DomainModels.Organization", "Organization")
                        .WithMany("AbsenceTypes")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("Core.DomainModels.Consultant", b =>
                {
                    b.HasOne("Core.DomainModels.Department", "Department")
                        .WithMany("Consultants")
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");
                });

            modelBuilder.Entity("Core.DomainModels.Customer", b =>
                {
                    b.HasOne("Core.DomainModels.Organization", "Organization")
                        .WithMany("Customers")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("Core.DomainModels.Department", b =>
                {
                    b.HasOne("Core.DomainModels.Organization", "Organization")
                        .WithMany("Departments")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("Core.DomainModels.Engagement", b =>
                {
                    b.HasOne("Core.DomainModels.Customer", "Customer")
                        .WithMany("Projects")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("Core.DomainModels.PlannedAbsence", b =>
                {
                    b.HasOne("Core.DomainModels.Absence", "Absence")
                        .WithMany()
                        .HasForeignKey("AbsenceId")
                        .OnDelete(DeleteBehavior.ClientCascade)
                        .IsRequired();

                    b.HasOne("Core.DomainModels.Consultant", "Consultant")
                        .WithMany("PlannedAbsences")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Absence");

                    b.Navigation("Consultant");
                });

            modelBuilder.Entity("Core.DomainModels.Staffing", b =>
                {
                    b.HasOne("Core.DomainModels.Consultant", "Consultant")
                        .WithMany("Staffings")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.ClientCascade)
                        .IsRequired();

                    b.HasOne("Core.DomainModels.Engagement", "Engagement")
                        .WithMany("Staffings")
                        .HasForeignKey("EngagementId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Consultant");

                    b.Navigation("Engagement");
                });

            modelBuilder.Entity("Core.DomainModels.Vacation", b =>
                {
                    b.HasOne("Core.DomainModels.Consultant", "Consultant")
                        .WithMany("Vacations")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Consultant");
                });

            modelBuilder.Entity("Core.DomainModels.Consultant", b =>
                {
                    b.Navigation("PlannedAbsences");

                    b.Navigation("Staffings");

                    b.Navigation("Vacations");
                });

            modelBuilder.Entity("Core.DomainModels.Customer", b =>
                {
                    b.Navigation("Projects");
                });

            modelBuilder.Entity("Core.DomainModels.Department", b =>
                {
                    b.Navigation("Consultants");
                });

            modelBuilder.Entity("Core.DomainModels.Engagement", b =>
                {
                    b.Navigation("Staffings");
                });

            modelBuilder.Entity("Core.DomainModels.Organization", b =>
                {
                    b.Navigation("AbsenceTypes");

                    b.Navigation("Customers");

                    b.Navigation("Departments");
                });
#pragma warning restore 612, 618
        }
    }
}
