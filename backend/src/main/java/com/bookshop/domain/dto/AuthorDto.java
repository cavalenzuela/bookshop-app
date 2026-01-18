package com.bookshop.domain.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthorDto {

  private Long id;

  private String name;

  private Date birthDate;

  private String nationality;

  private String biography;
}
