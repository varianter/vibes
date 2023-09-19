﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using backend.Database.Contexts;

#nullable disable

namespace backend.Migrations
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

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.Competence", b =>
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

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.Consultant", b =>
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

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.Department", b =>
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

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.Organization", b =>
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

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.PlannedAbsence", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ApplicableDays")
                        .HasColumnType("int");

                    b.Property<int>("ConsultantId")
                        .HasColumnType("int");

                    b.Property<double>("Fraction")
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

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.Vacation", b =>
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
                    b.HasOne("backend.ApplicationCore.DomainModels.Competence", null)
                        .WithMany()
                        .HasForeignKey("CompetencesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.ApplicationCore.DomainModels.Consultant", null)
                        .WithMany()
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.Consultant", b =>
                {
                    b.HasOne("backend.ApplicationCore.DomainModels.Department", "Department")
                        .WithMany("Consultants")
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");
                });

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.Department", b =>
                {
                    b.HasOne("backend.ApplicationCore.DomainModels.Organization", "Organization")
                        .WithMany("Departments")
                        .HasForeignKey("OrganizationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Organization");
                });

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.PlannedAbsence", b =>
                {
                    b.HasOne("backend.ApplicationCore.DomainModels.Consultant", "Consultant")
                        .WithMany("PlannedAbsences")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Consultant");
                });

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.Vacation", b =>
                {
                    b.HasOne("backend.ApplicationCore.DomainModels.Consultant", "Consultant")
                        .WithMany("Vacations")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Consultant");
                });

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.Consultant", b =>
                {
                    b.Navigation("PlannedAbsences");

                    b.Navigation("Vacations");
                });

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.Department", b =>
                {
                    b.Navigation("Consultants");
                });

            modelBuilder.Entity("backend.ApplicationCore.DomainModels.Organization", b =>
                {
                    b.Navigation("Departments");
                });
#pragma warning restore 612, 618
        }
    }
}
