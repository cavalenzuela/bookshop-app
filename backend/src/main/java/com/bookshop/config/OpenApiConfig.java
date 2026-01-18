package com.bookshop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;

/**
 * Configuración de OpenAPI (Swagger) para la documentación de la API.
 * Define la información general de la API, contactos, licencias y esquemas de seguridad.
 */
@Configuration
public class OpenApiConfig {

    /**
     * Configura la información general de la API y los esquemas de seguridad.
     * 
     * @return OpenAPI configurado con metadatos y esquemas de seguridad
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("BookShop API")
                        .description("API REST para la gestión de una librería online. " +
                                "Proporciona endpoints para la gestión de libros, autores, categorías y autenticación de usuarios.")
                        .version("1.0.0"))
                .addSecurityItem(new SecurityRequirement()
                        .addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", 
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Ingrese su token JWT para autenticarse")));
    }
}
