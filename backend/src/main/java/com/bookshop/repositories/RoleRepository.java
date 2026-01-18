package com.bookshop.repositories;

import com.bookshop.domain.entities.Role;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends CrudRepository<Role, Long> {
  Optional<Role> findByName(String name);
}