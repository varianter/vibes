﻿// <auto-generated />
using System;
using Infrastructure.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Infrastructure.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    [Migration("20241114074100_agreementEntity")]
    partial class agreementEntity
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Core.Absences.Absence", b =>
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

            modelBuilder.Entity("Core.Agreements.Agreement", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("EngagementId")
                        .HasColumnType("int");

                    b.Property<DateTime?>("NextPriceAdjustmentDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Notes")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PriceAdjustmentIndex")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("EngagementId")
                        .IsUnique();

                    b.ToTable("Agreements");
                });

            modelBuilder.Entity("Core.Consultants.Competence", b =>
                {
                    b.Property<string>("Id")
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
                        },
                        new
                        {
                            Id = "development",
                            Name = "Utvikling"
                        });
                });

            modelBuilder.Entity("Core.Consultants.CompetenceConsultant", b =>
                {
                    b.Property<int>("ConsultantId")
                        .HasColumnType("int");

                    b.Property<string>("CompetencesId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("ConsultantId", "CompetencesId");

                    b.HasIndex("CompetencesId");

                    b.ToTable("CompetenceConsultant");
                });

            modelBuilder.Entity("Core.Consultants.Consultant", b =>
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

                    b.Property<int>("GraduationYear")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("TransferredVacationDays")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(0);

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

            modelBuilder.Entity("Core.Customers.Customer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("OrganizationId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("OrganizationId", "Name")
                        .IsUnique();

                    b.ToTable("Customer");
                });

            modelBuilder.Entity("Core.Engagements.Engagement", b =>
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
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("State")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("CustomerId", "Name")
                        .IsUnique();

                    b.ToTable("Project");
                });

            modelBuilder.Entity("Core.Organizations.Department", b =>
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

            modelBuilder.Entity("Core.Organizations.Organization", b =>
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

            modelBuilder.Entity("Core.PlannedAbsences.PlannedAbsence", b =>
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

            modelBuilder.Entity("Core.Staffings.Staffing", b =>
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

            modelBuilder.Entity("Core.Vacations.Vacation", b =>
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

            modelBuilder.Entity("Core.Absences.Absence", b =>
                {
                    b.HasOne("Core.Organizations.Organization", "Organization")
                        .WithMany("AbsenceTypes")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("Core.Agreements.Agreement", b =>
                {
                    b.HasOne("Core.Engagements.Engagement", "Engagement")
                        .WithOne("Agreement")
                        .HasForeignKey("Core.Agreements.Agreement", "EngagementId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsMany("Core.Agreements.FileReference", "Files", b1 =>
                        {
                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("int");

                            SqlServerPropertyBuilderExtensions.UseIdentityColumn(b1.Property<int>("Id"));

                            b1.Property<int>("AgreementId")
                                .HasColumnType("int");

                            b1.Property<string>("BlobName")
                                .IsRequired()
                                .HasColumnType("nvarchar(max)");

                            b1.Property<string>("FileName")
                                .IsRequired()
                                .HasColumnType("nvarchar(max)");

                            b1.Property<DateTime>("UploadedOn")
                                .HasColumnType("datetime2");

                            b1.HasKey("Id");

                            b1.HasIndex("AgreementId");

                            b1.ToTable("FileReference");

                            b1.WithOwner()
                                .HasForeignKey("AgreementId");
                        });

                    b.Navigation("Engagement");

                    b.Navigation("Files");
                });

            modelBuilder.Entity("Core.Consultants.CompetenceConsultant", b =>
                {
                    b.HasOne("Core.Consultants.Competence", "Competence")
                        .WithMany("CompetenceConsultant")
                        .HasForeignKey("CompetencesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Core.Consultants.Consultant", "Consultant")
                        .WithMany("CompetenceConsultant")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Competence");

                    b.Navigation("Consultant");
                });

            modelBuilder.Entity("Core.Consultants.Consultant", b =>
                {
                    b.HasOne("Core.Organizations.Department", "Department")
                        .WithMany("Consultants")
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");
                });

            modelBuilder.Entity("Core.Customers.Customer", b =>
                {
                    b.HasOne("Core.Organizations.Organization", "Organization")
                        .WithMany("Customers")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("Core.Engagements.Engagement", b =>
                {
                    b.HasOne("Core.Customers.Customer", "Customer")
                        .WithMany("Projects")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("Core.Organizations.Department", b =>
                {
                    b.HasOne("Core.Organizations.Organization", "Organization")
                        .WithMany("Departments")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("Core.PlannedAbsences.PlannedAbsence", b =>
                {
                    b.HasOne("Core.Absences.Absence", "Absence")
                        .WithMany()
                        .HasForeignKey("AbsenceId")
                        .OnDelete(DeleteBehavior.ClientCascade)
                        .IsRequired();

                    b.HasOne("Core.Consultants.Consultant", "Consultant")
                        .WithMany("PlannedAbsences")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Absence");

                    b.Navigation("Consultant");
                });

            modelBuilder.Entity("Core.Staffings.Staffing", b =>
                {
                    b.HasOne("Core.Consultants.Consultant", "Consultant")
                        .WithMany("Staffings")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.ClientCascade)
                        .IsRequired();

                    b.HasOne("Core.Engagements.Engagement", "Engagement")
                        .WithMany("Staffings")
                        .HasForeignKey("EngagementId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Consultant");

                    b.Navigation("Engagement");
                });

            modelBuilder.Entity("Core.Vacations.Vacation", b =>
                {
                    b.HasOne("Core.Consultants.Consultant", "Consultant")
                        .WithMany("Vacations")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Consultant");
                });

            modelBuilder.Entity("Core.Consultants.Competence", b =>
                {
                    b.Navigation("CompetenceConsultant");
                });

            modelBuilder.Entity("Core.Consultants.Consultant", b =>
                {
                    b.Navigation("CompetenceConsultant");

                    b.Navigation("PlannedAbsences");

                    b.Navigation("Staffings");

                    b.Navigation("Vacations");
                });

            modelBuilder.Entity("Core.Customers.Customer", b =>
                {
                    b.Navigation("Projects");
                });

            modelBuilder.Entity("Core.Engagements.Engagement", b =>
                {
                    b.Navigation("Agreement");

                    b.Navigation("Staffings");
                });

            modelBuilder.Entity("Core.Organizations.Department", b =>
                {
                    b.Navigation("Consultants");
                });

            modelBuilder.Entity("Core.Organizations.Organization", b =>
                {
                    b.Navigation("AbsenceTypes");

                    b.Navigation("Customers");

                    b.Navigation("Departments");
                });
#pragma warning restore 612, 618
        }
    }
}
