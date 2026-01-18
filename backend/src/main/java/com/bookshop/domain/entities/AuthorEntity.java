package com.bookshop.domain.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "authors")
public class AuthorEntity {

  @Id
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "authors_seq"
  )
  @SequenceGenerator(
      name = "authors_seq",
      sequenceName = "authors_id_seq",
      allocationSize = 1
  )
  private Long id;

  private String name;

  private Date birthDate;

  private String nationality;

  private String biography;

}
