package com.bookshop.repositories;

import com.bookshop.domain.entities.User;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
  Optional<User> findByUsername(String username);
  boolean existsByUsername(String username);
}