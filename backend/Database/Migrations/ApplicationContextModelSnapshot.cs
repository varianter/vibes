﻿// <auto-generated />
using System;
using Database.DatabaseContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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

                    b.HasKey("Id");

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

                    b.HasKey("Id");

                    b.ToTable("Customer");
                });

            modelBuilder.Entity("Core.DomainModels.Department", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Department");

                    b.HasData(
                        new
                        {
                            Id = "trondheim",
                            Name = "Trondheim"
                        });
                });

            modelBuilder.Entity("Core.DomainModels.PlannedAbsence", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AbsenceId")
                        .HasColumnType("int");

                    b.Property<int>("ConsultantId")
                        .HasColumnType("int");

                    b.Property<double>("Hours")
                        .HasColumnType("float");

                    b.Property<int>("WeekNumber")
                        .HasColumnType("int");

                    b.Property<int>("Year")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AbsenceId");

                    b.HasIndex("ConsultantId");

                    b.ToTable("PlannedAbsence");
                });

            modelBuilder.Entity("Core.DomainModels.Project", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CustomerId")
                        .HasColumnType("int");

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

            modelBuilder.Entity("Core.DomainModels.Staffing", b =>
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

            modelBuilder.Entity("Core.DomainModels.Consultant", b =>
                {
                    b.HasOne("Core.DomainModels.Department", "Department")
                        .WithMany("Consultants")
                        .HasForeignKey("DepartmentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Department");
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

            modelBuilder.Entity("Core.DomainModels.Project", b =>
                {
                    b.HasOne("Core.DomainModels.Customer", "Customer")
                        .WithMany("Projects")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("Core.DomainModels.Staffing", b =>
                {
                    b.HasOne("Core.DomainModels.Consultant", "Consultant")
                        .WithMany("Staffings")
                        .HasForeignKey("ConsultantId")
                        .OnDelete(DeleteBehavior.ClientCascade)
                        .IsRequired();

                    b.HasOne("Core.DomainModels.Project", "Project")
                        .WithMany("Staffings")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Consultant");

                    b.Navigation("Project");
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

            modelBuilder.Entity("Core.DomainModels.Project", b =>
                {
                    b.Navigation("Staffings");
                });
#pragma warning restore 612, 618
        }
    }
}
