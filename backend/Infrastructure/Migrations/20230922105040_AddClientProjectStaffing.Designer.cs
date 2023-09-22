﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using backend.Database.Contexts;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    [Migration("20230922105040_AddClientProjectStaffing")]
    partial class AddClientProjectStaffing
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
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

            modelBuilder.Entity("backend.Core.DomainModels.Client", b =>
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

                    b.ToTable("Client");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Competence", b =>
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

            modelBuilder.Entity("backend.Core.DomainModels.Consultant", b =>
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

            modelBuilder.Entity("backend.Core.DomainModels.Department", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

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

            modelBuilder.Entity("backend.Core.DomainModels.Organization", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<float>("HoursPerWorkday")
                        .HasColumnType("real");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Organization");

                    b.HasData(
                        new
                        {
                            Id = "variant-as",
                            HoursPerWorkday = 7.5f,
                            Name = "Variant AS"
                        });
                });

            modelBuilder.Entity("backend.Core.DomainModels.PlannedAbsence", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ConsultantId")
                        .HasColumnType("int");

                    b.Property<double>("Hours")
                        .HasColumnType("float");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<int>("WeekNumber")
                        .HasColumnType("int");

                    b.Property<int>("Year")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ConsultantId");

                    b.ToTable("PlannedAbsence");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Project", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ClientId")
                        .HasColumnType("int");

                    b.Property<bool>("ExcludeFromBillRate")
                        .HasColumnType("bit");

                    b.Property<bool>("InternalProject")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("State")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("ClientId");

                    b.ToTable("Project");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Staffing", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ConsultantId")
                        .HasColumnType("int");

                    b.Property<double>("Hours")
                        .HasColumnType("float");

                    b.Property<int>("ProjectId")
                        .HasColumnType("int");

                    b.Property<int>("Week")
                        .HasColumnType("int");

                    b.Property<int>("Year")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ConsultantId");

                    b.HasIndex("ProjectId");

                    b.ToTable("Staffing");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Vacation", b =>
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
                    b.HasOne("backend.Core.DomainModels.Competence", null)
                        .WithMany()
                        .HasForeignKey("CompetencesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Core.DomainModels.Consultant", null)
                        .WithMany()
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("backend.Core.DomainModels.Client", b =>
                {
                    b.HasOne("backend.Core.DomainModels.Organization", "Organization")
                        .WithMany("Clients")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Consultant", b =>
                {
                    b.HasOne("backend.Core.DomainModels.Department", "Department")
                        .WithMany("Consultants")
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Department", b =>
                {
                    b.HasOne("backend.Core.DomainModels.Organization", "Organization")
                        .WithMany("Departments")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("backend.Core.DomainModels.PlannedAbsence", b =>
                {
                    b.HasOne("backend.Core.DomainModels.Consultant", "Consultant")
                        .WithMany("PlannedAbsences")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Consultant");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Project", b =>
                {
                    b.HasOne("backend.Core.DomainModels.Client", "Client")
                        .WithMany("Projects")
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Client");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Staffing", b =>
                {
                    b.HasOne("backend.Core.DomainModels.Consultant", "Consultant")
                        .WithMany("Staffings")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Core.DomainModels.Project", "Project")
                        .WithMany("Staffings")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Consultant");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Vacation", b =>
                {
                    b.HasOne("backend.Core.DomainModels.Consultant", "Consultant")
                        .WithMany("Vacations")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Consultant");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Client", b =>
                {
                    b.Navigation("Projects");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Consultant", b =>
                {
                    b.Navigation("PlannedAbsences");

                    b.Navigation("Staffings");

                    b.Navigation("Vacations");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Department", b =>
                {
                    b.Navigation("Consultants");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Organization", b =>
                {
                    b.Navigation("Clients");

                    b.Navigation("Departments");
                });

            modelBuilder.Entity("backend.Core.DomainModels.Project", b =>
                {
                    b.Navigation("Staffings");
                });
#pragma warning restore 612, 618
        }
    }
}