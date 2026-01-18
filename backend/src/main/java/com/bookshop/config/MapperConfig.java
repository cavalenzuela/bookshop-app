package com.bookshop.config;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración del mapeo de objetos en la aplicación.
 * Esta clase proporciona la configuración necesaria para el ModelMapper,
 * que se utiliza para mapear entre entidades y DTOs.
 */
@Configuration
public class MapperConfig {

  /**
   * Configura y proporciona una instancia de ModelMapper para la aplicación.
   * El ModelMapper se configura con una estrategia de coincidencia LOOSE,
   * lo que permite un mapeo más flexible entre objetos, ignorando algunas
   * diferencias en la estructura de los objetos.
   * 
   * @return Una instancia configurada de ModelMapper
   */
  @Bean
  public ModelMapper modelMapper() {
    ModelMapper modelMapper = new ModelMapper();
    modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.LOOSE);
    return modelMapper;
  }
}
