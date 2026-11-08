using CloudinaryDotNet;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.ServiceFabric.Services.Communication.AspNetCore;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Fabric;

namespace BackendSF
{
    /// <summary>
    /// The FabricRuntime creates an instance of this class for each service type instance.
    /// </summary>
    internal sealed class BackendSF : StatelessService
    {
        public BackendSF(StatelessServiceContext context)
            : base(context)
        { }

        /// <summary>
        /// Optional override to create listeners (like tcp, http) for this service instance.
        /// </summary>
        /// <returns>The collection of listeners.</returns>
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return new ServiceInstanceListener[]
            {
                new ServiceInstanceListener(serviceContext =>
                    new KestrelCommunicationListener(serviceContext, "ServiceEndpoint", (url, listener) =>
                    {
                        ServiceEventSource.Current.ServiceMessage(serviceContext, $"Starting Kestrel on {url}");

                        var builder = WebApplication.CreateBuilder();

                        builder.Services.AddSingleton<StatelessServiceContext>(serviceContext);
                        builder.WebHost
                                    .UseKestrel()
                                    .UseContentRoot(Directory.GetCurrentDirectory())
                                    .UseServiceFabricIntegration(listener, ServiceFabricIntegrationOptions.None)
                                    .UseUrls(url);
                        builder.Services.AddControllers();
                        builder.Services.AddEndpointsApiExplorer();
                        builder.Configuration.AddJsonFile("appsettings.json", optional: false);

                        var jwtKey = builder.Configuration["JwtSettings:SecretKey"];

                        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                            .AddJwtBearer(options =>
                            {
                                options.TokenValidationParameters =
                                    new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                                    {
                                        ValidateIssuer = false,
                                        ValidateAudience = false,
                                        ValidateLifetime = false,
                                        ValidateIssuerSigningKey = true,

                                        IssuerSigningKey =
                                            new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                                                System.Text.Encoding.UTF8.GetBytes(jwtKey!))
                                    };

                                options.Events = new JwtBearerEvents
                                {
                                    OnAuthenticationFailed = context =>
                                    {
                                        System.Diagnostics.Debug.WriteLine("AUTH FAILED:");
                                        System.Diagnostics.Debug.WriteLine(context.Exception.Message);

                                        return Task.CompletedTask;
                                    }
                                };
                            });
                        builder.Services.AddCors(options =>
                            {
                                options.AddPolicy("AllowFrontend",
                                    policy =>
                                    {
                                         policy.AllowAnyOrigin()
                                               .AllowAnyHeader()
                                               .AllowAnyMethod();
                                    });
                            });
                        builder.Services.AddSwaggerGen(options =>
                            {
                                options.AddSecurityDefinition("Bearer",
                                    new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                                    {
                                        Name = "Authorization",
                                        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                                        Scheme = "bearer",
                                        BearerFormat = "JWT",
                                        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                                        Description = "Unesi JWT token"
                                    });

                                options.AddSecurityRequirement(
                                    new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                                    {
                                        {
                                            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                                            {
                                                Reference =
                                                    new Microsoft.OpenApi.Models.OpenApiReference
                                                    {
                                                        Type =
                                                            Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                                        Id = "Bearer"
                                                    }
                                            },
                                            Array.Empty<string>()
                                        }
                                    });
                            });
                        var app = builder.Build();
                        app.UseCors("AllowFrontend");

                        if (app.Environment.IsDevelopment())
                        {
                            app.UseSwagger();
                            app.UseSwaggerUI();
                        }

                        app.UseAuthentication();
                        app.UseAuthorization();
                        app.MapControllers();

                        return app;

                    }))
            };
        }
    }
}
