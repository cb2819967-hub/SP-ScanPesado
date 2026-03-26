package com.scanpesado.backend.repository;

import com.scanpesado.backend.model.Region;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegionRepository extends JpaRepository<Region, Long> {
}
