package com.bookshop.domain.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
public class Role {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", updatable = false, nullable = false)
  private Long id;

  @Column(name = "name", unique = true, nullable = false, length = 50)
  private String name; // Ejemplo: "ROLE_ADMIN", "ROLE_USER"
}