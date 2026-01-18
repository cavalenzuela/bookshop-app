package com.bookshop.domain.entities;

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
@Table(name = "categories")
public class CategoryEntity {
    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "categories_seq"
    )
    @SequenceGenerator(
        name = "categories_seq",
        sequenceName = "categories_id_seq",
        allocationSize = 1
    )
    private Long id;

    private String name;
} 